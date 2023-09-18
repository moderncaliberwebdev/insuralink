import React from 'react'
import Layout from '../Components/Layout'
import styles from '../styles/Confirm.module.scss'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function SwitchNotConfirmed() {
  const router = useRouter()

  useEffect(() => {
    const sendNotification = async () => {
      const clientData = await axios.get(
        `/api/send-notification?email=${router.query.email}`
      )
    }
    sendNotification()
  }, [router.isReady])

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
