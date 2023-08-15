import React from 'react'
import styles from '../styles/CompanyPortal.module.scss'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMediaQuery } from 'react-responsive'

export default function PortalSidebar({ clientInfo }) {
  const router = useRouter()

  const isBigScreen = useMediaQuery({ query: '(min-width: 900px)' })

  return (
    <section className={styles.portal__sidebar}>
      {clientInfo ? (
        <>
          <h2>{clientInfo.name}</h2>
          <Link
            href='/company-portal/edit'
            style={{
              color: router.pathname == '/company-portal/edit' && '#fff',
              backgroundColor:
                router.pathname == '/company-portal/edit' && '#72a59c',
            }}
          >
            Edit
          </Link>

          <div className={styles.portal__sidebar__tabs}>
            <ul>
              <Link href={'/company-portal'}>
                <li
                  className={
                    router.pathname == '/company-portal'
                      ? `${styles.highlight}`
                      : ''
                  }
                >
                  <img src='/portal/dashboard.png' alt='Dashboard' />
                  <span>Dashboard</span>
                </li>
              </Link>
              {clientInfo.admin ? (
                <Link href={'/company-portal/companies'}>
                  <li
                    className={
                      router.pathname == '/company-portal/companies'
                        ? `${styles.highlight}`
                        : ''
                    }
                  >
                    <img src='/portal/clients.png' alt='companies' />
                    <span>Companies</span>
                  </li>
                </Link>
              ) : (
                <>
                  <Link href={'/company-portal/clients'}>
                    <li
                      className={
                        router.pathname == '/company-portal/clients'
                          ? `${styles.highlight}`
                          : ''
                      }
                    >
                      <img src='/portal/clients.png' alt='clients' />
                      <span>Clients</span>
                    </li>
                  </Link>
                  <Link
                    href={
                      clientInfo.subscribed == true
                        ? '/company-portal/subscription'
                        : '/company-portal/plans'
                    }
                  >
                    <li
                      className={
                        router.pathname == '/company-portal/subscription' ||
                        router.pathname == '/company-portal/plans'
                          ? `${styles.highlight}`
                          : ''
                      }
                    >
                      <img src='/portal/subscription.png' alt='Subscription' />
                      <span>Subscription</span>
                    </li>
                  </Link>
                </>
              )}
            </ul>
          </div>
        </>
      ) : (
        <div className={styles.portal__sidebar__skeleton}>
          <Skeleton height={70} borderRadius={15} />
          <Skeleton
            height={30}
            borderRadius={15}
            style={{ marginBottom: '5rem' }}
          />
          {isBigScreen && (
            <>
              <Skeleton height={70} borderRadius={15} />
              <Skeleton height={70} borderRadius={15} />
              <Skeleton height={70} borderRadius={15} />
            </>
          )}
        </div>
      )}
    </section>
  )
}
