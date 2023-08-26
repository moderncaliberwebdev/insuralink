import React from 'react'
import Layout from '../Components/Layout'
import styles from '../styles/About.module.scss'
import Link from 'next/link'

export default function OurService() {
  return (
    <Layout>
      <main className={styles.who}>
        <header className={styles.who__h1}>
          <h1>Our Service</h1>
          <img src='home/underline.png' alt='Underline Graphic' />
        </header>
        <section className={styles.who__intro}>
          <img src='/about/arrow.png' alt='Curly Arrow Graphic' />
          <h2>
            We make switching your insurance policy <span>quick and easy</span>
          </h2>
          <p>
            Policy<span>Switch</span> is an incredibly easy software to use. You
            just start by clicking Switch Your Insurance, and you’ll be taken to
            a form that directs you through the process of sending a
            cancellation message to your insurance provider.
          </p>
        </section>
        <img
          className={styles.who__hero}
          src='/about/our-service.png'
          alt='Our Service'
        />
        <section className={styles.who__content}>
          <h2>How Does it Work?</h2>
          <div className={styles.who__content__content}>
            <p>
              Policy<span>Switch</span> is actually a very simple concept, and
              that’s why we love it so much. When an insurance agency signs a
              new client, they need to contact the previous insurance provider
              to process a cancellation. Oftentimes, these messages are
              discarded which causes issues. This is where we come in. Insurance
              companies direct you to us and our software. You fill in every bit
              of information we need in order for your current provider to
              cancel your insurance policy. They can’t disregard a signed
              message directly from a client, and this way the process becomes
              simple and painless. It’s quick and effective.
            </p>
          </div>
        </section>
      </main>
    </Layout>
  )
}
