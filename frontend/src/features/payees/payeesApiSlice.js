import { apiSlice } from '../../app/api/apiSlice'

export const payeesApiSlice = apiSlice.injectEndpoints({
  tagTypes: 'Payees',
  endpoints: (builder) => ({
    payeeLookup: builder.query({
      query: () => `/payees/lookup`,
      providesTags: ['Payee'],
    }),
    payees: builder.query({
      query: (arg) => `/payees?${arg}`,
      providesTags: ['Payee'],
    }),
    payee: builder.query({
      query: (_id) => `/payees/${_id}`,
      providesTags: ['Payee'],
    }),
    deletePayee: builder.mutation({
      query: (_id) => ({
        url: `/payees/${_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Payee'],
    }),
    createPayee: builder.mutation({
      query: (payee) => ({
        url: '/payees',
        method: 'POST',
        body: payee,
      }),
      invalidatesTags: ['Payee'],
    }),
    updatePayee: builder.mutation({
      query: ({ _id, ...rest }) => ({
        url: `/payees/${_id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: ['Payee'],
    }),
  }),
})

export const {
  usePayeeLookupQuery,
  usePayeesQuery,
  usePayeeQuery,
  useDeletePayeeMutation,
  useCreatePayeeMutation,
  useUpdatePayeeMutation,
} = payeesApiSlice
