import '../styles/globals.scss'
import { wrapper } from '../store/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'

function MyApp({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest)
  const { pageProps } = props

  return (
    <Provider store={store}>
      <PersistGate persistor={store.__persistor} loading={null}>
        <>
          <Component {...pageProps} />
        </>
      </PersistGate>
    </Provider>
  )
}
export default MyApp
