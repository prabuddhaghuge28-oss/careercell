import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import axios from 'axios';
import Logo from '../assets/logo.svg';
import SubMenu from './Submenu';
import { BASE_URL, SERVER_BASE_URL } from '../config/config';

const Sidebar = ({ isSidebarVisible }) => {
  const [sidebar, setSidebar] = useState(isSidebarVisible);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebar(isSidebarVisible);
  }, [isSidebarVisible]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (loadData.role === 'student') navigate('../student/login');
    else if (loadData.role === 'tpo_admin') navigate('../tpo/login');
    else if (loadData.role === 'management_admin') navigate('../management/login');
    else navigate('../login');
  };

  const [loadData, setLoadData] = useState({
    name: 'Not Found',
    email: 'Not Found',
    profile: 'Profile Img',
    role: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${BASE_URL}/user/detail`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        const fullName = [res.data?.first_name, res.data?.middle_name, res.data?.last_name]
          .filter(namePart => namePart && namePart !== 'undefined' && namePart !== 'null')
          .join(' ');

        setLoadData({
          name: fullName || 'Not Found',
          email: res.data.email,
          profile: res.data.profile,
          role: res.data.role,
        });
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          const dataToPass = {
            showToastPass: true,
            toastMessagePass: err.response.data.msg,
          };
          navigate('../', { state: dataToPass });
        }
      });
  }, [navigate]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [SidebarData, setSidebarData] = useState([]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  }

  const fetchSidebarData = async () => {
    if (loadData.role === 'management_admin') {
      const { SidebarData } = await import('./Management/SidebarData');
      setSidebarData(SidebarData);
    } else if (loadData.role === 'tpo_admin') {
      const { SidebarData } = await import('./TPO/SidebarData');
      setSidebarData(SidebarData);
    } else if (loadData.role === 'student') {
      const { SidebarData } = await import('./Students/SidebarData');
      setSidebarData(SidebarData);
    }
  };

  useEffect(() => {
    if (loadData.role) {
      fetchSidebarData();
    }
  }, [loadData.role]);


  return (
    <>
      <nav className={`bg-surface-soft/90 backdrop-blur w-[240px] min-h-screen h-full z-20 flex flex-col fixed top-0 transition-transform duration-300 ${sidebar ? 'translate-x-0' : '-translate-x-full'} shadow-soft navbar-container lg:w-[260px] border-r border-primary-100 rounded-r-2xl`}>
        {/* Main Sidebar Logo and Name */}
        <div className="flex items-center justify-center px-6 py-6 bg-primary-50 border-b border-primary-100">
          <img
            className="rounded-lg shadow-soft cursor-pointer hover:ring-2 hover:ring-primary-300 transition block mx-auto"
            src={Logo}
            alt="Logo Image"
            width="140"
            height="140"
            onClick={() => navigate('/')}
          />
        </div>

        {/* Main body */}
        <div className="flex-grow overflow-y-auto sidebar-content pb-24 [scrollbar-width:thin] [scrollbar-color:theme(colors.primary.300)_transparent]">
          <div className="px-3 pt-4 pb-2 text-sm tracking-wide text-primary-700/80">MENU</div>
          <div className="flex flex-col justify-center w-full pb-2">
            {SidebarData.length > 0 ? (
              SidebarData.map((item, index) => (
                <SubMenu item={item} key={index} currentPath={location.pathname} />
              ))
            ) : (
              <p className="text-center text-primary-700">Loading...</p>
            )}
          </div>
        </div>

        {/* Bottom Menu */}
        <div className="bottom-0 absolute w-full transition-all duration-300">
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className={`w-full rounded-t-xl bg-primary-50 border-t border-primary-100 ${dropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-5'} transition-all duration-200`}>
              {/* Conditional rendering based on role */}
              {loadData.role === 'student' && (
                <Link to={`../student/account`} className="flex items-center rounded-t-md no-underline text-primary-900 p-3 hover:bg-primary-200">
                  <FaCog className="mr-2" /> <span>Account Details</span>
                </Link>
              )}
              {loadData.role === 'tpo_admin' && (
                <Link to={`../tpo/account`} className="flex items-center rounded-t-md no-underline text-primary-900 p-3 hover:bg-primary-200">
                  <FaCog className="mr-2" /> <span>Account Details</span>
                </Link>
              )}
              {loadData.role === 'management_admin' && (
                <Link to={`../management/account`} className="flex items-center rounded-t-md no-underline text-primary-900 p-3 hover:bg-primary-200">
                  <FaCog className="mr-2" /> <span>Account Details</span>
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center rounded-t-md w-full p-3 text-red-700 hover:bg-primary-200">
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          )}

          {/* User Profile */}
          <div className="flex justify-center items-center cursor-pointer bg-primary-50 border-t border-primary-100 hover:bg-primary-100/60 transition" onClick={toggleDropdown}>
            <img src={`${SERVER_BASE_URL}${loadData.profile}`} alt="Profile Img" width="45px" className="mx-2 my-2 rounded-2xl transition-all duration-300 shadow-soft ring-1 ring-primary-200" />
            <div className="w-full">
              <div className="flex flex-col justify-center py-1">
                <h2 className="text-base font-semibold text-primary-900 leading-tight">{loadData.name}</h2>
                <p className="text-sm text-primary-700 truncate">{loadData.email}</p>
              </div>
            </div>
            <div className="px-1">
              <IoIosArrowDropdownCircle size={24} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
