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

export default function Date() {
  const dispatch = useDispatch()

  const insuralinkState = useSelector(selectInsuralinkState)

  const [selected, setSelected] = useState('')

  const [initialStateLoaded, setInitialStateLoaded] = useState(false)

  useEffect(() => {
    console.log('string of selected time >>> ', selected)
    console.log('type of selected >>>> ', typeof selected)

    //send selected date to redux when selected date is updated
    dispatch(updateInsuralink({ date: selected }))
  }, [selected])

  useEffect(() => {
    console.log('redux state >>>>  ', insuralinkState.date)
  }, [insuralinkState])

  useEffect(() => {
    //on page load, when insuralinkState loads, set initial state of selected to value from redux
    if (insuralinkState.date) {
      console.log('setting selected on load >>>', insuralinkState.date)
      setInitialStateLoaded(true)
      setSelected(insuralinkState.date)
    }
  }, [])

  return (
    <Layout>
      <Link href='/start-your-switch/current-number'>
        <img src='/switch/back.png' alt='Back Arrow' className={styles.back} />
      </Link>
      <main className={styles.switch}>
        <p className={styles.switch__number}>
          <span>04</span> of 08
        </p>
        <div className={styles.switch__main}>
          <div className={styles.switch__main__question}>
            <h1>When would you like this insurance policy to be cancelled?</h1>
            <p>
              Overlapping insurance policies can cost you unnecessarily. Please
              make sure to select the most exact date possible.
            </p>
          </div>
          <div className={styles.switch__main__answer}>
            <div className={styles.switch__main__answer__item}>
              <DayPicker
                mode='single'
                selected={initialStateLoaded ? parseISO(selected) : selected}
                onSelect={(value) => {
                  setInitialStateLoaded(false)
                  setSelected(value)
                }}
                footer={
                  selected ? (
                    <p>
                      You picked{' '}
                      {initialStateLoaded
                        ? format(parseISO(selected), 'PP')
                        : format(selected, 'PP')}
                      .
                    </p>
                  ) : (
                    <p>Please pick a day.</p>
                  )
                }
              />
            </div>
          </div>
        </div>
        {selected && <Link href='/start-your-switch/date'>Next</Link>}
      </main>
    </Layout>
  )
}
