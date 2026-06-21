// src/components/layout/BottomNav.jsx
import { NavLink } from "react-router-dom";
import Icon from "../common/Icon.jsx";
import { ICONS } from "../../constants/icons.js";

const ITEMS = [
  { to: "/dashboard", label: "Home", icon: ICONS.home },
  { to: "/classrooms", label: "Classes", icon: ICONS.classes },
  { to: "/assignments", label: "Tasks", icon: ICONS.tasks },
  { to: "/attendance", label: "Attend", icon: ICONS.attend },
  { to: "/profile", label: "Profile", icon: ICONS.profile },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
        >
          <Icon d={item.icon} size={20} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
