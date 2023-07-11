import { s } from '../../styles/variables'
import { SFixedContainer, SFlexContainer } from '../../styles/containerStyles'
import { SCardFull } from '../../styles/cardStyles'
import BillableList from './BillableList'
import BilledList from './BilledList'

const Billing = () => {
  return (
    <SFixedContainer maxwidth={`${s.xxl}`}>
      <h2>Billing</h2>
      <SFlexContainer>
        <SCardFull width={'55%'} height='calc(100vh - 15rem)'>
          <BillableList />
        </SCardFull>
        <SCardFull width={'45%'} height='calc(100vh - 15rem)'>
          <BilledList />
        </SCardFull>
      </SFlexContainer>
    </SFixedContainer>
  )
}

export default Billing
