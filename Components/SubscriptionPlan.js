import React, { useState } from 'react'
import styles from '../styles/Plans.module.scss'
import axios from 'axios'
import Popup from './Popup'
import { Stripe } from 'stripe'
const stripe = Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_TEST_KEY)

export default function SubscriptionPlan({
  color,
  price,
  clients,
  payment,
  user,
  currentPlan,
  subscriptionID,
}) {
  const [openPopup, setOpenPopup] = useState(false)

  const closePopup = () => {
    setOpenPopup(false)
  }

  const updateSubscription = async () => {
    const subscription = await stripe.subscriptions.retrieve(subscriptionID)
    const newSubscription = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: false,
      proration_behavior: 'create_prorations',
      items: [
        {
          id: subscription.items.data[0].id,
          price: payment,
        },
      ],
    })

    console.log('NEW SUB >>>>>>   ', newSubscription)

    const config = {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    }

    const clientSubscribed = await axios.put(
      `/api/client/subscribed`,
      {
        email: user.email,
        subscribed: true,
        subscriptionID: newSubscription.id,
        customerID: newSubscription.customer,
        productID: newSubscription.items.data[0].plan.product,
        paymentMethod: newSubscription.default_payment_method,
        priceID: newSubscription.plan.id,
      },
      config
    )
    window.location.href = '/company-portal/subscription?upgrade=true'
  }

  return (
    <div
      className={styles.plans__plans__plan}
      style={{
        backgroundColor: color == 'white' ? '#fff' : '#72A59C',
        color: color == 'white' ? '#000' : '#fff',
      }}
    >
      <Popup
        question='Confirm your plan change'
        desc='You will be charged at the end of the current billing period '
        answer='Change Your Plan'
        no='Cancel'
        cancel={closePopup}
        next={updateSubscription}
        openPopup={openPopup}
        color='blue'
        renew={true}
      />
      <h2>
        ${price}
        <span>/mo</span>
      </h2>

      <div className={styles.plans__plans__plan__clients}>
        <img
          src={
            color == 'white'
              ? '/plans/teal-check.png'
              : '/plans/white-check.png'
          }
          alt='Check Icon'
        />
        <p>{clients} New Clients</p>
      </div>
      {currentPlan == payment ? (
        //button to display when this is the client's current plan
        <button
          style={{
            cursor: 'auto',
            backgroundColor: '#979797',
            color: '#fff',
          }}
        >
          Current Plan
        </button>
      ) : currentPlan ? (
        //button to display when the client has a plan and is upgrading
        <button
          onClick={() => {
            setOpenPopup(true)
          }}
          style={{
            backgroundColor: color == 'white' ? '#72A59C' : '#fff',
            color: color == 'white' ? '#fff' : '#72A59C',
          }}
        >
          Change Plan Now
        </button>
      ) : (
        //button to display when the client has no plan yet
        <button
          onClick={async () => {
            const responseUrl = await axios.post(
              '/api/create-checkout-session',
              {
                price: payment,
                uid: user,
              }
            )
            window.location.href = responseUrl.data.url
          }}
          style={{
            backgroundColor: color == 'white' ? '#72A59C' : '#fff',
            color: color == 'white' ? '#fff' : '#72A59C',
          }}
        >
          Proceed to Payment
        </button>
      )}
    </div>
  )
}
