import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/logo.svg';
import Toast from '../components/Toast';
import isAuthenticated from '../utility/auth.utility';
import { Button } from 'react-bootstrap';
import { BASE_URL } from '../config/config';

const roleToPath = {
  student: '/student/dashboard',
  tpo_admin: '/tpo/dashboard',
  management_admin: '/management/dashboard'
};

function LoginUnified() {
  document.title = 'CareerCell | Login';
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      // attempt to redirect based on token role if available
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const role = payload.role || null;
          if (role && roleToPath[role]) return navigate(roleToPath[role]);
        }
      } catch (err) {
        // ignore
      }
    }
  }, [navigate]);

  const [formData, setFormData] = useState({ email: '', password: '', role: 'student' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'email') return setError({ ...error, email: '' });
    if (e.target.name === 'password') return setError({ ...error, password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email && !formData.password) return setError({ email: 'Email Required!', password: 'Password Required!' });
    if (!formData.email) return setError({ email: 'Email Required!' });
    if (!formData.password) return setError({ password: 'Password Required!' });

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/user/login`, { email: formData.email.trim(), password: formData.password });
      const { token, role, isApproved } = response.data;
      localStorage.setItem('token', token);

      // If returned role differs from selected role, inform user briefly
      if (role && role !== formData.role) {
        setToastMessage(`Logged in as ${role}. Redirecting...`);
        setShowToast(true);
      }

      // If student logged in but not approved yet, notify them (but still allow access)
      if (role === 'student' && isApproved === false) {
        setToastMessage('Logged in. Your account is pending TPO approval — some features may be restricted.');
        setShowToast(true);
      }

      const dest = roleToPath[role] || '/';
      navigate(dest);
    } catch (err) {
      const msg = err?.response?.data?.msg || 'Login failed!';
      setToastMessage(msg);
      setShowToast(true);
      setLoading(false);
    }
  };

  return (
    <>
      <Toast show={showToast} onClose={() => setShowToast(false)} message={toastMessage} delay={3000} position="bottom-end" />

      <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-primary-50 via-surface-soft to-primary-100">
        <div className="absolute -z-10 inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-300/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-16 w-96 h-96 bg-accent-300/30 rounded-full blur-3xl"></div>
        </div>

        <form className="form-signin flex justify-center items-center flex-col gap-4 backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl p-8 md:p-10 shadow-soft w-[92%] sm:w-[80%] md:w-[500px]" onSubmit={handleSubmit}>
          <div className='flex justify-center items-center flex-col text-center'>
            <img className="mb-4 rounded-xl shadow w-24 h-24 md:w-28 md:h-28 cursor-pointer" src={`${Logo}`} alt="Logo Image" onClick={() => navigate('/')} />
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Unified Login</h1>
            <p className="text-sm text-gray-500 mt-1">Choose your role and sign in</p>
          </div>

          <div className="w-full">
            <label className="text-sm text-gray-600 mb-1">Login as</label>
            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                aria-label="Select role"
                aria-haspopup="listbox"
                className="form-control ml-1 bg-white/90 focus:bg-white focus:ring-2 focus:ring-primary-300 rounded-md p-2 pr-10 appearance-none cursor-pointer"
              >
                <option value="student">Student</option>
                <option value="tpo_admin">TPO Admin</option>
                <option value="management_admin">Management Admin</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </div>

          <div className="w-full">
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <input type="email" id="inputEmail" className="form-control ml-1 bg-white/80 focus:bg-white focus:ring-2 focus:ring-primary-300 rounded-md" placeholder="Email address" autoFocus autoComplete='email' name='email' value={formData.email} onChange={handleChange} />
            {<div className='text-red-500 ml-2 text-left'>{error?.email}</div>}
          </div>

          <div className="w-full">
            <div className="relative w-full">
              <label htmlFor="inputPassword" className="sr-only">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="inputPassword"
                className="form-control bg-white/80 focus:bg-white focus:ring-2 focus:ring-primary-300 rounded-md pr-10"
                placeholder="Password"
                autoComplete='current-password'
                name='password'
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 p-1"
              >
                {showPassword ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-4.97 0-9.19-3.11-10-7 1.53-4.95 6.17-8 10-8 1.67 0 3.23.36 4.65 1.02" />
                      <path d="M1 1l22 22" />
                    </svg>
                    <span className="sr-only">Hide password</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span className="sr-only">Show password</span>
                  </>
                )}
              </button>
            </div>
            {<div className='text-red-500 text-left ml-2'>{error?.password}</div>}
          </div>

          <div className="flex justify-between items-center w-full text-sm text-gray-600">
            <span></span>
            <span className="cursor-pointer hover:text-primary-700">Forgot password?</span>
          </div>

          <div className="flex justify-center items-center flex-col w-full">
            <Button type="submit" variant="primary" disabled={isLoading} className="w-full py-2 md:py-2.5 rounded-md shadow hover:shadow-md transition-shadow">
              {isLoading ? 'Loading...' : 'Log In'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginUnified;
