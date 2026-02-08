import About1 from '../../assets/aboutImg1.jpg';
import About2 from '../../assets/aboutImg2.jpg';
import About3 from '../../assets/aboutImg3.jpg';

function LandAbout() {
  return (
    <>
      <div id='about' className="bg-surface-soft py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className='text-3xl md:text-4xl font-semibold text-primary-900'>About Us</h1>
          <p className="text-primary-700 mt-2 max-w-3xl">Empowering students and admins with a streamlined placement management experience.</p>
          <div className="min-h-96 mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className='bg-surface rounded-2xl border border-primary-100 shadow-soft hover:shadow-softLg transition-shadow p-5 text-center hover:-translate-y-0.5 will-change-transform'>
              <div className="flex justify-center flex-col items-center gap-3">
                <img src={`${About2}`} alt="Placement management" className='w-56 md:w-64 border border-primary-100 rounded-xl shadow-sm' />
                <span className='text-primary-900'>CareerCell – YCC Official Placement Management System. 
                  CareerCell manages and organizes all student placement-related information at YCC, helping students and faculty maintain structured and updated placement records.</span>
              </div>
            </div>
            <div className='bg-surface rounded-2xl border border-primary-100 shadow-soft hover:shadow-softLg transition-all p-5 text-center hover:-translate-y-0.5'>
              <h3 className='py-1 text-primary-800 font-medium'>Get Placement</h3>
              <div className="flex justify-center flex-col items-center gap-3">
                <img src={`${About1}`} alt="Web app information" className='w-56 md:w-64 border border-primary-100 rounded-xl shadow-sm' />
                <span className='text-primary-900'>CareerCell connects YCC students with top recruiters.
CareerCell is a web-based platform that provides real-time updates on placement drives, company details, eligibility criteria, and student shortlisting. It ensures that students stay informed and ready for upcoming opportunities.</span>
              </div>
            </div>
            <div className='bg-surface rounded-2xl border border-primary-100 shadow-soft hover:shadow-softLg transition-all p-5 text-center hover:-translate-y-0.5'>
              <div className="flex justify-center flex-col items-center gap-3">
                <img src={`${About3}`} alt="Access control" className='w-56 md:w-64 border border-primary-100 rounded-xl shadow-sm' />
                <span className='text-primary-900'>Secure Access for Students and Faculties
CareerCell can be accessed by all YCC students and staff using a secure login. It ensures smooth communication, easy registration for placement drives, and transparent recruitment processes within the college.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LandAbout
