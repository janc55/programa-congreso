import React, { useState } from 'react';
import { SPEAKER_PHOTO_MAP, COUNTRY_FLAG_MAP } from '../data/speakerPhotos';

export default function SpeakerAvatar({ speaker, country, size = 'md', showFlag = true, className = '' }) {
  const [extIndex, setExtIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const extensions = ['jpg', 'jpeg', 'png', 'webp'];

  // Resolve country ISO code for flag-icons
  const countryKey = (country || 'bolivia').toLowerCase().trim();
  const flagCode = COUNTRY_FLAG_MAP[countryKey] || 'bo';

  const sizeClasses = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-base',
    xl: 'w-24 h-24 text-lg'
  };

  const flagSizes = {
    sm: 'text-[9px] -bottom-0.5 -right-0.5',
    md: 'text-[12px] -bottom-1 -right-1',
    lg: 'text-[16px] -bottom-1 -right-1',
    xl: 'text-[18px] -bottom-1 -right-1'
  };

  // Determine initial photo source
  const mappedFile = speaker?.s ? SPEAKER_PHOTO_MAP[speaker.s] : null;
  const photoUrl = mappedFile 
    ? `/assets/fotos/${mappedFile}` 
    : (speaker?.s ? `/assets/fotos/${speaker.s}.${extensions[extIndex]}` : null);

  const handleImageError = () => {
    if (mappedFile) {
      // If mapped file failed, don't keep looping
      setHasError(true);
    } else if (extIndex < extensions.length - 1) {
      setExtIndex(extIndex + 1);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className={`relative inline-block flex-shrink-0 select-none ${className}`}>
      {/* Photo Container */}
      <div 
        className={`${sizeClasses[size] || sizeClasses.md} rounded-xl overflow-hidden border-2 border-white/90 bg-slate-100 flex items-center justify-center shadow-xs transition-transform hover:scale-105`}
        title={speaker?.n || 'Expositor'}
      >
        {!hasError && photoUrl ? (
          <img
            src={photoUrl}
            alt={speaker?.n || 'Expositor'}
            onError={handleImageError}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            <svg className="w-3/5 h-3/5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>

      {/* Flag Icon Badge using official flag-icons */}
      {showFlag && flagCode && (
        <div 
          className={`absolute ${flagSizes[size] || flagSizes.md} rounded-[2px] overflow-hidden shadow-xs border border-white bg-white flex items-center justify-center leading-none`}
          title={`País: ${country || 'Bolivia'}`}
        >
          <span className={`fi fi-${flagCode} rounded-[1px]`} />
        </div>
      )}
    </div>
  );
}
