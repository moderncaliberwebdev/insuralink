import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import PortalSidebar from '../../Components/PortalSidebar'
import styles from '../../styles/CompanyPortal.module.scss'
import Popup from '../../Components/Popup'
import { useRouter } from 'next/router'
import emailjs from 'emailjs-com'
import { parseISO } from 'date-fns'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../../firebase/clientApp'
import axios from 'axios'

import { Stripe } from 'stripe'
const stripe = Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_TEST_KEY)
import Link from 'next/link'

const auth = getAuth()

export default function CompanyPortal() {
  const router = useRouter()

  const [currentUser, setCurrentUser] = useState()
  const [userFromDB, setUserFromDB] = useState()
  const [checkoutSession, setCheckoutSession] = useState('')
  const [loading, setLoading] = useState(true)
  const [openPopup, setOpenPopup] = useState(false)
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState('')
  const [cancelled, setCancelled] = useState(false)
  const [clientsSwitched, setClientsSwitched] = useState(0)
  const [clientsNotSwitched, setClientsNotSwitched] = useState(0)
  const [allClientsState, setAllClientsState] = useState([])
  const [companiesNumber, setCompaniesNumber] = useState(0)

  useEffect(() => {
    if (router.isReady) {
      //gets user from firebase
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user)

          const config = {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }

          //retrieve client data
          const clientData = await axios.get(
            `/api/client?email=${user.email}`,
            config
          )

          clientData && setLoading(false)

          //set user data to state
          setUserFromDB(clientData.data.user)

          if (clientData.data.user.subscribed == true) {
            //retrieve subscription if the user has one
            const subscription = await stripe.subscriptions.retrieve(
              clientData.data.user.subscriptionID
            )
            setCurrentPeriodEnd(
              new Date(1000 * subscription.current_period_end)
            )
            if (subscription.cancel_at) {
              setCancelled(true)
            }
          }

          //send code to company via email
          if (
            clientData.data.user.subscribed == true &&
            clientData.data.user.sentCode == false
          ) {
            const templateParams = {
              code: clientData.data.user.code,
              client: clientData.data.user.name,
              client_email: clientData.data.user.email,
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
                },
                (error) => {
                  setResponse(error.text)
                }
              )

            //sets sentCode to false so it doens't send if the user refreshes their page
            const sentCode = await axios.put(
              `/api/client/sent-code`,
              {
                email: user.email,
              },
              config
            )
          }

          //if the user is not subscribed, then open the notification popup
          if (
            clientData.data.user.subscribed == false &&
            clientData.data.user.admin == false
          ) {
            setOpenPopup(true)
          }

          //collect admin data
          if (clientData.data.user.admin == true) {
            const config = {
              headers: { Authorization: `Bearer ${user.accessToken}` },
            }

            //retrieve client data
            const allClients = await axios.get(
              `/api/client/all-clients?admin=true`,
              config
            )
            console.log(allClients)
            setAllClientsState(allClients.data.clients)
            setCompaniesNumber(allClients.data.companies)
          }
        } else {
          window.location.href = '/'
        }
      })
    }
  }, [auth, router.isReady])

  useEffect(() => {
    if (userFromDB) {
      //sets temp vars for switched and not switched
      let tempSwitched = 0
      let tempNotSwitched = 0

      const clientsToSort = userFromDB.admin
        ? allClientsState
        : userFromDB.clients

      console.log(clientsToSort)

      //sorts users by if their expiration date is up or not
      clientsToSort.forEach((client) => {
        const currentDate = new Date().getTime()
        if (currentDate > new Date(client.date).getTime()) {
          tempSwitched = tempSwitched + 1
        } else {
          tempNotSwitched = tempNotSwitched + 1
        }
      })

      setClientsSwitched(tempSwitched)
      setClientsNotSwitched(tempNotSwitched)
    }
  }, [userFromDB, allClientsState])

  const closePopup = () => {
    setOpenPopup(false)
  }

  return (
    <Layout>
      <main className={styles.portal}>
        <Popup
          question='You Are Not Subscribed Yet'
          desc='To use PolicySwitch and finish your sign up process, you must have a subscription'
          answer='Subscription Settings'
          no='Cancel'
          cancel={closePopup}
          next={() => (window.location.href = '/company-portal/plans')}
          openPopup={openPopup}
          color='blue'
          renew={true}
        />
        <PortalSidebar clientInfo={userFromDB} />
        <section className={styles.portal__right}>
          <h1>Company Dashboard</h1>

          {userFromDB ? (
            <div className={styles.portal__right__blocks}>
              {userFromDB.admin == false ? (
                currentPeriodEnd ? (
                  <>
                    <div className={styles.portal__right__blocks__clients}>
                      <div
                        className={styles.portal__right__blocks__clients__top}
                      >
                        <h2>Clients</h2>

                        <Link href='/company-portal/clients'>More</Link>
                      </div>
                      <div
                        className={styles.portal__right__blocks__clients__mid}
                        style={{
                          background: `radial-gradient(
                  closest-side,
                  #72a59c 85%,
                  transparent 80% 100%
                ),
                conic-gradient(#fff ${
                  (clientsSwitched / (clientsSwitched + clientsNotSwitched)) *
                  100
                }%, #bedbd6 0)`,
                        }}
                      >
                        {userFromDB && userFromDB.clients.length}
                      </div>
                      <div
                        className={
                          styles.portal__right__blocks__clients__bottom
                        }
                      >
                        <div
                          className={
                            styles.portal__right__blocks__clients__bottom__switched
                          }
                        >
                          <div></div>
                          <p>Insurance Switched</p>
                          <span>
                            {Math.round(
                              (clientsSwitched /
                                (clientsSwitched + clientsNotSwitched)) *
                                100
                            ) || 0}
                            %
                          </span>
                        </div>
                        <div
                          className={
                            styles.portal__right__blocks__clients__bottom__notswitched
                          }
                        >
                          <div></div>
                          <p>Insurance Not Yet Switched</p>
                          <span>
                            {Math.round(
                              (clientsNotSwitched /
                                (clientsSwitched + clientsNotSwitched)) *
                                100
                            ) || 0}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.portal__right__blocks__subscription}>
                      {userFromDB.subscribed == true ? (
                        <>
                          <div
                            className={
                              styles.portal__right__blocks__subscription__top
                            }
                          >
                            <h2>Subscription</h2>
                          </div>
                          <div
                            className={
                              styles.portal__right__blocks__subscription__mid
                            }
                          >
                            <div
                              className={
                                styles.portal__right__blocks__subscription__mid__date
                              }
                            >
                              <p>
                                {new Date(
                                  (currentPeriodEnd.getTime() / 1000 - 86400) *
                                    1000
                                ).toLocaleString('default', {
                                  weekday: 'short',
                                })}
                              </p>
                              <span>
                                {new Date(
                                  (currentPeriodEnd.getTime() / 1000 - 86400) *
                                    1000
                                ).getDate()}
                              </span>
                            </div>
                            <div
                              className={
                                styles.portal__right__blocks__subscription__mid__date
                              }
                            >
                              <p>
                                {currentPeriodEnd.toLocaleString('default', {
                                  weekday: 'short',
                                })}
                              </p>
                              <span>{currentPeriodEnd.getDate()}</span>
                            </div>
                            <div
                              className={
                                styles.portal__right__blocks__subscription__mid__date
                              }
                            >
                              <p>
                                {new Date(
                                  (currentPeriodEnd.getTime() / 1000 + 86400) *
                                    1000
                                ).toLocaleString('default', {
                                  weekday: 'short',
                                })}
                              </p>
                              <span>
                                {new Date(
                                  (currentPeriodEnd.getTime() / 1000 + 86400) *
                                    1000
                                ).getDate()}
                              </span>
                            </div>
                          </div>
                          <div
                            className={
                              styles.portal__right__blocks__subscription__bottom
                            }
                          >
                            {cancelled ? (
                              <p>
                                {`Subscription cancelling on 
                          ${currentPeriodEnd.toLocaleString('en-US', {
                            month: 'long',
                          })} ${currentPeriodEnd.getDate()}, ${currentPeriodEnd.getFullYear()} `}
                              </p>
                            ) : (
                              <p>
                                {`Next month due on
                          ${currentPeriodEnd.toLocaleString('en-US', {
                            month: 'long',
                          })} ${currentPeriodEnd.getDate()}, ${currentPeriodEnd.getFullYear()} `}
                              </p>
                            )}
                            <Link href='/company-portal/subscription'>
                              Subscription Info
                            </Link>
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className={
                              styles.portal__right__blocks__subscription__top
                            }
                          >
                            <h2>Subscription</h2>
                          </div>
                          <div
                            className={
                              styles.portal__right__blocks__subscription__mid
                            }
                          >
                            <div
                              className={
                                styles.portal__right__blocks__subscription__mid__notsubbed
                              }
                            >
                              <p>You are not yet subscribed to any plan</p>
                              <Link href='/company-portal/plans'>
                                Find Your Plan
                              </Link>
                            </div>
                          </div>
                          <div
                            className={
                              styles.portal__right__blocks__subscription__bottom
                            }
                          ></div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <Skeleton height={350} borderRadius={15} />
                )
              ) : (
                <>
                  <div className={styles.portal__right__blocks__clients}>
                    <div className={styles.portal__right__blocks__clients__top}>
                      <h2>Companies</h2>
                      <Link href='/company-portal/companies'>More</Link>
                    </div>
                    <div
                      className={styles.portal__right__blocks__clients__mid}
                      style={{
                        background: `radial-gradient(
              closest-side,
              #72a59c 85%,
              transparent 80% 100%
            ),
            conic-gradient(#fff 100%, #bedbd6 0)`,
                      }}
                    >
                      {companiesNumber}
                    </div>
                    <div
                      className={styles.portal__right__blocks__clients__bottom}
                    ></div>
                  </div>
                  <div className={styles.portal__right__blocks__clients}>
                    <div className={styles.portal__right__blocks__clients__top}>
                      <h2>Clients</h2>
                    </div>
                    <div
                      className={styles.portal__right__blocks__clients__mid}
                      style={{
                        background: `radial-gradient(
              closest-side,
              #72a59c 85%,
              transparent 80% 100%
            ),
            conic-gradient(#fff ${
              (clientsSwitched / (clientsSwitched + clientsNotSwitched)) * 100
            }%, #bedbd6 0)`,
                      }}
                    >
                      {allClientsState && allClientsState.length}
                    </div>
                    <div
                      className={styles.portal__right__blocks__clients__bottom}
                    >
                      <div
                        className={
                          styles.portal__right__blocks__clients__bottom__switched
                        }
                      >
                        <div></div>
                        <p>Insurance Switched</p>
                        <span>
                          {Math.round(
                            (clientsSwitched /
                              (clientsSwitched + clientsNotSwitched)) *
                              100
                          ) || 0}
                          %
                        </span>
                      </div>
                      <div
                        className={
                          styles.portal__right__blocks__clients__bottom__notswitched
                        }
                      >
                        <div></div>
                        <p>Insurance Not Yet Switched</p>
                        <span>
                          {Math.round(
                            (clientsNotSwitched /
                              (clientsSwitched + clientsNotSwitched)) *
                              100
                          ) || 0}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className={styles.portal__right__skeleton}>
              <Skeleton height={350} borderRadius={15} />
            </div>
          )}
        </section>
      </main>
    </Layout>
  )
}
