import React, { useEffect, useState } from 'react'
import styles from '../../styles/Companies.module.scss'
import Layout from '../../Components/Layout'
import PortalSidebar from '../../Components/PortalSidebar'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../../firebase/clientApp'
import { useRouter } from 'next/router'
import axios from 'axios'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const auth = getAuth()

export default function Companies() {
  const router = useRouter()

  const [userFromDB, setUserFromDB] = useState()
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const [allCompanies, setAllCompanies] = useState()

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

        //get all companies data

        const companiesData = await axios.get(
          `/api/client/all-companies?admin=true`,
          config
        )
        setAllCompanies(companiesData.data.companies)

        console.log(companiesData.data.companies)

        if (clientData.data.user.admin) {
        } else window.location.href = '/'
      } else {
        window.location.href = '/'
      }
    })
  }, [auth, router.isReady])
  return (
    <Layout>
      <main className={styles.companies}>
        <PortalSidebar clientInfo={userFromDB} />
        <section className={styles.companies__right}>
          <h1>Companies</h1>

          <div className={styles.companies__right__list}>
            {allCompanies ? (
              allCompanies.map((company) => {
                return (
                  <div
                    className={styles.companies__right__list__item}
                    key={company.code}
                  >
                    <div
                      className={styles.companies__right__list__item__visible}
                    >
                      <h2
                        className={
                          styles.companies__right__list__item__visible__name
                        }
                      >
                        {company.name}
                      </h2>
                      <p
                        className={
                          styles.companies__right__list__item__visible__location
                        }
                      >
                        {company.location}
                      </p>
                      <p
                        className={
                          styles.companies__right__list__item__visible__clients
                        }
                      >
                        {company.clients.length} clients
                      </p>
                      <img
                        src='/companies/expand.png'
                        alt='Expand Arrow'
                        className={
                          styles.companies__right__list__item__visible__expand
                        }
                      />
                    </div>
                    <div
                      className={styles.companies__right__list__item__hidden}
                    ></div>
                  </div>
                )
              })
            ) : (
              <>
                <Skeleton height={40} borderRadius={10} />
                <Skeleton height={40} borderRadius={10} />
                <Skeleton height={40} borderRadius={10} />
                <Skeleton height={40} borderRadius={10} />
                <Skeleton height={40} borderRadius={10} />
                <Skeleton height={40} borderRadius={10} />
                <Skeleton height={40} borderRadius={10} />
              </>
            )}
          </div>
        </section>
      </main>
    </Layout>
  )
}
