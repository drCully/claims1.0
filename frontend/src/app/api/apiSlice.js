import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, signout } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
  baseUrl: '/',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.originalStatus === 403) {
    // send refresh token to get new access token
    const refreshResult = await baseQuery('/refresh', api, extraOptions)

    if (refreshResult?.data) {
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data }))

      // retry the original query with new access token
      result = await baseQuery(args, api, extraOptions)
    } else {
      // refresh token has expired - force signout
      //console.log(refreshResult.error.data)
      api.dispatch(signout())
    }
  }

  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
})
