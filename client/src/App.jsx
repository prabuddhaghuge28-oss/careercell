import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation, useNavigate } from "react-router-dom";
// Landing Page 
// import LandingPage from "./pages/LandingPage";
const LandingPage = lazy(() => import('./pages/LandingPage.jsx'))

// Student Pages 
const Login = lazy(() => import("./pages/students/Login.jsx"));
const Signup = lazy(() => import("./pages/students/Signup.jsx"));
const HomeStudent = lazy(() => import('./pages/students/Home.jsx'));
const UpdatePlacementProfile = lazy(() => import("./components/Students/UpdatePlacementProfile.jsx"));
const AddInternship = lazy(() => import("./components/Students/AddInternship.jsx"));
const MyAppliedJobs = lazy(() => import("./components/Students/MyApplied.jsx"));
// TPO pages
const LoginTPO = lazy(() => import("./pages/TPO/Login.jsx"));
const HomeTPO = lazy(() => import('./pages/TPO/Home.jsx'));
const StudentAccYearTPO = lazy(() => import("./components/TPO/StudentYearAndBranchView.jsx"));
const PostJobTPO = lazy(() => import("./components/TPO/PostJob.jsx"));
const AddNewUser = lazy(() => import("./components/Management/AddNewUser.jsx"));
const AddCompany = lazy(() => import("./components/TPO/AddCompany.jsx"));
// Management pages
const HomeManagement = lazy(() => import('./pages/Management/Home.jsx'));
const LoginManagement = lazy(() => import("./pages/Management/Login.jsx"));
const ListAllTPO = lazy(() => import("./components/Management/ListAllTPO.jsx"));
const ApproveStudent = lazy(() => import("./components/ApproveStudent.jsx"));

// common users
// for admin, tpo to edit or view user details 
const Navbar = lazy(() => import('./components/Navbar.jsx'));
const Sidebar = lazy(() => import('./components/Sidebar.jsx'));
const Footer = lazy(() => import("./components/Footer.jsx"));
const Account = lazy(() => import("./components/Account.jsx"));
const UserDetails = lazy(() => import("./components/UserDetails.jsx"));
const ViewJobPost = lazy(() => import("./components/ViewJobPost.jsx"));
const ViewUserData = lazy(() => import("./components/ViewUserData.jsx"));
const AllJobPost = lazy(() => import("./components/AllJobPost.jsx"));
const AllCompany = lazy(() => import("./components/AllCompany.jsx"));
const ViewAllInternship = lazy(() => import("./components/ViewAllInternship.jsx"));
const SendNotice = lazy(() => import("./components/SendNotice.jsx"));
const ViewAllNotice = lazy(() => import("./pages/ViewAllNotice.jsx"));
const ViewNotice = lazy(() => import("./components/ViewNotice.jsx"));

// Page not found 
const PageNotFound = lazy(() => import("./pages/PageNotFound.jsx"));
// breadcrumb
const BreadcrumbExp = lazy(() => import("./components/Breadcrumb.jsx"));
// css
import './style/index.css';

const ProtectedRoute = lazy(() => import("./components/protectedRoute.jsx"));
// Unified login page
const LoginUnified = lazy(() => import('./pages/LoginUnified.jsx'));
import { UserProvider } from "./context/userContext.jsx";


