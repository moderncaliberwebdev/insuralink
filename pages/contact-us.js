import React, { useState } from 'react'
import Layout from '../Components/Layout'
import styles from '../styles/Contact.module.scss'

import emailjs from 'emailjs-com'

export default function Contact() {
  const [from_name, setFrom_name] = useState('')
  const [email, setEmail] = useState('')
  const [number, setNumber] = useState('')
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')

  const handleSubmit = () => {
    const templateParams = {
      from_name,
      email,
      number,
      message,
      subject: 'New Insuralink Contact Request',
      client: 'Insuralink',
      client_email: 'cmartin@moderncaliber.com',
    }

    emailjs
      .send(
        process.env.NEXT_PUBLIC_SERVICE_ID,
        process.env.NEXT_PUBLIC_TEMPLATE_ID,
        templateParams,
        process.env.NEXT_PUBLIC_EMAIL_KEY
      )
      .then(
        (result) => {
          console.log(result.text)
          setResponse('Message Sent')

          setFrom_name('')
          setEmail('')
          setNumber('')
          setMessage('')
        },
        (error) => {
          setResponse(error.text)
        }
      )
  }

  return (
    <Layout>
      <div className={styles.contact}>
        <div className={styles.contact__left}>
          <h1>Have a question? Feel free to contact us!</h1>
          <p>
            Fill out the following form and we’ll get back to you as soon as
            possible
          </p>
          <form>
            <div>
              <label>
                <p className={styles.number}>01</p>
                <p className={styles.label}>What’s your name?</p>
              </label>
              <input
                type='text'
                placeholder='Type your full name'
                name='from_name'
                value={from_name}
                onChange={(e) => setFrom_name(e.target.value)}
              />
            </div>
            <div>
              <label>
                <p className={styles.number}>02</p>
                <p className={styles.label}>What’s your email address?</p>
              </label>
              <input
                type='text'
                placeholder='example@gmail.com'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label>
                <p className={styles.number}>03</p>
                <p className={styles.label}>What’s your phone number?</p>
              </label>
              <input
                type='text'
                placeholder='717-777-7777'
                name='number'
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
            <div>
              <label>
                <p className={styles.number}>04</p>
                <p className={styles.label}>What are you inquiring about?</p>
              </label>
              <input
                type='text'
                placeholder='Type your inquiry'
                name='message'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </form>
          <p className={styles.contact__left__response}>{response}</p>
          <button onClick={handleSubmit}>Send Message</button>
        </div>
        <div className={styles.contact__right}>
          <img src='/contact/get-in-touch.png' alt='Get in Touch Image' />
          <div className={styles.contact__right__numbers}>
            <h2>Call Us</h2>
            <p>717-777-7777</p>
            <p>717-777-7777</p>
            <h2>Email</h2>
            <p>admin@gmail.com</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
