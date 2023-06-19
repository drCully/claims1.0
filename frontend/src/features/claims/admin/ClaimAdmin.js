import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import { s } from '../../../styles/variables'
import {
  SFixedContainer,
  SFlexCol,
  SFlexContainer,
} from '../../../styles/containerStyles'
import {
  SForm,
  SFormControl,
  SFormTitle,
  SInput,
  SLabel,
  SSelect,
} from '../../../styles/formStyles'
import { SButton } from '../../../styles/buttonStyles'
import { SCard } from '../../../styles/cardStyles'

import { ClaimHours } from './ClaimHours'
import { useClaimQuery } from '../claimsApiSlice'
import { useTimeslipsQuery } from '../../timeslips/timeslipsApiSlice'

const ClaimAdmin = () => {
  const navigate = useNavigate()

  let { id } = useParams()
  if (!id) {
    id = ''
  }

  const { data: claim, isLoading, error } = useClaimQuery(id)
  const { data: timeslips } = useTimeslipsQuery(`claim=${id}`, {
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    if (error && id) {
      toast.error('Something went wrong')
    }
  }, [error, id])

  if (isLoading) {
    return <div>Loading...</div>
  }

  const handleEditClaim = (id) => {
    navigate(`/claim/${id}`)
  }

  const handleBack = (event) => {
    navigate('/claims')
  }

  return (
    <SFixedContainer maxwidth={`${s.xxl}`}>
      <SFlexContainer gap='2rem'>
        <SFlexCol size='1'>
          <SCard>
            <h2>Claim Details</h2>
            <p>
              <strong>Number:</strong> {claim.number}
            </p>
            <p>
              <strong>Claim:</strong> {claim.name}
            </p>
            <p>
              <strong>Claimant:</strong> {claim.claimant}
            </p>
            <p>
              <strong>Manager:</strong> {claim.manager.firstname}
            </p>
            <p>
              <strong>Client:</strong> {claim.client.name}
            </p>
            <p>
              <strong>Reference:</strong> {claim.reference}
            </p>
            <p>
              <strong>Vessel:</strong> {claim.vessel}
            </p>
            <p>
              <strong>DOL/DOI:</strong> {claim.dol}
            </p>
            <p>
              <strong>Active?:</strong> {claim.active}
            </p>

            <SFlexContainer>
              <SButton
                type='button'
                margin='.5rem'
                onClick={() => handleEditClaim(claim._id)}
              >
                Edit
              </SButton>

              <SButton
                background='gray'
                type='button'
                margin='.5rem'
                onClick={handleBack}
              >
                Go Back
              </SButton>
            </SFlexContainer>
          </SCard>
        </SFlexCol>

        <SFlexCol size='2'>
          <ClaimHours id={id} />
        </SFlexCol>
      </SFlexContainer>
    </SFixedContainer>
  )
}

export default ClaimAdmin
