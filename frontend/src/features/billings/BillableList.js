import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { format } from 'date-fns'
import { s } from '../../styles/variables'
import {
  SFixedContainer,
  SFlexContainer,
  SFlexCol,
} from '../../styles/containerStyles'
import { SLabel, SInput } from '../../styles/formStyles'

import BillableListDetail from './BillableListDetail'
import { setAsOfDate } from './billingSlice'

const BillableList = () => {
  const dispatch = useDispatch()

  const { asOfDate } = useSelector((state) => state.billing)
  /*   if (!asOfDate) {
    const newDate = format(new Date(), 'yyyy-MM-dd')
    dispatch(setAsOfDate(newDate))
  } */

  /*   const [searchClaim, setSearchClaim] = useState('')
  const onChangeSearchClaim = (event) => {
    const searchClaim = event.target.value
    setSearchClaim(searchClaim)
  } */

  const handleDateChange = (e) => {
    dispatch(setAsOfDate(e.target.value))
  }

  return (
    <SFixedContainer maxwidth={`${s.md}`}>
      <h3>Billable</h3>
      <SFlexContainer justify='space-between' align='start'>
        <SFlexCol>
          <SFlexContainer>
            {/*             <SInput
              type='search'
              className='form-control'
              placeholder='Search by claim name...'
              value={searchClaim}
              onChange={onChangeSearchClaim}
              width={'20rem'}
              margin={'0 1em'}
            /> */}
            <SLabel margin={'0 .75em 0 2em'}>As of </SLabel>
            <SInput
              type='date'
              id='asOfDate'
              name='asOfDate'
              value={asOfDate}
              onChange={handleDateChange}
              width={'12rem'}
              style={{ fontFamily: 'Roboto' }}
            />
          </SFlexContainer>
        </SFlexCol>
      </SFlexContainer>
      <SFixedContainer height='calc(100vh - 22rem)' margin='1rem 0 0'>
        {/* <BillableListDetail searchClaim={searchClaim} /> */}
        <BillableListDetail />
      </SFixedContainer>
    </SFixedContainer>
  )
}

export default BillableList
