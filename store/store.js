import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { authSlice } from './authSlice'
import { createWrapper } from 'next-redux-wrapper'
import { persistReducer, persistStore } from 'redux-persist'
import storage from './createNoopStorage'
import thunk from 'redux-thunk'

const rootReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
})

const makeConfiguredStore = () =>
  configureStore({
    reducer: rootReducer,
    devTools: true,
  })

export const makeStore = () => {
  const isServer = typeof window === 'undefined'
  if (isServer) {
    return makeConfiguredStore()
  } else {
    // we need it only on client side
    const persistConfig = {
      key: 'nextjs',
      whitelist: ['auth'],
      storage,
    }
    const persistedReducer = persistReducer(persistConfig, rootReducer)
    let store = configureStore({
      reducer: persistedReducer,
      devTools: process.env.NODE_ENV !== 'production',
      middleware: [thunk],
    })
    store.__persistor = persistStore(store) // Nasty hack
    return store
  }
}

// Previous codes

export const wrapper = createWrapper(makeStore)
