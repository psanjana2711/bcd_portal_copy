import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const StaffPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hospitalName: '',
    staffName: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('hospitalName');
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.hospitalName || !formData.staffName || !formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'Please fill in hospital name, staff name, email, and password.' });
      return;
    }

    setMessage({ type: 'success', text: 'Login details captured.' });
    navigate('/hospital/patients');
  };

  return (
    <Layout userRole="staff" handleLogout={handleLogout}>
      <div style={contentStyle}>
        <h2 style={titleStyle}>Hospital Portal</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="hospitalName">Hospital Name</label>
            <input
              id="hospitalName"
              name="hospitalName"
              type="text"
              value={formData.hospitalName}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="staffName">Staff Name</label>
            <input
              id="staffName"
              name="staffName"
              type="text"
              value={formData.staffName}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {message.text && (
            <div
              style={{
                padding: '10px',
                borderRadius: '4px',
                backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                color: message.type === 'success' ? '#155724' : '#721c24',
                border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
              }}
            >
              {message.text}
            </div>
          )}

          <button type="submit" style={submitButtonStyle}>Submit</button>
        </form>
      </div>
    </Layout>
  );
};

const contentStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  minHeight: '260px',
  maxWidth: '600px',
  margin: '0 auto'
};

const titleStyle = {
  color: '#8B008B',
  marginBottom: '20px',
  textAlign: 'center'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%'
};

const formGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const labelStyle = {
  fontWeight: 500,
  color: '#333'
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  boxSizing: 'border-box'
};

const submitButtonStyle = {
  padding: '10px 16px',
  backgroundColor: '#8B008B',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default StaffPage;
