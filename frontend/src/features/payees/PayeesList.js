import { useState } from 'react'
import { SButtonLink } from '../../styles/buttonStyles'
import { s } from '../../styles/variables'
import { SFixedContainer, SFlexContainer } from '../../styles/containerStyles'
import { SInput, SSelect } from '../../styles/formStyles'

import { PayeesListDetail } from './PayeesListDetail'

const PayeesList = () => {
  const [activeStatus, setActiveStatus] = useState(true)
  const onChangeActiveStatus = (event) => {
    const activeStatus = event.target.value
    setActiveStatus(activeStatus)
  }

  const [searchPayee, setSearchPayee] = useState('')
  const onChangeSearchPayee = (event) => {
    const searchPayee = event.target.value
    setSearchPayee(searchPayee)
  }

  return (
    <SFixedContainer maxwidth={`${s.lg}`}>
      <h2>Payees</h2>
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
          placeholder='Search by name'
          value={searchPayee}
          onChange={onChangeSearchPayee}
          width={'20rem'}
          margin={'0 1em'}
        />
        <SButtonLink to={'/payees/add'}>Add New</SButtonLink>
      </SFlexContainer>
      <PayeesListDetail searchPayee={searchPayee} activeStatus={activeStatus} />
    </SFixedContainer>
  )
}

export default PayeesList
