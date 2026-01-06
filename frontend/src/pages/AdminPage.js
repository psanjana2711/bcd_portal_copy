import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tanuhLogo from '../assets/tanuh.png';
import iiscLogo from '../assets/IISc_logo.png';
import Consent from '../components/Consent';
import Questionnaire from '../components/Questionnaire';
import ThankYou from '../components/ThankYou';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('patient');
  const [patientFlowStep, setPatientFlowStep] = useState('consent');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('role')?.toLowerCase();
    const token = localStorage.getItem('token');
    if (!token || !['admin', 'doctor', 'staff'].includes(role)) {
      navigate('/login');
    } else {
      setUserRole(role);
      if (role === 'staff') {
        setActiveTab('patient');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleQuestionnaireSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Mock API call
      console.log('Submitting questionnaire data:', data);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPatientFlowStep('thankyou');
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      alert('An error occurred while submitting the questionnaire.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const allTabs = [
    { id: 'patient', label: 'Patient View' },
    { id: 'doctor', label: 'Doctor View' },
    { id: 'admin', label: 'Admin' }
  ];

  const tabs = allTabs.filter(tab => {
    if (userRole === 'admin') return true;
    if (userRole === 'doctor') return ['patient', 'doctor'].includes(tab.id);
    if (userRole === 'staff') return tab.id === 'patient';
    return false;
  });

  const renderPatientFlow = () => {
    switch (patientFlowStep) {
      case 'consent':
        return <Consent onAccept={() => setPatientFlowStep('questionnaire')} />;
      case 'questionnaire':
        return (
          <Questionnaire 
            onSubmit={handleQuestionnaireSubmit} 
            isSubmitting={isSubmitting} 
          />
        );
      case 'thankyou':
        return <ThankYou onReset={() => setPatientFlowStep('consent')} />;
      default:
        return <Consent onAccept={() => setPatientFlowStep('questionnaire')} />;
    }
  };

  const renderContent = () => {
    // Force patient view for staff
    const currentTab = userRole === 'staff' ? 'patient' : activeTab;
    switch (currentTab) {
      case 'patient':
        return <div style={contentStyle}>{renderPatientFlow()}</div>;
      case 'doctor':
        return <div style={contentStyle}>Doctor View Content</div>;
      case 'admin':
        return <div style={contentStyle}><AdminContent /></div>;
      default:
        return null;
    }
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={logoContainerStyle}>
          <img src={tanuhLogo} alt="Tanuh Logo" style={logoStyle} />
          <h1 style={titleStyle}>AI enabled Breast Cancer Screening Tool</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f8d7da',
                color: '#721c24',
                border: '1px solid #f5c6cb',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
            <img src={iiscLogo} alt="IISc Logo" style={logoStyle} />
          </div>
        </div>
      </header>

      {userRole !== 'staff' && (
        <div style={tabContainerStyle}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...tabButtonStyle,
                borderBottom: activeTab === tab.id ? '3px solid #8B008B' : 'none',
                color: activeTab === tab.id ? '#8B008B' : '#666',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <main style={mainStyle}>
        {renderContent()}
      </main>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#fff5f7',
  fontFamily: '"Inter", sans-serif'
};

const headerStyle = {
  padding: '20px',
  backgroundColor: 'white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

const logoContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%',
  gap: '20px'
};

const logoStyle = {
  height: '64px',
  width: '64px',
  objectFit: 'contain'
};

const titleStyle = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#8B008B',
  textAlign: 'center',
  flex: '1'
};

const tabContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: 'white',
  borderBottom: '1px solid #ddd',
  padding: '0 20px'
};

const tabButtonStyle = {
  padding: '15px 30px',
  fontSize: '16px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const mainStyle = {
  flex: 1,
  padding: '20px',
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%'
};

const contentStyle = {
  backgroundColor: 'white',
  padding: '40px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  minHeight: '400px',
  color: '#666'
};

const AdminContent = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Forms states
  const [doctorForm, setDoctorForm] = useState({ fullName: '', email: '', password: '', hospitalId: '' });
  const [staffForm, setStaffForm] = useState({ fullName: '', email: '', password: '', hospitalId: '' });
  const [hospitalForm, setHospitalForm] = useState({ name: '', contactPerson: '', email: '', address: '' });
  const [adminForm, setAdminForm] = useState({ fullName: '', email: '', password: '', hospitalId: '' });

  useEffect(() => {
    fetchHospitals();
    fetchRoles();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/v1/auth/hospitals`);
      const data = await response.json();
      setHospitals(data);
    } catch (err) {
      console.error("Failed to fetch hospitals", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/v1/admin/roles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setRoles(data);
    } catch (err) {
      console.error("Failed to fetch roles", err);
    }
  };

  const handleCreateUser = async (formData, roleName) => {
    setLoading(true);
    try {
      const role = roles.find(r => r.name.toLowerCase() === roleName.toLowerCase());
      if (!role) throw new Error(`Role ${roleName} not found`);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/v1/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
          hospital_id: parseInt(formData.hospitalId),
          role_id: role.id
        })
      });
      
      if (response.ok) {
        alert(`${roleName} account created successfully!`);
        // Reset form
        if (roleName === 'Doctor') setDoctorForm({ fullName: '', email: '', password: '', hospitalId: '' });
        if (roleName === 'Staff') setStaffForm({ fullName: '', email: '', password: '', hospitalId: '' });
        if (roleName === 'Admin') setAdminForm({ fullName: '', email: '', password: '', hospitalId: '' });
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || 'Failed to create account'}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHospital = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/v1/admin/hospitals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: hospitalForm.name,
          contact_person: hospitalForm.contactPerson,
          email: hospitalForm.email,
          address: hospitalForm.address
        })
      });
      
      if (response.ok) {
        alert('Hospital account created successfully!');
        setHospitalForm({ name: '', contactPerson: '', email: '', address: '' });
        fetchHospitals(); // Refresh hospital list
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || 'Failed to create hospital'}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const accordionStyle = {
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    overflow: 'hidden'
  };

  const accordionHeaderStyle = {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bold',
    color: '#333'
  };

  const accordionContentStyle = {
    padding: '20px',
    borderTop: '1px solid #ddd',
    backgroundColor: 'white'
  };

  const formGroupStyle = {
    marginBottom: '15px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#8B008B',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px'
  };

  return (
    <div style={{ color: '#333' }}>
      <h2 style={{ marginBottom: '20px', color: '#8B008B' }}>Administrative Tasks</h2>
      
      {/* 1. Create Doctor Account */}
      <div style={accordionStyle}>
        <div style={accordionHeaderStyle} onClick={() => toggleSection('doctor')}>
          1. Create a doctor account for the hospital
          <span>{expandedSection === 'doctor' ? '−' : '+'}</span>
        </div>
        {expandedSection === 'doctor' && (
          <div style={accordionContentStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Full Name</label>
              <input 
                style={inputStyle} 
                value={doctorForm.fullName} 
                onChange={(e) => setDoctorForm({...doctorForm, fullName: e.target.value})}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email</label>
              <input 
                style={inputStyle} 
                type="email" 
                value={doctorForm.email}
                onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Password</label>
              <input 
                style={inputStyle} 
                type="password" 
                value={doctorForm.password}
                onChange={(e) => setDoctorForm({...doctorForm, password: e.target.value})}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Hospital</label>
              <select 
                style={inputStyle} 
                value={doctorForm.hospitalId}
                onChange={(e) => setDoctorForm({...doctorForm, hospitalId: e.target.value})}
              >
                <option value="">Select Hospital</option>
                {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
            <button 
              style={{...buttonStyle, opacity: loading ? 0.7 : 1}} 
              disabled={loading}
              onClick={() => handleCreateUser(doctorForm, 'Doctor')}
            >
              {loading ? 'Creating...' : 'Create Doctor Account'}
            </button>
          </div>
        )}
      </div>

      {/* 2. Create Staff Account */}
      <div style={accordionStyle}>
        <div style={accordionHeaderStyle} onClick={() => toggleSection('staff')}>
          2. Create a staff account for the hospital
          <span>{expandedSection === 'staff' ? '−' : '+'}</span>
        </div>
        {expandedSection === 'staff' && (
          <div style={accordionContentStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Full Name</label>
              <input 
                style={inputStyle} 
                value={staffForm.fullName}
                onChange={(e) => setStaffForm({...staffForm, fullName: e.target.value})}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email</label>
              <input 
                style={inputStyle} 
                type="email" 
                value={staffForm.email}
                onChange={(e) => setStaffForm({...staffForm, email: e.target.value})}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Password</label>
              <input 
                style={inputStyle} 
                type="password" 
                value={staffForm.password}
                onChange={(e) => setStaffForm({...staffForm, password: e.target.value})}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Hospital</label>
              <select 
                style={inputStyle} 
                value={staffForm.hospitalId}
                onChange={(e) => setStaffForm({...staffForm, hospitalId: e.target.value})}
              >
                <option value="">Select Hospital</option>
                {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
            <button 
              style={{...buttonStyle, opacity: loading ? 0.7 : 1}} 
              disabled={loading}
              onClick={() => handleCreateUser(staffForm, 'Staff')}
            >
              {loading ? 'Creating...' : 'Create Staff Account'}
            </button>
          </div>
        )}
      </div>

      {/* 3. Create another hospital account */}
      <div style={accordionStyle}>
        <div style={accordionHeaderStyle} onClick={() => toggleSection('hospital')}>
          3. Create another hospital account
          <span>{expandedSection === 'hospital' ? '−' : '+'}</span>
        </div>
        {expandedSection === 'hospital' && (
          <div style={accordionContentStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Hospital Name</label>
              <input 
                style={inputStyle} 
                value={hospitalForm.name}
                onChange={(e) => setHospitalForm({...hospitalForm, name: e.target.value})}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Contact Person</label>
              <input 
                style={inputStyle} 
                value={hospitalForm.contactPerson}
                onChange={(e) => setHospitalForm({...hospitalForm, contactPerson: e.target.value})}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email</label>
              <input 
                style={inputStyle} 
                type="email" 
                value={hospitalForm.email}
                onChange={(e) => setHospitalForm({...hospitalForm, email: e.target.value})}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Address</label>
              <textarea 
                style={{...inputStyle, height: '80px'}} 
                value={hospitalForm.address}
                onChange={(e) => setHospitalForm({...hospitalForm, address: e.target.value})}
              />
            </div>
            <button 
              style={{...buttonStyle, opacity: loading ? 0.7 : 1}} 
              disabled={loading}
              onClick={handleCreateHospital}
            >
              {loading ? 'Creating...' : 'Create Hospital Account'}
            </button>
          </div>
        )}
      </div>

      {/* 4. Create admin account for another hospital */}
      <div style={accordionStyle}>
        <div style={accordionHeaderStyle} onClick={() => toggleSection('admin-user')}>
          4. Create admin account for another hospital
          <span>{expandedSection === 'admin-user' ? '−' : '+'}</span>
        </div>
        {expandedSection === 'admin-user' && (
          <div style={accordionContentStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Full Name</label>
              <input 
                style={inputStyle} 
                value={adminForm.fullName}
                onChange={(e) => setAdminForm({...adminForm, fullName: e.target.value})}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email</label>
              <input 
                style={inputStyle} 
                type="email" 
                value={adminForm.email}
                onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Password</label>
              <input 
                style={inputStyle} 
                type="password" 
                value={adminForm.password}
                onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Hospital</label>
              <select 
                style={inputStyle} 
                value={adminForm.hospitalId}
                onChange={(e) => setAdminForm({...adminForm, hospitalId: e.target.value})}
              >
                <option value="">Select Hospital</option>
                {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
            <button 
              style={{...buttonStyle, opacity: loading ? 0.7 : 1}} 
              disabled={loading}
              onClick={() => handleCreateUser(adminForm, 'Admin')}
            >
              {loading ? 'Creating...' : 'Create Admin Account'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
