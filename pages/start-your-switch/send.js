import React from 'react'
import Layout from '../../Components/Layout'
import Link from 'next/link'
import styles from '../../styles/SwitchSend.module.scss'
import { useSelector } from 'react-redux'
import { selectInsuralinkState } from '../../store/insuralinkSlice'
import { format, parseISO } from 'date-fns'

export default function Send() {
  const insuralinkState = useSelector(selectInsuralinkState)

  return (
    <Layout>
      <Link href='/start-your-switch/new-number'>
        <img
          src='/switch/back.png'
          alt='Back Arrow'
          className={styles.back}
          id='backArrow'
        />
      </Link>
      <main className={styles.switch}>
        <h1>Send Insurance Switch Message</h1>
        <p className={styles.switch__subhead}>
          Verify that all information is correct before sending.
        </p>
        <section className={styles.switch__items}>
          <div className={styles.switch__items__item}>
            <Link href='/start-your-switch'>Code: </Link>
            <p>{insuralinkState.code}</p>
          </div>
          <div className={styles.switch__items__item}>
            <Link href='/start-your-switch/current-insurance'>
              Current Insurance Company:
            </Link>
            <p>{insuralinkState.currentIns[0]}</p>
          </div>
          <div className={styles.switch__items__item}>
            <Link href='/start-your-switch/current-number'>
              Current Policy Number:{' '}
            </Link>
            <p>{insuralinkState.currentNumber}</p>
          </div>
          <div className={styles.switch__items__item}>
            <Link href='/start-your-switch/date'>
              Current Policy Cancellation Date:{' '}
            </Link>
            <p>
              {format(
                parseISO(
                  new Date(insuralinkState.date.toString()).toISOString()
                ),
                'PP'
              )}
            </p>
          </div>
          <div className={styles.switch__items__item}>
            <Link href='/start-your-switch/id-card'>Identification: </Link>
            <img
              src={`https://insuralink.s3.amazonaws.com/${insuralinkState.idCard}`}
              alt='preview '
              id='awsImg'
            />
          </div>
          <div className={styles.switch__items__item}>
            <Link href='/start-your-switch/e-signature'>E-Signature: </Link>
            <img src={insuralinkState.eSig} />
          </div>
          <div className={styles.switch__items__item}>
            <Link href='/start-your-switch/new-insurance'>
              New Insurance Agent:
            </Link>
            <p>
              {insuralinkState.newAgentName}, {insuralinkState.newAgentCompany},{' '}
              {insuralinkState.newAgentEmail}
            </p>
          </div>
          <div className={styles.switch__items__item}>
            <Link href='/start-your-switch/new-number'>New Policy Number:</Link>
            <p>{insuralinkState.newNumber}</p>
          </div>
        </section>
        <p className={styles.switch__description}>
          When you send the message, your information will be sent to your
          current insurance provider. You should receive a response in a couple
          of days confirming your cancellation. Thank you for working with us!
        </p>
        <button className={styles.switch__submit}>Send Message</button>
      </main>
    </Layout>
  )
}
