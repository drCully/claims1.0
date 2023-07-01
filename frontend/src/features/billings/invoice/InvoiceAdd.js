import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { format, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import {
  SFixedContainer,
  SFlexContainer,
  SFlexRow,
  SFlexCol,
} from '../../../styles/containerStyles'
import { SFormPlain, SInput, SLabel } from '../../../styles/formStyles'
import { SButton } from '../../../styles/buttonStyles'
import { s } from '../../../styles/variables'

import TimeDetail from './TimeDetail'
import ChargeDetail from './ChargeDetail'

import { useClaimQuery } from '../../claims/claimsApiSlice'

import {
  useTimeslipsQuery,
  useUpdateTimeslipMutation,
} from '../../timeslips/timeslipsApiSlice'
import {
  useChargesQuery,
  useUpdateChargeMutation,
} from '../../charges/chargesApiSlice'
import {
  useInvoiceClientQuery,
  useCreateInvoiceMutation,
} from './invoicesApiSlice'
import {
  setAsOfDate,
  setTimeItems,
  setSelectedTime,
  setChargeItems,
  setSelectedCharges,
  clearBilling,
} from '../billingSlice'

const formatNumber = (num) => {
  return num.toLocaleString('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
  })
}

const InvoiceAdd = () => {
  const {
    asOfDate,
    claimId,
    selectedTime,
    timeAmount,
    selectedCharges,
    chargeAmount,
  } = useSelector((state) => state.billing)
  const [createInvoice] = useCreateInvoiceMutation()
  const [invoiceTimeslip] = useUpdateTimeslipMutation()
  const [invoiceCharge] = useUpdateChargeMutation()

  const claims = useClaimQuery(claimId)
  const clients = useInvoiceClientQuery(claimId)
  const timeslips = useTimeslipsQuery(
    `claim=${claimId}&lastdate=${asOfDate}&billed=false`
  )
  const charges = useChargesQuery(
    `claim=${claimId}&lastdate=${asOfDate}&billed=false`
  )
  const isLoading =
    claims.isLoading ||
    clients.isLoading ||
    timeslips.isLoading ||
    charges.isLoading

  const isSuccess =
    claims.isSuccess ||
    clients.isSuccess ||
    timeslips.isSuccess ||
    charges.isSuccess

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (timeslips.isSuccess) {
      const timeItems = timeslips.data.map((item) => ({
        ...item,
        total: Math.round(item.hours * item.rate * 100) / 100,
      }))
      dispatch(setTimeItems(timeItems))
      if (!selectedTime || !selectedTime.length) {
        dispatch(setSelectedTime(timeItems))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeslips])

  useEffect(() => {
    if (charges.isSuccess) {
      const chargeItems = charges.data.map((item) => ({
        ...item,
        total: Math.round(item.amount * 100) / 100,
      }))
      dispatch(setChargeItems(chargeItems))
      if (!selectedCharges || !selectedCharges.length) {
        dispatch(setSelectedCharges(chargeItems))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charges])

  const handleDateChange = (e) => {
    dispatch(setAsOfDate(e.target.value))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const invoiceResult = await createInvoice({
      date: asOfDate,
      claim: claimId,
      client: clients.data._id,
      timeAmount: timeAmount,
      chargeAmount: chargeAmount,
    })

    selectedTime.map(async (timeslip) => {
      let updatedValue = { ...timeslip }
      updatedValue.billed = true
      updatedValue.invoice = invoiceResult.data._id
      await invoiceTimeslip(updatedValue)
    })

    selectedCharges.map(async (charge) => {
      let updatedValue = { ...charge }
      updatedValue.billed = true
      updatedValue.invoice = invoiceResult.data._id
      await invoiceCharge(updatedValue)
    })

    //dispatch(clearBilling())
    navigate(`/billings/${invoiceResult.data._id}`)
    toast.success('Invoice Added Successfully')
  }

  const handleCancel = () => {
    dispatch(clearBilling())
    navigate('/billings')
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isSuccess) {
    return (
      <SFixedContainer minwidth={`${s.md}`} maxwidth={`${s.xl}`}>
        <SFlexContainer justify='space-between' align='start'>
          <SFlexCol>
            <h2>Create Invoice</h2>
            <SFlexRow>
              <div style={{ margin: '1rem 0 0 1rem' }}>
                <strong>Bill To: </strong>
                <br />
                {clients.data.name}
                <br />
                {clients.data.addr1}
                <br />
                {clients.data.addr2}
                <br />
                {clients.data.addr3}
                <br />
              </div>
              <div style={{ margin: '2rem 0 0 5rem' }}>
                <strong>Claimant: </strong>
                {claims.data.claimant}
                <br />
                <strong>Our Reference: </strong>
                {claims.data.number}
                <br />
                <strong>Vessel: </strong>
                {claims.data.vessel}
                <br />
                <strong> D.O.L.: </strong>
                {format(parseISO(claims.data.dol), 'MM/dd/yyyy')}
              </div>
            </SFlexRow>
          </SFlexCol>
          <SFlexCol>
            <SFormPlain onSubmit={handleSubmit}>
              <SFlexContainer justify='space-between'>
                <div>
                  <SLabel htmlFor='date'>Date</SLabel>
                  <SInput
                    type='Date'
                    id='date'
                    name='date'
                    defaultValue={format(parseISO(asOfDate), 'yyyy-MM-dd')}
                    onChange={handleDateChange}
                    width='10rem'
                    margin='0 1rem 0 0'
                  />
                </div>
                <SLabel htmlFor='timeAmount'>Time</SLabel>
                <SInput
                  type='text'
                  id='timeAmount'
                  name='timeAmount'
                  value={formatNumber(Number(timeAmount))}
                  disabled={true}
                  width='6rem'
                  style={{ textAlign: 'right' }}
                />
              </SFlexContainer>
              <SFlexContainer margin='.5rem 0 0 0'>
                <div>
                  <SLabel htmlFor='chargeAmount'>Charges</SLabel>
                  <SInput
                    type='text'
                    id='chargeAmount'
                    name='chargeAmount'
                    value={formatNumber(Number(chargeAmount))}
                    disabled={true}
                    width='6rem'
                    style={{ textAlign: 'right' }}
                  />
                </div>
              </SFlexContainer>
              <SFlexContainer margin='.5rem 0 0 0'>
                <div>
                  <SButton type='submit' width='5rem' onClick={handleSubmit}>
                    Post
                  </SButton>
                  <SButton
                    type='button'
                    background='gray'
                    margin='0 3rem 0 .5rem'
                    width='5rem'
                    onClick={handleCancel}
                  >
                    Cancel
                  </SButton>
                </div>
                <div>
                  <SLabel htmlFor='amount'>Total</SLabel>
                  <SInput
                    type='text'
                    id='amount'
                    name='amount'
                    value={formatNumber(Number(timeAmount + chargeAmount))}
                    disabled={true}
                    width='6rem'
                    style={{ textAlign: 'right' }}
                  />
                </div>
              </SFlexContainer>
              <input
                type='hidden'
                id='claimId'
                name='claimId'
                value={claimId}
              />
            </SFormPlain>
          </SFlexCol>
        </SFlexContainer>
        <SFixedContainer height='30rem' margin='1rem 0 0 0' overflow='auto'>
          <SLabel>Time</SLabel>
          <TimeDetail />
          <SLabel style={{ marginTop: '1rem' }}>Charges</SLabel>
          <ChargeDetail />
        </SFixedContainer>
      </SFixedContainer>
    )
  }
}

export default InvoiceAdd
