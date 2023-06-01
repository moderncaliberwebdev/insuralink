import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import PortalSidebar from '../../Components/PortalSidebar'
import styles from '../../styles/CompanyPortal.module.scss'
import Popup from '../../Components/Popup'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../../firebase/clientApp'
import axios from 'axios'

const auth = getAuth()

export default function CompanyPortal() {
  const [currentUser, setCurrentUser] = useState()
  const [userFromDB, setUserFromDB] = useState()
  const [loading, setLoading] = useState(true)
  const [openPopup, setOpenPopup] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        const config = {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
        console.log(user.accessToken)
        const clientData = await axios.get(
          `/api/client?email=${user.email}`,
          config
        )

        clientData && setLoading(false)

        console.log(clientData.data.user)
        setUserFromDB(clientData.data.user)
      } else {
        window.location.href = '/'
      }
    })
  }, [auth])

  //open popup if not subscribed
  useEffect(() => {
    if (userFromDB && userFromDB.subscribed == false) {
      setOpenPopup(true)
    }
  }, [userFromDB])

  const closePopup = () => {
    setOpenPopup(false)
  }

  return (
    <Layout>
      <main className={styles.portal}>
        <Popup
          question='You Are Not Subscribed Yet'
          desc='To use Insuralink and finish your sign up process, you must have a subscription'
          answer='Subscription Settings'
          no='Cancel'
          cancel={closePopup}
          next={() => (window.location.href = '/company-portal/plans')}
          openPopup={openPopup}
          color='blue'
          renew={true}
        />
        <PortalSidebar clientInfo={userFromDB} />
        <section className={styles.portal__right}>
          <h1>Company Dashboard</h1>
          <div className={styles.portal__right__blocks}>
            <div className={styles.portal__right__blocks__clients}>
              <Skeleton height={200} borderRadius={15} />
            </div>
            <div className={styles.portal__right__blocks__subscription}>
              <Skeleton height={200} borderRadius={15} />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}
