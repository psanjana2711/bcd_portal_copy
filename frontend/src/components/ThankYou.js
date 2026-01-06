import React from 'react';
import './ThankYou.css';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import tanuhLogo from '../assets/tanuh.png';
import iiscLogo from '../assets/IISc_logo.png';

function ThankYou({ onReset }) {
  const { t } = useTranslation('thankyou');

  return (
    <div className="thank-you-container">
      <div className="thank-you-card">
        <div className="thank-you-logos">
          <img src={tanuhLogo} alt="TANUH Logo" className="logo" />
          <img src={iiscLogo} alt="IISc Logo" className="logo" />
        </div>

        <div className="success-icon">
          <CheckCircle size={80} color="#8B008B" />
        </div>

        <h1>{t('title')}</h1>
        <p className="message">{t('message')}</p>

        <div className="info-section">
          <h2>{t('nextSteps.title')}</h2>
          <ul>
            {t('nextSteps.items', { returnObjects: true }).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <button className="reset-button" onClick={onReset}>
          {t('buttons.reset') || 'Start New Screening'}
        </button>
      </div>
    </div>
  );
}

export default ThankYou;
