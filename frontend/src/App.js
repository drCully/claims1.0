import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles } from './styles/globalStyles'
import { darkTheme, lightTheme } from './styles/theme'
import { Helmet } from 'react-helmet'
import { SPageContainer } from './styles/containerStyles'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header/Header'
import Layout from './components/Layout'
import Signin from './features/auth/Signin'
import RequireAuth from './features/auth/RequireAuth'
import { ROLES } from './config/roles'

import Billings from './features/billings/Billing'
import Charge from './features/charges/Charge'
import Charges from './features/charges/ChargesList'
import Claim from './features/claims/Claim'
import ClaimAdmin from './features/claims/admin/ClaimAdmin'
import Claims from './features/claims/ClaimsList'
import Client from './features/clients/Client'
import Clients from './features/clients/ClientsList'
import Invoice from './features/billings/invoice/Invoice'
import InvoiceAdd from './features/billings/invoice/InvoiceAdd'
import Payee from './features/payees/Payee'
import Payees from './features/payees/PayeesList'
import Profile from './features/profile/Profile'
import ProfileHours from './features/profile/ProfileHours'
import ProfileCharges from './features/profile/ProfileCharges'
import Timeslip from './features/timeslips/Timeslip'
import Timeslips from './features/timeslips/TimeslipsList'
import Users from './features/users/UsersList'
import UserAddEdit from './features/users/User'

function App() {
  const { theme } = useSelector((state) => state.ui)
  const currentTheme = theme === 'light' ? lightTheme : darkTheme

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyles />
      <Helmet>
        <title>ClaimsManager</title>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin />
        <link
          href='https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap'
          rel='stylesheet'
        />
      </Helmet>
      <>
        <Header />
        <SPageContainer>
          <Routes>
            <Route path='/' element={<Layout />}>
              {/* public routes */}
              <Route path='signin' element={<Signin />} />

              {/* protected routes */}
              <Route
                element={
                  <RequireAuth allowedRoles={[...Object.values(ROLES)]} />
                }
              >
                <Route path='charges'>
                  <Route index element={<Charges />} />
                  <Route path=':id' element={<Charge />} />
                  <Route path='add' element={<Charge />} />
                </Route>
                <Route path='claims'>
                  <Route path='admin/:id' element={<ClaimAdmin />} />
                  <Route index element={<Claims />} />
                  <Route path=':id' element={<Claim />} />
                  <Route path='add' element={<Claim />} />
                </Route>
                <Route path='clients'>
                  <Route index element={<Clients />} />
                  <Route path=':id' element={<Client />} />
                  <Route path='add' element={<Client />} />
                </Route>
                <Route path='payees'>
                  <Route index element={<Payees />} />
                  <Route path=':id' element={<Payee />} />
                  <Route path='add' element={<Payee />} />
                </Route>
                <Route path='profile'>
                  <Route index element={<Profile />} />
                  <Route path='profilehours' element={<ProfileHours />} />
                  <Route path='profilecharges' element={<ProfileCharges />} />
                </Route>

                <Route path='timeslips'>
                  <Route index element={<Timeslips />} />
                  <Route path=':id' element={<Timeslip />} />
                  <Route path='add' element={<Timeslip />} />
                </Route>

                <Route
                  element={
                    <RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />
                  }
                >
                  <Route path='billings'>
                    <Route index element={<Billings />} />
                    <Route path=':id' element={<Invoice />} />
                    <Route path='add' element={<InvoiceAdd />} />
                  </Route>

                  <Route path='users'>
                    <Route index element={<Users />} />
                    <Route path=':id' element={<UserAddEdit />} />
                    <Route path='add' element={<UserAddEdit />} />
                  </Route>
                </Route>
              </Route>
            </Route>
            {/* End Protected Routes */}
          </Routes>
        </SPageContainer>
        <ToastContainer autoClose={2000} />
      </>
    </ThemeProvider>
  )
}

export default App
