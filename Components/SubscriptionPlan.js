import React from 'react'
import styles from '../styles/Plans.module.scss'

export default function SubscriptionPlan({ color, price, clients, payment }) {
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
      <a
        href={payment}
        style={{
          backgroundColor: color == 'white' ? '#72A59C' : '#fff',
          color: color == 'white' ? '#fff' : '#72A59C',
        }}
      >
        Proceed to Payment
      </a>
    </div>
  )
}
