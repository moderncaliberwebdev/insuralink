import React, { useEffect } from 'react'
import Layout from '../Components/Layout'
import styles from '../styles/Auth.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router'

import {
  getAuth,
  verifyPasswordResetCode,
  confirmPasswordReset,
  signOut,
  checkActionCode,
  applyActionCode,
  sendPasswordResetEmail,
} from 'firebase/auth'
import app from '../firebase/clientApp'
import { useState } from 'react'
import axios from 'axios'

const auth = getAuth()

export default function OurService() {
  const router = useRouter()
  const { mode, oobCode, apiKey, lang } = router.query

  const [firebaseEmail, setFirebaseEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [emailUpdated, setEmailUpdated] = useState(false)
  const [oldEmail, setOldEmail] = useState('')
  const [passwordResetState, setPasswordResetState] = useState(false)

  const handleResetPassword = (auth, actionCode, continueUrl, lang) => {
    // Verify the password reset code is valid.
    verifyPasswordResetCode(auth, actionCode)
      .then((email) => {
        const accountEmail = email

        const newPassword = '...'
        setFirebaseEmail(accountEmail)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const resetPassword = (auth, actionCode, newPassword) => {
    // Save the new password.
    confirmPasswordReset(auth, actionCode, newPassword)
      .then((resp) => {
        // Password reset has been confirmed and new password updated.
        signOut(auth)
          .then(() => {
            window.location.href = '/sign-in'
          })
          .catch((error) => {
            console.log(error)
          })
      })
      .catch((error) => {
        setErrorMsg(
          'Error occurred during confirmation. The code might have expired or the password is too weak.'
        )
      })
  }

  const handleRecoverEmail = (auth, actionCode, lang) => {
    let restoredEmail = null
    // Confirm the action code is valid.
    checkActionCode(auth, actionCode)
      .then((info) => {
        // Get the restored email address.
        restoredEmail = info['data']['email']

        // Revert to the old email.
        return applyActionCode(auth, actionCode)
      })
      .then(async () => {
        const emailForAPI = auth.currentUser.email

        const config = {
          headers: {
            Authorization: `Bearer ${auth.currentUser.accessToken}`,
          },
        }

        const data = await axios.put(
          `/api/client/update-email`,
          {
            newEmail: restoredEmail,
            email: emailForAPI,
          },
          config
        )

        setOldEmail(restoredEmail)
        setEmailUpdated(true)
      })
      .catch((error) => {})
  }

  const changePassword = () => {
    sendPasswordResetEmail(auth, oldEmail)
      .then(() => {
        setPasswordResetState(true)
      })
      .catch((error) => {
        // Error encountered while sending password reset code.
      })
  }

  useEffect(() => {
    mode &&
      mode.length > 0 &&
      (mode == 'resetPassword'
        ? handleResetPassword(auth, oobCode, '/company-portal', lang)
        : mode == 'recoverEmail' && handleRecoverEmail(auth, oobCode, lang))
  }, [mode])

  return (
    <Layout>
      <main className={styles.auth}>
        {mode &&
          (mode == 'resetPassword' && firebaseEmail ? (
            //rest password UI
            <div className={styles.auth__item}>
              <h2>Reset your password</h2>
              <p>for {firebaseEmail}</p>
              <input
                type='text'
                placeholder='New Password'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <span className={styles.auth__item__error}>{errorMsg}</span>
              <button onClick={() => resetPassword(auth, oobCode, password)}>
                Save
              </button>
            </div>
          ) : mode == 'verifyEmail' ? (
            //recover email UI
            <></>
          ) : mode == 'recoverEmail' && emailUpdated == true ? (
            //verify email UI
            <div className={styles.auth__item}>
              <h2>Updated email address</h2>
              {passwordResetState == true ? (
                <p>
                  Follow the instructions sent to your inbox to reset your
                  password
                </p>
              ) : (
                <>
                  <p>
                    Your sign-in email address has been changed back to{' '}
                    {oldEmail}
                  </p>
                  <p>
                    If you didn't ask to change your sign-in email, it's
                    possible someone is trying to access your account and you
                    should change your password right away
                    <button onClick={changePassword}>Change Password</button>
                  </p>
                </>
              )}
            </div>
          ) : (
            //invalid or expired action code
            <div className={styles.auth__item}>
              <span className={styles.auth__item__error}>
                Invalid or Expired Action Code
              </span>
            </div>
          ))}
      </main>
    </Layout>
  )
}
