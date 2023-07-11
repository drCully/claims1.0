import { s } from '../../styles/variables'
import { SFixedContainer } from '../../styles/containerStyles'

import BilledListDetail from './BilledListDetail'

const BilledList = () => {
  return (
    <SFixedContainer maxwidth={`${s.md}`}>
      <h3>Billed</h3>
      <SFixedContainer height='calc(100vh - 20rem)' margin='1rem 0 0'>
        <BilledListDetail />
      </SFixedContainer>
    </SFixedContainer>
  )
}

export default BilledList
