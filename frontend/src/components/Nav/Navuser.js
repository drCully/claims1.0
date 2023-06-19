import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useSendSignoutMutation } from '../../features/auth/authApiSlice'
import {
  SArrowContainer,
  SArrowIcon,
  SNavLabelContainer,
  SNav,
  SNavLink,
  SNavLinkContainer,
  SProfile,
  SDropdown,
  SProfileLink,
} from '../../styles/navStyles'
import { FaUser } from 'react-icons/fa'

const Navuser = ({ navLinks }) => {
  const { userName } = useAuth()
  const [dropdown, setDropdown] = useState(false)
  const [sendSignout] = useSendSignoutMutation()
  let ref = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (event) => {
      if (dropdown && ref.current && !ref.current.contains(event.target)) {
        setDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [dropdown])

  const onMouseEnter = () => {
    window.innerWidth > 960 && setDropdown(true)
  }

  const onMouseLeave = () => {
    window.innerWidth > 960 && setDropdown(false)
  }

  return (
    <SNav>
      <SProfile
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={(e) => {
          navigate('/profile')
        }}
      >
        <SNavLabelContainer
          role='button'
          aria-expanded={dropdown ? 'true' : 'false'}
          onClick={() => setDropdown((prev) => !prev)}
        >
          <FaUser style={{ marginRight: '10px' }} /> {userName}
          <SArrowContainer isOpen={dropdown}>
            <SArrowIcon />
          </SArrowContainer>
        </SNavLabelContainer>
        <SDropdown top={'38px'} isOpen={dropdown}>
          {navLinks.map((items, index) => (
            <SNavLinkContainer key={index}>
              <SNavLink to={items.link}>{items.label}</SNavLink>
            </SNavLinkContainer>
          ))}
          <SProfileLink onClick={sendSignout}>Sign Out</SProfileLink>
        </SDropdown>
      </SProfile>
    </SNav>
  )
}

Navuser.defaultProps = {
  navLinks: [
    {
      label: 'Profile',
      link: '/profile',
    },
  ],
}

export default Navuser
