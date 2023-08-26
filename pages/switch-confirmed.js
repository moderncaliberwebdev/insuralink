import React from 'react'
import Layout from '../Components/Layout'
import styles from '../styles/Confirm.module.scss'
import Link from 'next/link'

export default function WhoWeAre() {
  return (
    <Layout>
      <main className={styles.confirm}>
        <h1>Confirm That Your Old Insurance Policy Was Cancelled</h1>
        <button>It Was Cancelled</button>
      </main>
    </Layout>
  )
}
