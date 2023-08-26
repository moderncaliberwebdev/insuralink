import React, { useState } from 'react'
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import app from '../firebase/clientApp'
import styles from '../styles/SignIn.module.scss'
import Layout from '../Components/Layout'
import validator from 'validator'
import Link from 'next/link'
import Popup from '../Components/Popup'

export default function SignIn() {
  const auth = getAuth(app)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [openPopup, setOpenPopup] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const cancelReset = () => {
    setOpenPopup(false)
  }

  const resetPassword = (inputText) => {
    sendPasswordResetEmail(auth, inputText)
      .then(() => {
        setOpenPopup(false)
        setSuccessMsg('Password reset email sent. Check your spam box as well')
        setErrorMsg('')
      })
      .catch((error) => {
        const errorMessage = error.message.replace('Firebase: ', '')
        setErrorMsg("User not found. Can't reset password")
        setSuccessMsg('')
        setOpenPopup(false)
        // ..
      })
  }

  const signUp = () => {
    //front end validation
    const allFilled = email.length > 0 && password.length > 0
    const isEmail = validator.isEmail(email)

    if (!allFilled) {
      setErrorMsg('Please fill in all fields')
    } else if (!isEmail) {
      setErrorMsg('Please provide a valid email')
    } else if (document.querySelector('#honeypot').value.length == 0) {
      setErrorMsg('')
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user

          setSuccessMsg('Successfully logged in user')
          setEmail('')
          setPassword('')
          setErrorMsg('')

          window.location.href = '/company-portal'
        })
        .catch((error) => {
          const errorMessage = error.message.replace('Firebase: ', '')
          if (errorMessage == 'Error (auth/user-not-found).') {
            setErrorMsg('User Not Found')
          } else if (errorMessage == 'Error (auth/wrong-password).') {
            setErrorMsg('Incorrect email or password')
          } else setErrorMsg(errorMessage)
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
      <Popup
        question='Forgot Your Password?'
        desc='Enter your email and click Reset Password. You will be sent a password reset email. Check your spam box as well.'
        input={true}
        answer='Reset Password'
        no='Cancel'
        cancel={cancelReset}
        next={resetPassword}
        openPopup={openPopup}
        color='blue'
        renew={true}
      />
      <div className={styles.signin}>
        <section className={styles.signin__left}>
          <h2>Welcome</h2>
          <p className={styles.signin__left__subhead}>
            Please enter your details
          </p>
          <form className={styles.signin__left__form}>
            <label>Email</label>
            <input
              type='email'
              className={styles.signin__left__form__input}
              onChange={(e) => setEmail(e.target.value)}
              id='email'
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
            <p
              className={styles.signin__left__form__forgot}
              onClick={() => setOpenPopup(true)}
            >
              Forgot Password?
            </p>
            <input
              type='submit'
              value='Sign In'
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
            Policy<span>Switch</span>
          </h2>
        </section>
      </div>
    </Layout>
  )
}
