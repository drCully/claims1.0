import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import useAuth from '../../hooks/useAuth'
import { format, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import {
  SFixedContainer,
  SFlexContainer,
  SFlexRow,
  SFlexCol,
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

import {
  useCreateTimeslipMutation,
  useTimeslipQuery,
  useUpdateTimeslipMutation,
} from './timeslipsApiSlice'
import { useClaimLookupQuery } from '../claims/claimsApiSlice'
import { useUserLookupQuery } from '../users/usersApiSlice'
import { setLastClaim } from '../sessionSlice'

const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2)
}

const Timeslip = () => {
  const currentUser = useAuth()
  const { lastDate, lastClaim } = useSelector((state) => state.session)
  const dispatch = useDispatch()

  const initialValues = {
    date: lastDate,
    timekeeper: currentUser.userId,
    claim: lastClaim,
    hours: 0.5,
    rate: currentUser.userRate,
    description: '',
    billable: true,
    billed: false,
  }

  const [formValues, setFormValues] = useState(initialValues)
  const [editMode, setEditMode] = useState(false)
  const [createTime] = useCreateTimeslipMutation()
  const [updateTime] = useUpdateTimeslipMutation()

  const {
    date,
    timekeeper,
    claim,
    hours,
    rate,
    description,
    billable,
    billed,
  } = formValues

  const navigate = useNavigate()
  let { id } = useParams()
  if (!id) {
    id = undefined
  }

  const { data } = useTimeslipQuery(id)
  const { data: claimlookup } = useClaimLookupQuery()
  const { data: userlookup } = useUserLookupQuery()

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, data])

  const handleInputChange = (event) => {
    let target = event.target
    let name = target.name
    let value = target.type === 'checkbox' ? target.checked : target.value
    setFormValues({ ...formValues, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!date && !timekeeper && !claim && !description && !rate) {
      toast.error('Fields must not be left blank')
    } else {
      if (!editMode) {
        await createTime(formValues)
        dispatch(setLastClaim(formValues.claim))
        navigate(-1)
        toast.success('Time record Added Successfully')
      } else {
        await updateTime(formValues)
        setEditMode(false)
        navigate(-1)
        toast.success('Time record Updated Successfully')
      }
    }
  }

  const handleCancel = async (e) => {
    e.preventDefault()
    setEditMode(!editMode)
    setFormValues({ ...initialValues })
    navigate(-1)
  }

  return (
    <SFixedContainer maxwidth={`${s.md}`}>
      <SForm onSubmit={handleSubmit}>
        <SFormTitle>{editMode ? 'Edit Time' : 'Add Time'}</SFormTitle>
        <SFlexRow>
          <SFlexCol>
            <SFormControl margin='0 2em 0 0'>
              <SLabel htmlFor='date'>Date</SLabel>
              <SInput
                type='date'
                id='date'
                name='date'
                value={format(parseISO(date), 'yyyy-MM-dd')}
                disabled={billed}
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
                disabled={billed}
                onChange={handleInputChange}
                width={'24rem'}
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
              <SLabel htmlFor='hours'>Hours</SLabel>
              <SInput
                type='number'
                id='hours'
                name='hours'
                value={hours}
                disabled={billed}
                onChange={handleInputChange}
                width='4rem'
              />
            </SFormControl>
          </SFlexCol>
        </SFlexRow>
        <SFlexRow>
          <SFlexCol size='1'>
            <SFormControl>
              <SLabel htmlFor='description'>Description</SLabel>
              <STextArea
                rows='2'
                id='description'
                name='description'
                value={description}
                disabled={billed}
                onChange={handleInputChange}
                width='44rem'
              />
            </SFormControl>
          </SFlexCol>
        </SFlexRow>
        {billed ? (
          <div style={{ color: 'red', marginTop: '1rem' }}>
            This timeslip has been billed on invoice {data.invoice.number} and
            can not be edited. Undo billing to edit this timeslip and re-bill if
            necessary.
          </div>
        ) : (
          <SFlexContainer justify='space-around' margin='2rem 1rem'>
            <div>
              <SLabel htmlFor='timekeeper'>Timekeeper</SLabel>
              <SSelect
                id='timekeeper'
                name='timekeeper'
                value={timekeeper}
                disabled={billed}
                onChange={handleInputChange}
                width={'15rem'}
              >
                <option value=''> -- Select a Timekeeper -- </option>
                {userlookup?.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.firstName}
                  </option>
                ))}
              </SSelect>
            </div>
            <div>
              <SLabel htmlFor='rate'>Rate</SLabel>
              <SInput
                type='number'
                id='rate'
                name='rate'
                value={addDecimals(rate)}
                disabled={billed}
                placeholder='required'
                onChange={handleInputChange}
                width='7rem'
                style={{ textAlign: 'right' }}
              />
            </div>

            <SLabel htmlFor='billable'>Billable</SLabel>
            <SInput
              type='checkbox'
              id='billable'
              name='billable'
              value={billable}
              disabled={billed}
              checked={billable}
              onChange={handleInputChange}
              style={{ cursor: 'pointer' }}
              width={`2rem`}
              height={`1.1rem`}
            />

            <input type='hidden' id='billed' name='billed' value={billed} />
          </SFlexContainer>
        )}
        <SFlexContainer>
          <div hidden={billed}>
            <SButton type='submit' margin='.5rem'>
              {editMode ? 'Update' : 'Save'}
            </SButton>
          </div>

          <SButton background='gray' margin='.5rem' onClick={handleCancel}>
            Cancel
          </SButton>
        </SFlexContainer>
      </SForm>
    </SFixedContainer>
  )
}

export default Timeslip
