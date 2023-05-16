import React from 'react'
import Layout from '../Components/Layout'
import styles from '../styles/About.module.scss'
import Link from 'next/link'

export default function WhoWeAre() {
  return (
    <Layout>
      <main className={styles.who}>
        <header className={styles.who__h1}>
          <h1>Who We Are</h1>
          <img src='home/underline.png' alt='Underline Graphic' />
        </header>
        <section className={styles.who__intro}>
          <h2>
            We build bridges between <span>companies and clients</span>
          </h2>
          <p>
            We are a single service agency dedicated to making your life a bit
            easier. By building simple software to make switching insurance
            companies way easier, we take a little bit of stress out of your
            life.
          </p>
        </section>
        <img
          className={styles.who__hero}
          src='/about/who-we-are.png'
          alt='Who We Are'
        />
        <section className={styles.who__content}>
          <h2>
            We keep it <span>simple</span>
          </h2>
          <div className={styles.who__content__content}>
            <p>
              Insura<span>Link</span> is dedicated to simplifying the insurance
              transition process. We make it easy for customers to switch
              providers by streamlining the policy cancellation process. Our
              efficient cancellation system allows customers to end their
              existing policies quickly, making it easy for them to onboard with
              new insurance providers. Our mission is to make insurance
              transitions seamless and hassle-free, providing customers with a
              stress-free experience and enabling insurance providers to onboard
              new policyholders quickly and efficiently.
            </p>
            <Link href='/start-your-switch'>Start Your Switch</Link>
          </div>
        </section>
      </main>
    </Layout>
  )
}
