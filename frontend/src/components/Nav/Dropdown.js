import MenuItems from './MenuItems'
import { SDropdown } from '../../styles/navStyles'

const Dropdown = ({ submenus, dropdown, depthLevel }) => {
  depthLevel = depthLevel + 1

  return (
    <SDropdown isOpen={dropdown}>
      {submenus.map((submenu, index) => (
        <MenuItems items={submenu} key={index} />
      ))}
    </SDropdown>
  )
}

export default Dropdown
