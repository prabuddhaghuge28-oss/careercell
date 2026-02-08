import React, { useEffect, useState } from 'react'
import Accordion from 'react-bootstrap/Accordion';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Toast from './Toast';
import Button from 'react-bootstrap/Button';
import ModalBox from './Modal';
import { BASE_URL } from '../config/config';


function ViewJobPost() {
  document.title = 'CarrerCell | View Job Post';
  const { jobId } = useParams();

  const [data, setData] = useState({});
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');


  // useState for load data
  const [currentUser, setCurrentUser] = useState({});


  // check applied to a job
  const [applied, setApplied] = useState(false);

  const [applicant, setApplicant] = useState([]);

  // check applied to a job
  const fetchApplied = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/student/check-applied/${jobId}/${currentUser.id}`);
      // console.log(response.data);
      if (response?.data?.applied) {
        setApplied(response?.data?.applied)
      }
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
      console.log("error while fetching student applied or not => ", error);
    }
  }

  // checking for authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${BASE_URL}/user/detail`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setCurrentUser({
          id: res.data.id,
          email: res.data.email,
          role: res.data.role,
        });
      })
      .catch(err => {
        console.log("AddUserTable.jsx => ", err);
        setToastMessage(err);
        setShowToast(true);
      });
  }, []);

  const fetchJobDetail = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      )
      setData(response.data);
    } catch (error) {
      if (error.response) {
        if (error?.response.data?.msg) setToastMessage(error.response.data.msg)
        else setToastMessage(error.message)
        setShowToast(true);

        if (error?.response?.data?.msg === "job data not found") navigate('../404');
      }
      console.log("Error while fetching details => ", error);
    }
  }

  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/company/company-data?companyId=${data.company}`);
      setCompany(response.data.company);
    } catch (error) {
      console.log("AddCompany error while fetching => ", error);
    }
  }

  // handle apply and its modal
  const [showModal, setShowModal] = useState(false);
  const [modalBody, setModalBody] = useState();
  const [confirmAction, setConfirmAction] = useState(() => () => { });
  const [modalBtnText, setModalBtnText] = useState('Apply');

  const closeModal = () => {
    setShowModal(false);
  };

  const handleApply = () => {
    setModalBody("Do you really want to apply this job? Make sure your profile is updated to lastest that increase placement chances.");
    setModalBtnText('Apply');
    setConfirmAction(() => handleConfirmApply);
    setShowModal(true);
    // console.log(currentUser)
  }

  const handleConfirmApply = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/student/job/${jobId}/${currentUser.id}`);
      // console.log(response.data);
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
      setShowModal(false);
      fetchApplied();
      // setCompany(response.data.company);
    } catch (error) {
      setShowModal(false);
      if (error?.response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
      console.log("error while fetching apply to job => ", error);
    }
  }

  const handleReject = () => {
    setModalBody("Do you really want to withdraw your application for this job? This action will remove your application.");
    setModalBtnText('Reject');
    setConfirmAction(() => handleConfirmReject);
    setShowModal(true);
  }

  const handleConfirmReject = async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/student/job/${jobId}/${currentUser.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
      setShowModal(false);
      setApplied(false);
    } catch (error) {
      setShowModal(false);
      if (error?.response?.data?.msg) {
        setToastMessage(error?.response?.data?.msg);
        setShowToast(true);
      }
      console.log("error while withdrawing application => ", error);
    }
  }

  const fetchApplicant = async () => {
    if (!jobId || currentUser?.role === 'student') return;
    await axios.get(`${BASE_URL}/tpo/job/applicants/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (res?.data?.msg) setToastMessage(res.data.msg)
        else setApplicant(res?.data?.applicantsList);
      })
      .catch(err => {
        console.log(err);
        if (err?.response?.data?.msg) setToastMessage(err.response.data.msg)
      })
  }

  const handleExportCSV = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/job/applicants/${jobId}/export`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `applicants_job_${jobId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log('Error exporting CSV => ', error);
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      } else {
        setToastMessage('Failed to export CSV');
        setShowToast(true);
      }
    }
  }

  const updateApplicantStatus = async (studentId, uiStatus) => {
    // map UI labels to backend values
    const map = {
      'Applied': 'applied',
      'Shortlisted': 'interview',
      'Selected': 'selected',
      'Rejected': 'rejected'
    };
    const statusValue = map[uiStatus] || 'applied';
    try {
      const response = await axios.post(`${BASE_URL}/tpo/job/update-status/${jobId}/${studentId}`, { applicant: { status: statusValue } }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response?.data?.msg) {
        setToastMessage(response.data.msg);
        setShowToast(true);
      }

      // update UI
      setApplicant(prev => prev.map(a => a.id === studentId ? { ...a, status: statusValue } : a));
    } catch (error) {
      console.log('Error updating applicant status => ', error);
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      } else {
        setToastMessage('Failed to update status');
        setShowToast(true);
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchApplied();
        if (data?.company) {
          await fetchCompanyData();
        }
        if (currentUser.id) {
          await fetchJobDetail();
        }
        if (jobId)
          await fetchApplicant();
      } catch (error) {
        console.error("Error during fetching and applying job:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [currentUser.id, data?.company, jobId]);



  return (
    <>
      {/*  any message here  */}
      < Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      {
        loading ? (
          <div className="flex justify-center h-72 items-center">
            <i className="fa-solid fa-spinner fa-spin text-3xl" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 my-6 text-base max-sm:text-sm max-sm:grid-cols-1">
              <div className="flex flex-col grid-flow-row-dense gap-2">

                <div className="">
                  {/* Company Details  */}
                  <Accordion defaultActiveKey={['0']} alwaysOpen className='shadow rounded'>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Company Details</Accordion.Header>
                      <Accordion.Body>
                        <div className="">
                          {/* company name  */}
                          <h3 className='text-3xl text-center border-b-2 py-4 mb-4'>
                            {company?.companyName}
                          </h3>
                          <div className="border-b-2 px-2 pb-4 text-gray-500 text-justify leading-5">
                            {company?.companyDescription}
                          </div>
                          <div className="flex justify-between p-2 border-b-2 my-2">
                            {/* company website  */}
                            <span>Website</span>
                            <span className='bg-blue-500 py-1 px-2 text-white rounded cursor-pointer'>
                              <a
                                href={`${company?.companyWebsite}`}
                                target='_blanck'
                                className='no-underline text-white'
                              >
                                {company?.companyWebsite}
                              </a>
                            </span>
                          </div>
                          <div className="flex justify-between p-2 border-b-2 my-2">
                            {/* company location  */}
                            <span>Job Locations</span>
                            <div className="flex gap-2">
                              {company?.companyLocation?.split(',').map((location, index) => (
                                <span key={index} className='bg-blue-500 py-1 px-2 text-white rounded'>
                                  {location.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-between p-2 border-b-2 my-2">
                            {/* company difficulty  */}
                            <span>Difficulty Level</span>
                            {
                              company?.companyDifficulty === "Easy" &&
                              <span className='bg-green-500 py-1 px-2 text-white rounded'>
                                {company?.companyDifficulty}
                              </span>
                            }
                            {
                              company?.companyDifficulty === "Moderate" &&
                              <span className='bg-orange-500 py-1 px-2 text-white rounded'>
                                {company?.companyDifficulty}
                              </span>
                            }
                            {
                              company?.companyDifficulty === "Hard" &&
                              <span className='bg-red-500 py-1 px-2 text-white rounded'>
                                {company?.companyDifficulty}
                              </span>
                            }
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>

                {
                  currentUser.role !== "student" && (
                    <>
                      {/* pending */}
                      <div className="">
                        {/* Applicants applied */}
                        <Accordion defaultActiveKey={['3']} alwaysOpen className='shadow rounded'>
                          <Accordion.Item eventKey="3">
                            <Accordion.Header>Applicants Applied</Accordion.Header>
                            <Accordion.Body>
                                <div className="flex justify-end mb-2">
                                  <Button variant="info" size="sm" onClick={handleExportCSV}>
                                    <i className="fa-solid fa-file-csv mr-2" />
                                    Export CSV
                                  </Button>
                                </div>
                              <div className="overflow-x-auto">
                                <Table striped bordered hover size='sm' className='text-center min-w-full'>
                                  <thead>
                                    <tr>
                                      <th style={{ width: '10%' }}>#</th>
                                      <th style={{ width: '30%' }}>Name</th>
                                      <th style={{ width: '30%' }}>Email</th>
                                      <th style={{ width: '30%' }}>Applied On</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {
                                      applicant?.length > 0 ? (
                                        <>
                                          {
                                            applicant.map((app, index) => (
                                              <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                  {
                                                    (currentUser.role === 'tpo_admin' ||
                                                      currentUser.role === 'management_admin') && (
                                                      <Link
                                                        to={
                                                          currentUser.role === 'tpo_admin'
                                                            ? `/tpo/user/${app.id}`
                                                            : currentUser.role === 'management_admin'
                                                              ? `/management/user/${app.id}`
                                                              : '#'
                                                        }
                                                        target='_blank'
                                                        className='text-blue-500 no-underline hover:text-blue-700'
                                                      >
                                                        {app.name}
                                                      </Link>
                                                    )
                                                  }
                                                </td>
                                                <td>{app.email}</td>
                                                <td>{new Date(app.appliedAt).toLocaleString('en-IN')}</td>
                                                
                                              </tr>
                                            ))
                                          }
                                        </>
                                      ) : (
                                        <tr>
                                          <td colSpan={5}>No Student Yet Applied!</td>
                                        </tr>
                                      )
                                    }
                                  </tbody>
                                </Table>
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </div>
                    </>
                  )
                }

              </div>


              <div className="">
                {/* Job details (visible to all users). Students will also see the details and apply/reject controls below. */}
                <Accordion defaultActiveKey={['1']} alwaysOpen className='shadow rounded'>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Job Details</Accordion.Header>
                    <Accordion.Body>
                      <div className="flex flex-col gap-4">
                        {/* job title  */}
                        <div className="flex flex-col backdrop-blur-md bg-white/30 border border-white/20 rounded-lg px-2 shadow-sm shadow-red-400">
                          <span className='text-xl text-blue-500 py-2 border-b-2'>
                            Job Title
                          </span>
                          <span className='py-3'>
                            {data?.jobTitle}
                          </span>
                        </div>
                        {/* job Profile  */}
                        <div className="flex flex-col backdrop-blur-md bg-white/30 border border-white/20 rounded-lg px-2 shadow-sm shadow-red-400">
                          <span className='text-xl text-blue-500 py-2 border-b-2'>
                            Job Profile
                          </span>
                          <span className='py-3' dangerouslySetInnerHTML={{ __html: data?.jobDescription }} />
                        </div>
                        {/* job eligibility  */}
                        <div className="flex flex-col backdrop-blur-md bg-white/30 border border-white/20 rounded-lg px-2 shadow-sm shadow-red-400">
                          <span className='text-xl text-blue-500 py-2 border-b-2'>
                            Eligibility
                          </span>
                          <span className='py-3' dangerouslySetInnerHTML={{ __html: data?.eligibility }} />
                        </div>
                        {/* job salary  */}
                        <div className="flex flex-col backdrop-blur-md bg-white/30 border border-white/20 rounded-lg px-2 shadow-sm shadow-red-400">
                          <span className='text-xl text-blue-500 py-2 border-b-2'>
                            Annual CTC
                          </span>
                          <span className='py-3'>
                            {data?.salary} LPA
                          </span>
                        </div>
                        {/* job deadline  */}
                        <div className="flex flex-col backdrop-blur-md bg-white/30 border border-white/20 rounded-lg px-2 shadow-sm shadow-red-400">
                          <span className='text-xl text-blue-500 py-2 border-b-2'>
                            Last Date of Application
                          </span>
                          <span className='py-3'>
                            {new Date(data?.applicationDeadline).toLocaleDateString('en-IN', {
                              month: 'long',
                              year: 'numeric',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        {/* how to apply  */}
                        <div className="flex flex-col backdrop-blur-md bg-white/30 border border-white/20 rounded-lg px-2 shadow-sm shadow-red-400">
                          <span className='text-xl text-blue-500 py-2 border-b-2'>
                            How to Apply?
                          </span>
                          <span className='py-3' dangerouslySetInnerHTML={{ __html: data?.howToApply }} />
                        </div>

                        {/* For students, render apply/reject controls below the details */}
                        {currentUser.role === 'student' && (
                          <div className="flex justify-center mt-4 gap-2">
                            {applied === false ? (
                              <Button variant="warning" onClick={handleApply}>
                                <i className="fa-solid fa-check px-2" />
                                Apply Now
                              </Button>
                            ) : (
                              <>
                                <Button variant="danger" onClick={handleReject}>
                                  <i className="fa-solid fa-x px-2" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>

            </div>
          </>
        )
      }


      {/* ModalBox Component for Delete Confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirmation"}
        body={modalBody}
        btn={modalBtnText}
        confirmAction={confirmAction}
      />

    </>
  )
}

export default ViewJobPost
