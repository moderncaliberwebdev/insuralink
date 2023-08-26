import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import styles from '../../styles/Switch.module.scss'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectInsuralinkState,
  updateInsuralink,
} from '../../store/insuralinkSlice'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function YourEmail() {
  const dispatch = useDispatch()

  const insuralinkState = useSelector(selectInsuralinkState)

  const [input, setInput] = useState(insuralinkState.yourEmail)
  const [nameInput, setNameInput] = useState(insuralinkState.yourName)

  useEffect(() => {
    dispatch(updateInsuralink({ yourEmail: input }))
  }, [input])
  useEffect(() => {
    dispatch(updateInsuralink({ yourName: nameInput }))
  }, [nameInput])

  useEffect(() => {
    if (insuralinkState.code.length == 0) {
      window.location.href = '/start-your-switch'
    }
  }, [insuralinkState])

  return (
    <Layout>
      {insuralinkState.code ? (
        <>
          <Link href='/start-your-switch/current-insurance-email'>
            <img
              src='/switch/back.png'
              alt='Back Arrow'
              className={styles.back}
              id='backArrow'
            />
          </Link>
          <main className={styles.switch}>
            <p className={styles.switch__number}>
              <span>05</span> of 10
            </p>
            <div className={styles.switch__main}>
              <div className={styles.switch__main__question}>
                <h1>What is your name & email?</h1>
                <p>
                  This is necessary so you can receive confirmation of your
                  insurance policy being cancelled.
                </p>
              </div>
              <div className={styles.switch__main__answer}>
                <div className={styles.switch__main__answer__item}>
                  <label>Name:</label>
                  <input
                    type='text'
                    onChange={(e) => setNameInput(e.target.value)}
                    value={nameInput}
                    id='nameInput'
                  />
                </div>
                <div className={styles.switch__main__answer__item}>
                  <label>Email:</label>
                  <input
                    type='text'
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                    id='emailInput'
                  />
                </div>
              </div>
            </div>
            {input.length > 0 && (
              <Link href='/start-your-switch/date'>Next</Link>
            )}
          </main>
        </>
      ) : (
        <Skeleton height={500} borderRadius={15} />
      )}
    </Layout>
  )
}
