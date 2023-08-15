import React, { useState } from 'react'
import styles from '../styles/Companies.module.scss'

function CompanyItem({ company }) {
  const [hiddenDisplay, setHiddenDisplay] = useState('none')

  return (
    <div className={styles.companies__right__list__item} key={company.code}>
      <div className={styles.companies__right__list__item__visible}>
        <div>
          <h2 className={styles.companies__right__list__item__visible__name}>
            {company.name}
          </h2>
          <p className={styles.companies__right__list__item__visible__location}>
            {company.location}
          </p>
          <p className={styles.companies__right__list__item__visible__clients}>
            {company.clients.length} clients
          </p>
        </div>
        <img
          src='/companies/expand.png'
          alt='Expand Arrow'
          onClick={() =>
            setHiddenDisplay(hiddenDisplay == 'none' ? 'flex' : 'none')
          }
          className={styles.companies__right__list__item__visible__expand}
          style={{
            transform:
              hiddenDisplay == 'none' ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </div>
      <div
        className={styles.companies__right__list__item__hidden}
        style={{ display: hiddenDisplay }}
      >
        <div className={styles.companies__right__list__item__hidden__clients}>
          <h3>Clients</h3>
          {company.clients.map((client) => {
            return <p key={client.yourEmail}>{client.yourEmail}</p>
          })}
        </div>
        <div className={styles.companies__right__list__item__hidden__joined}>
          <h3>Date Joined</h3>
          {company.clients.map((client) => {
            const formattedDate = new Date(client.currentDate)
            return (
              <p key={client.currentDate}>{`${formattedDate.toLocaleString(
                'en-US',
                {
                  month: 'long',
                }
              )} ${formattedDate.getDate()}, ${formattedDate.getFullYear()}`}</p>
            )
          })}
        </div>
        <div className={styles.companies__right__list__item__hidden__date}>
          <h3>Insurance Change Date</h3>
          {company.clients.map((client) => {
            const formattedDate = new Date(client.date)
            return (
              <p key={client.date}>{`${formattedDate.toLocaleString('en-US', {
                month: 'long',
              })} ${formattedDate.getDate()}, ${formattedDate.getFullYear()}`}</p>
            )
          })}
        </div>
        <div className={styles.companies__right__list__item__hidden__changed}>
          <h3>
            Insurance Changed?
            <span>
              <img src='/clients/info.png' />
              <p>
                Insurance Changed is based on the change date, not whether the
                client has actually had their insurance switched
              </p>
            </span>
          </h3>
          {company.clients.map((client) => {
            const unixTime = new Date(client.date).getTime()
            const today = new Date().getTime()
            return <p key={client.date}>{unixTime < today ? 'Yes' : 'No'}</p>
          })}
        </div>
      </div>
    </div>
  )
}

export default CompanyItem
