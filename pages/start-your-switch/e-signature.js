import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../Components/Layout'
import styles from '../../styles/Switch.module.scss'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectInsuralinkState,
  updateInsuralink,
} from '../../store/insuralinkSlice'
import SignatureCanvas from 'react-signature-canvas'

export default function CurrentNumber() {
  const dispatch = useDispatch()

  const insuralinkState = useSelector(selectInsuralinkState)

  const [savedURL, setSavedURL] = useState(insuralinkState.eSig)
  const [imageURL, setImageURL] = useState(null)

  const sigCanvas = useRef()

  useEffect(() => {
    if (savedURL && sigCanvas) {
      sigCanvas.current.fromDataURL(savedURL)
      setImageURL(savedURL)
    }
  }, [savedURL])

  const create = () => {
    const URL = sigCanvas.current.getCanvas().toDataURL('image/png')
    setImageURL(URL)
    dispatch(updateInsuralink({ eSig: URL }))

    window.location.href = '/start-your-switch/new-insurance'
  }

  const clear = () => {
    sigCanvas.current.clear()
    setImageURL(null)
    dispatch(updateInsuralink({ eSig: '' }))
  }

  return (
    <Layout>
      <Link href='/start-your-switch/id-card'>
        <img
          src='/switch/back.png'
          alt='Back Arrow'
          className={styles.back}
          id='backArrow'
        />
      </Link>
      <main className={styles.switch}>
        <p className={styles.switch__number}>
          <span>06</span> of 08
        </p>
        <div className={styles.switch__main}>
          <div className={styles.switch__main__question}>
            <h1>E-Signature</h1>
            <p>
              Your e-signature confirms your cancellation with your current
              insurance provider.
            </p>
          </div>
          <div className={styles.switch__main__answer}>
            <div className={styles.switch__main__answer__item}>
              <SignatureCanvas
                penColor='black'
                canvasProps={{
                  width: 400,
                  height: 200,
                  className: 'sigCanvas',
                }}
                ref={sigCanvas}
              />
            </div>
            <button onClick={clear} className={styles.small__button}>
              Clear Signature
            </button>
          </div>
        </div>

        <button onClick={create} className={styles.black__button}>
          Create Signature
        </button>
      </main>
    </Layout>
  )
}
