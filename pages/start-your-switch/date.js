import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import styles from '../../styles/Switch.module.scss'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectInsuralinkState,
  updateInsuralink,
} from '../../store/insuralinkSlice'

import { format, parseISO } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function SwitchDate() {
  const dispatch = useDispatch()

  const insuralinkState = useSelector(selectInsuralinkState)

  const [selected, setSelected] = useState('')

  useEffect(() => {
    //send selected date to redux when selected date is updated
    dispatch(updateInsuralink({ date: selected }))
    console.log(selected)
  }, [selected])

  //redirect to start if there is no code
  useEffect(() => {
    if (insuralinkState.code.length == 0) {
      window.location.href = '/start-your-switch'
    }
  }, [insuralinkState])

  useEffect(() => {
    //on page load, when insuralinkState loads, set initial state of selected to value from redux
    if (insuralinkState.date) {
      setSelected(new Date(insuralinkState.date.toString()).toISOString())
    }
  }, [])

  return (
    <Layout>
      {insuralinkState.code ? (
        <>
          <Link href='/start-your-switch/your-email'>
            <img
              src='/switch/back.png'
              alt='Back Arrow'
              className={styles.back}
              id='backArrow'
            />
          </Link>
          <main className={styles.switch}>
            <p className={styles.switch__number}>
              <span>06</span> of 09
            </p>
            <div className={styles.switch__main}>
              <div className={styles.switch__main__question}>
                <h1>
                  When would you like this insurance policy to be cancelled?
                </h1>
                <p>
                  Overlapping insurance policies can cost you unnecessarily.
                  Please make sure to select the most exact date possible.
                </p>
              </div>
              <div className={styles.switch__main__answer}>
                <div className={styles.switch__main__answer__item}>
                  <DayPicker
                    mode='single'
                    selected={parseISO(selected)}
                    onSelect={(value) => {
                      setSelected(new Date(value.toString()).toISOString())
                    }}
                    footer={
                      selected ? (
                        <p>You picked {format(parseISO(selected), 'PP')}.</p>
                      ) : (
                        <p>Please pick a day.</p>
                      )
                    }
                  />
                </div>
              </div>
            </div>
            {selected && (
              <Link href='/start-your-switch/e-signature'>Next</Link>
            )}
          </main>
        </>
      ) : (
        <Skeleton height={500} borderRadius={15} />
      )}
    </Layout>
  )
}
