import Layout from '../Components/Layout'
import styles from '../styles/Home.module.scss'
import { selectAuthState, setAuthState } from '../store/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'

export default function Home() {
  const authState = useSelector(selectAuthState)
  const dispatch = useDispatch()

  return (
    // <div>
    //   <div>{authState ? 'Logged in' : 'Not Logged In'}</div>
    //   <button
    //     onClick={() =>
    //       authState
    //         ? dispatch(setAuthState(false))
    //         : dispatch(setAuthState(true))
    //     }
    //   >
    //     {authState ? 'Logout' : 'LogIn'}
    //   </button>
    // </div>
    <Layout>
      <div className={styles.home}>
        <header className={styles.home__header}>
          <div className={styles.home__header__left}>
            <h1>
              Streamline Your Insurance Switch with
              <span>
                <p>Quick and Easy</p>
                <img src='/home/underline.png' alt='Underline' />
              </span>
              Policy Cancellations
            </h1>

            <p>
              Getting in contact with old insurance providers is tricky.
              Cancelling your insurance doesn’t have to be.
              <span>
                Insura<span>Link</span>
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
      </div>
    </Layout>
  )
}