function Layout({ header }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Get sidebar state from localStorage or default to false
  const isSidebarOpenFromStorage = localStorage.getItem('isSidebarOpen') === 'true';

  useEffect(() => {
    const checkScreenWidth = () => {
      const mediaQuery = window.matchMedia('(max-width: 950px)').matches;
      if (mediaQuery) {
        localStorage.setItem('isSidebarOpen', false); // Adjust this to update the state in your context or component
        setSidebarVisible(false);
      }
    };
    // Listen for location changes
    checkScreenWidth(); // Check immediately when component mounts
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, [location.pathname, navigate]);


  // State to control sidebar visibility
  const [isSidebarVisible, setSidebarVisible] = useState(isSidebarOpenFromStorage);


  // Toggle sidebar visibility and update localStorage
  const toggleSidebar = () => {
    const newState = !isSidebarVisible;
    setSidebarVisible(newState);
    localStorage.setItem('isSidebarOpen', newState);
  };

  useEffect(() => {
    // Ensure localStorage has a default value on initial load
    if (localStorage.getItem('isSidebarOpen') === null) localStorage.setItem('isSidebarOpen', 'false');
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar isSidebarVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />
        <div className="flex flex-grow">
          <Sidebar isSidebarVisible={isSidebarVisible} />
          <div className={`content flex-grow p-4 transition-all duration-300 ${isSidebarVisible ? 'md:ml-64' : 'ml-0'}`}>
            <BreadcrumbExp header={header} />
            <div className="mt-4 animate-fadeIn">
              <Outlet />
            </div>
          </div>
        </div>
        <Footer isSidebarVisible={isSidebarVisible} />
      </div>
    </>
  );
}


function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            {/* Public Route  */}
            <Route index element={<LandingPage />} />
            {/* Student Login, Sign Up  */}
            <Route path="/student/login" element={<LoginUnified />} />
            <Route path="/student/signup" element={<Signup />} />
            {/* TPO Login  */}
            <Route path="/tpo/login" element={<LoginUnified />} />
            {/* Management Login  */}
            <Route path="/management/login" element={<LoginUnified />} />
            <Route path="/login" element={<LoginUnified />} />


            {/* All student routes  */}
            <Route element={<UserProvider><ProtectedRoute allowedRoles={['student']} /></UserProvider>}>

              <Route path="/student/complete-profile/:userId" element={<UserDetails />} />

              <Route element={<Layout header="Dashboard" />}>
                <Route path="/student/dashboard" element={<HomeStudent />} />
              </Route>
              <Route element={<Layout header="Account Details" />}>
                <Route path="/student/account" element={<Account />} />
              </Route>
              <Route element={<Layout header="Placement Listings" />}>
                <Route path="/student/job-listings" element={<AllJobPost />} />
              </Route>
              {/* view a job post */}
              <Route element={<Layout header="Job Listing" />}>
                <Route path="/student/job/:jobId" element={<ViewJobPost />} />
              </Route>
              {/* my applied jobs */}
              <Route element={<Layout header="Applied Jobs" />}>
                <Route path="/student/myjob" element={<MyAppliedJobs />} />
              </Route>
              {/* placement profile update */}
              <Route element={<Layout header="Placement Profile" />}>
                <Route path="/student/placement-profile" element={<UpdatePlacementProfile />} />
              </Route>
              {/* update status of job - removed for students (students can only apply/reject) */}
              {/* view all internships */}
              <Route element={<Layout header="My Internships" />}>
                <Route path="/student/internship" element={<ViewAllInternship />} />
              </Route>
              {/* add internships */}
              <Route element={<Layout header="Add New Internship" />}>
                <Route path="/student/add-internship" element={<AddInternship />} />
              </Route>
              {/* add internships */}
              <Route element={<Layout header="Update Internship Details" />}>
                <Route path="/student/add-internship/:internshipId" element={<AddInternship />} />
              </Route>
              {/* view notice */}
              <Route element={<Layout header="Notice" />}>
                <Route path="/student/notice/:noticeId" element={<ViewNotice />} />
              </Route>
              
              {/* all notice */}
              <Route element={<Layout header="All Notices" />}>
                <Route path="/student/all-notice" element={<ViewAllNotice />} />
              </Route>
            </Route>


            {/* All tpo routes  */}
            <Route element={<UserProvider><ProtectedRoute allowedRoles={['tpo_admin']} /></UserProvider>}>
              <Route path="/tpo/complete-profile/:userId" element={<UserDetails />} />
              <Route element={<Layout header="Dashboard" />}>
                <Route path="/tpo/dashboard" element={<HomeTPO />} />
              </Route>
              <Route element={<Layout header="Account Details" />}>
                <Route path="/tpo/account" element={<Account />} />
              </Route>
              <Route element={<Layout header="Students" />}>
                <Route path="/tpo/students" element={<StudentAccYearTPO />} />
              </Route>
              <Route element={<Layout header="Approve Student User" />}>
                <Route path="/tpo/approve-student" element={<ApproveStudent />} />
              </Route>
              {/* to view student data  */}
              <Route element={<Layout header="User Details" />}>
                <Route path="/tpo/user/:userId" element={<ViewUserData />} />
              </Route>
              {/* post jobs */}
              <Route element={<Layout header="Post New Job" />}>
                <Route path="/tpo/post-job" element={<PostJobTPO />} />
              </Route>
              {/* edit post jobs */}
              <Route element={<Layout header="Edit Job Detail" />}>
                <Route path="/tpo/post-job/:jobId" element={<PostJobTPO />} />
              </Route>
              {/* all jobs post */}
              <Route element={<Layout header="Placement Listings" />}>
                <Route path="/tpo/job-listings" element={<AllJobPost />} />
              </Route>
              {/* view a job post */}
              <Route element={<Layout header="Job Listing" />}>
                <Route path="/tpo/job/:jobId" element={<ViewJobPost />} />
              </Route>
              {/* all company */}
              <Route element={<Layout header="All Companys" />}>
                <Route path="/tpo/companys" element={<AllCompany />} />
              </Route>
              {/* add company */}
              <Route element={<Layout header="Add Company Detail" />}>
                <Route path="/tpo/add-company" element={<AddCompany />} />
              </Route>
              {/* update particular company */}
              <Route element={<Layout header="Edit Company Detail" />}>
                <Route path="/tpo/add-company/:companyId" element={<AddCompany />} />
              </Route>
              {/* all notice */}
              <Route element={<Layout header="All Notices" />}>
                <Route path="/tpo/all-notice" element={<ViewAllNotice />} />
              </Route>
              {/* view notice */}
              <Route element={<Layout header="Notice" />}>
                <Route path="/tpo/notice/:noticeId" element={<ViewNotice />} />
              </Route>
              {/* send notice */}
              <Route element={<Layout header="Send Notice" />}>
                <Route path="/tpo/send-notice" element={<SendNotice />} />
              </Route>
            </Route>


            {/* All management routes  */}
            <Route element={<UserProvider><ProtectedRoute allowedRoles={['management_admin']} /></UserProvider>}>

              <Route path="/management/complete-profile/:userId" element={<UserDetails />} />

              <Route element={<Layout header="Dashboard" />}>
                <Route path="/management/dashboard" element={<HomeManagement />} />
              </Route>
              <Route element={<Layout header="Account Details" />}>
                <Route path="/management/account" element={<Account />} />
              </Route>
              {/* list all tpo  */}
              <Route element={<Layout header="TPO Admins" />}>
                <Route path="/management/tpo-admin" element={<ListAllTPO />} />
              </Route>
              {/* add new tpo */}
              <Route element={<Layout header="Create New TPO Admin" />}>
                <Route path="/management/add-tpo-admin" element={<AddNewUser />} />
              </Route>
              <Route element={<Layout header="Approve Student User" />}>
                <Route path="/management/approve-student" element={<ApproveStudent />} />
              </Route>
              {/* all student  */}
              <Route element={<Layout header="Students" />}>
                <Route path="/management/students" element={<StudentAccYearTPO />} />
              </Route>
              {/* to view student data  */}
              <Route element={<Layout header="User" />}>
                <Route path="/management/user/:userId" element={<ViewUserData />} />
              </Route>
              {/* Management: show job listings for management users */}
              <Route element={<Layout header="Placement Listings" />}>
                <Route path="/management" element={<AllJobPost />} />
                <Route path="/management/job-listings" element={<AllJobPost />} />
              </Route>
              <Route element={<Layout header="Job Listing" />}>
                <Route path="/management/job/:jobId" element={<ViewJobPost />} />
              </Route>
              {/* all notice */}
              <Route element={<Layout header="All Notices" />}>
                <Route path="/management/all-notice" element={<ViewAllNotice />} />
              </Route>
              {/* view notice */}
              <Route element={<Layout header="Notice" />}>
                <Route path="/management/notice/:noticeId" element={<ViewNotice />} />
              </Route>
              {/* send notice */}
              <Route element={<Layout header="Send Notice" />}>
                <Route path="/management/send-notice" element={<SendNotice />} />
              </Route>
            </Route>



            {/* 404 page not found route */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
