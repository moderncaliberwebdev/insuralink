import React from 'react'
import styles from '../styles/Switch.module.scss'

export default function SwitchRadio({ label, radioChange, currentIns }) {
  return (
    <div
      className={styles.switch__main__answer__radios__item}
      onClick={() => radioChange(label)}
      style={{ border: currentIns == label && '2px solid #000' }}
    >
      <label>{label}</label>
    </div>
  )
}
