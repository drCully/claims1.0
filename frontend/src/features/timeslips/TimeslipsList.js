import { useSelector, useDispatch } from 'react-redux'
import useAuth from '../../hooks/useAuth'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { SButtonLink } from '../../styles/buttonStyles'
import { s } from '../../styles/variables'
import {
  SFixedContainer,
  SFlexContainer,
  SFlexCol,
} from '../../styles/containerStyles'
import { SInput } from '../../styles/formStyles'
import {
  FaFileAlt,
  FaChevronCircleLeft,
  FaChevronCircleRight,
} from 'react-icons/fa'

import TimeslipsListDetail from './TimeslipsListDetail'

import {
  setLastDate,
  previousDate,
  nextDate,
  setLastUser,
} from '../sessionSlice'

const TimeslipsList = () => {
  const dispatch = useDispatch()

  const timekeeper = useAuth()

  const { lastDate } = useSelector((state) => state.session)
  if (!lastDate) {
    const newDate = format(new Date(), 'yyyy-MM-dd')
    dispatch(setLastDate(newDate))
  }

  const { lastUser } = useSelector((state) => state.session)
  if (!lastUser) {
    dispatch(setLastUser(timekeeper.userId))
  }

  const handleDateChange = (e) => {
    dispatch(setLastDate(e.target.value))
  }

  return (
    <SFixedContainer maxwidth={`${s.xxl}`}>
      <SFlexContainer justify='space-between' align='start'>
        <SFlexCol>
          <h2>Timesheet</h2>
        </SFlexCol>
        <SFlexCol>
          <SFlexContainer>
            <FaChevronCircleLeft
              type='button'
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                margin: '3px 10px 2px',
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
              style={{ fontFamily: 'Roboto' }}
            />

            <FaChevronCircleRight
              type='button'
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                margin: '3px 10px 2px',
                color: '#888888',
                fontSize: 30,
                cursor: 'pointer',
              }}
              onClick={() => dispatch(nextDate())}
            />
            <SButtonLink
              to={'/timeslips/add'}
              margin={'0 .5rem'}
              padding={'0.18rem 0.5rem'}
            >
              Add New
            </SButtonLink>
            <Link to={`/timesheet`}>
              <FaFileAlt
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignContent: 'center',
                  color: 'green',
                  fontSize: 30,
                  margin: '3px 10px 0',
                  padding: '.03rem',
                }}
              />
            </Link>
          </SFlexContainer>
        </SFlexCol>
      </SFlexContainer>
      <SFixedContainer height='calc(100vh - 15rem)' margin='1rem 0 0'>
        <TimeslipsListDetail />
      </SFixedContainer>
    </SFixedContainer>
  )
}

export default TimeslipsList
