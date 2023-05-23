import React, { useEffect, useState } from 'react'

import styles from '../styles/Layout.module.scss'
import Link from 'next/link'

import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import app from '../firebase/clientApp'

const auth = getAuth()

export default function Layout({ children }) {
  const [currentUser, setCurrentUser] = useState()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid
        setCurrentUser(user)
        // ...
      } else {
        // User is signed out
        // ...
      }
    })
  }, [auth])

  useEffect(() => {
    console.log(currentUser)
  }, [currentUser])

  const firebaseSignOut = () => {
    signOut(auth)
      .then(() => {
        setCurrentUser()
        localStorage.clear()
        window.location.href = '/'
      })
      .catch((error) => {
        // An error happened.
      })
  }

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.nav__left}>
          <ul>
            <Link href='/who-we-are'>
              <li>Who We Are</li>
            </Link>
            <Link href='/our-service'>
              <li>Our Service</li>
            </Link>
            <Link href='/contact-us'>
              <li>Contact Us</li>
            </Link>
          </ul>
        </div>
        <div className={styles.nav__center}>
          <Link href='/'>
            Insura<span>Link</span>
          </Link>
        </div>
        <div className={styles.nav__right}>
          <ul>
            <Link href={currentUser ? '/company-portal' : '/sign-in'}>
              <li>Company Portal</li>
            </Link>
            {currentUser ? (
              <li
                className={styles.nav__right__switch}
                onClick={firebaseSignOut}
              >
                Sign Out
              </li>
            ) : (
              <Link href='/start-your-switch'>
                <li className={styles.nav__right__switch}>
                  Switch Your Insurance
                </li>
              </Link>
            )}
          </ul>
        </div>
      </nav>
      {children}
      <footer className={styles.footer}>
        <div className={styles.footer__top}>
          <ul>
            <Link href='/'>
              <li className={styles.footer__top__logo}>
                Insura<span>Link</span>
              </li>
            </Link>
            <Link href='/who-we-are'>
              <li>Who We Are</li>
            </Link>
            <Link href='/our-service'>
              <li>Our Service</li>
            </Link>
            <Link href='/contact-us'>
              <li>Contact Us</li>
            </Link>
            <Link href='/sign-in'>
              <li>Company Portal</li>
            </Link>
            <Link href='/start-your-switch'>
              <li>Switch Your Insurance</li>
            </Link>
          </ul>
        </div>
        <div className={styles.footer__bottom}>
          © Copyright 2023 by InsuraLink
        </div>
      </footer>
    </>
  )
}
