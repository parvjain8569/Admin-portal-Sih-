import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { languages } from '../../i18n/languages';

export default function LanguageSelectModal({ onClose, forceShow }) {
  const { currentLang, setLanguage, t } = useLanguage();

  // Show modal whenever forceShow is true
  if (!forceShow) return null;

  return (
    <div className="bhoomi-modal-overlay" style={{ zIndex: 9999 }}>
      <div 
        className="bhoomi-modal bhoomi-lang-modal" 
        style={{ 
          maxWidth: '780px', 
          width: 'min(780px, calc(100vw - 20px))', 
          maxHeight: '90vh', 
          overflowY: 'auto',
          borderRadius: '18px',
          padding: '24px 16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ 
            width: '56px', 
            height: '56px', 
            backgroundColor: '#dcfce7', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 12px',
            color: '#15803d',
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
          <h2 style={{ fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: '800', color: '#0f172a', marginBottom: '6px', letterSpacing: '-0.5px' }}>
            Select Your Language / अपनी भाषा चुनें
          </h2>
          <p style={{ color: '#64748b', fontSize: '13.5px', maxWidth: '520px', margin: '0 auto' }}>
            Choose your preferred language to view BhoomIntelli land record portal.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', 
          gap: '10px',
          marginBottom: '22px'
        }}>
          {languages.map((lang) => {
            const isSelected = (currentLang || 'en') === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  if (onClose) onClose();
                }}
                style={{
                  padding: '16px 10px',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid #16a34a' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#ecfdf5' : '#ffffff',
                  boxShadow: isSelected ? '0 4px 12px rgba(22, 163, 74, 0.15)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.18s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#16a34a';
                    e.currentTarget.style.backgroundColor = '#f0fdf4';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }
                }}
              >
                {isSelected && (
                  <span style={{
                    position: 'absolute',
                    top: '6px',
                    right: '8px',
                    fontSize: '12px',
                    color: '#16a34a',
                    fontWeight: '700'
                  }}>✓</span>
                )}
                <span style={{ fontSize: '20px', fontWeight: '700', color: isSelected ? '#15803d' : '#0f172a' }}>
                  {lang.native}
                </span>
                <span style={{ fontSize: '13px', color: isSelected ? '#166534' : '#64748b', fontWeight: isSelected ? '600' : '400' }}>
                  {lang.name}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={() => {
              if (!currentLang) setLanguage('en');
              if (onClose) onClose();
            }}
            style={{
              padding: '12px 36px',
              borderRadius: '12px',
              backgroundColor: '#166534',
              color: '#ffffff',
              border: 'none',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(22, 101, 52, 0.25)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#166534'}
          >
            Continue to Website / आगे बढ़ें →
          </button>
        </div>
      </div>
    </div>
  );
}
