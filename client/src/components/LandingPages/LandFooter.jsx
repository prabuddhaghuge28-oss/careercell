//import { useNavigate } from 'react-router-dom';

function LandFooter() {
 // const navigate = useNavigate();
  return (
    <>
      <div className="bg-primary-900 text-primary-100">
        <footer className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/logo.svg" alt="CareerCell" className="h-6 w-6" />
                <span className="font-semibold">CareerCell</span>
              </div>
              <p className="text-primary-100/80 text-sm">
                Empowering students and institutions with streamlined placement processes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Explore</h3>
              <ul className="space-y-2 text-sm">
                <li><a className="hover:text-white" href="#home">Home</a></li>
                <li><a className="hover:text-white" href="#about">About</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Follow</h3>
              <div className="flex items-center gap-4 text-xl">
                <a aria-label="GitHub" className="text-primary-100/80 hover:text-white" href="https://github.com" target="_blank" rel="noreferrer">
                  <i className="fa-brands fa-github"></i>
                </a>
                <a aria-label="LinkedIn" className="text-primary-100/80 hover:text-white" href="https://www.linkedin.com" target="_blank" rel="noreferrer">
                  <i className="fa-brands fa-linkedin"></i>
                </a>
                <a aria-label="X" className="text-primary-100/80 hover:text-white" href="https://x.com" target="_blank" rel="noreferrer">
                  <i className="fa-brands fa-x-twitter"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-800 mt-8 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-100/80">
              © {new Date().getFullYear()} CareerCell. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a className="hover:text-white" href="/privacy">Privacy</a>
              <a className="hover:text-white" href="/terms">Terms</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default LandFooter
