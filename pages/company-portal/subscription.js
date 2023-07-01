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
const stripe = Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_TEST_KEY)
import Link from 'next/link'

import { loadStripe } from '@stripe/stripe-js'
import Popup from '../../Components/Popup'
import { useRouter } from 'next/router'

const auth = getAuth()

export default function Subscription() {
  const router = useRouter()

  const [currentUser, setCurrentUser] = useState()
  const [userFromDB, setUserFromDB] = useState()
  const [loading, setLoading] = useState(true)
  const [subscriptionInfo, setSubscriptionInfo] = useState()
  const [productInfo, setProductInfo] = useState()
  const [invoices, setInvoices] = useState()
  const [cancelled, setCancelled] = useState(false)

  const [openUnSubPopup, setOpenUnSubPopup] = useState(false)
  const [unSubOpen, setUnSubOpen] = useState(false)
  const [openPopup, setOpenPopup] = useState(false)
  const [openRenewPopup, setOpenRenewPopup] = useState(false)
  const [upcomingInvoiceDetails, setUpcomingInvoiceDetails] = useState(0)

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

        if (clientData.data.user.subscribed) {
          //retrieve subscription info
          const subscription = await stripe.subscriptions.retrieve(
            clientData.data.user.subscriptionID
          )

          setSubscriptionInfo(subscription)

          if (subscription.cancel_at) {
            setCancelled(true)
          }

          const product = await stripe.products.retrieve(
            clientData.data.user.productID
          )

          setProductInfo(product)

          const invoices = await stripe.invoices.list({
            customer: subscription.customer,
          })
          setInvoices(invoices.data)

          const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
            customer: subscription.customer,
          })
          console.log(upcomingInvoice)
          setUpcomingInvoiceDetails(upcomingInvoice)

          const paymentMethod = await stripe.paymentMethods.retrieve(
            subscription.default_payment_method
          )
        } else window.location.href = '/company-portal/plans'

        if (router.isReady && router.query.upgrade == 'true') {
          setOpenPopup(true)
        }
      } else {
        window.location.href = '/'
      }
    })
  }, [auth, router.isReady])

  const closePopup = () => {
    setOpenPopup(false)
  }

  const closeUnSubPopup = () => {
    setOpenUnSubPopup(false)
  }
  const closeRenewPopup = () => {
    setOpenRenewPopup(false)
  }

  const updatePaymentDetails = async () => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'setup',
      customer: subscriptionInfo.customer,
      setup_intent_data: {
        metadata: {
          customer_id: subscriptionInfo.customer,
          subscription_id: subscriptionInfo.id,
        },
      },
      success_url: `https://insuralink.vercel.app/company-portal/subscription?paymentMethodSession={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://insuralink.vercel.app/company-portal/subscription`,
    })

    const clientStripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLIC_TEST_KEY
    )

    clientStripe.redirectToCheckout({
      sessionId: session.id,
    })
  }

  const unsubscribe = async () => {
    const subscription = await stripe.subscriptions.update(
      subscriptionInfo.id,
      {
        cancel_at_period_end: true,
      }
    )

    const config = {
      headers: { Authorization: `Bearer ${currentUser.accessToken}` },
    }
    console.log(config)
    window.location.href = '/company-portal/subscription?upgrade=true'
  }

  const renew = async () => {}

  return (
    <Layout>
      <main className={styles.subscription}>
        {/* Popup for after a subscription has been updated */}
        <Popup
          question='Your Plan Has Been Successfully Updated'
          desc=''
          no='Close'
          cancel={closePopup}
          openPopup={openPopup}
          color='blue'
          renew={true}
        />
        {/* Popup for if a customer clicks Unsubscribe */}
        <Popup
          question='Are You Sure You Want to Unsubscribe?'
          desc='You will be unsubscribed at the end of the billing period. You can reactivate the subscription at any point up to the end of the period.'
          no='Cancel'
          answer='Unsubscribe'
          cancel={closeUnSubPopup}
          openPopup={openUnSubPopup}
          next={unsubscribe}
          color='blue'
          renew={true}
        />
        {/* Popup for renewing subscription */}
        <Popup
          question='
          Would you like to renew your subscription?'
          desc='You will be unsubscribed at the end of the billing period. You can reactivate the subscription at any point up to the end of the period.'
          no='Cancel'
          answer='Unsubscribe'
          cancel={closeRenewPopup}
          openPopup={openRenewPopup}
          next={renew}
          color='blue'
          renew={true}
        />
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
                      <Link href='/company-portal/upgrade'>Upgrade</Link>
                      <img
                        src='/portal/settings.png'
                        alt='Settings'
                        onClick={() => setUnSubOpen(!unSubOpen)}
                        style={{ background: unSubOpen && '#bedbd6' }}
                      />
                      {unSubOpen && (
                        <p onClick={() => setOpenUnSubPopup(!openUnSubPopup)}>
                          Unsubscribe
                        </p>
                      )}
                    </div>
                  </section>
                  <section
                    className={styles.subscription__right__info__plan__mid}
                  >
                    <div>
                      <span>Your Current Plan</span>
                      <h3>{productInfo.name}</h3>
                      {/* <ul>
                        <li>{productInfo.description}</li>
                      </ul> */}
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
                        {(upcomingInvoiceDetails.amount_due / 100)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </span>
                    </div>
                  </section>
                  <section
                    className={styles.subscription__right__info__bill__bottom}
                  >
                    <div>
                      <p>Estimated Total</p>
                      <p>
                        $
                        {(upcomingInvoiceDetails.amount_due / 100)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </p>
                    </div>
                    <span>
                      Autopays on{' '}
                      {new Date(
                        upcomingInvoiceDetails.next_payment_attempt * 1000
                      ).toLocaleString('en-US', {
                        month: 'long',
                      })}{' '}
                      {new Date(
                        upcomingInvoiceDetails.next_payment_attempt * 1000
                      ).getDate()}
                      ,{' '}
                      {new Date(
                        upcomingInvoiceDetails.next_payment_attempt * 1000
                      ).getFullYear()}
                    </span>
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

              <div className={styles.subscription__right__payment}>
                <div className={styles.subscription__right__payment__left}>
                  <div
                    className={styles.subscription__right__payment__left__top}
                  >
                    <div
                      className={
                        styles.subscription__right__payment__left__top__header
                      }
                    >
                      <h2>Payment Method</h2>
                      <button onClick={updatePaymentDetails}>Edit</button>
                    </div>
                  </div>
                  <div
                    className={
                      styles.subscription__right__payment__left__bottom
                    }
                  ></div>
                </div>
                <div
                  className={styles.subscription__right__payment__right}
                ></div>
              </div>
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
