import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  SFixedContainer,
  SFlexContainer,
} from '../../../styles/containerStyles'
import { SCard } from '../../../styles/cardStyles'
import Tabs from '../../../components/Tabs/Tabs'

import Claim from '../Claim'
import TimeDetail from './TimeDetail'
import ChargeDetail from './ChargeDetail'
import CheckDetail from './CheckDetail'
import BillingDetail from './BillingDetail'
import { setLastClaim } from '../../sessionSlice'

const ClaimDashboard = () => {
  let { id } = useParams()
  const dispatch = useDispatch()
  dispatch(setLastClaim(id))

  return (
    <>
      <div style={{ overflowY: 'visible' }}>
        <SFixedContainer>
          <SFlexContainer justify='space-between' align='start'>
            <Claim />
          </SFlexContainer>
          <SFixedContainer>
            <Tabs>
              <div label='Time'>
                <SCard style={{ height: 'calc(100vh - 23rem)' }}>
                  <TimeDetail />
                </SCard>
              </div>
              <div label='Charges'>
                <SCard style={{ height: 'calc(100vh - 23rem)' }}>
                  <ChargeDetail />
                </SCard>
              </div>
              <div label='Disbursements'>
                <SCard style={{ height: 'calc(100vh - 23rem)' }}>
                  <CheckDetail />
                </SCard>
              </div>
              <div label='Billings'>
                <SCard style={{ height: 'calc(100vh - 23rem)' }}>
                  <BillingDetail />
                </SCard>
              </div>
            </Tabs>
          </SFixedContainer>
        </SFixedContainer>
      </div>
    </>
  )
}

export default ClaimDashboard
