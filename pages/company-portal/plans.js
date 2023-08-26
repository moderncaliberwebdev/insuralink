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

        setUserFromDB(clientData.data.user)

        //if already subscribed, redirect to upgrade page
        if (clientData.data.user.subscribed == true) {
          window.location.href = '/company-portal/upgrade'
        }
      } else {
        window.location.href = '/'
      }
    })
  }, [auth])

  return (
    <Layout>
      <main className={styles.plans}>
        {currentUser && userFromDB && userFromDB.subscribed == false ? (
          <>
            <header className={styles.plans__h1}>
              <h1>Start Your Subscription</h1>
              <img src='/home/underline.png' alt='Underline Graphic' />
            </header>
            <p className={styles.plans__subhead}>
              To complete the sign up process and register your company with
              Policy
              <span>Switch</span>, please select a plan
            </p>
            <section className={styles.plans__plans}>
              <SubscriptionPlan
                color='white'
                price='1,000'
                clients='0-100'
                payment='price_1NO3KQBAb1nKRDOxNetLeWWT'
                user={currentUser}
              />
              <SubscriptionPlan
                color='teal'
                price='2,000'
                clients='100-500'
                payment='price_1NO3KQBAb1nKRDOx2SaZQzNs'
                user={currentUser}
              />
              <SubscriptionPlan
                color='white'
                price='3,000'
                clients='500+'
                payment='price_1NO3KQBAb1nKRDOx5eFFSAQN'
                user={currentUser}
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
