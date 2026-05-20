import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const HospitalPatientsPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('hospitalName');
    navigate('/');
  };

  const patients = [
    { id: 'PT-1001', name: 'Anita Sharma', age: 46, lastVisit: 'May 18, 2026', status: 'Pending Review' },
    { id: 'PT-1002', name: 'Meera Das', age: 52, lastVisit: 'May 17, 2026', status: 'Completed' },
    { id: 'PT-1003', name: 'Suman Rao', age: 39, lastVisit: 'May 16, 2026', status: 'In Progress' },
    { id: 'PT-1004', name: 'Latha Menon', age: 58, lastVisit: 'May 14, 2026', status: 'Pending Review' }
  ];

  return (
    <Layout userRole="staff" handleLogout={handleLogout} maxWidth="1000px" padding="20px">
      <div style={contentStyle}>
        <div style={headerRowStyle}>
          <h2 style={titleStyle}>Hospital Patient Details</h2>
          <button type="button" style={backButtonStyle} onClick={() => navigate('/staff')}>
            Back to Login
          </button>
        </div>

        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr style={headerRowStyleTable}>
                <th style={thStyle}>Patient ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Age</th>
                <th style={thStyle}>Last Visit</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} style={rowStyle}>
                  <td style={tdStyle}>{patient.id}</td>
                  <td style={tdStyle}>{patient.name}</td>
                  <td style={tdStyle}>{patient.age}</td>
                  <td style={tdStyle}>{patient.lastVisit}</td>
                  <td style={{ ...tdStyle, color: statusColorMap[patient.status] || '#333' }}>
                    {patient.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

const statusColorMap = {
  'Pending Review': '#8B008B',
  'In Progress': '#b85c00',
  'Completed': '#1b6b3a'
};

const contentStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const headerRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  marginBottom: '16px'
};

const titleStyle = {
  margin: 0,
  color: '#8B008B'
};

const backButtonStyle = {
  padding: '8px 14px',
  backgroundColor: '#f8d7da',
  color: '#721c24',
  border: '1px solid #f5c6cb',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 600
};

const tableContainerStyle = {
  overflowX: 'auto'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse'
};

const headerRowStyleTable = {
  backgroundColor: '#f8f9fa',
  borderBottom: '2px solid #dee2e6'
};

const thStyle = {
  padding: '12px',
  textAlign: 'left',
  color: '#495057',
  fontWeight: 600
};

const rowStyle = {
  borderBottom: '1px solid #dee2e6'
};

const tdStyle = {
  padding: '12px',
  verticalAlign: 'middle'
};

export default HospitalPatientsPage;
