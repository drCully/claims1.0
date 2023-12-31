import MenuItems from './MenuItems'
import { SNav } from '../../styles/navStyles'

const Navbar = ({ navLinks }) => {
  return (
    <SNav>
      {navLinks.map((menu, index) => {
        const depthLevel = 0
        return <MenuItems items={menu} key={index} depthLevel={depthLevel} />
      })}
    </SNav>
  )
}

Navbar.defaultProps = {
  navLinks: [
    {
      label: 'Claims',
      link: '/claims',
      submenu: [
        {
          label: 'Claims List',
          link: '/claims',
        },
        {
          label: 'Disbursements',
          link: '/checks',
        },
        {
          label: 'Billing',
          link: '/billings',
        },
      ],
    },
    {
      label: 'Time',
      link: '/timeslips',
      submenu: null,
    },
    {
      label: 'Charges',
      link: '/charges',
      tree: null,
    },

    {
      label: 'More',
      link: null,
      submenu: [
        {
          label: 'Clients',
          link: '/clients',
        },
        {
          label: 'Payees',
          link: '/payees',
        },
        {
          label: 'Users',
          link: '/users',
        },
      ],
    },
  ],
}
export default Navbar
