import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import styles from '../../styles/Switch.module.scss'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectInsuralinkState,
  updateInsuralink,
} from '../../store/insuralinkSlice'
import SwitchRadio from '../../Components/SwitchRadio'

export default function CurrentInsurance() {
  const dispatch = useDispatch()

  const insuralinkState = useSelector(selectInsuralinkState)

  const [input, setInput] = useState(
    insuralinkState.currentIns[1] == 'input'
      ? insuralinkState.currentIns[0]
      : ''
  )

  const [currentIns, setCurrentIns] = useState(
    insuralinkState.currentIns[1] == 'radio'
      ? insuralinkState.currentIns[0]
      : ''
  )

  const onInputChange = (e) => {
    setInput(e.target.value)
    setCurrentIns('')
    dispatch(updateInsuralink({ currentIns: [e.target.value, 'input'] }))
  }

  const radioChange = (label) => {
    setCurrentIns(label)
    dispatch(updateInsuralink({ currentIns: [label, 'radio'] }))
  }

  return (
    <Layout>
      <Link href='/start-your-switch'>
        <img src='/switch/back.png' alt='Back Arrow' className={styles.back} />
      </Link>
      <main className={styles.switch}>
        <p className={styles.switch__number}>
          <span>02</span> of 08
        </p>
        <div className={styles.switch__main}>
          <div className={styles.switch__main__question}>
            <h1>
              Who is your current insurance provider that you would like to
              cancel with?
            </h1>
          </div>
          <div className={styles.switch__main__answer}>
            <div className={styles.switch__main__answer__radios}>
              <SwitchRadio
                label='State Farm'
                radioChange={radioChange}
                currentIns={currentIns}
              />
              <SwitchRadio
                label='Berkshire Hathaway'
                radioChange={radioChange}
                currentIns={currentIns}
              />
              <SwitchRadio
                label='Progressive'
                radioChange={radioChange}
                currentIns={currentIns}
              />
              <SwitchRadio
                label='Allstate'
                radioChange={radioChange}
                currentIns={currentIns}
              />
            </div>
            <div className={styles.switch__main__answer__item}>
              <label>Other:</label>
              <input
                type='text'
                onChange={(e) => onInputChange(e)}
                value={input}
              />
            </div>
          </div>
        </div>
        {(input.length > 0 || currentIns.length > 0) && (
          <Link href='/start-your-switch/current-number'>Next</Link>
        )}
      </main>
    </Layout>
  )
}
