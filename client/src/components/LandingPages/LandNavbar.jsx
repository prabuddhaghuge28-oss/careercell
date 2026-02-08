import { useEffect, useState } from 'react';
import Logo from '../../assets/logo.svg';
import { useNavigate } from 'react-router-dom';

function LandingNavbar() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 64) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    setLoading(false);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {
        loading ? (
          <div className="">Loading...</div>
        ) : (
          <>
            <div className={`top-0 sticky z-50 transition-all duration-300 ${isScrolled ? 'backdrop-blur bg-surface/70 shadow-soft' : 'bg-transparent'}`}>
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={Logo}
                      alt="Logo"
                      className="rounded-lg border border-primary-100 w-14 h-14 max-md:w-12 max-md:h-12"
                    />
                  </div>
                  <div className="flex gap-3 items-center">
                    <button
                      className="px-4 py-2 rounded-lg border border-primary-300 text-primary-700 bg-surface hover:bg-primary-50 transition-colors shadow-sm hover:shadow-soft"
                      onClick={() => navigate('student/login')}
                    >
                      Login
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-soft hover:shadow-softLg"
                      onClick={() => navigate('student/signup')}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      }
    </>
  )
}

export default LandingNavbar;
