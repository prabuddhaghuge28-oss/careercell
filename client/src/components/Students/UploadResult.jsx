import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { BASE_URL, SERVER_BASE_URL } from '../../config/config';

const UploadResult = ({ resultType, label, fetchCurrentUserData, currentUser, resultFile }) => {
  const [uploadStatus, setUploadStatus] = useState('');

  // Handle result file upload
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!e.target.files[0]) {
      setUploadStatus('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('result', e.target.files[0]);
    formData.append('userId', currentUser.id);
    formData.append('resultType', resultType);

    try {
      const response = await axios.post(`${BASE_URL}/student/upload-result`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // Update userData in parent component
      if (fetchCurrentUserData) fetchCurrentUserData();
      setUploadStatus(response.data.msg || 'Result file uploaded successfully');
      
      // Clear status message after 3 seconds
      setTimeout(() => setUploadStatus(''), 3000);
    } catch (error) {
      console.error('Error uploading the result file', error);
      setUploadStatus(error.response?.data?.msg || 'Error uploading the result file');
      setTimeout(() => setUploadStatus(''), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Form.Control
        type="file"
        accept='.pdf, .doc, .docx, .jpg, .jpeg, .png'
        placeholder={`Upload ${label}`}
        name={`result-${resultType}`}
        onChange={handleSubmit}
        size="sm"
      />
      {resultFile && resultFile.filepath !== 'undefined' && resultFile.filepath && (
        <div className="py-1">
          <span className='bg-green-500 py-1 px-2 rounded cursor-pointer hover:bg-green-700 text-white text-xs'>
            <a href={SERVER_BASE_URL + resultFile.filepath} target='_blank' rel='noopener noreferrer' className='no-underline text-white'>
              <i className="fa-regular fa-eye px-1" />
              View {label}
            </a>
          </span>
        </div>
      )}
      {uploadStatus && (
        <p className='text-xs mt-1' style={{ color: uploadStatus.includes('Error') ? '#ef4444' : '#10b981' }}>
          {uploadStatus}
        </p>
      )}
    </div>
  );
};

export default UploadResult;
