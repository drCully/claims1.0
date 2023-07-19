import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import {
  SFlexCol,
  SFixedContainer,
  SFlexContainer,
} from '../../styles/containerStyles'
import {
  SFormPlain,
  SFormControl2,
  SFormTitle,
  SInput,
  SLabel,
  SSelect,
} from '../../styles/formStyles'
import { SButton } from '../../styles/buttonStyles'
import { useClaimQuery, useUpdateClaimMutation } from './claimsApiSlice'
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

  const [editMode, setEditMode] = useState(false)
  const [updateClaim] = useUpdateClaimMutation()
  const navigate = useNavigate()

  let { id } = useParams()
  const { data: claim, isSuccess } = useClaimQuery(id)
  const { data: userlookup } = useUserLookupQuery()
  const { data: clientlookup } = useClientLookupQuery()

  useEffect(() => {
    if (isSuccess) {
      setFormValues({ ...claim })
    }
  }, [isSuccess])

  const handleInputChange = (event) => {
    let target = event.target
    let name = target.name
    let value = target.type === 'checkbox' ? target.checked : target.value
    setFormValues({ ...formValues, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formValues.name) {
      toast.error('Please provide value into each input field')
    } else {
      if (!editMode) {
        setEditMode(true)
      } else {
        await updateClaim(formValues)
        setEditMode(false)
        toast.success('Claim Updated Successfully')
      }
    }
  }

  const handleCancel = () => {
    if (editMode) {
      setEditMode(false)
    } else {
      setEditMode(false)
      setFormValues({ ...initialValues })
      navigate(-1)
    }
  }

  return (
    <SFormPlain onSubmit={handleSubmit} padding='0'>
      <SFlexContainer justify='space-between' align='start'>
        <SFlexCol>
          <SFormTitle>{editMode ? 'Edit Claim ' : name}</SFormTitle>
          <SFlexContainer wrap='wrap' justify='space-evenly'>
            <SFormControl2 width='7rem'>
              <SLabel htmlFor='number'>Number</SLabel>
              <SInput
                type='text'
                id='number'
                name='number'
                value={number}
                disabled={!editMode}
                onChange={handleInputChange}
                width='100%'
              />
            </SFormControl2>
            <SFormControl2 width='22rem'>
              <SLabel htmlFor='name'>Our Reference</SLabel>
              <SInput
                type='text'
                id='name'
                name='name'
                value={name}
                disabled={!editMode}
                onChange={handleInputChange}
                width='100%'
              />
            </SFormControl2>
            <SFormControl2 width='15rem'>
              <SLabel htmlFor='claimant'>Claimant</SLabel>
              <SInput
                type='text'
                id='claimant'
                name='claimant'
                value={claimant || ''}
                disabled={!editMode}
                onChange={handleInputChange}
                width='100%'
              />
            </SFormControl2>
            <SFormControl2 width='10rem'>
              <SLabel htmlFor='manager'>Manager</SLabel>
              <SSelect
                id='manager'
                name='manager'
                value={manager._id}
                disabled={!editMode}
                onChange={handleInputChange}
                width='100%'
              >
                <option value=''> -- Select Claim Manager -- </option>
                {userlookup?.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.firstName}
                  </option>
                ))}
              </SSelect>
            </SFormControl2>
            <SFormControl2 width='18rem'>
              <SLabel htmlFor='client'>Client</SLabel>
              <SSelect
                type='text'
                id='client'
                name='client'
                value={client._id}
                disabled={!editMode}
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
            </SFormControl2>
            <SFormControl2 width='15rem'>
              <SLabel htmlFor='reference'>Client Reference</SLabel>
              <SInput
                type='text'
                id='reference'
                name='reference'
                value={reference || ''}
                disabled={!editMode}
                onChange={handleInputChange}
                width='100%'
              />
            </SFormControl2>
            <SFormControl2 width='15rem'>
              <SLabel htmlFor='vessel'>Vessel</SLabel>
              <SInput
                type='text'
                id='vessel'
                name='vessel'
                value={vessel || ''}
                disabled={!editMode}
                onChange={handleInputChange}
                width='100%'
              />
            </SFormControl2>
            <SFormControl2 width='10rem'>
              <SLabel htmlFor='dol'>DOL/DOI</SLabel>
              <SInput
                type='Date'
                id='dol'
                name='dol'
                value={format(parseISO(dol), 'yyyy-MM-dd')}
                disabled={!editMode}
                onChange={handleInputChange}
                width='100%'
              />
            </SFormControl2>
            <SFlexContainer>
              <SFormControl2 style={{ marginTop: '1rem' }}>
                <SLabel htmlFor='isActive'>Active?</SLabel>
                <SInput
                  type='checkbox'
                  id='isActive'
                  name='isActive'
                  value={isActive}
                  checked={isActive}
                  disabled={!editMode}
                  onChange={handleInputChange}
                  style={{ cursor: 'pointer' }}
                  width={`2rem`}
                  height={`1.1rem`}
                />
              </SFormControl2>
            </SFlexContainer>
          </SFlexContainer>
        </SFlexCol>
        <SFlexCol>
          <SFixedContainer minwidth='8rem'>
            <SButton type='submit' width='100%' margin='.3rem'>
              {editMode ? 'Save' : 'Edit'}
            </SButton>
            {editMode ? (
              <SButton
                background='gray'
                type='button'
                width='100%'
                margin='.3rem'
                onClick={handleCancel}
              >
                Cancel
              </SButton>
            ) : (
              ''
            )}
            {editMode ? (
              ''
            ) : (
              <SButton
                width='100%'
                margin={'.3rem'}
                background='gray'
                onClick={() => {
                  navigate(-1)
                }}
              >
                Back
              </SButton>
            )}
          </SFixedContainer>
        </SFlexCol>
      </SFlexContainer>
    </SFormPlain>
  )
}

export default Claim
