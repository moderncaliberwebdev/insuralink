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

export default function NewNumber() {
  const dispatch = useDispatch()

  const insuralinkState = useSelector(selectInsuralinkState)

  const [input, setInput] = useState(insuralinkState.newNumber)

  useEffect(() => {
    dispatch(updateInsuralink({ newNumber: input }))
  }, [input])

  //redirect to start if there is no code
  useEffect(() => {
    if (insuralinkState.code.length == 0) {
      window.location.href = '/start-your-switch'
    }
  }, [insuralinkState])

  return (
    <Layout>
      {insuralinkState.code ? (
        <>
          <Link href='/start-your-switch/new-insurance'>
            <img
              src='/switch/back.png'
              alt='Back Arrow'
              className={styles.back}
              id='backArrow'
            />
          </Link>
          <main className={styles.switch}>
            <p className={styles.switch__number}>
              <span>10</span> of 10
            </p>
            <div className={styles.switch__main}>
              <div className={styles.switch__main__question}>
                <h1>What is your new insurance policy number?</h1>
                <p>
                  This number can be found on your new insurance card. It may be
                  referred to as Subscriber ID or Member ID.
                </p>
              </div>
              <div className={styles.switch__main__answer}>
                <div className={styles.switch__main__answer__item}>
                  <label>Number:</label>
                  <input
                    type='text'
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (input.length > 0 && e.key === 'Enter')
                        window.location.href = '/start-your-switch/send'
                    }}
                    value={input}
                  />
                </div>
              </div>
            </div>
            {input.length > 0 && (
              <Link href='/start-your-switch/send'>Next</Link>
            )}
          </main>
        </>
      ) : (
        <Skeleton height={500} borderRadius={15} />
      )}
    </Layout>
  )
}
