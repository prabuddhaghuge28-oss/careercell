import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Tailwind CSS classes will replace styled-components
const SidebarLink = ({ to, onClick, active, children, hasSubnav }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`group flex items-center justify-between w-full px-3 h-12 text-primary-900 text-base no-underline transition
      ${active
        ? 'bg-primary-100/80 border-l-4 border-primary-500 font-semibold'
        : 'hover:bg-primary-50 hover:border-l-4 hover:border-primary-300'} rounded-md mx-2 mt-2`}
    aria-current={active ? 'page' : undefined}
  >
    {children}
  </Link>
);

const SidebarLabel = ({ children, className = '' }) => (
  <span className={`ml-3 ${className}`}>{children}</span>
);

const DropdownLink = ({ to, active, children }) => (
  <Link
    to={to}
    className={`flex items-center h-11 pl-8 pr-3 text-primary-900 text-sm no-underline transition mx-2
      ${active
        ? 'bg-primary-100/70 border-l-4 border-primary-500 font-medium rounded-md'
        : 'hover:bg-primary-50 hover:border-l-4 hover:border-primary-300 rounded-md'}`}
    aria-current={active ? 'page' : undefined}
  >
    {children}
  </Link>
);

const SubMenu = ({ item, currentPath }) => {
  const [subnav, setSubnav] = useState(false);

  useEffect(() => {
    if (item.subNav && item.subNav.some(subItem => currentPath.includes(subItem.path))) {
      setSubnav(true);
    } else {
      setSubnav(false);
    }
  }, [currentPath, item.subNav]);

  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <SidebarLink
        to={item.path}
        onClick={item.subNav && showSubnav}
        active={currentPath === item.path}
        hasSubnav={!!item.subNav}  // Pass whether it has subnav
      >
        <div className="flex items-center gap-3">
          <span className={`${currentPath === item.path ? 'bg-primary-600 text-white' : 'bg-primary-50 text-primary-700 group-hover:bg-primary-100 group-hover:text-primary-800'} w-9 h-9 flex items-center justify-center rounded-lg transition`}>
            {item.icon}
          </span>
          <SidebarLabel className={`${currentPath === item.path ? 'text-primary-900' : 'text-primary-900 group-hover:text-primary-900'}`}>
            {item.title}
          </SidebarLabel>
        </div>
        <div>
          {item.subNav && (
            <span className={`transition-transform duration-300 ${subnav ? 'rotate-180' : 'rotate-0'}`}>
              {subnav ? item.iconOpened : item.iconClosed}
            </span>
          )}
        </div>
      </SidebarLink>

      {subnav && (
        <div className="bg-surface-muted/60 border-l border-primary-100 rounded-md mx-2 mb-2">
          {item.subNav.map((subItem, index) => (
            <DropdownLink
              to={subItem.path}
              key={index}
              active={currentPath === subItem.path}
            >
              <span className="text-primary-700 mr-2">{subItem.icon}</span>
              <SidebarLabel>
                {subItem.title}
              </SidebarLabel>
            </DropdownLink>
          ))}
        </div>
      )}
    </>
  );
};

export default SubMenu;
