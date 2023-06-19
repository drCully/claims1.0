import { apiSlice } from '../../app/api/apiSlice'

export const claimsApiSlice = apiSlice.injectEndpoints({
  tagTypes: 'Claim',
  endpoints: (builder) => ({
    claimLookup: builder.query({
      query: () => `/claims/lookup`,
      providesTags: ['Claim'],
    }),
    claims: builder.query({
      query: (arg) => `/claims?${arg}`,
      providesTags: ['Claim'],
    }),
    claim: builder.query({
      query: (_id) => `/claims/${_id}`,
      providesTags: ['Claim'],
    }),
    deleteClaim: builder.mutation({
      query: (_id) => ({
        url: `/claims/${_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Claim'],
    }),
    createClaim: builder.mutation({
      query: (claim) => ({
        url: '/claims',
        method: 'POST',
        body: claim,
      }),
      invalidatesTags: ['Claim'],
    }),
    updateClaim: builder.mutation({
      query: ({ _id, ...rest }) => ({
        url: `/claims/${_id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: ['Claim'],
    }),
  }),
})

export const {
  useClaimLookupQuery,
  useClaimsQuery,
  useClaimQuery,
  useDeleteClaimMutation,
  useCreateClaimMutation,
  useUpdateClaimMutation,
} = claimsApiSlice
