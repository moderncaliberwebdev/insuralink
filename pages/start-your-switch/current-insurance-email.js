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

export default function CurrentEmail() {
  const dispatch = useDispatch()

  const insuralinkState = useSelector(selectInsuralinkState)

  const [input, setInput] = useState(insuralinkState.currentInsEmail)

  useEffect(() => {
    dispatch(updateInsuralink({ currentInsEmail: input }))
  }, [input])

  useEffect(() => {
    if (insuralinkState.code.length == 0) {
      window.location.href = '/start-your-switch'
    }
  }, [insuralinkState])

  return (
    <Layout>
      {insuralinkState.code ? (
        <>
          <Link href='/start-your-switch/current-number'>
            <img
              src='/switch/back.png'
              alt='Back Arrow'
              className={styles.back}
              id='backArrow'
            />
          </Link>
          <main className={styles.switch}>
            <p className={styles.switch__number}>
              <span>04</span> of 09
            </p>
            <div className={styles.switch__main}>
              <div className={styles.switch__main__question}>
                <h1>What is your current insurance agent's email?</h1>
                <p>
                  If you've ever corresponded with your insurance company via an
                  agent, it would be their email.
                </p>
              </div>
              <div className={styles.switch__main__answer}>
                <div className={styles.switch__main__answer__item}>
                  <label>Email:</label>
                  <input
                    type='text'
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (input.length > 0 && e.key === 'Enter')
                        window.location.href = '/start-your-switch/your-email'
                    }}
                    value={input}
                  />
                </div>
              </div>
            </div>
            {input.length > 0 && (
              <Link href='/start-your-switch/your-email'>Next</Link>
            )}
          </main>
        </>
      ) : (
        <Skeleton height={500} borderRadius={15} />
      )}
    </Layout>
  )
}
