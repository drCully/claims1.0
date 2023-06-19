import { apiSlice } from '../../app/api/apiSlice'

export const chargesApiSlice = apiSlice.injectEndpoints({
  tagTypes: 'Charge',
  endpoints: (builder) => ({
    charges: builder.query({
      query: (arg) => `/charges?${arg}`,
      providesTags: ['Charge'],
    }),
    charge: builder.query({
      query: (_id) => `/charges/${_id}`,
      providesTags: ['Charge'],
    }),
    deleteCharge: builder.mutation({
      query: (_id) => ({
        url: `/charges/${_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Charge'],
    }),
    createCharge: builder.mutation({
      query: (charge) => ({
        url: '/charges',
        method: 'POST',
        body: charge,
      }),
      invalidatesTags: ['Charge'],
    }),
    updateCharge: builder.mutation({
      query: ({ _id, ...rest }) => ({
        url: `/charges/${_id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: ['Charge'],
    }),
  }),
})

export const {
  useChargesQuery,
  useChargeQuery,
  useDeleteChargeMutation,
  useCreateChargeMutation,
  useUpdateChargeMutation,
} = chargesApiSlice
