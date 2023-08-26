import Layout from '../Components/Layout'
import styles from '../styles/Home.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { updateInsuralink } from '../store/insuralinkSlice'
import Popup from '../Components/Popup'

export default function Home() {
  const router = useRouter()
  const dispatch = useDispatch()

  const [openPopup, setOpenPopup] = useState(false)

  useEffect(() => {
    if (router.isReady && router.query.sent == 'true') {
      setOpenPopup(true)
    }
  }, [router.isReady])

  const closePopup = () => {
    setOpenPopup(false)
    dispatch(
      updateInsuralink({
        code: '',
      })
    )
  }

  return (
    <Layout>
      <Popup
        question='Your Cancellation Request Has Been Sent'
        desc=''
        no='Close'
        cancel={closePopup}
        openPopup={openPopup}
        color='blue'
        renew={true}
      />
      <div className={styles.home}>
        <header className={styles.home__header}>
          <div className={styles.home__header__left}>
            <h1>
              Streamline Your Insurance Switch with{' '}
              <span>
                <p>Quick and Easy</p>
                <img src='/home/underline.png' alt='Underline' />
              </span>{' '}
              Policy Cancellations
            </h1>

            <p>
              Getting in contact with old insurance providers is tricky.
              Cancelling your insurance doesn’t have to be.
              <span>
                Policy<span>Switch</span>
              </span>
              can help you.
            </p>
            <Link href='/our-service'>
              <span>Discover More</span>
              <img src='/home/go.png' alt='Next Page Button' />
            </Link>
          </div>
          <div className={styles.home__header__right}>
            <img
              className={styles.home__header__right}
              src='/home/hero.png'
              alt='Home Header Insurance Photo'
            />
          </div>
        </header>
        <section className={styles.home__protection}>
          <div className={styles.home__protection__left}>
            <img src='/home/insurance.png' alt='Insurance Graphic' />
          </div>
          <div className={styles.home__protection__right}>
            <h2>Stay protected without any breaks in your insurance</h2>
            <p>
              When switching insurance providers, it's crucial not to go a
              single day without coverage. Even one day with a lapse in coverage
              could cost hundreds of dollars.
            </p>
            <p className={styles.home__protection__right__accent}>
              When using PolicySwitch, we collect necessary information
              regarding your current provider to aid in cancelling your policy
              with them on time.
            </p>
            <p>
              Switching your insurance used to be a stressful process... until
              now. Regardless of what type of insurance you have, start your
              switch today with
              <span>
                Policy<span>Switch</span>
              </span>
              .
            </p>
            <Link href='/start-your-switch'>Start Your Switch</Link>
          </div>
        </section>
        <section className={styles.home__how}>
          <h2>How It Works</h2>
          <p className={styles.home__how__subhead}>
            Three simple steps to switch your insurance.
          </p>
          <div className={styles.home__how__graphics}>
            <div className={styles.home__how__graphics__item}>
              <img
                src='/home/line.png'
                alt='Dashed Line'
                className={styles.home__how__graphics__item__graphic__line}
              />
              <div class={styles.home__how__graphics__item__graphic}>
                <div
                  className={styles.home__how__graphics__item__graphic__card}
                >
                  <img src='/home/form.png' alt='Form' />
                  <h4>
                    Who is your current insurance provider? When would you like
                    your policy to be cancelled?
                  </h4>
                  <p>
                    Answer a couple simple questions to provide the information
                    we need.
                  </p>
                </div>
                <h3>1. Fill in your information</h3>
              </div>
            </div>
            <div
              className={`${styles.home__how__graphics__item} ${styles.item__right}`}
            >
              <div class={styles.home__how__graphics__item__graphic}>
                <h3>2. Click Send</h3>
                <div
                  className={styles.home__how__graphics__item__graphic__card}
                >
                  <img src='/home/send.png' alt='Send graphic' />
                  <h4>Click send and that’s it!</h4>
                  <p>
                    Once all necessary information is provided and the form is
                    sent, we'll step in to do the rest.
                  </p>
                </div>
              </div>
              <img
                src='/home/line.png'
                alt='Dashed Line'
                className={styles.home__how__graphics__item__graphic__line}
              />
            </div>
            <div className={styles.home__how__graphics__item}>
              <img
                src='/home/line.png'
                alt='Dashed Line'
                className={styles.home__how__graphics__item__graphic__line}
              />
              <div class={styles.home__how__graphics__item__graphic}>
                <div
                  className={styles.home__how__graphics__item__graphic__card}
                >
                  <img src='/home/handshake.png' alt='Handshake graphic' />
                  <h4>
                    PolicySwitch connects with your current insurance company.
                  </h4>
                  <p>
                    We connect with your current insurance company and provide
                    them with your information. We'll make sure your policy is
                    cancelled on time.
                  </p>
                </div>
                <h3>3. We handle the contact</h3>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.home__faq}>
          <div className={styles.home__faq__header}>
            <h2>Frequently Asked Questions</h2>
            <img src='/home/sparkle.png' alt='Sparkle' />
          </div>
          <p className={styles.home__faq__subhead}>
            Everything you need to know to get a seamless switch to your new
            insurance provider.
          </p>
          <div className={styles.home__faq__qs}>
            <div className={styles.home__faq__qs__item}>
              <h4>Is PolicySwitch free?</h4>
              <p>
                Yes! PolicySwitch is free for all clients of participating
                insurance companies. Just fill out the simple form and click
                send, and we’ll handle the rest!
              </p>
            </div>
            <div className={styles.home__faq__qs__item}>
              <h4>Is PolicySwitch free?</h4>
              <p>
                Yes! PolicySwitch isfree for all clients of participating
                insurance companies. Just fill out the simple form and click
                send, and we’ll handle the rest!
              </p>
            </div>
            <div className={styles.home__faq__qs__item}>
              <h4>Is PolicySwitch free?</h4>
              <p>
                Yes! PolicySwitch isfree for all clients of participating
                insurance companies. Just fill out the simple form and click
                send, and we’ll handle the rest!
              </p>
            </div>
            <div className={styles.home__faq__qs__item}>
              <h4>Is PolicySwitch free?</h4>
              <p>
                Yes! PolicySwitch isfree for all clients of participating
                insurance companies. Just fill out the simple form and click
                send, and we’ll handle the rest!
              </p>
            </div>
            <div className={styles.home__faq__qs__item}>
              <h4>Is PolicySwitch free?</h4>
              <p>
                Yes! PolicySwitch isfree for all clients of participating
                insurance companies. Just fill out the simple form and click
                send, and we’ll handle the rest!
              </p>
            </div>
            <div className={styles.home__faq__qs__item}>
              <h4>Is PolicySwitch free?</h4>
              <p>
                Yes! PolicySwitch isfree for all clients of participating
                insurance companies. Just fill out the simple form and click
                send, and we’ll handle the rest!
              </p>
            </div>
          </div>
          <div className={styles.home__faq__cta}>
            <div className={styles.home__faq__cta__left}>
              <h3>Ready to make a switch?</h3>
              <p>Go to the Switch Insurance page and get started!</p>
            </div>
            <div className={styles.home__faq__cta__right}>
              <Link href='/start-your-switch'>Start Your Switch</Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
