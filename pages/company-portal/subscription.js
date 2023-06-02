import React, { useEffect, useState } from 'react'
import styles from '../../styles/Subscription.module.scss'
import Layout from '../../Components/Layout'
import PortalSidebar from '../../Components/PortalSidebar'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../../firebase/clientApp'
import axios from 'axios'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import ProgressBar from '@ramonak/react-progress-bar'
import { Stripe } from 'stripe'
import Link from 'next/link'
const stripe = Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_TEST_KEY)

const auth = getAuth()

export default function Subscription() {
  const [currentUser, setCurrentUser] = useState()
  const [userFromDB, setUserFromDB] = useState()
  const [loading, setLoading] = useState(true)
  const [subscriptionInfo, setSubscriptionInfo] = useState()
  const [productInfo, setProductInfo] = useState()
  const [invoices, setInvoices] = useState()

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

        //retrieve subscription info
        const subscription = await stripe.subscriptions.retrieve(
          clientData.data.user.subscriptionID
        )

        setSubscriptionInfo(subscription)

        console.log('subscription >>>> ', subscription)
        const product = await stripe.products.retrieve(
          clientData.data.user.productID
        )

        setProductInfo(product)
        console.log('product >>>> ', product)

        const invoices = await stripe.invoices.list({
          customer: subscription.customer,
        })
        setInvoices(invoices.data)
        console.log('invoices >>>> ', invoices.data)
      } else {
        window.location.href = '/'
      }
    })
  }, [auth])

  return (
    <Layout>
      <main className={styles.subscription}>
        <PortalSidebar clientInfo={userFromDB} />
        <section className={styles.subscription__right}>
          <h1>Subscription Info</h1>
          {userFromDB && productInfo && subscriptionInfo && invoices ? (
            <>
              <div className={styles.subscription__right__info}>
                <div className={styles.subscription__right__info__plan}>
                  <section
                    className={styles.subscription__right__info__plan__top}
                  >
                    <h2>
                      Insura<span>Link</span>
                    </h2>
                    <div>
                      <Link href='/company-portal/plans'>Upgrade</Link>
                      <img src='/portal/settings.png' alt='Settings' />
                    </div>
                  </section>
                  <section
                    className={styles.subscription__right__info__plan__mid}
                  >
                    <div>
                      <span>Your Current Plan</span>
                      <h3>{productInfo.name}</h3>
                      <ul>
                        <li>{productInfo.description}</li>
                      </ul>
                    </div>
                    <p>
                      $
                      {(subscriptionInfo.items.data[0].price.unit_amount / 100)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      <span>/ month</span>
                    </p>
                  </section>
                  <section
                    className={styles.subscription__right__info__plan__bottom}
                  >
                    <div>
                      <p>Current Clients</p>
                      <p>
                        {userFromDB.clients.length}/
                        {productInfo.id == 'prod_O0AzcnWmMjVY33' ? '100' : '!!'}
                      </p>
                    </div>
                    <ProgressBar
                      completed={userFromDB.clients.length}
                      customLabel=' '
                      bgColor='#72A59C'
                      baseBgColor='#D9D9D9'
                      height='10px'
                    />
                  </section>
                </div>
                <div className={styles.subscription__right__info__bill}>
                  <section
                    className={styles.subscription__right__info__bill__top}
                  >
                    <h2>Upcoming Bill</h2>
                  </section>
                  <section
                    className={styles.subscription__right__info__bill__mid}
                  >
                    <span>InsuraLink</span>
                    <div>
                      <p>{productInfo.name}</p>
                      <span>
                        $
                        {(
                          subscriptionInfo.items.data[0].price.unit_amount / 100
                        )
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </span>
                    </div>
                  </section>
                  <section
                    className={styles.subscription__right__info__bill__bottom}
                  >
                    <div>
                      <p>Estimated Total</p>{' '}
                      <p>
                        $
                        {(
                          subscriptionInfo.items.data[0].price.unit_amount / 100
                        )
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </p>
                    </div>
                    <span>Autopay every month</span>
                  </section>
                </div>
              </div>
              <div className={styles.subscription__right__invoices}>
                <h2>Invoices</h2>
                <div className={styles.subscription__right__invoices__data}>
                  <section
                    className={styles.subscription__right__invoices__data__id}
                  >
                    <h3>Invoice ID</h3>
                    {invoices.map((invoice) => {
                      return <p key={invoice.id}>#{invoice.id}</p>
                    })}
                  </section>
                  <section
                    className={styles.subscription__right__invoices__data__id}
                  >
                    <h3>Issue Date</h3>
                    {invoices.map((invoice) => {
                      return (
                        <p key={invoice.id}>
                          {new Date(invoice.created * 1000).toLocaleDateString(
                            'en-US'
                          )}
                        </p>
                      )
                    })}
                  </section>
                  <section
                    className={styles.subscription__right__invoices__data__id}
                  >
                    <h3>Amount Paid</h3>
                    {invoices.map((invoice) => {
                      return (
                        <p key={invoice.id}>
                          $
                          {(invoice.amount_paid / 100)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </p>
                      )
                    })}
                  </section>
                  <section
                    className={styles.subscription__right__invoices__data__id}
                  >
                    <h3>Status</h3>
                    {invoices.map((invoice) => {
                      return (
                        <p
                          key={invoice.id}
                          style={{
                            color: invoice.paid == true ? '#59D12F' : '$C1E1E',
                          }}
                        >
                          {invoice.paid == true ? 'PAID' : 'NOT PAID'}
                        </p>
                      )
                    })}
                  </section>
                </div>
              </div>
              <div className={styles.subscription__right__details}></div>
            </>
          ) : (
            <>
              <Skeleton height={220} borderRadius={15} />
              <Skeleton height={500} borderRadius={15} />
              <Skeleton height={200} borderRadius={15} />
              <Skeleton height={200} borderRadius={15} />
            </>
          )}
        </section>
      </main>
    </Layout>
  )
}
