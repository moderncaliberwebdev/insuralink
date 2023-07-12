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
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function NewInsurance() {
  const dispatch = useDispatch()

  const insuralinkState = useSelector(selectInsuralinkState)

  const [agentName, setAgentName] = useState(insuralinkState.newAgentName)
  const [agentCompany, setAgentCompany] = useState(
    insuralinkState.newAgentCompany
  )
  const [agentEmail, setAgentEmail] = useState(insuralinkState.newAgentEmail)

  useEffect(() => {
    dispatch(updateInsuralink({ newAgentName: agentName }))
  }, [agentName])
  useEffect(() => {
    dispatch(updateInsuralink({ newAgentCompany: agentCompany }))
  }, [agentCompany])
  useEffect(() => {
    dispatch(updateInsuralink({ newAgentEmail: agentEmail }))
  }, [agentEmail])

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
          <Link href='/start-your-switch/e-signature'>
            <img
              src='/switch/back.png'
              alt='Back Arrow'
              className={styles.back}
              id='backArrow'
            />
          </Link>
          <main className={styles.switch}>
            <p className={styles.switch__number}>
              <span>09</span> of 10
            </p>
            <div className={styles.switch__main}>
              <div className={styles.switch__main__question}>
                <h1>Who is your new insurance agent?</h1>
                <p>Necessary for security and verification.</p>
              </div>
              <div className={styles.switch__main__answer}>
                <div className={styles.switch__main__answer__item}>
                  <label>Agent Name:</label>
                  <input
                    type='text'
                    onChange={(e) => setAgentName(e.target.value)}
                    value={agentName}
                    id='agentName'
                  />
                </div>
                <div className={styles.switch__main__answer__item}>
                  <label>Agent Company:</label>
                  <input
                    type='text'
                    onChange={(e) => setAgentCompany(e.target.value)}
                    value={agentCompany}
                    id='agentCompany'
                  />
                </div>
                <div className={styles.switch__main__answer__item}>
                  <label>Agent Email:</label>
                  <input
                    type='text'
                    onChange={(e) => setAgentEmail(e.target.value)}
                    value={agentEmail}
                    id='agentEmail'
                  />
                </div>
              </div>
            </div>
            {agentName.length > 0 &&
              agentCompany.length > 0 &&
              agentEmail.length > 0 && (
                <Link href='/start-your-switch/new-number'>Next</Link>
              )}
          </main>
        </>
      ) : (
        <Skeleton height={500} borderRadius={15} />
      )}
    </Layout>
  )
}
