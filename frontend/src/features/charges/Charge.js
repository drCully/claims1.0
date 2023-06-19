import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import useAuth from '../../hooks/useAuth'
import { format, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import { SFixedContainer, SFlexContainer } from '../../styles/containerStyles'
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
import { useClaimLookupQuery } from '../claims/claimsApiSlice'
import {
  useCreateChargeMutation,
  useChargeQuery,
  useUpdateChargeMutation,
} from './chargesApiSlice'
import { setLastClaim } from '../sessionSlice'

const Charge = () => {
  const { userId } = useAuth()
  const { lastClaim } = useSelector((state) => state.session)
  const dispatch = useDispatch()

  const initialValues = {
    timekeeper: userId,
    claim: lastClaim,
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    amount: '',
    billable: true,
    billed: false,
  }

  const [formValues, setFormValues] = useState(initialValues)
  const [editMode, setEditMode] = useState(false)
  const [createCharge] = useCreateChargeMutation()
  const [updateCharge] = useUpdateChargeMutation()

  const { date, timekeeper, claim, description, amount, billable, billed } =
    formValues

  const navigate = useNavigate()
  let { id } = useParams()
  if (!id) {
    id = ''
  }
  const { data, error } = useChargeQuery(id)
  const { data: claimlookup } = useClaimLookupQuery()

  useEffect(() => {
    if (error && id) {
      toast.error('Something went wrong')
    }
  }, [error, id])

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
    let value = target.type === 'chargebox' ? target.chargeed : target.value
    setFormValues({ ...formValues, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (
      !formValues.date &&
      !formValues.claim &&
      !formValues.description &&
      !formValues.amount
    ) {
      toast.error('Please provide value into each input field')
    } else {
      if (!editMode) {
        console.log(formValues)
        await createCharge(formValues)
        dispatch(setLastClaim(formValues.claim))
        navigate('/charges')
        toast.success('Charge Added Successfully')
      } else {
        await updateCharge(formValues)
        setEditMode(false)
        navigate('/charges')
        toast.success('Charge Updated Successfully')
      }
    }
  }

  const handleCancel = () => {
    setEditMode(false)
    setFormValues({ ...initialValues })
    navigate('/charges')
  }

  return (
    <SFixedContainer maxwidth={`${s.sm}`}>
      <SForm onSubmit={handleSubmit}>
        <SFormTitle>{editMode ? 'Edit Charge' : 'Add New Charge'}</SFormTitle>
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
        <SFormControl>
          <SLabel htmlFor='date'>Charge Date</SLabel>
          <SInput
            type='Date'
            id='date'
            name='date'
            value={format(parseISO(date), 'yyyy-MM-dd')}
            onChange={handleInputChange}
            width='100%'
          />
        </SFormControl>
        <SFormControl>
          <SLabel htmlFor='amount'>Amount</SLabel>
          <SInput
            type='number'
            id='amount'
            name='amount'
            value={amount}
            onChange={handleInputChange}
            width='100%'
          />
        </SFormControl>
        <SFormControl>
          <SLabel htmlFor='description'>Description</SLabel>
          <STextArea
            type='text'
            id='description'
            name='description'
            value={description}
            onChange={handleInputChange}
            width='100%'
          />
        </SFormControl>
        <input
          type='hidden'
          id='timekeeper'
          name='timekeeper'
          value={timekeeper}
        />
        <input type='hidden' id='billable' name='billable' value={billable} />
        <input type='hidden' id='billed' name='billed' value={billed} />

        <SFlexContainer>
          <SButton type='submit' margin='.5rem'>
            {editMode ? 'Update' : 'Save'}
          </SButton>

          <SButton
            background='gray'
            margin='.5rem'
            type='button'
            onClick={handleCancel}
          >
            Cancel
          </SButton>
        </SFlexContainer>
      </SForm>
    </SFixedContainer>
  )
}

export default Charge
