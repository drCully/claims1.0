import { useState } from 'react'
import { SButtonLink } from '../../styles/buttonStyles'
import { s } from '../../styles/variables'
import { ClaimsListDetail } from './ClaimsListDetail'
import { SFixedContainer, SFlexContainer } from '../../styles/containerStyles'
import { SInput, SSelect } from '../../styles/formStyles'

const ClaimsList = () => {
  const [activeStatus, setActiveStatus] = useState(true)
  const onChangeActiveStatus = (event) => {
    const activeStatus = event.target.value
    setActiveStatus(activeStatus)
  }

  const [searchClaim, setSearchClaim] = useState('')
  const onChangeSearchClaim = (event) => {
    const searchClaim = event.target.value
    setSearchClaim(searchClaim)
  }

  return (
    <SFixedContainer maxwidth={`${s.lg}`}>
      <h2>Claims</h2>
      <SFlexContainer>
        <SSelect
          onChange={(event) => {
            onChangeActiveStatus(event)
          }}
          width='10rem'
        >
          <option value='true'>Show Active</option>
          <option value='false'>Show Closed</option>
          <option value=''>Show All</option>
        </SSelect>
        <SInput
          type='search'
          className='form-control'
          placeholder='Search by claim'
          value={searchClaim}
          onChange={onChangeSearchClaim}
          width={'20rem'}
          margin={'0 1em'}
        />
        <SButtonLink to={'/claims/add'}>Add New</SButtonLink>
      </SFlexContainer>
      <ClaimsListDetail searchClaim={searchClaim} activeStatus={activeStatus} />
    </SFixedContainer>
  )
}

export default ClaimsList
