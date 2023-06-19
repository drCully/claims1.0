import { createSlice } from '@reduxjs/toolkit'
import { format } from 'date-fns'

const initialState = {
  asOfDate: format(new Date(), 'yyyy-MM-dd'),
  claimId: null,
  clientId: null,
  timeItems: [],
  selectedTime: null,
  timeAmount: 0,
  hours: 0,
  expenseAmount: 0,
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
    setClientId: (state, action) => {
      state.clientId = action.payload
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
    setHours: (state, action) => {
      state.hours = action.payload
    },
    setExpenseItems: (state, action) => {
      state.expenseItems = action.payload
    },
    setSelectedExpenses: (state, action) => {
      state.selectedExpenses = action.payload
    },
    SetExpenseAmount: (state, action) => {
      state.expenseAmount = action.payload
    },
    clearBilling: (state, action) => {
      state.asOfDate = format(new Date(), 'yyyy-MM-dd')
      state.claimId = null
      state.clientId = null
      state.timeItems = []
      state.selectedTime = null
      state.timeAmount = 0
      state.hours = 0
      state.expenseItems = []
      state.selectedExpenses = null
      state.expenseAmount = 0
    },
  },
})

export const {
  setAsOfDate,
  setClaimId,
  setClientId,
  setTimeItems,
  setSelectedTime,
  setTimeAmount,
  setHours,
  setExpenseItems,
  setSelectedExpenses,
  setExpenseAmount,
  clearBilling,
} = billingSlice.actions
export default billingSlice.reducer
