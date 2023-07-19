import { useState } from 'react'
import { SButtonLink } from '../../styles/buttonStyles'
import { s } from '../../styles/variables'
import { ChecksListDetail } from './ChecksListDetail'
import { SFixedContainer, SFlexContainer } from '../../styles/containerStyles'
import { SInput } from '../../styles/formStyles'

const ChecksList = () => {
  const [searchCheck, setSearchCheck] = useState('')
  const onChangeSearchCheck = (event) => {
    const searchCheck = event.target.value
    setSearchCheck(searchCheck)
  }

  return (
    <SFixedContainer maxwidth={`${s.lg}`}>
      <h2>Checks</h2>
      <SFlexContainer>
        <SInput
          type='search'
          className='form-control'
          placeholder='Search by check'
          value={searchCheck}
          onChange={onChangeSearchCheck}
          width={'20rem'}
          margin={'0 1em'}
        />
        <SButtonLink to={'/checks/add'} padding={'0.18rem 0.5rem'}>
          Add New
        </SButtonLink>
      </SFlexContainer>
      <ChecksListDetail searchCheck={searchCheck} />
    </SFixedContainer>
  )
}

export default ChecksList
