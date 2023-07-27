import React, { useEffect, useState } from 'react'
import styles from '../../styles/Client.module.scss'
import Layout from '../../Components/Layout'
import PortalSidebar from '../../Components/PortalSidebar'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../../firebase/clientApp'
import { useRouter } from 'next/router'
import axios from 'axios'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const auth = getAuth()

export default function Clients() {
  const router = useRouter()

  const [userFromDB, setUserFromDB] = useState()
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        const config = {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }

        const clientData = await axios.get(
          `/api/client?email=${user.email}`,
          config
        )

        clientData && setLoading(false)

        setUserFromDB(clientData.data.user)

        if (clientData.data.user.subscribed) {
        } else window.location.href = '/company-portal/plans'
      } else {
        window.location.href = '/'
      }
    })
  }, [auth, router.isReady])
  return (
    <Layout>
      <main className={styles.client}>
        <PortalSidebar clientInfo={userFromDB} />
        <section className={styles.client__right}>
          <h1>Clients</h1>
          <div className={styles.client__right__clients}>
            <div className={styles.client__right__clients__clients}>
              <h3>Clients</h3>
              {userFromDB ? (
                userFromDB.clients.map((client) => {
                  return <p key={client.yourEmail}>{client.yourEmail}</p>
                })
              ) : (
                <>
                  <Skeleton height={30} borderRadius={15} />
                  <Skeleton height={30} borderRadius={15} />
                  <Skeleton height={30} borderRadius={15} />
                  <Skeleton height={30} borderRadius={15} />
                  <Skeleton height={30} borderRadius={15} />
                </>
              )}
            </div>
            <div className={styles.client__right__clients__joined}>
              <h3>Date Joined</h3>
              {userFromDB ? (
                userFromDB.clients.map((client) => {
                  const formattedDate = new Date(client.currentDate)
                  return (
                    <p
                      key={client.currentDate}
                    >{`${formattedDate.toLocaleString('en-US', {
                      month: 'long',
                    })} ${formattedDate.getDate()}, ${formattedDate.getFullYear()}`}</p>
                  )
                })
              ) : (
                <>
                  <Skeleton height={30} borderRadius={15} />
                  <Skeleton height={30} borderRadius={15} />
                  <Skeleton height={30} borderRadius={15} />
                  <Skeleton height={30} borderRadius={15} />
                  <Skeleton height={30} borderRadius={15} />
                </>
              )}
            </div>
            <div className={styles.client__right__clients__date}>
              <h3>Insurance Change Date</h3>
              {userFromDB ? (
                userFromDB.clients.map((client) => {
                  const formattedDate = new Date(client.date)
                  return (
                    <p key={client.date}>{`${formattedDate.toLocaleString(
                      'en-US',
                      {
                        month: 'long',
                      }
                    )} ${formattedDate.getDate()}, ${formattedDate.getFullYear()}`}</p>
                  )
                })
              ) : (
                <>
                  <Skeleton height={30} borderRadius={15} />
                  <Skeleton height={30} borderRadius={15} />
                  <Skeleton height={30} borderRadius={15} />
                  <Skeleton height={30} borderRadius={15} />
                  <Skeleton height={30} borderRadius={15} />
                </>
              )}
            </div>
            <div className={styles.client__right__clients__changed}>
              <h3>
                Insurance Changed?
                <span>
                  <img src='/clients/info.png' />
                  <p>
                    Insurance Changed is based on the change date, not whether
                    the client has actually had their insurance switched
                  </p>
                </span>
              </h3>
              {userFromDB ? (
                userFromDB.clients.map((client) => {
                  const unixTime = new Date(client.date).getTime()
                  const today = new Date().getTime()
                  return (
                    <p key={client.date}>{unixTime < today ? 'Yes' : 'No'}</p>
                  )
                })
              ) : (
                <>
                  <Skeleton height={30} borderRadius={15} />
                  <Skeleton height={30} borderRadius={15} />
                  <Skeleton height={30} borderRadius={15} />
                  <Skeleton height={30} borderRadius={15} />
                  <Skeleton height={30} borderRadius={15} />
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}
