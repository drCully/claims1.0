import { apiSlice } from '../../app/api/apiSlice'

export const checksApiSlice = apiSlice.injectEndpoints({
  tagTypes: 'Check',
  endpoints: (builder) => ({
    checks: builder.query({
      query: (arg) => `/checks?${arg}`,
      providesTags: ['Check'],
    }),
    check: builder.query({
      query: (_id) => `/checks/${_id}`,
      providesTags: ['Check'],
    }),
    deleteCheck: builder.mutation({
      query: (_id) => ({
        url: `/checks/${_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Check'],
    }),
    createCheck: builder.mutation({
      query: (check) => ({
        url: '/checks',
        method: 'POST',
        body: check,
      }),
      invalidatesTags: ['Check'],
    }),
    updateCheck: builder.mutation({
      query: ({ _id, ...rest }) => ({
        url: `/checks/${_id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: ['Check'],
    }),
  }),
})

export const {
  useChecksQuery,
  useCheckQuery,
  useDeleteCheckMutation,
  useCreateCheckMutation,
  useUpdateCheckMutation,
} = checksApiSlice
