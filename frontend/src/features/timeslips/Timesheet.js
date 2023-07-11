import { forwardRef, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { format, addHours, parseISO } from 'date-fns'
import ReactToPrint from 'react-to-print'
import {
  SFixedContainer,
  SFlexContainer,
  SFlexCol,
} from '../../styles/containerStyles'
import { SCardFull } from '../../styles/cardStyles'
import { SButton } from '../../styles/buttonStyles'
import { s } from '../../styles/variables'

import { useTimeslipsQuery } from './timeslipsApiSlice'
import { useUserQuery } from '../users/usersApiSlice'
import { TimesheetDetail } from './TimesheetDetail'

const formatNumber = (num) => {
  return num.toLocaleString('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
  })
}

const Timesheet = () => {
  let componentRef = useRef()
  const navigate = useNavigate()

  const handleDone = () => {
    navigate('/timeslips')
  }

  return (
    <SFixedContainer>
      <SFlexContainer justify='center'>
        <SFlexCol>
          {/* button to trigger printing of target component */}
          <ReactToPrint
            trigger={() => (
              <SButton background='green' margin='.5rem' width='6rem'>
                Print
              </SButton>
            )}
            documentTitle='Daily Timesheet'
            onAfterPrint={() => {
              navigate('/timeslips')
            }}
            content={() => componentRef}
            pageStyle='@page { margin: 20px 20px 50px }'
          />
          <SButton
            background='gray'
            margin='.5rem'
            width='6rem'
            onClick={handleDone}
          >
            Done
          </SButton>
        </SFlexCol>
      </SFlexContainer>
      <SFlexContainer justify='center'>
        {/* component to be printed */}
        <SCardFull
          width={`${s.lg}`}
          maxwidth={`${s.xl}`}
          height='40rem'
          overflow='auto'
        >
          <TimesheetToPrint ref={(el) => (componentRef = el)} />
        </SCardFull>
      </SFlexContainer>
    </SFixedContainer>
  )
}
export default Timesheet

const TimesheetToPrint = forwardRef((props, ref) => {
  const { lastDate, lastUser } = useSelector((state) => state.session)
  const [totalHours, setTotalHours] = useState(0)

  const timekeeper = lastUser
  const { data: timeslips, isLoading: timeslipsLoading } = useTimeslipsQuery(
    `date=${lastDate}&timekeeper=${timekeeper}`
  )

  const { data: user, isLoading: userLoading } = useUserQuery(timekeeper)

  useEffect(() => {
    if (timeslips) {
      const getTotal = timeslips.reduce(
        (total, currentValue) => (total = total + currentValue.hours),
        0
      )
      setTotalHours(getTotal)
    }
  }, [timeslips])

  if (timeslipsLoading || userLoading) {
    return <div>Loading...</div>
  }

  return (
    <SFixedContainer ref={ref} width={`${s.md}`}>
      <SFixedContainer margin='1.5rem 0 1rem 0' style={{ padding: '1.5rem' }}>
        <SFlexContainer justify='space-between' align='start'>
          <SFlexCol>
            <h2 style={{ color: 'rgb(255, 106, 0)', fontWeight: 'bolder' }}>
              Daily Time Sheet
            </h2>
          </SFlexCol>
          <SFlexCol style={{ textAlign: 'end', fontWeight: 'bolder' }}>
            <div>{user.firstName + ' ' + user.lastName}</div>
            <div> {format(addHours(parseISO(lastDate), 8), 'MM/dd/yyyy')}</div>
            <div>{formatNumber(Number(totalHours))} Hours</div>
          </SFlexCol>
        </SFlexContainer>
        <SFixedContainer margin='1rem 0 5rem 0'>
          <TimesheetDetail timeslips={timeslips} />
        </SFixedContainer>
      </SFixedContainer>
    </SFixedContainer>
  )
})
