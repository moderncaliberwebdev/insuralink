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
import CompanyItem from '../../Components/CompanyItem'

const auth = getAuth()

const seedInfo = [
  {
    _id: {
      $oid: '647a0be8abc22d475dc3b10d',
    },
    name: 'Caleb Martin Insurance',
    location: 'Reinholds, PA',
    email: 'caleb637@icloud.com',
    clients: [
      {
        currentIns: ['Berkshire Hathaway', 'radio'],
        currentNumber: '45213424234',
        currentInsEmail: 'cmartin@moderncaliber.com',
        yourEmail: 'caleb637@icloud.com',
        date: '2023-08-16T04:00:00.000Z',
        idCard: '81U+Kh+-bwL-45142._SL1500_',
        eSig: 'data:image',
        newAgentName: 'Caleb Martin',
        newAgentCompany: 'Allstate',
        newAgentEmail: 'calebm@allstate.com',
        newNumber: '092837423',
        currentDate: Number('1689255603517'),
      },
      {
        currentIns: ['Berkshire Hathaway', 'radio'],
        currentNumber: '45213424234',
        currentInsEmail: 'cmartin@moderncaliber.com',
        yourEmail: 'caleb637@icloud.com',
        date: '2023-08-16T04:00:00.000Z',
        idCard: '81U+Kh+-bwL-45142._SL1500_',
        eSig: 'data:image',
        newAgentName: 'Caleb Martin',
        newAgentCompany: 'Allstate',
        newAgentEmail: 'calebm@allstate.com',
        newNumber: '092837423',
        currentDate: Number('1689255603517'),
      },
    ],
    admin: false,
    subscribed: true,
    code: 'OVN1GvDZi1OV7blEXyrDuZ57Oo1aqOHp',
    subscriptionID: 'sub_1NPntBBAb1nKRDOxIvvJznlF',
    sentCode: true,
    customerID: 'cus_OCCHY7IEyfTXCm',
    productID: 'prod_OAO6zMJQpNfWiS',
    paymentMethod: 'pm_1NPntBBAb1nKRDOxgtFvN3Ts',
    priceID: 'price_1NO3KQBAb1nKRDOx2SaZQzNs',
  },
  {
    _id: {
      $oid: '647a0be8abc22d475dc3b10d',
    },
    name: 'Caleb Martin Insurance',
    location: 'Reinholds, PA',
    email: 'caleb637@icloud.com',
    clients: [
      {
        currentIns: ['Berkshire Hathaway', 'radio'],
        currentNumber: '45213424234',
        currentInsEmail: 'cmartin@moderncaliber.com',
        yourEmail: 'caleb637@icloud.com',
        date: '2023-08-16T04:00:00.000Z',
        idCard: '81U+Kh+-bwL-45142._SL1500_',
        eSig: 'data:image',
        newAgentName: 'Caleb Martin',
        newAgentCompany: 'Allstate',
        newAgentEmail: 'calebm@allstate.com',
        newNumber: '092837423',
        currentDate: Number('1689255603517'),
      },
      {
        currentIns: ['Berkshire Hathaway', 'radio'],
        currentNumber: '45213424234',
        currentInsEmail: 'cmartin@moderncaliber.com',
        yourEmail: 'caleb637@icloud.com',
        date: '2023-08-16T04:00:00.000Z',
        idCard: '81U+Kh+-bwL-45142._SL1500_',
        eSig: 'data:image',
        newAgentName: 'Caleb Martin',
        newAgentCompany: 'Allstate',
        newAgentEmail: 'calebm@allstate.com',
        newNumber: '092837423',
        currentDate: Number('1689255603517'),
      },
    ],
    admin: false,
    subscribed: true,
    code: 'OVN1GvDZi1OV7blEXyrDuZ57Oo1aqOHp',
    subscriptionID: 'sub_1NPntBBAb1nKRDOxIvvJznlF',
    sentCode: true,
    customerID: 'cus_OCCHY7IEyfTXCm',
    productID: 'prod_OAO6zMJQpNfWiS',
    paymentMethod: 'pm_1NPntBBAb1nKRDOxgtFvN3Ts',
    priceID: 'price_1NO3KQBAb1nKRDOx2SaZQzNs',
  },
  {
    _id: {
      $oid: '647a0be8abc22d475dc3b10d',
    },
    name: 'Caleb Martin Insurance',
    location: 'Reinholds, PA',
    email: 'caleb637@icloud.com',
    clients: [
      {
        currentIns: ['Berkshire Hathaway', 'radio'],
        currentNumber: '45213424234',
        currentInsEmail: 'cmartin@moderncaliber.com',
        yourEmail: 'caleb637@icloud.com',
        date: '2023-08-16T04:00:00.000Z',
        idCard: '81U+Kh+-bwL-45142._SL1500_',
        eSig: 'data:image',
        newAgentName: 'Caleb Martin',
        newAgentCompany: 'Allstate',
        newAgentEmail: 'calebm@allstate.com',
        newNumber: '092837423',
        currentDate: Number('1689255603517'),
      },
      {
        currentIns: ['Berkshire Hathaway', 'radio'],
        currentNumber: '45213424234',
        currentInsEmail: 'cmartin@moderncaliber.com',
        yourEmail: 'caleb637@icloud.com',
        date: '2023-08-16T04:00:00.000Z',
        idCard: '81U+Kh+-bwL-45142._SL1500_',
        eSig: 'data:image',
        newAgentName: 'Caleb Martin',
        newAgentCompany: 'Allstate',
        newAgentEmail: 'calebm@allstate.com',
        newNumber: '092837423',
        currentDate: Number('1689255603517'),
      },
    ],
    admin: false,
    subscribed: true,
    code: 'OVN1GvDZi1OV7blEXyrDuZ57Oo1aqOHp',
    subscriptionID: 'sub_1NPntBBAb1nKRDOxIvvJznlF',
    sentCode: true,
    customerID: 'cus_OCCHY7IEyfTXCm',
    productID: 'prod_OAO6zMJQpNfWiS',
    paymentMethod: 'pm_1NPntBBAb1nKRDOxgtFvN3Ts',
    priceID: 'price_1NO3KQBAb1nKRDOx2SaZQzNs',
  },
  {
    _id: {
      $oid: '647a0be8abc22d475dc3b10d',
    },
    name: 'Caleb Martin Insurance',
    location: 'Reinholds, PA',
    email: 'caleb637@icloud.com',
    clients: [
      {
        currentIns: ['Berkshire Hathaway', 'radio'],
        currentNumber: '45213424234',
        currentInsEmail: 'cmartin@moderncaliber.com',
        yourEmail: 'caleb637@icloud.com',
        date: '2023-08-16T04:00:00.000Z',
        idCard: '81U+Kh+-bwL-45142._SL1500_',
        eSig: 'data:image',
        newAgentName: 'Caleb Martin',
        newAgentCompany: 'Allstate',
        newAgentEmail: 'calebm@allstate.com',
        newNumber: '092837423',
        currentDate: Number('1689255603517'),
      },
      {
        currentIns: ['Berkshire Hathaway', 'radio'],
        currentNumber: '45213424234',
        currentInsEmail: 'cmartin@moderncaliber.com',
        yourEmail: 'caleb637@icloud.com',
        date: '2023-08-16T04:00:00.000Z',
        idCard: '81U+Kh+-bwL-45142._SL1500_',
        eSig: 'data:image',
        newAgentName: 'Caleb Martin',
        newAgentCompany: 'Allstate',
        newAgentEmail: 'calebm@allstate.com',
        newNumber: '092837423',
        currentDate: Number('1689255603517'),
      },
    ],
    admin: false,
    subscribed: true,
    code: 'OVN1GvDZi1OV7blEXyrDuZ57Oo1aqOHp',
    subscriptionID: 'sub_1NPntBBAb1nKRDOxIvvJznlF',
    sentCode: true,
    customerID: 'cus_OCCHY7IEyfTXCm',
    productID: 'prod_OAO6zMJQpNfWiS',
    paymentMethod: 'pm_1NPntBBAb1nKRDOxgtFvN3Ts',
    priceID: 'price_1NO3KQBAb1nKRDOx2SaZQzNs',
  },
  {
    _id: {
      $oid: '647a0be8abc22d475dc3b10d',
    },
    name: 'Caleb Martin Insurance',
    location: 'Reinholds, PA',
    email: 'caleb637@icloud.com',
    clients: [
      {
        currentIns: ['Berkshire Hathaway', 'radio'],
        currentNumber: '45213424234',
        currentInsEmail: 'cmartin@moderncaliber.com',
        yourEmail: 'caleb637@icloud.com',
        date: '2023-08-16T04:00:00.000Z',
        idCard: '81U+Kh+-bwL-45142._SL1500_',
        eSig: 'data:image',
        newAgentName: 'Caleb Martin',
        newAgentCompany: 'Allstate',
        newAgentEmail: 'calebm@allstate.com',
        newNumber: '092837423',
        currentDate: Number('1689255603517'),
      },
      {
        currentIns: ['Berkshire Hathaway', 'radio'],
        currentNumber: '45213424234',
        currentInsEmail: 'cmartin@moderncaliber.com',
        yourEmail: 'caleb637@icloud.com',
        date: '2023-08-16T04:00:00.000Z',
        idCard: '81U+Kh+-bwL-45142._SL1500_',
        eSig: 'data:image',
        newAgentName: 'Caleb Martin',
        newAgentCompany: 'Allstate',
        newAgentEmail: 'calebm@allstate.com',
        newNumber: '092837423',
        currentDate: Number('1689255603517'),
      },
    ],
    admin: false,
    subscribed: true,
    code: 'OVN1GvDZi1OV7blEXyrDuZ57Oo1aqOHp',
    subscriptionID: 'sub_1NPntBBAb1nKRDOxIvvJznlF',
    sentCode: true,
    customerID: 'cus_OCCHY7IEyfTXCm',
    productID: 'prod_OAO6zMJQpNfWiS',
    paymentMethod: 'pm_1NPntBBAb1nKRDOxgtFvN3Ts',
    priceID: 'price_1NO3KQBAb1nKRDOx2SaZQzNs',
  },
  {
    _id: {
      $oid: '647a0be8abc22d475dc3b10d',
    },
    name: 'Caleb Martin Insurance',
    location: 'Reinholds, PA',
    email: 'caleb637@icloud.com',
    clients: [
      {
        currentIns: ['Berkshire Hathaway', 'radio'],
        currentNumber: '45213424234',
        currentInsEmail: 'cmartin@moderncaliber.com',
        yourEmail: 'caleb637@icloud.com',
        date: '2023-08-16T04:00:00.000Z',
        idCard: '81U+Kh+-bwL-45142._SL1500_',
        eSig: 'data:image',
        newAgentName: 'Caleb Martin',
        newAgentCompany: 'Allstate',
        newAgentEmail: 'calebm@allstate.com',
        newNumber: '092837423',
        currentDate: Number('1689255603517'),
      },
      {
        currentIns: ['Berkshire Hathaway', 'radio'],
        currentNumber: '45213424234',
        currentInsEmail: 'cmartin@moderncaliber.com',
        yourEmail: 'caleb637@icloud.com',
        date: '2023-08-16T04:00:00.000Z',
        idCard: '81U+Kh+-bwL-45142._SL1500_',
        eSig: 'data:image',
        newAgentName: 'Caleb Martin',
        newAgentCompany: 'Allstate',
        newAgentEmail: 'calebm@allstate.com',
        newNumber: '092837423',
        currentDate: Number('1689255603517'),
      },
    ],
    admin: false,
    subscribed: true,
    code: 'OVN1GvDZi1OV7blEXyrDuZ57Oo1aqOHp',
    subscriptionID: 'sub_1NPntBBAb1nKRDOxIvvJznlF',
    sentCode: true,
    customerID: 'cus_OCCHY7IEyfTXCm',
    productID: 'prod_OAO6zMJQpNfWiS',
    paymentMethod: 'pm_1NPntBBAb1nKRDOxgtFvN3Ts',
    priceID: 'price_1NO3KQBAb1nKRDOx2SaZQzNs',
  },
]

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
        // setAllCompanies(seedInfo)

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
                return <CompanyItem company={company} key={company.name} />
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
