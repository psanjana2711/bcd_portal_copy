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
        return <div style={contentStyle}>Admin Content</div>;
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

export default AdminPage;
