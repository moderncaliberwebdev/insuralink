import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import PortalSidebar from '../../Components/PortalSidebar'
import styles from '../../styles/Settings.module.scss'
import Popup from '../../Components/Popup'
import { useRouter } from 'next/router'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import {
  EmailAuthProvider,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updateEmail,
  updateProfile,
} from 'firebase/auth'
import app from '../../firebase/clientApp'
import axios from 'axios'

const auth = getAuth()

export default function Settings() {
  const router = useRouter()

  const [currentUser, setCurrentUser] = useState()
  const [userFromDB, setUserFromDB] = useState()
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(true)
  const [openPopup, setOpenPopup] = useState(false)
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState('')
  const [cancelled, setCancelled] = useState(false)
  const [clientsSwitched, setClientsSwitched] = useState(0)
  const [clientsNotSwitched, setClientsNotSwitched] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')
  const [password, setPassword] = useState('')
  const [requirePassword, setRequirePassword] = useState(false)
  const [saveButtonText, setSaveButtonText] = useState('Save Changes')

  useEffect(() => {
    if (router.isReady) {
      //gets user from firebase
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user)
          console.log(user)

          const config = {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }

          //retrieve client data
          const clientData = await axios.get(
            `/api/client?email=${user.email}`,
            config
          )

          clientData && setLoading(false)

          //set user data to state
          setUserFromDB(clientData.data.user)
        } else {
          window.location.href = '/'
        }
      })
    }
  }, [auth, router.isReady])

  useEffect(() => {
    userFromDB &&
      userFromDB.clients.forEach((client) => {
        const currentDate = new Date().getTime()
        if (currentDate > new Date(client.date).getTime()) {
          setClientsSwitched(clientsSwitched + 1)
        } else setClientsNotSwitched(clientsNotSwitched + 1)
      })
  }, [userFromDB])

  const closePopup = () => {
    setOpenPopup(false)
  }

  const passwordReset = () => {
    sendPasswordResetEmail(auth, userFromDB.email)
      .then(() => {
        // Password reset email sent
        setResponse('Password reset email has been sent')
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        // ..
      })
  }

  const saveProfile = () => {
    const oldEmail = currentUser.email
    setSaveButtonText('Loading...')

    //function to update profile after email has been updated
    const updateInfo = () => {
      updateProfile(auth.currentUser, {
        displayName: name,
      })
        .then(async () => {
          const config = {
            headers: {
              Authorization: `Bearer ${auth.currentUser.accessToken}`,
            },
          }
          console.log(config)
          const data = await axios.put(
            `/api/client/update-user`,
            {
              oldEmail,
              email: email || currentUser.email.toLowerCase(),
              newName: name || userFromDB.name,
              location: location || userFromDB.location,
            },
            config
          )

          data && window.location.reload()
        })
        .catch((error) => {
          console.error(error)
          setSaveButtonText('Save Changes')
        })
    }

    //update email with credentials
    if (requirePassword) {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      )

      reauthenticateWithCredential(auth.currentUser, credential)
        .then(() => {
          updateEmail(auth.currentUser, email)
            .then(() => {
              updateInfo()
            })
            .catch((error) => {
              setSaveButtonText('Save Changes')
              console.log('email error')
              console.log(error)
            })
        })
        .catch((error) => {
          setSaveButtonText('Save Changes')
          console.error(error)
        })
    }
    //update email on first try without credentials
    else {
      updateEmail(auth.currentUser, email)
        .then(() => {
          updateInfo()
        })
        .catch((error) => {
          console.log('email error')
          console.log(error)
          setSaveButtonText('Save Changes')
          setRequirePassword(true)
        })
    }
  }

  return (
    <Layout>
      <main className={styles.edit}>
        <Popup
          question='You Are Not Subscribed Yet'
          desc='To use PolicySwitch and finish your sign up process, you must have a subscription'
          answer='Subscription Settings'
          no='Cancel'
          cancel={closePopup}
          next={() => (window.location.href = '/company-portal/plans')}
          openPopup={openPopup}
          color='blue'
          renew={true}
        />
        <PortalSidebar clientInfo={userFromDB} />
        <section className={styles.edit__right}>
          <h1>Profile Settings</h1>
          {userFromDB ? (
            <>
              <div className={styles.edit__right__settings}>
                <div className={styles.edit__right__settings__item}>
                  <div className={styles.edit__right__settings__item__info}>
                    <h2>Name</h2>
                    <p>The name of your insurance agency</p>
                  </div>
                  <input
                    type='text'
                    defaultValue={userFromDB.name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className={styles.edit__right__settings__item}>
                  <div className={styles.edit__right__settings__item__info}>
                    <h2>Location</h2>
                    <p>Location of Your Office</p>
                  </div>
                  <input
                    type='text'
                    defaultValue={userFromDB.location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className={styles.edit__right__settings__item}>
                  <div className={styles.edit__right__settings__item__info}>
                    <h2>Email</h2>
                    <p>Your company email</p>
                  </div>
                  <input
                    type='text'
                    defaultValue={userFromDB.email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {requirePassword && (
                  <div className={styles.edit__right__settings__item}>
                    <label>
                      Your password is required to reset your email. Once filled
                      correctly, click Save Changes.
                    </label>
                    <input
                      type='text'
                      placeholder='Password'
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                )}
                <button
                  className={styles.edit__right__settings__reset}
                  onClick={passwordReset}
                >
                  Reset Password
                </button>
                {response ? (
                  <p className={styles.edit__right__settings__response}>
                    {response}
                  </p>
                ) : (
                  <p className={styles.edit__right__settings__subhead}>
                    You will be sent an email with instructions on how to reset
                    your password
                  </p>
                )}
              </div>
              <button
                className={styles.edit__right__save}
                onClick={saveProfile}
                disabled={!location && !email && !name}
                style={{
                  backgroundColor: !location && !email && !name && '#979797',
                  cursor: !location && !email && !name && 'default',
                }}
              >
                {saveButtonText}
              </button>
            </>
          ) : (
            <>
              <Skeleton height={50} borderRadius={15} />
              <Skeleton height={50} borderRadius={15} />
              <Skeleton height={50} borderRadius={15} />
              <Skeleton height={50} borderRadius={15} />
              <Skeleton height={50} borderRadius={15} />
              <Skeleton height={50} borderRadius={15} />
            </>
          )}
        </section>
      </main>
    </Layout>
  )
}
