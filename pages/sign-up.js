import React, { useState } from 'react'
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import app from '../firebase/clientApp'
import styles from '../styles/SignIn.module.scss'
import Layout from '../Components/Layout'
import validator from 'validator'
import Link from 'next/link'
import axios from 'axios'

export default function SignUp() {
  const auth = getAuth(app)

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [showPass, setShowPass] = useState(false)

  const signUp = () => {
    //front end validation
    const allFilled =
      name.length > 0 &&
      location.length > 0 &&
      email.length > 0 &&
      password.length > 0

    const isEmail = validator.isEmail(email)
    if (!allFilled) {
      setErrorMsg('Please fill in all fields')
    } else if (!isEmail) {
      setErrorMsg('Please provide a valid email')
    } else if (document.querySelector('#honeypot').value.length == 0) {
      setErrorMsg('')
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user
          updateProfile(auth.currentUser, {
            displayName: name,
          })

          //makes random string code
          function randomString(length, chars) {
            var result = ''
            for (var i = length; i > 0; --i)
              result += chars[Math.floor(Math.random() * chars.length)]
            return result
          }

          await axios.post('/api/create-user', {
            name,
            location,
            email: email.toLowerCase(),
            clients: [],
            admin: false,
            subscribed: false,
            code: randomString(
              32,
              '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
            ),
            subscriptionID: '',
            sentCode: false,
            customerID: '',
            productID: '',
          })

          setSuccessMsg('Successfully created user')
          setName('')
          setLocation('')
          setEmail('')
          setPassword('')
          setErrorMsg('')

          window.location.href = '/company-portal'
        })
        .catch((error) => {
          const errorMessage = error.message.replace('Firebase: ', '')
          setErrorMsg(errorMessage)
        })
    }
  }

  const showPassword = () => {
    const x = document.getElementById('password')
    if (x.type === 'password') {
      x.type = 'text'
      setShowPass(true)
    } else {
      x.type = 'password'
      setShowPass(false)
    }
  }

  return (
    <Layout>
      <div className={styles.signin}>
        <section className={styles.signin__left}>
          <h2>Welcome</h2>
          <p className={styles.signin__left__subhead}>
            Please enter your details to create an account
          </p>
          <form className={styles.signin__left__form}>
            <label>Company Name</label>
            <input
              type='text'
              className={styles.signin__left__form__input}
              onChange={(e) => setName(e.target.value)}
            />
            <label>Location (City)</label>
            <input
              type='text'
              className={styles.signin__left__form__input}
              onChange={(e) => setLocation(e.target.value)}
            />
            <label>Email</label>
            <input
              type='email'
              className={styles.signin__left__form__input}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className={styles.signin__left__form__honeypot}>
              <input type='text' id='honeypot' />
            </div>
            <label>Password</label>
            <input
              type='password'
              id='password'
              className={styles.signin__left__form__input}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p
              className={styles.signin__left__form__show}
              onClick={showPassword}
            >
              {showPass ? 'Hide Password' : 'Show Password'}
            </p>

            <input
              type='submit'
              value='Sign Up'
              className={styles.signin__left__form__submit}
              onClick={(e) => {
                e.preventDefault()
                signUp()
              }}
            />
            <p className={styles.signin__left__form__error}>
              {errorMsg && errorMsg.length > 0 && errorMsg}
            </p>
            <p className={styles.signin__left__form__success}>
              {successMsg && successMsg.length > 0 && successMsg}
            </p>
            <p className={styles.signin__left__form__noaccount}>
              Don't have an account? <Link href='/sign-up'>Sign Up</Link>
            </p>
          </form>
        </section>
        <section className={styles.signin__right}>
          <h2>
            Insura<span>Link</span>
          </h2>
        </section>
      </div>
    </Layout>
  )
}
