import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../assets/logo.svg';
import Toast from '../../components/Toast';
import isAuthenticated from '../../utility/auth.utility';
import { Button } from 'react-bootstrap';
import { BASE_URL } from '../../config/config';

function Login() {
  document.title = 'CarrerCell | Student Login';
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setLoading] = useState(false);

  const [error, setError] = useState({});

  // if login user visit redirect to home page
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("../student/dashboard");
    }
  }, [navigate]);

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'email') return setError({ ...error, email: '' });
    if (e.target.name === 'password') return setError({ ...error, password: '' });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData?.email && !formData?.password) return setError({ email: 'Email Required!', password: 'Password Required!' })
    if (!formData?.email) return setError({ email: 'Email Required!' })
    if (!formData?.password) return setError({ password: 'Password Required!' })

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/student/login`, formData);
      localStorage.setItem('token', response.data.token);
      navigate('../student/dashboard');
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
      console.log("Error in Student login.jsx => ", error);
      setLoading(false);
    }
  }

  // if user came from signup page then this toast appears
  const { showToastPass, toastMessagePass } = location.state || { showToastPass: false, toastMessagePass: '' };
  useEffect(() => {
    if (showToastPass) {
      setToastMessage(toastMessagePass);
      setShowToast(showToastPass);
      // Clear the state after the toast is shown
      navigate('.', { replace: true, state: {} });
    }
  }, []);

  // toggle eye
  const [isEyeOpen, setEyeOpen] = useState(false);

  const handleEye = () => {
    setEyeOpen(!isEyeOpen);
  }

  return (
    <>
      {/* for any message "toast" */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-primary-50 via-surface-soft to-primary-100">
        <div className="absolute -z-10 inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-300/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-16 w-96 h-96 bg-accent-300/30 rounded-full blur-3xl"></div>
        </div>

        <form className="form-signin flex justify-center items-center flex-col gap-4 backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl p-8 md:p-10 shadow-soft w-[92%] sm:w-[80%] md:w-[500px]" onSubmit={handleSubmit}>
          <div className='flex justify-center items-center flex-col text-center'>
            <img className="mb-4 rounded-xl shadow w-24 h-24 md:w-28 md:h-28 cursor-pointer" src={`${Logo}`} alt="Logo Image" onClick={() => navigate('/')} />
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Student Login</h1>
            <p className="text-sm text-gray-500 mt-1">Access your dashboard to manage placements</p>
          </div>

          <div className="flex flex-col justify-center w-full">
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <input type="email" id="inputEmail" className="form-control ml-1 bg-white/80 focus:bg-white focus:ring-2 focus:ring-primary-300 rounded-md" placeholder="Email address" autoFocus="" fdprocessedid="gwlj3s" autoComplete='email' name='email' value={email} onChange={handleChange} />
            {/* error for email  */}
            {<div className='text-red-500 ml-2 text-left'>
              {error?.email}
            </div>}
          </div>

          <div className="w-full">
            <div className="flex justify-center items-center w-full">
              <label htmlFor="inputPassword" className="sr-only">Password</label>
              <input type={`${isEyeOpen ? "text" : "password"}`} id="inputPassword" className="form-control bg-white/80 focus:bg-white focus:ring-2 focus:ring-primary-300 rounded-md" placeholder="Password" fdprocessedid="9sysne" autoComplete='current-password' name='password' value={password} onChange={handleChange} />
              <i className={`${isEyeOpen ? "fa-solid fa-eye" : "fa-regular fa-eye-slash"} -ml-7 text-gray-500 hover:text-gray-700 cursor-pointer`} onClick={handleEye}></i>
            </div>
            {/* error for password */}
            {<div className='text-red-500 text-left ml-2'>
              {error?.password}
            </div>}
          </div>

          <div className="flex justify-between items-center w-full text-sm text-gray-600">
            <span></span>
            <span className="cursor-pointer hover:text-primary-700">Forgot password?</span>
          </div>

          <div className="flex justify-center items-center flex-col w-full">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full py-2 md:py-2.5 rounded-md shadow hover:shadow-md transition-shadow"
            >
              {isLoading ? 'Loading...' : 'Log In'}
            </Button>
          </div>
          <span className='text-center text-sm text-gray-600'>Don't have an account?
            <span className='text-primary-700 font-semibold cursor-pointer px-1 hover:underline' onClick={() => navigate('../student/signup')}>
              Create new account
            </span>
          </span>
        </form>
      </div>
    </>
  )
}

export default Login
