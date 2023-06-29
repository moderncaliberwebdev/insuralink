import React, { useState } from 'react'
import styles from '../styles/Popup.module.scss'

function Popup({
  question,
  desc,
  answer,
  no,
  cancel,
  next,
  openPopup,
  renew,
  color,
  input,
}) {
  const [inputText, setInputText] = useState('')

  return (
    <div
      className={styles.popup}
      style={{ display: openPopup ? 'block' : 'none' }}
    >
      <div className={styles.popup__message}>
        <h2>{question}</h2>
        <p>{desc}</p>
        {input && (
          <input
            type='text'
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        )}
        <div
          className={styles.popup__message__buttons}
          style={{ flexDirection: renew ? 'row-reverse' : 'row' }}
        >
          {renew ? (
            <>
              {answer && (
                <button
                  onClick={() => (!input ? next() : next(inputText))}
                  style={{
                    backgroundColor: color == 'red' ? '#c9a596' : '#72a59c',
                  }}
                >
                  {answer}
                </button>
              )}
              <button onClick={cancel}>{no}</button>
            </>
          ) : (
            <>
              <button
                onClick={cancel}
                style={{
                  backgroundColor: color == 'red' ? '#c9a596' : '#72a59c',
                }}
              >
                {no}
              </button>
              <button onClick={next}>{answer}</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Popup
