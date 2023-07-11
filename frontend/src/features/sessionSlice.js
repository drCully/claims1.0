import { createSlice } from '@reduxjs/toolkit'
import { subDays, addDays, format, parseISO } from 'date-fns'

const initialState = {
  lastDate: format(new Date(), 'yyyy-MM-dd'),
  lastUser: undefined,
  lastClient: undefined,
  lastClaim: undefined,
}

const sessionSlice = createSlice({
  name: 'sesson',
  initialState,
  reducers: {
    setLastDate: (state, action) => {
      state.lastDate = action.payload
    },
    previousDate: (state) => {
      state.lastDate = format(
        subDays(parseISO(state.lastDate), 1),
        'yyyy-MM-dd'
      )
    },
    nextDate: (state) => {
      state.lastDate = format(
        addDays(parseISO(state.lastDate), 1),
        'yyyy-MM-dd'
      )
    },
    setLastUser: (state, action) => {
      state.lastUser = action.payload
    },
    setLastClient: (state, action) => {
      state.lastClient = action.payload
    },
    setLastClaim: (state, action) => {
      state.lastClaim = action.payload
    },
  },
})

export const {
  setLastDate,
  previousDate,
  nextDate,
  setLastUser,
  setLastClient,
  setLastClaim,
} = sessionSlice.actions
export default sessionSlice.reducer
