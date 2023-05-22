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

export default function CurrentNumber() {
  const dispatch = useDispatch()

  const insuralinkState = useSelector(selectInsuralinkState)

  const [createObjectURL, setCreateObjectURL] = useState(null)
  const [imageError, setImageError] = useState('')

  const uploadToClient = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0]
      if (i.size < 1600000) {
        //create temp url for displaying preview
        setCreateObjectURL(URL.createObjectURL(i))
        console.log(URL.createObjectURL(i))

        const logoName = await uploadToServer()

        dispatch(updateInsuralink({ idCard: logoName }))
      } else setImageError('File must be less than 16MB')
    }
  }

  const uploadToServer = async () => {
    const event = document.getElementById('fileUpload')
    if (event.files && event.files[0]) {
      const i = event.files[0]
      if (i.size < 1600000) {
        const renameFile = (originalFile, newName) => {
          return new File([originalFile], newName, {
            type: originalFile.type,
            lastModified: originalFile.lastModified,
          })
        }
        const newName = renameFile(
          i,
          `${i.name.split('.')[0]}-${
            Math.floor(Math.random() * 90000) + 10000
          }.${i.name.split('.')[1]}`
        )
        const body = new FormData()
        body.append('file', newName)

        const config = {
          headers: {
            'content-type': 'multipart/form-data',
          },
        }

        console.log(newName)

        const uploadLogo = await axios.post('/api/id-img', body, config)
        if (uploadLogo) {
          return newName.name
        }
      } else setImageError('File must be less than 16MB')
    }
    return ''
  }

  return (
    <Layout>
      <Link href='/start-your-switch/date'>
        <img
          src='/switch/back.png'
          alt='Back Arrow'
          className={styles.back}
          id='backArrow'
        />
      </Link>
      <main className={styles.switch}>
        <p className={styles.switch__number}>
          <span>05</span> of 08
        </p>
        <div className={styles.switch__main}>
          <div className={styles.switch__main__question}>
            <h1>Identification Card</h1>
            <p>
              Provide a copy of your identification to help confirm your
              cancellation with your current insurance provider. (Driver’s
              License, Passport, etc.)
            </p>
          </div>
          <div className={styles.switch__main__answer}>
            <div className={styles.switch__main__answer__item}>
              <label>
                <span>Upload</span>
                {insuralinkState.idCard ? (
                  <img
                    src={`https://insuralink.s3.amazonaws.com/${insuralinkState.idCard}`}
                    alt='preview '
                    id='awsImg'
                  />
                ) : (
                  <img src='/switch/upload.png' alt='Upload Icon' />
                )}
                <input
                  type='file'
                  name='file'
                  id='fileUpload'
                  accept='image/png,image/gif,image/jpeg'
                  onChange={uploadToClient}
                />
              </label>
              {imageError && <p>{imageError}</p>}
            </div>
          </div>
        </div>
        {insuralinkState.idCard.length > 0 && (
          <Link href='/start-your-switch/e-signature'>Next</Link>
        )}
      </main>
    </Layout>
  )
}
