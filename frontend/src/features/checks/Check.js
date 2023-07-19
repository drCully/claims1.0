import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import useAuth from '../../hooks/useAuth'
import { format, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import {
  SFixedContainer,
  SFlexCol,
  SFlexContainer,
  SFlexRow,
} from '../../styles/containerStyles'
import {
  SForm,
  SFormControl,
  SFormTitle,
  SInput,
  SLabel,
  SSelect,
  STextArea,
} from '../../styles/formStyles'
import { SButton } from '../../styles/buttonStyles'
import { s } from '../../styles/variables'
import { usePayeeLookupQuery } from '../payees/payeesApiSlice'
import { useClaimLookupQuery } from '../claims/claimsApiSlice'
import {
  useCreateCheckMutation,
  useCheckQuery,
  useUpdateCheckMutation,
} from './checksApiSlice'
import { setLastClaim } from '../sessionSlice'

const formatNumber = (num) => {
  return num.toLocaleString('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
  })
}

const Check = () => {
  const { userId } = useAuth()
  const { lastClaim } = useSelector((state) => state.session)
  const dispatch = useDispatch()

  const initialValues = {
    date: format(new Date(), 'yyyy-MM-dd'),
    payee: undefined,
    claim: lastClaim,
    amount: 0,
    memo: undefined,
    timekeeper: userId,
  }

  const [formValues, setFormValues] = useState(initialValues)
  const [editMode, setEditMode] = useState(false)
  const [createCheck] = useCreateCheckMutation()
  const [updateCheck] = useUpdateCheckMutation()

  const { date, payee, claim, amount, memo, timekeeper } = formValues

  const navigate = useNavigate()
  let { id } = useParams()
  if (!id) {
    id = undefined
  }
  const { data } = useCheckQuery(id)
  const { data: payeelookup } = usePayeeLookupQuery()
  const { data: claimlookup } = useClaimLookupQuery()

  useEffect(() => {
    if (id) {
      setEditMode(true)
      if (data) {
        setFormValues({ ...data })
      }
    } else {
      setEditMode(false)
      setFormValues({ ...initialValues })
    }
  }, [id, data])

  const handleInputChange = (event) => {
    let target = event.target
    let name = target.name
    let value = target.type === 'checkbox' ? target.checked : target.value
    setFormValues({ ...formValues, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (
      !formValues.date &&
      !formValues.claim &&
      !formValues.memo &&
      !formValues.amount
    ) {
      toast.error('Feilds must not be left blank')
    } else {
      if (!editMode) {
        await createCheck(formValues)
        dispatch(setLastClaim(formValues.claim))
        navigate(-1)
        toast.success('Check Added Successfully')
      } else {
        await updateCheck(formValues)
        setEditMode(false)
        navigate(-1)
        toast.success('Check Updated Successfully')
      }
    }
  }

  const handleCancel = () => {
    setEditMode(false)
    setFormValues({ ...initialValues })
    navigate(-1)
  }

  return (
    <SFixedContainer maxwidth={`${s.md}`}>
      <SFlexContainer justify='space-between'>
        <SForm onSubmit={handleSubmit}>
          <SFormTitle>{editMode ? 'Edit Check' : 'Add New Check'}</SFormTitle>
          <SFlexRow>
            <SFlexCol>
              <SFormControl margin='0 2em 0 0'>
                <SLabel htmlFor='date'>Date</SLabel>
                <SInput
                  type='Date'
                  id='date'
                  name='date'
                  value={format(parseISO(date), 'yyyy-MM-dd')}
                  onChange={handleInputChange}
                  width='10rem'
                />
              </SFormControl>
            </SFlexCol>
            <SFlexCol>
              <SFormControl>
                <SLabel htmlFor='claim'>Claim</SLabel>
                <SSelect
                  id='claim'
                  name='claim'
                  value={claim}
                  onChange={handleInputChange}
                  width={'15rem'}
                >
                  <option value=''> -- Select a Claim -- </option>
                  {claimlookup?.map((claim) => (
                    <option key={claim._id} value={claim._id}>
                      {claim.name}
                    </option>
                  ))}
                </SSelect>
              </SFormControl>
            </SFlexCol>
          </SFlexRow>
          <SFlexRow>
            <SFlexCol>
              <SFormControl>
                <SLabel htmlFor='payee'>Payee</SLabel>
                <SSelect
                  id='payee'
                  name='payee'
                  value={payee}
                  onChange={handleInputChange}
                  width={'15rem'}
                >
                  <option value=''> -- Select a Payee -- </option>
                  {payeelookup?.map((payee) => (
                    <option key={payee._id} value={payee._id}>
                      {payee.name}
                    </option>
                  ))}
                </SSelect>
              </SFormControl>
            </SFlexCol>
            <SFlexCol>
              <SFormControl>
                <SLabel htmlFor='amount'>Amount</SLabel>
                <SInput
                  type='number'
                  id='amount'
                  name='amount'
                  value={formatNumber(amount)}
                  onChange={handleInputChange}
                  width='10rem'
                  style={{ textAlign: 'right' }}
                />
              </SFormControl>
            </SFlexCol>
          </SFlexRow>
          <SFlexRow>
            <SFlexCol size='1'>
              <SFormControl>
                <SLabel htmlFor='memo'>Memo</SLabel>
                <STextArea
                  type='text'
                  id='memo'
                  name='memo'
                  value={memo}
                  onChange={handleInputChange}
                  width='44rem'
                />
              </SFormControl>
            </SFlexCol>
          </SFlexRow>
          <input
            type='hidden'
            id='timekeeper'
            name='timekeeper'
            value={timekeeper}
          />
          <SFlexContainer>
            <SButton type='submit' margin='.5rem'>
              Save
            </SButton>

            <SButton
              type='button'
              onClick={handleCancel}
              background='gray'
              margin='.5rem'
            >
              Cancel
            </SButton>
          </SFlexContainer>
        </SForm>
      </SFlexContainer>
    </SFixedContainer>
  )
}

export default Check
