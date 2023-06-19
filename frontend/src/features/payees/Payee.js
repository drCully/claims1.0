import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { SFixedContainer, SFlexContainer } from '../../styles/containerStyles'
import {
  SForm,
  SFormControl,
  SFormTitle,
  SInput,
  SLabel,
} from '../../styles/formStyles'
import { SButton } from '../../styles/buttonStyles'
import { s } from '../../styles/variables'
import {
  useCreatePayeeMutation,
  usePayeeQuery,
  useUpdatePayeeMutation,
} from './payeesApiSlice'

const Payee = () => {
  const initialValues = {
    name: '',
    addr1: '',
    addr2: '',
    addr3: '',
    isActive: true,
  }

  const [formValues, setFormValues] = useState(initialValues)
  const [editMode, setEditMode] = useState(false)
  const [createPayee] = useCreatePayeeMutation()
  const [updatePayee] = useUpdatePayeeMutation()

  const navigate = useNavigate()

  let { id } = useParams()
  if (!id) {
    id = ''
  }
  const { data, error } = usePayeeQuery(id)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        await createPayee(formValues)
        navigate('/payees')
        toast.success('Payee Added Successfully')
      } else {
        await updatePayee(formValues)
        setEditMode(false)
        navigate('/payees')
        toast.success('Payee Updated Successfully')
      }
    }
  }

  const handleCancel = (event) => {
    setEditMode(false)
    setFormValues({ ...initialValues })
    navigate('/payees')
  }

  return (
    <SFixedContainer maxwidth={`${s.xsm}`}>
      <SForm onSubmit={handleSubmit}>
        <SFormTitle>{editMode ? 'Edit Payee' : 'Add New Payee'}</SFormTitle>
        <SFormControl>
          <SLabel htmlFor='name'>Name</SLabel>
          <SInput
            type='text'
            id='name'
            name='name'
            value={formValues.name}
            onChange={handleInputChange}
            width='100%'
          />
        </SFormControl>
        <SFormControl>
          <SLabel htmlFor='addr1'>Address Line 1</SLabel>
          <SInput
            type='text'
            id='addr1'
            name='addr1'
            value={formValues.addr1}
            onChange={handleInputChange}
            width='100%'
          />
        </SFormControl>
        <SFormControl>
          <SLabel htmlFor='addr2'>Address Line 2</SLabel>
          <SInput
            type='text'
            id='addr2'
            name='addr2'
            value={formValues.addr2}
            onChange={handleInputChange}
            width='100%'
          />
        </SFormControl>
        <SFormControl>
          <SLabel htmlFor='addr3'>Address Line 3</SLabel>
          <SInput
            type='text'
            id='addr3'
            name='addr3'
            value={formValues.addr3}
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
            value={formValues.isActive}
            checked={formValues.isActive}
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
    </SFixedContainer>
  )
}

export default Payee
