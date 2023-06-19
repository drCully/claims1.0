import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import useAuth from '../../hooks/useAuth'
import { uiActions } from '../../features/uiSlice'

import Navbar from '../Nav/Navbar'
import Navuser from '../Nav/Navuser'
import {
  SCenter,
  SHeader,
  SHeaderFixed,
  SHeaderHeight,
  SLeft,
  SLogo,
  SLogoLink,
  SBrand,
  SMenu,
  SRight,
} from '../../styles/headerStyles'
import LogoImg from './logo.png'

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userName, isEditor, isAdmin } = useAuth()

  useEffect(() => {
    if (!userName) {
      navigate('/signin')
    }
  }, [userName, navigate])

  const { menuOpen } = useSelector((state) => state.ui)

  const menuToggleHandler = () => {
    dispatch(uiActions.menuToggle())
  }

  const menuCloseHandler = () => {
    if (menuOpen) dispatch(uiActions.menuClose())
  }

  return (
    <>
      <SHeaderHeight />
      <SHeaderFixed>
        <SHeader>
          <SLeft>
            <SLogoLink to='/timesheets' onClick={menuCloseHandler}>
              <SLogo src={LogoImg}></SLogo>
            </SLogoLink>
            <SBrand>
              Claims<b>Manager</b>
            </SBrand>
          </SLeft>
          <SCenter>
            {isEditor ? <Navbar /> : isAdmin ? <Navbar /> : null}
          </SCenter>
          <SRight>{userName ? <Navuser /> : null}</SRight>
        </SHeader>
      </SHeaderFixed>
      <SMenu style={menuOpen ? { left: 0 } : {}}>
        <Navbar menuToggleHandler={menuToggleHandler} />
      </SMenu>
    </>
  )
}

export default Header
