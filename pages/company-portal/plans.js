import React, { useEffect, useState } from 'react'
import styles from '../../styles/Plans.module.scss'
import Layout from '../../Components/Layout'
import SubscriptionPlan from '../../Components/SubscriptionPlan'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../../firebase/clientApp'
import axios from 'axios'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const auth = getAuth()

export default function Plans() {
  const [currentUser, setCurrentUser] = useState()
  const [userFromDB, setUserFromDB] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        const config = {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
        const clientData = await axios.get(
          `/api/client?email=${user.email}`,
          config
        )

        clientData && setLoading(false)

        console.log(clientData.data.user)
        setUserFromDB(clientData.data.user)
      } else {
        window.location.href = '/'
      }
    })
  }, [auth])

  return (
    <Layout>
      <main className={styles.plans}>
        {currentUser ? (
          <>
            <header className={styles.plans__h1}>
              <h1>Start Your Subscription</h1>
              <img src='/home/underline.png' alt='Underline Graphic' />
            </header>
            <p className={styles.plans__subhead}>
              To complete the sign up process and register your company with
              Insura
              <span>Link</span>, please select a plan
            </p>
            <section className={styles.plans__plans}>
              <SubscriptionPlan
                color='white'
                price='1,000'
                clients='0-100'
                payment='https://buy.stripe.com/test_4gwcNlgKhbLHaA05kk'
              />
              <SubscriptionPlan
                color='teal'
                price='2,000'
                clients='100-500'
                payment='https://buy.stripe.com/test_5kA4gP3Xv7vr7nOdQR'
              />
              <SubscriptionPlan
                color='white'
                price='3,000'
                clients='500+'
                payment='https://buy.stripe.com/test_4gwcNlgKhbLHaA05kk'
              />
            </section>
            <p className={styles.plans__note}>
              You will receive a code via email that you can give to all of your
              new clients. Your new clients will then be able to use this code
              to access the Switch Your Insurance form.
            </p>
          </>
        ) : (
          <>
            <Skeleton height={70} borderRadius={15} />
            <Skeleton height={20} borderRadius={15} />
            <Skeleton height={80} borderRadius={15} />
            <Skeleton height={80} borderRadius={15} />
            <Skeleton height={80} borderRadius={15} />
            <Skeleton height={80} borderRadius={15} />
          </>
        )}
      </main>
    </Layout>
  )
}
