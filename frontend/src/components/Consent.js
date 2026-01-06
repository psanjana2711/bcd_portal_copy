import React, { useState } from 'react';
import './Consent.css';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import tanuhLogo from '../assets/tanuh.png';
import iiscLogo from '../assets/IISc_logo.png';

function Consent({ onAccept }) {
  const [isChecked, setIsChecked] = useState(false);
  const { t } = useTranslation('consent');

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

      <div className="consent-checkbox">
        <input
          type="checkbox"
          id="consent-check"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <label htmlFor="consent-check">{t('checkboxLabel')}</label>
      </div>

      <button className="consent-button" onClick={onAccept} disabled={!isChecked}>
        {t('buttonText')}
      </button>
    </div>
  );
}

export default Consent;
