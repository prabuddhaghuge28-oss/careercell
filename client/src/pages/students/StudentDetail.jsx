import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../config/config';

function StudentDetail() {
  const { studentId } = useParams(); 
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState(null);

  const adminBasePath = currentRole === 'management_admin' ? 'management' : currentRole === 'tpo_admin' ? 'tpo' : null;

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/detail`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        setCurrentRole(response.data.role);
      } catch (error) {
        console.error("Error fetching current user role", error);
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!adminBasePath) {
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/${adminBasePath}/student/${studentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        setStudentData(response.data);
      } catch (error) {
        console.error("Error fetching student data", error);
      } finally {
        setLoading(false);
      }
    };

    if (adminBasePath) fetchStudentData();
  }, [adminBasePath, studentId]);

  useEffect(() => {
    if (currentRole && !adminBasePath) setLoading(false);
  }, [currentRole, adminBasePath]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!studentData) {
    return <div>No student data found.</div>;
  }

  return (
    <div>
      <h1>{studentData.name}</h1>
      <p>Email: {studentData.email}</p>
      <p>Phone: {studentData.phone}</p>
      {/* Render more student data as needed */}
    </div>
  );
}

export default StudentDetail;
