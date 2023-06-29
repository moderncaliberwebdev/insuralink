import React from 'react'
import styles from '../styles/Plans.module.scss'
import axios from 'axios'

export default function SubscriptionPlan({
  color,
  price,
  clients,
  payment,
  user,
}) {
  return (
    <div
      className={styles.plans__plans__plan}
      style={{
        backgroundColor: color == 'white' ? '#fff' : '#72A59C',
        color: color == 'white' ? '#000' : '#fff',
      }}
    >
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
      <button
        onClick={async () => {
          const responseUrl = await axios.post('/api/create-checkout-session', {
            price: payment,
            uid: user,
          })
          window.location.href = responseUrl.data.url
        }}
        style={{
          backgroundColor: color == 'white' ? '#72A59C' : '#fff',
          color: color == 'white' ? '#fff' : '#72A59C',
        }}
      >
        Proceed to Payment
      </button>
    </div>
  )
}
