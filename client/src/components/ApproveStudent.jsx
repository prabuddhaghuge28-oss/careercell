import React, { useEffect, useState } from 'react';
import AddUserTable from './AddUserTable';
import Toast from './Toast';
import ModalBox from './Modal';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BASE_URL } from '../config/config';

function ApproveStudent() {
  document.title = 'CarrerCell | Approve Students';

  // student users store here
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);
  const [userEmailToProcess, setUserEmailToProcess] = useState(null);
  const [modalBody, setModalBody] = useState('');
  const [modalBtn, setModalBtn] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // full user object when rejecting
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectMessage, setRejectMessage] = useState('');

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

  const fetchUserDetails = async () => {
    if (!adminBasePath) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/${adminBasePath}/student-users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      if (response.data) {
        // checking isApprove is false
        const filteredUsers = response.data.studentUsers.filter(element => !element.studentProfile?.isApproved);
        setUsers(filteredUsers);
      } else {
        console.warn('Response does not contain studentUsers:', response.data);
      }
    } catch (error) {
      console.error("Error fetching user details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminBasePath) fetchUserDetails();
  }, [adminBasePath]);

  useEffect(() => {
    if (currentRole && !adminBasePath) setLoading(false);
  }, [currentRole, adminBasePath]);

  const handleDeleteUser = (userOrEmail) => {
    // If a string (email) is passed, keep legacy delete behavior
    if (typeof userOrEmail === 'string') {
      setUserEmailToProcess(userOrEmail);
      setModalBody(`Do you want to delete ${userOrEmail}?`);
      setModalBtn("Delete");
      setShowModal(true);
      return;
    }

    // If an object is passed (from approve-student table), treat as Reject flow
    setSelectedUser(userOrEmail);
    setRejectMessage('');
    setShowRejectModal(true);
  };

  const confirmDelete = async () => {
    if (!adminBasePath) return;
    try {
      const response = await axios.post(`${BASE_URL}/${adminBasePath}/student-delete-user`,
        { email: userEmailToProcess },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      setShowModal(false);
      if (response.data) {
        setToastMessage(response.data.msg);
        setShowToast(true);
        fetchUserDetails();
      }
    } catch (error) {
      console.log("student => confirmDelete ==> ", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setUserEmailToProcess(null);
  };

  // approve student user method
  const handleApproveStudent = (email) => {
    setUserEmailToProcess(email);
    setModalBody(`Do you want to approve ${email}?`);
    setModalBtn("Approve");
    // setModalAction(confirmApproveStudent);
    setShowModal(true);
  };

  const confirmApproveStudent = async () => {
    if (!adminBasePath) return;
    try {
      const response = await axios.post(`${BASE_URL}/${adminBasePath}/student-approve`,
        { email: userEmailToProcess }, // Use the state `userEmailToProcess` instead of `email`
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (response.data) {
        setToastMessage(response.data.msg || "User approved successfully");
        setShowToast(true);
        fetchUserDetails(); // Refresh the user list after approval
      }
      setShowModal(false);
    } catch (error) {
      setToastMessage("Error approving user");
      setShowToast(true);
      console.log("handleApproveStudent => AddUersTable.jsx ==> ", error);
    }
  };

  // confirm reject -> send notice to student instead of deleting
  const confirmRejectStudent = async () => {
    if (!adminBasePath || !selectedUser) return;
    try {
      const payload = {
        receiver_role: 'student',
        receiver: selectedUser._id,
        title: 'Application Status',
        message: rejectMessage || 'Your application was rejected.'
      };

      const response = await axios.post(`${BASE_URL}/${adminBasePath}/send-notice`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setShowRejectModal(false);
      setSelectedUser(null);
      if (response?.data?.msg) {
        setToastMessage(response.data.msg);
        setShowToast(true);
      } else {
        setToastMessage('Rejection notice sent');
        setShowToast(true);
      }
      // no deletion, refresh list to keep unchanged users
      fetchUserDetails();
    } catch (error) {
      console.error('Error sending rejection notice', error);
      setToastMessage('Error sending rejection notice');
      setShowToast(true);
    }
  };

  return (
    <>
      {/* Toast Component */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      {/* AddUserTable Component */}
      <AddUserTable
        users={users}
        loading={loading}
        handleDeleteUser={handleDeleteUser}
        showModal={showModal}
        closeModal={closeModal}
        confirmDelete={confirmDelete}
        userToDelete={userEmailToProcess}
        userToAdd={"approve-student"}
        handleApproveStudent={handleApproveStudent}
      />

      {/* ModalBox Component for Delete Confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirmation"}
        body={modalBody}
        btn={modalBtn}
        confirmAction={modalBtn === "Delete" ? confirmDelete : confirmApproveStudent}
      />

      {/* Reject Modal: show a textarea and send notice to student (no deletion) */}
      <Modal
        show={showRejectModal}
        onHide={() => setShowRejectModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Send Rejection Notice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-2">Send rejection notice to <strong>{selectedUser?.email}</strong></div>
          <Form.Group>
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={rejectMessage}
              onChange={(e) => setRejectMessage(e.target.value)}
              placeholder="Enter rejection message to send to student"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>Close</Button>
          <Button variant="danger" onClick={confirmRejectStudent}>Send</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ApproveStudent;
