import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import Link from 'next/link'
import styles from '../../styles/SwitchSend.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectInsuralinkState,
  updateInsuralink,
} from '../../store/insuralinkSlice'
import { format, parseISO } from 'date-fns'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import emailjs from 'emailjs-com'
import axios from 'axios'

export default function Send() {
  const dispatch = useDispatch()

  const insuralinkState = useSelector(selectInsuralinkState)

  const [response, setResponse] = useState('')

  //redirect to start if there is no code
  useEffect(() => {
    if (insuralinkState.code.length == 0) {
      window.location.href = '/start-your-switch'
    }
  }, [insuralinkState])

  const handleSubmit = async () => {
    setResponse('Sending...')

    const {
      code,
      currentIns,
      currentNumber,
      currentInsEmail,
      yourEmail,
      yourName,
      date,
      idCard,
      eSig,
      newAgentName,
      newAgentCompany,
      newAgentEmail,
      newNumber,
    } = insuralinkState

    const newClient = await axios.post('/api/client/new-client', {
      code,
      currentIns,
      currentNumber,
      currentInsEmail,
      yourEmail,
      yourName,
      date,
      idCard: `https://insuralink.s3.amazonaws.com/${idCard}`,
      eSig,
      newAgentName,
      newAgentCompany,
      newAgentEmail,
      newNumber,
      currentDate: new Date().getTime(),
    })

    // dispatch(
    //   updateInsuralink({
    //     currentIns: [],
    //     currentNumber: '',
    //     currentInsEmail: '',
    //     yourEmail: '',
    //     yourName: '',
    //     date: '',
    //     idCard: '',
    //     eSig: '',
    //     newAgentName: '',
    //     newAgentCompany: '',
    //     newAgentEmail: '',
    //     newNumber: '',
    //   })
    // )

    window.location.href = '/?sent=true'
  }

  return (
    <Layout>
      {insuralinkState.code ? (
        <>
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
                <Link href='/start-your-switch/current-insurance-email'>
                  Current Insurance Agent Email:{' '}
                </Link>
                <p>{insuralinkState.currentInsEmail}</p>
              </div>
              <div className={styles.switch__items__item}>
                <Link href='/start-your-switch/your-email'>Your Name: </Link>
                <p>{insuralinkState.yourName}</p>
              </div>
              <div className={styles.switch__items__item}>
                <Link href='/start-your-switch/your-email'>Your Email: </Link>
                <p>{insuralinkState.yourEmail}</p>
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
                  {insuralinkState.newAgentName},{' '}
                  {insuralinkState.newAgentCompany},{' '}
                  {insuralinkState.newAgentEmail}
                </p>
              </div>
              <div className={styles.switch__items__item}>
                <Link href='/start-your-switch/new-number'>
                  New Policy Number:
                </Link>
                <p>{insuralinkState.newNumber}</p>
              </div>
            </section>
            <p className={styles.switch__description}>
              When you send the message, your information will be sent to your
              current insurance provider. You should receive a response in a
              couple of days confirming your cancellation. Thank you for working
              with us!
            </p>
            <button className={styles.switch__submit} onClick={handleSubmit}>
              Send Message
            </button>
            <p className={styles.switch__response}>{response}</p>
          </main>
        </>
      ) : (
        <Skeleton height={800} borderRadius={15} />
      )}
    </Layout>
  )
}
