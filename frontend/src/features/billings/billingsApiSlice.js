import { apiSlice } from '../../../app/api/apiSlice'

export const billingsApiSlice = apiSlice.injectEndpoints({
  tagTypes: 'Billing',
  endpoints: (builder) => ({
    billings: builder.query({
      query: (arg) => `/billings?${arg}`,
      providesTags: ['Billing'],
    }),
  }),
})

export const { useBillingsQuery } = billingsApiSlice
