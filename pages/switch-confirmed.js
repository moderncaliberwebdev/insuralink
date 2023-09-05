import React from 'react'
import Layout from '../Components/Layout'
import styles from '../styles/Confirm.module.scss'
import Link from 'next/link'

export default function WhoWeAre() {
  return (
    <Layout>
      <main className={styles.confirm}>
        <h1>
          Thank you for confirming the status of your insurance policy with us!
        </h1>
      </main>
    </Layout>
  )
}
