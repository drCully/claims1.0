import { createSlice } from '@reduxjs/toolkit'
import { format } from 'date-fns'

const initialState = {
  asOfDate: format(new Date(), 'yyyy-MM-dd'),
  claimId: undefined,
  timeItems: [],
  selectedTime: [],
  timeAmount: 0,
  chargeItems: [],
  selectedCharges: [],
  chargeAmount: 0,
}

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setAsOfDate: (state, action) => {
      state.asOfDate = action.payload
    },
    setClaimId: (state, action) => {
      state.claimId = action.payload
    },
    setTimeItems: (state, action) => {
      state.timeItems = action.payload
    },
    setSelectedTime: (state, action) => {
      state.selectedTime = action.payload
    },
    setTimeAmount: (state, action) => {
      state.timeAmount = action.payload
    },
    setChargeItems: (state, action) => {
      state.chargeItems = action.payload
    },
    setSelectedCharges: (state, action) => {
      state.selectedCharges = action.payload
    },
    setChargeAmount: (state, action) => {
      state.chargeAmount = action.payload
    },
    clearBilling: (state, action) => {
      //state.asOfDate = format(new Date(), 'yyyy-MM-dd')
      state.claimId = undefined
      state.timeItems = []
      state.selectedTime = []
      state.timeAmount = 0
      state.chargeItems = []
      state.selectedCharges = []
      state.chargeAmount = 0
    },
  },
})

export const {
  setAsOfDate,
  setClaimId,
  setTimeItems,
  setSelectedTime,
  setTimeAmount,
  setChargeItems,
  setSelectedCharges,
  setChargeAmount,
  clearBilling,
} = billingSlice.actions
export default billingSlice.reducer
