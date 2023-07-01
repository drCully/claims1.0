import { useState } from 'react'
import { SButtonLink } from '../../styles/buttonStyles'
import { s } from '../../styles/variables'
import { ChargesListDetail } from './ChargesListDetail'
import { SFixedContainer, SFlexContainer } from '../../styles/containerStyles'
import { SInput } from '../../styles/formStyles'

const ChargesList = () => {
  const [searchCharge, setSearchCharge] = useState('')
  const onChangeSearchCharge = (event) => {
    const searchCharge = event.target.value
    setSearchCharge(searchCharge)
  }

  return (
    <SFixedContainer maxwidth={`${s.lg}`}>
      <h2>Charges</h2>
      <SFlexContainer>
        <SInput
          type='search'
          className='form-control'
          placeholder='Search by charge'
          value={searchCharge}
          onChange={onChangeSearchCharge}
          width={'20rem'}
          margin={'0 1em'}
        />
        <SButtonLink to={'/charges/add'}>Add New</SButtonLink>
      </SFlexContainer>
      <ChargesListDetail searchCharge={searchCharge} />
    </SFixedContainer>
  )
}

export default ChargesList
