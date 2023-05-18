import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import styles from '../../styles/Switch.module.scss'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectInsuralinkState,
  updateInsuralink,
} from '../../store/insuralinkSlice'

export default function StartYourSwitch() {
  const dispatch = useDispatch()

  const insuralinkState = useSelector(selectInsuralinkState)

  const [input, setInput] = useState(insuralinkState.code)

  useEffect(() => {
    dispatch(updateInsuralink({ code: input }))
  }, [input])

  return (
    <Layout>
      <main className={styles.switch}>
        <p className={styles.switch__number}>
          <span>01</span> of 08
        </p>
        <div className={styles.switch__main}>
          <div className={styles.switch__main__question}>
            <h1>What is your InsuraLink code?</h1>
            <p>
              Your insurance company gave you a unique code during the sign on
              process with them.
            </p>
          </div>
          <div className={styles.switch__main__answer}>
            <div className={styles.switch__main__answer__item}>
              <label>Code:</label>
              <input
                type='text'
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
            </div>
          </div>
        </div>
        {input.length > 0 && (
          <Link href='/start-your-switch/current-insurance'>Next</Link>
        )}
      </main>
    </Layout>
  )
}
