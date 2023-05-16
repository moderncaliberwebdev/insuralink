import React from 'react'

import styles from '../styles/Layout.module.scss'
import Link from 'next/link'

export default function Layout({ children }) {
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
            <Link href='/company-portal'>
              <li>Company Portal</li>
            </Link>
            <Link href='/start-your-switch'>
              <li className={styles.nav__right__switch}>
                Switch Your Insurance
              </li>
            </Link>
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
            <Link href='/company-portal'>
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
