import { forwardRef, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { format, addHours, parseISO } from 'date-fns'
import ReactToPrint from 'react-to-print'
import { toast } from 'react-toastify'
import {
  SFixedContainer,
  SFlexContainer,
  SFlexRow,
  SFlexCol,
} from '../../../styles/containerStyles'
import { SCardFull } from '../../../styles/cardStyles'
import { SButton } from '../../../styles/buttonStyles'
import { s } from '../../../styles/variables'
import LogoImg from './clientlogo.png'

import { useInvoiceQuery, useUpdateInvoiceMutation } from './invoicesApiSlice'
import {
  useTimeslipsQuery,
  useUpdateTimeslipMutation,
} from '../../timeslips/timeslipsApiSlice'
import {
  useChargesQuery,
  useUpdateChargeMutation,
} from '../../charges/chargesApiSlice'
import { InvoiceTimeDetail } from './InvoiceTimeDetail'
import { InvoiceChargeDetail } from './InvoiceChargeDetail'
import { setClaimId, clearBilling } from '../billingSlice'

const formatNumber = (num) => {
  return num.toLocaleString('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
  })
}

const Invoice = () => {
  let componentRef = useRef()
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: invoice, isLoading } = useInvoiceQuery(id)
  const { data: timeslips, isSuccess } = useTimeslipsQuery(`invoice=${id}`)
  const charges = useChargesQuery(`invoice=${id}`)

  const [updateInvoice] = useUpdateInvoiceMutation()
  const [updateTimeslip] = useUpdateTimeslipMutation()
  const [updateCharges] = useUpdateChargeMutation()

  const dispatch = useDispatch()

  const handleUnpost = async (id) => {
    if (window.confirm('Are you sure you want to VOID this invoice? ')) {
      if (isSuccess) {
        let updatedValue = { ...invoice }
        updatedValue.claim = undefined
        updatedValue.client = undefined
        updatedValue.timeAmount = 0
        updatedValue.chargeAmount = 0
        updatedValue.status = 'void'
        await updateInvoice(updatedValue)

        timeslips.map(async (timeslip) => {
          let updatedValue = { ...timeslip }
          updatedValue.billed = false
          updatedValue.invoice = undefined
          await updateTimeslip(updatedValue)
        })

        charges.data.map(async (charge) => {
          let updatedValue = { ...charge }
          updatedValue.billed = false
          updatedValue.invoice = undefined
          await updateCharges(updatedValue)
        })

        dispatch(clearBilling())
        dispatch(setClaimId(invoice.claim._id))
        navigate('/billings/add')
        toast.success('Invoice Voided Successfully')
      }
    }
  }

  const handleDone = () => {
    dispatch(clearBilling())
    navigate(-1)
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
            onAfterPrint={() => {
              dispatch(clearBilling())
              navigate('/billings')
            }}
            content={() => componentRef}
          />
          <SButton
            type='submit'
            margin='.5rem'
            width='6rem'
            onClick={() => handleUnpost(id)}
          >
            Unpost
          </SButton>
          <SButton
            background='gray'
            margin='.5rem'
            width='6rem'
            onClick={handleDone}
          >
            Cancel
          </SButton>
        </SFlexCol>
      </SFlexContainer>
      <SFlexContainer justify='center'>
        {/* component to be printed */}
        <SCardFull
          width={`${s.lg}`}
          maxwidth={`${s.xl}`}
          height='calc(100vh - 17rem)'
          overflow='auto'
        >
          <InvoiceToPrint ref={(el) => (componentRef = el)} />
        </SCardFull>
      </SFlexContainer>
    </SFixedContainer>
  )
}
export default Invoice

