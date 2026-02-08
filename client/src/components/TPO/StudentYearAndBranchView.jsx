import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios from 'axios';
import StudentTable from './StudentTableTemplate';
import { BASE_URL } from '../../config/config';
import AccordionPlaceholder from '../AccordionPlaceholder';

function StudentYearAndBranchView() {
  document.title = 'CareerCell | All Students';

  const [loading, setLoading] = useState(true);

  const [firstYearBscCs, setFirstYearBscCs] = useState([]);
  const [firstYearBscIt, setFirstYearBscIt] = useState([]);
  const [firstYearBcom, setFirstYearBcom] = useState([]);
  const [firstYearBaf, setFirstYearBaf] = useState([]);
  const [firstYearBmm, setFirstYearBmm] = useState([]);
  const [firstYearBms, setFirstYearBms] = useState([]);
  const [secondYearBscCs, setSecondYearBscCs] = useState([]);
  const [secondYearBscIt, setSecondYearBscIt] = useState([]);
  const [secondYearBcom, setSecondYearBcom] = useState([]);
  const [secondYearBaf, setSecondYearBaf] = useState([]);
  const [secondYearBmm, setSecondYearBmm] = useState([]);
  const [secondYearBms, setSecondYearBms] = useState([]);
  const [thirdYearBscCs, setThirdYearBscCs] = useState([]);
  const [thirdYearBscIt, setThirdYearBscIt] = useState([]);
  const [thirdYearBcom, setThirdYearBcom] = useState([]);
  const [thirdYearBaf, setThirdYearBaf] = useState([]);
  const [thirdYearBmm, setThirdYearBmm] = useState([]);
  const [thirdYearBms, setThirdYearBms] = useState([]);

  const fetchStudentsData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/student/all-students-data-year-and-branch`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setFirstYearBscCs(response.data.firstYearBscCs);
      setFirstYearBscIt(response.data.firstYearBscIt);
      setFirstYearBcom(response.data.firstYearBcom);
      setFirstYearBaf(response.data.firstYearBaf);
      setFirstYearBmm(response.data.firstYearBmm);
      setFirstYearBms(response.data.firstYearBms);

      setSecondYearBscCs(response.data.secondYearBscCs);
      setSecondYearBscIt(response.data.secondYearBscIt);
      setSecondYearBcom(response.data.secondYearBcom);
      setSecondYearBaf(response.data.secondYearBaf);
      setSecondYearBmm(response.data.secondYearBmm);
      setSecondYearBms(response.data.secondYearBms);

      setThirdYearBscCs(response.data.thirdYearBscCs);
      setThirdYearBscIt(response.data.thirdYearBscIt);
      setThirdYearBcom(response.data.thirdYearBcom);
      setThirdYearBaf(response.data.thirdYearBaf);
      setThirdYearBmm(response.data.thirdYearBmm);
      setThirdYearBms(response.data.thirdYearBms);

      // setLoading(false);
    } catch (error) {
      console.log("Error fetching jobs ", error);
      // if (error?.response?.data?.msg) {
      // setToastMessage(error.response.data.msg);
      // setShowToast(true);
      // }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudentsData();
  }, []);

  return (
    <>
      {
        loading ? (
          // <div className="flex justify-center h-72 items-center">
          //   <i className="fa-solid fa-spinner fa-spin text-3xl" />
          // </div>
          <AccordionPlaceholder />
        ) : (
          <>
            <div className="my-4 p-6">
              <div className="">
                {/* parent accordion for year of student  */}
                <Accordion defaultActiveKey={['1']} flush className='flex flex-col gap-4'>
                  <Accordion.Item eventKey="1" className='backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-red-400'>
                    {/* 3rd year  */}
                    <Accordion.Header>Third Year</Accordion.Header>
                    <Accordion.Body>
                      <Accordion flush defaultActiveKey={['BSC CS']} className='flex flex-col gap-2'>
                        <StudentTable branchName={"BSC CS"} studentData={thirdYearBscCs} />
                        <StudentTable branchName={"BSC IT"} studentData={thirdYearBscIt} />
                        <StudentTable branchName={"BCOM"} studentData={thirdYearBcom} />
                        <StudentTable branchName={"BAF"} studentData={thirdYearBaf} />
                        <StudentTable branchName={"BMM"} studentData={thirdYearBmm} />
                        <StudentTable branchName={"BMS"} studentData={thirdYearBms} />
                      </Accordion>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="2" className='backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-red-400'>
                    {/* 2nd year  */}
                    <Accordion.Header>Second Year</Accordion.Header>
                    <Accordion.Body>
                      <Accordion flush defaultActiveKey={['BSC CS']} className='flex flex-col gap-2'>
                        <StudentTable branchName={"BSC CS"} studentData={secondYearBscCs} />
                        <StudentTable branchName={"BSC IT"} studentData={secondYearBscIt} />
                        <StudentTable branchName={"BCOM"} studentData={secondYearBcom} />
                        <StudentTable branchName={"BAF"} studentData={secondYearBaf} />
                        <StudentTable branchName={"BMM"} studentData={secondYearBmm} />
                        <StudentTable branchName={"BMS"} studentData={secondYearBms} />
                      </Accordion>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="3" className='backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-red-400'>
                    {/* 1st year  */}
                    <Accordion.Header>First Year</Accordion.Header>
                    <Accordion.Body>
                      <Accordion flush defaultActiveKey={['BSC CS']} className='flex flex-col gap-2'>
                        <StudentTable branchName={"BSC CS"} studentData={firstYearBscCs} />
                        <StudentTable branchName={"BSC IT"} studentData={firstYearBscIt} />
                        <StudentTable branchName={"BCOM"} studentData={firstYearBcom} />
                        <StudentTable branchName={"BAF"} studentData={firstYearBaf} />
                        <StudentTable branchName={"BMM"} studentData={firstYearBmm} />
                        <StudentTable branchName={"BMS"} studentData={firstYearBms} />
                      </Accordion>
                    </Accordion.Body>
                  </Accordion.Item>


                </Accordion>
              </div>


            </div >
          </>
        )
      }
    </>
  )
}

export default StudentYearAndBranchView
