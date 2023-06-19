import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import { SFlexCol, SFlexContainer } from '../../styles/containerStyles'
import {
  SForm,
  SFormControl,
  SFormTitle,
  SInput,
  SLabel,
  SSelect,
} from '../../styles/formStyles'
import { SButton } from '../../styles/buttonStyles'
import {
  useCreateClaimMutation,
  useClaimQuery,
  useUpdateClaimMutation,
} from './claimsApiSlice'
import { useUserLookupQuery } from '../users/usersApiSlice'
import { useClientLookupQuery } from '../clients/clientsApiSlice'

const Claim = () => {
  const initialValues = {
    number: '',
    name: '',
    claimant: '',
    manager: '',
    client: '',
    reference: '',
    vessel: '',
    dol: format(new Date(), 'yyyy-MM-dd'),
    isActive: true,
  }

  const [formValues, setFormValues] = useState(initialValues)
  const [editMode, setEditMode] = useState(false)
  const [createClaim] = useCreateClaimMutation()
  const [updateClaim] = useUpdateClaimMutation()

  const {
    number,
    name,
    claimant,
    manager,
    client,
    reference,
    vessel,
    dol,
    isActive,
  } = formValues

  const navigate = useNavigate()

  let { id } = useParams()
  if (!id) {
    id = ''
  }
  const { data, error } = useClaimQuery(id)
  const { data: userlookup } = useUserLookupQuery()
  const { data: clientlookup } = useClientLookupQuery()

  useEffect(() => {
    if (userlookup) {
      console.log(userlookup)
    }
  })
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
    let value = target.type === 'checkbox' ? target.checked : target.value
    setFormValues({ ...formValues, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!formValues.name) {
      toast.error('Please provide value into each input field')
    } else {
      if (!editMode) {
        await createClaim(formValues)
        navigate('/claims')
        toast.success('Claim Added Successfully')
      } else {
        await updateClaim(formValues)
        setEditMode(false)
        navigate('/claims')
        toast.success('Claim Updated Successfully')
      }
    }
  }

  const handleCancel = () => {
    setEditMode(false)
    setFormValues({ ...initialValues })
    navigate(-1)
  }

  return (
    <SFlexContainer gap='2rem'>
      <SForm onSubmit={handleSubmit}>
        <SFormTitle>{editMode ? 'Edit Claim' : 'Add New Claim'}</SFormTitle>
        <SFormControl>
          <SLabel htmlFor='number'>Number</SLabel>
          <SInput
            type='text'
            id='number'
            name='number'
            value={number}
            onChange={handleInputChange}
            width='100%'
          />
        </SFormControl>
        <SFormControl>
          <SLabel htmlFor='name'>Name</SLabel>
          <SInput
            type='text'
            id='name'
            name='name'
            value={name}
            onChange={handleInputChange}
            width='100%'
          />
        </SFormControl>
        <SFormControl>
          <SLabel htmlFor='claimant'>Claimant</SLabel>
          <SInput
            type='text'
            id='claimant'
            name='claimant'
            value={claimant}
            onChange={handleInputChange}
            width='100%'
          />
        </SFormControl>
        <SFormControl></SFormControl>
        <SFormControl>
          <SLabel htmlFor='manager'>Manager</SLabel>
          <SSelect
            id='manager'
            name='manager'
            value={manager}
            onChange={handleInputChange}
            width='100%'
          >
            <option value=''> -- Select Claim Manager -- </option>
            {userlookup?.map((user) => (
              <option key={user._id} value={user._id}>
                {user.firstname}
              </option>
            ))}
          </SSelect>
        </SFormControl>
        <SFormControl>
          <SLabel htmlFor='client'>Client</SLabel>
          <SSelect
            type='text'
            id='client'
            name='client'
            value={client}
            onChange={handleInputChange}
            width='100%'
          >
            <option value=''> -- Select Client -- </option>
            {clientlookup?.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </SSelect>
        </SFormControl>
        <SFormControl>
          <SLabel htmlFor='reference'>Reference</SLabel>
          <SInput
            type='text'
            id='reference'
            name='reference'
            value={reference}
            onChange={handleInputChange}
            width='100%'
          />
        </SFormControl>
        <SFormControl>
          <SLabel htmlFor='vessel'>Vessel</SLabel>
          <SInput
            type='text'
            id='vessel'
            name='vessel'
            value={vessel}
            onChange={handleInputChange}
            width='100%'
          />
        </SFormControl>
        <SFormControl>
          <SLabel htmlFor='dol'>DOL/DOI</SLabel>
          <SInput
            type='Date'
            id='dol'
            name='dol'
            value={format(parseISO(dol), 'yyyy-MM-dd')}
            onChange={handleInputChange}
            width='100%'
          />
        </SFormControl>
        <SFormControl style={{ marginTop: '1.1rem' }}>
          <SLabel htmlFor='isActive'>Active?</SLabel>
          <SInput
            type='checkbox'
            id='isActive'
            name='isActive'
            value={isActive}
            checked={isActive}
            onChange={handleInputChange}
            style={{ cursor: 'pointer' }}
            width={`2rem`}
            height={`1.1rem`}
          />
        </SFormControl>

        <SFlexContainer>
          <SButton type='submit' margin='.5rem'>
            {editMode ? 'Update' : 'Save'}
          </SButton>

          <SButton
            background='gray'
            type='button'
            margin='.5rem'
            onClick={handleCancel}
          >
            Cancel
          </SButton>
        </SFlexContainer>
      </SForm>
    </SFlexContainer>
  )
}

export default Claim
