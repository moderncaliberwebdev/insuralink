import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

// Initial state
const initialState = {
  insuralinkState: {
    code: '',
    currentIns: [],
    currentNumber: '',
    date: '',
    idCard: '',
    eSig: '',
    newAgentName: '',
    newAgentCompany: '',
    newAgentEmail: '',
    newNumber: '',
  },
}

// Actual Slice
export const insuralinkSlice = createSlice({
  name: 'insuralink',
  initialState,
  reducers: {
    // Action to set the insuralink status
    setInsuralinkState(state, action) {
      state.insuralinkState = action.payload
    },
    updateInsuralink(state, action) {
      return {
        ...state,
        insuralinkState: {
          ...state.insuralinkState,
          ...action.payload,
        },
      }
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        ...action.payload.insuralink,
      }
    })
  },
})

export const { setInsuralinkState, updateInsuralink } = insuralinkSlice.actions

export const selectInsuralinkState = (state) => state.insuralink.insuralinkState

export default insuralinkSlice.reducer
