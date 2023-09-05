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
} from 'firebase/auth'
import app from '../firebase/clientApp'
import { useState } from 'react'

const auth = getAuth()

export default function OurService() {
  const router = useRouter()
  const { mode, oobCode, apiKey, lang } = router.query

  const [firebaseEmail, setFirebaseEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleResetPassword = (auth, actionCode, continueUrl, lang) => {
    // Localize the UI to the selected language as determined by the lang
    // parameter.

    // Verify the password reset code is valid.
    verifyPasswordResetCode(auth, actionCode)
      .then((email) => {
        const accountEmail = email

        // TODO: Show the reset screen with the user's email and ask the user for
        // the new password.
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
        // TODO: Display a link back to the app, or sign-in the user directly
        // if the page belongs to the same domain as the app:
        // auth.signInWithEmailAndPassword(firebaseEmail, newPassword)
        signOut(auth)
          .then(() => {
            window.location.href = '/sign-in'
          })
          .catch((error) => {
            console.log(error)
          })

        // TODO: If a continue URL is available, display a button which on
        // click redirects the user back to the app via continueUrl with
        // additional state determined from that URL's parameters.
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    mode &&
      mode.length > 0 &&
      handleResetPassword(auth, oobCode, '/company-portal', lang)
  }, [mode])

  return (
    <Layout>
      <main className={styles.auth}>
        {mode &&
          (mode == 'resetPassword' && firebaseEmail ? (
            //rest password UI
            <div className={styles.auth__resetPassword}>
              <h2>Reset your password</h2>
              <p>for {firebaseEmail}</p>
              <input
                type='text'
                placeholder='New Password'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button onClick={() => resetPassword(auth, oobCode, password)}>
                Save
              </button>
            </div>
          ) : mode == 'recoverEmail' ? (
            //recover email UI
            <></>
          ) : mode == 'verifyEmail' ? (
            //verify email UI
            <></>
          ) : (
            //invalid or expired action code
            <></>
          ))}
      </main>
    </Layout>
  )
}
