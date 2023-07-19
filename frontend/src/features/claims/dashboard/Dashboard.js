import { useNavigate } from 'react-router-dom'
import { s } from '../../../styles/variables'
import {
  SFixedContainer,
  SFlexCol,
  SFlexContainer,
  SFlexRow,
} from '../../../styles/containerStyles'
import { SCard } from '../../../styles/cardStyles'
import { SButton, SButtonLink } from '../../../styles/buttonStyles'
import Tabs from '../../../components/Tabs/Tabs'

import Claim from '../Claim'
import TimeDetail from './TimeDetail'
import ChargeDetail from './ChargeDetail'
import CheckDetail from './CheckDetail'

const ClaimDashboard = () => {
  const navigate = useNavigate()

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
              <div label='Billing'>Billing Detail HERE</div>
            </Tabs>
          </SFixedContainer>
        </SFixedContainer>
      </div>
    </>
  )
}

export default ClaimDashboard
