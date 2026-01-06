import React, { useState } from 'react';
import './Consent.css';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import tanuhLogo from '../assets/tanuh.png';
import iiscLogo from '../assets/IISc_logo.png';

function Consent({ onAccept }) {
  const [isChecked, setIsChecked] = useState(false);
  const [scannedFile, setScannedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { t } = useTranslation('consent');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setScannedFile(e.target.files[0]);
    }
  };

  const handleAccept = async () => {
    if (!scannedFile) {
      alert(t('uploadPrompt') || 'Please upload a scanned copy of the physical consent form.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', scannedFile);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/v1/patient/consent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        onAccept(result);
      } else {
        const errorData = await response.json();
        alert(`Upload failed: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading consent:', error);
      alert('An error occurred while uploading the consent form.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="consent-container">
      <div className="consent-logos">
        <img src={tanuhLogo} alt={t('logos.tanuhAlt')} className="logo tanuh-logo" />
        <img src={iiscLogo} alt={t('logos.iiscAlt')} className="logo iisc-logo" />
      </div>
      
      <LanguageSwitcher />
      
      <h2>{t('title')}</h2>
      
      <div className="consent-header">
        <p><strong>{t('headernames.studyTitle')} :</strong> {t('header.studyTitle')}</p>
        <p><strong>{t('headernames.sponsor')} :</strong> {t('header.sponsor')}</p>
        <p><strong>{t('headernames.programManager')} :</strong> {t('header.programManager')}</p>
        <p><strong>{t('headernames.iecApproval')} :</strong> {t('header.iecApproval')}</p>
      </div>

      {t('sections', { returnObjects: true }).map((section, idx) => (
        <div key={idx} className={section.className ? section.className : 'consent-section'}>
          <h3>{section.heading}</h3>
          {section.paragraphs.map((para, pIdx) => (
            <p key={pIdx} className={para.className || undefined}>
              {para.strong && <strong>{para.strong} </strong>}
              {para.text}
            </p>
          ))}
        </div>
      ))}

      <div className="consent-upload">
        <label htmlFor="consent-file">
          <strong>{t('uploadLabel') || 'Upload Scanned Consent (Image/PDF):'}</strong>
        </label>
        <input
          type="file"
          id="consent-file"
          accept="image/*,application/pdf"
          capture="environment"
          onChange={handleFileChange}
        />
        {scannedFile && <p className="file-name">{scannedFile.name}</p>}
      </div>

      <div className="consent-checkbox">
        <input
          type="checkbox"
          id="consent-check"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <label htmlFor="consent-check">{t('checkboxLabel')}</label>
      </div>

      <button 
        className="consent-button" 
        onClick={handleAccept} 
        disabled={!isChecked || !scannedFile || isUploading}
      >
        {isUploading ? (t('uploadingText') || 'Uploading...') : t('buttonText')}
      </button>
    </div>
  );
}

export default Consent;
