import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

import styles from '../styles/Layout.module.scss'
import Link from 'next/link'

import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import app from '../firebase/clientApp'
import Head from 'next/head'

const auth = getAuth()

export default function Layout({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [mobileNav, setMobileNav] = useState(false)

  const isBigScreen = useMediaQuery({ query: '(min-width: 900px)' })

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
      <Head>
        <link rel='icon' href='/home/PS.ico' sizes='any' />
      </Head>
      {isBigScreen ? (
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
              Policy<span>Switch</span>
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
      ) : (
        <nav className={styles.mobilenav}>
          <div className={styles.mobilenav__upper}>
            <div></div>
            <Link href='/'>
              Policy<span>Switch</span>
            </Link>
            <div
              className={styles.mobilenav__upper__icon}
              onClick={() => setMobileNav(true)}
            >
              <img src='/home/menu-upper.png' alt='Menu Upper' />
              <img src='/home/menu-lower.png' alt='Menu Lower' />
            </div>
          </div>
          {mobileNav && (
            <div className={styles.mobilenav__lower}>
              <div
                className={styles.mobilenav__lower__top}
                onClick={() => setMobileNav(false)}
              ></div>
              <div className={styles.mobilenav__lower__bottom}>
                <ul>
                  <li>
                    <Link href='/'>Home</Link>
                  </li>
                  <li>
                    <Link href='/who-we-are'>Who We Are</Link>
                  </li>
                  <li>
                    <Link href='/our-service'>Our Service</Link>
                  </li>
                  <li>
                    <Link href='/contact-us'>Contact Us</Link>
                  </li>
                  <li>
                    <Link href='/start-your-switch'>Switch Your Insurance</Link>
                  </li>
                  {currentUser ? (
                    <li onClick={firebaseSignOut}>Sign Out</li>
                  ) : (
                    <li>
                      <Link href={currentUser ? '/company-portal' : '/sign-in'}>
                        Company Portal
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </nav>
      )}
      {children}
      <footer className={styles.footer}>
        <div className={styles.footer__top}>
          <ul>
            <Link href='/'>
              <li className={styles.footer__top__logo}>
                Policy<span>Switch</span>
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
          © Copyright 2023 by PolicySwitch
        </div>
      </footer>
    </>
  )
}