const InvoiceToPrint = forwardRef((props, ref) => {
  const { id } = useParams()
  const { data: invoiceData, isLoading } = useInvoiceQuery(id)

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <SFixedContainer ref={ref} width={`${s.md}`}>
      <SFixedContainer margin='1.5rem 0 1rem 0' style={{ padding: '1.5rem' }}>
        <SFlexContainer justify='space-between' align='end'>
          <SFlexCol>
            <img src={LogoImg} style={{ width: '350px' }} />
            <p style={{ fontSize: '.7rem' }}>
              4055 21st Avenue West, Suite 200 | Seattle, WA 98199-1201 |
              206.378.6090
            </p>
          </SFlexCol>
          <SFlexCol style={{ alignItems: 'flex-end' }}>
            <h1 style={{ color: 'rgb(255, 106, 0)', fontWeight: 'bolder' }}>
              INVOICE
            </h1>
          </SFlexCol>
        </SFlexContainer>
        <SFlexContainer justify='space-between'>
          <SFlexRow>
            <div style={{ margin: '1rem 0 0 1rem' }}>
              <strong>Bill To: </strong>
              <br />
              {invoiceData.client.name}
              <br />
              {invoiceData.client.addr1}
              <br />
              {invoiceData.client.addr2}
              <br />
              {invoiceData.client.addr3}
              <br />
            </div>
            <div style={{ margin: '2rem 0 0 3rem' }}>
              <strong>Claimant: </strong>
              {invoiceData.claim.claimant}
              <br />
              <strong>Our Reference: </strong>
              {invoiceData.claim.number}
              <br />
              <strong>Vessel: </strong>
              {invoiceData.claim.vessel}
              <br />
              <strong> D.O.L.: </strong>
              {format(parseISO(invoiceData.claim.dol), 'MM/dd/yyyy')}
            </div>
          </SFlexRow>
          <SFlexCol>
            <SFlexRow style={{ marginTop: '1rem' }}>
              <SFlexCol margin='0 1rem 0 auto'>
                <p
                  style={{
                    color: 'rgb(255, 106, 0)',
                    fontSize: '.85rem',
                    fontWeight: 'bolder',
                  }}
                >
                  Date
                </p>
              </SFlexCol>
              <SFlexCol>
                <p
                  style={{
                    width: '5rem',
                    fontSize: '.85rem',
                    textAlign: 'right',
                  }}
                >
                  {format(
                    addHours(parseISO(invoiceData.date), 8),
                    'MM/dd/yyyy'
                  )}
                </p>
              </SFlexCol>
            </SFlexRow>
            <SFlexRow>
              <SFlexCol margin='0 1rem 0 auto'>
                <p
                  style={{
                    color: 'rgb(255, 106, 0)',
                    fontSize: '.85rem',
                    fontWeight: 'bolder',
                  }}
                >
                  Number
                </p>
              </SFlexCol>
              <SFlexCol>
                <p
                  style={{
                    width: '5rem',
                    fontSize: '.85rem',
                    textAlign: 'right',
                  }}
                >
                  {invoiceData.number}
                </p>
              </SFlexCol>
            </SFlexRow>
            <SFlexRow style={{ marginTop: '1rem' }}>
              <SFlexCol margin='0 1rem 0 auto'>
                <p
                  style={{
                    color: 'rgb(255, 106, 0)',
                    fontSize: '.85rem',
                    fontWeight: 'bolder',
                  }}
                >
                  Adjuster Time
                </p>
              </SFlexCol>
              <SFlexCol>
                <p
                  style={{
                    width: '5rem',
                    fontSize: '.85rem',
                    textAlign: 'right',
                  }}
                >
                  {formatNumber(invoiceData.timeAmount)}
                </p>
              </SFlexCol>
            </SFlexRow>
            <SFlexRow>
              <SFlexCol margin='0 1rem 0 auto'>
                <p
                  style={{
                    color: 'rgb(255, 106, 0)',
                    fontSize: '.85rem',
                    fontWeight: 'bolder',
                  }}
                >
                  Charges
                </p>
              </SFlexCol>
              <SFlexCol>
                <p
                  style={{
                    width: '5rem',
                    fontSize: '.85rem',
                    textAlign: 'right',
                  }}
                >
                  {formatNumber(invoiceData.chargeAmount)}
                </p>
              </SFlexCol>
            </SFlexRow>
            <SFlexRow>
              <SFlexCol margin='0 1rem 0 auto'>
                <p
                  style={{
                    color: 'rgb(255, 106, 0)',
                    fontSize: '.85rem',
                    fontWeight: 'bolder',
                  }}
                >
                  Total
                </p>
              </SFlexCol>
              <SFlexCol>
                <p
                  style={{
                    width: '5rem',
                    fontSize: '.85rem',
                    textAlign: 'right',
                  }}
                >
                  {formatNumber(
                    Number(invoiceData.timeAmount) +
                      Number(invoiceData.chargeAmount)
                  )}
                </p>
              </SFlexCol>
            </SFlexRow>
          </SFlexCol>
        </SFlexContainer>
        <SFixedContainer margin='1rem 0 5rem 0'>
          {invoiceData.timeAmount ? (
            <>
              <div
                style={{
                  color: 'rgb(255, 106, 0)',
                  fontSize: '.85rem',
                  fontWeight: 'bolder',
                }}
              >
                Adjuster Time
              </div>
              <InvoiceTimeDetail invoice={invoiceData._id} />
            </>
          ) : (
            ''
          )}
          {invoiceData.chargeAmount ? (
            <>
              <div
                style={{
                  marginTop: '1rem',
                  color: 'rgb(255, 106, 0)',
                  fontSize: '.85rem',
                  fontWeight: 'bolder',
                }}
              >
                Charges
              </div>

              <InvoiceChargeDetail invoice={invoiceData._id} />
            </>
          ) : (
            ''
          )}
        </SFixedContainer>
      </SFixedContainer>
    </SFixedContainer>
  )
})
