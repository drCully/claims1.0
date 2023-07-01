import { useSelector, useDispatch } from 'react-redux'
import { format } from 'date-fns'
import { SButtonLink } from '../../styles/buttonStyles'
import { s } from '../../styles/variables'
import { SFixedContainer, SFlexContainer } from '../../styles/containerStyles'
import { SInput } from '../../styles/formStyles'
import {
  FaFileAlt,
  FaChevronCircleLeft,
  FaChevronCircleRight,
} from 'react-icons/fa'

import { TimeslipsListDetail } from './TimeslipsListDetail'

import { setLastDate, previousDate, nextDate } from '../sessionSlice'

const TimeslipsList = () => {
  const dispatch = useDispatch()

  const { lastDate } = useSelector((state) => state.session)
  if (!lastDate) {
    const newDate = format(new Date(), 'yyyy-MM-dd')
    dispatch(setLastDate(newDate))
  }

  const handleDateChange = (e) => {
    dispatch(setLastDate(e.target.value))
  }

  return (
    <SFixedContainer maxwidth={`${s.xxl}`}>
      <h2>Timesheet</h2>
      <SFlexContainer>
        <FaChevronCircleLeft
          type='button'
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            margin: '3px 10px 0 0',
            color: '#888888',
            fontSize: 30,
            marginRight: 10,
            cursor: 'pointer',
          }}
          onClick={() => dispatch(previousDate())}
        />
        <SInput
          type='date'
          id='lastDate'
          name='lastDate'
          value={lastDate}
          onChange={handleDateChange}
          width={'12rem'}
          height={'2.5rem'}
          style={{ fontFamily: 'Roboto' }}
        />

        <FaChevronCircleRight
          type='button'
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            margin: '3px 10px 10px',
            color: '#888888',
            fontSize: 30,
            cursor: 'pointer',
          }}
          onClick={() => dispatch(nextDate())}
        />
        <SButtonLink to={'/timeslips/add'} style={{ margin: '0 15px 15px' }}>
          Add New
        </SButtonLink>
        <FaFileAlt
          type='button'
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignContent: 'center',
            color: 'green',
            fontSize: 30,
            margin: '3px 10px 10px',
          }}
        />
      </SFlexContainer>
      <TimeslipsListDetail />
    </SFixedContainer>
  )
}

export default TimeslipsList
