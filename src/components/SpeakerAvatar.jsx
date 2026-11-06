import React, { useState } from 'react';
import { SPEAKER_PHOTO_MAP, getCountryFlagPath } from '../data/speakerPhotos';

export default function SpeakerAvatar({ speaker, country, size = 'md', showFlag = true, className = '' }) {
  const [extIndex, setExtIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const extensions = ['jpg', 'jpeg', 'png', 'webp'];

  const flagSrc = getCountryFlagPath(country);

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-18 h-18'
  };

  const flagSizes = {
    sm: 'w-3.5 h-2.5 -bottom-0.5 -right-0.5',
    md: 'w-4.5 h-3 -bottom-0.5 -right-0.5',
    lg: 'w-5.5 h-4 -bottom-1 -right-1',
    xl: 'w-6.5 h-4.5 -bottom-1 -right-1'
  };

  const mappedFile = speaker?.s ? SPEAKER_PHOTO_MAP[speaker.s] : null;
  const photoUrl = mappedFile 
    ? `/assets/fotos/${mappedFile}` 
    : (speaker?.s ? `/assets/fotos/${speaker.s}.${extensions[extIndex]}` : null);

  const handleImageError = () => {
    if (mappedFile) {
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
        className={`${sizeClasses[size] || sizeClasses.md} rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shadow-2xs`}
        title={speaker?.n || 'Expositor'}
      >
        {!hasError && photoUrl ? (
          <img
            src={photoUrl}
            alt={speaker?.n || 'Expositor'}
            onError={handleImageError}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            <svg className="w-3/5 h-3/5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>

      {/* Flag Badge using official user PNG */}
      {showFlag && flagSrc && (
        <div 
          className={`absolute ${flagSizes[size] || flagSizes.md} rounded-[1px] overflow-hidden shadow-xs border border-white bg-white flex items-center justify-center leading-none z-10`}
          title={`País: ${country || 'Bolivia'}`}
        >
          <img 
            src={flagSrc} 
            alt={country || 'Bolivia'}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
