import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import styles from '../../styles/Switch.module.scss'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectInsuralinkState,
  updateInsuralink,
} from '../../store/insuralinkSlice'
import axios from 'axios'
import Popup from '../../Components/Popup'

export default function StartYourSwitch() {
  const dispatch = useDispatch()

  const insuralinkState = useSelector(selectInsuralinkState)

  const [input, setInput] = useState(insuralinkState.code)
  const [clientExists, setClientExists] = useState(false)
  const [maxClientsReached, setMaxClientsReached] = useState(false)

  useEffect(() => {
    const checkCode = async () => {
      //returns the code if it finds a match in the database
      const codeMatch = await axios.get(`/api/code-match?code=${input}`)

      const company = codeMatch.data.user || null

      if (company && company.code) {
        //check to see if the company has reached their max clients for their plan
        const maxClients =
          company.priceID == process.env.NEXT_PUBLIC_STARTER_PLAN
            ? 100
            : company.priceID == process.env.NEXT_PUBLIC_PRO_PLAN
            ? 500
            : 0
        if (company.clients.length == maxClients) {
          setMaxClientsReached(true)
        } else {
          setClientExists(true)
          dispatch(updateInsuralink({ code: input }))
        }
      } else setClientExists(false)
    }
    checkCode()
  }, [input])

  const closePopup = () => {
    setMaxClientsReached(false)
    setInput('')
    dispatch(
      updateInsuralink({
        code: '',
      })
    )
  }

  return (
    <Layout>
      <Popup
        question='Your insurance company has reached the maximum amount of clients for their plan. Let them know so you can start your insurance switch.'
        desc=''
        no='Close'
        cancel={closePopup}
        openPopup={maxClientsReached}
        color='blue'
        renew={true}
      />
      <main className={styles.switch}>
        <p className={styles.switch__number}>
          <span>01</span> of 10
        </p>
        <div className={styles.switch__main}>
          <div className={styles.switch__main__question}>
            <h1>What is your PolicySwitch code?</h1>
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
                onKeyDown={(e) => {
                  if (clientExists && e.key === 'Enter')
                    window.location.href =
                      '/start-your-switch/current-insurance'
                }}
                value={input}
              />
            </div>
          </div>
        </div>
        {clientExists && (
          <Link href='/start-your-switch/current-insurance'>Next</Link>
        )}
      </main>
    </Layout>
  )
}
