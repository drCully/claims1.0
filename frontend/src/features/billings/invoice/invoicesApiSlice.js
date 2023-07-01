import { apiSlice } from '../../../app/api/apiSlice'

export const invoicesApiSlice = apiSlice.injectEndpoints({
  tagTypes: 'Invoice',
  endpoints: (builder) => ({
    invoices: builder.query({
      query: (arg) => `/invoices?${arg}`,
      providesTags: ['Invoice'],
    }),
    invoice: builder.query({
      query: (_id) => `/invoices/${_id}`,
      providesTags: ['Invoice'],
    }),
    invoiceClient: builder.query({
      async queryFn(_id, _queryApi, _extraOptions, fetchWithBQ) {
        const claimResult = await fetchWithBQ(`/claims/${_id}`)
        if (claimResult.error) return { error: claimResult.error }
        const clientId = claimResult.data.client._id
        const clientResult = await fetchWithBQ(`/clients/${clientId}`)
        return clientResult.data
          ? { data: clientResult.data }
          : { error: clientResult.error }
      },
    }),
    deleteInvoice: builder.mutation({
      query: (_id) => ({
        url: `/invoices/${_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Invoice'],
    }),
    createInvoice: builder.mutation({
      query: (invoice) => ({
        url: '/invoices',
        method: 'POST',
        body: invoice,
      }),
      invalidatesTags: ['Invoice'],
    }),
    updateInvoice: builder.mutation({
      query: ({ _id, ...rest }) => ({
        url: `/invoices/${_id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: ['Invoice'],
    }),
  }),
})

export const {
  useInvoicesQuery,
  useInvoiceQuery,
  useInvoiceClientQuery,
  useDeleteInvoiceMutation,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
} = invoicesApiSlice
