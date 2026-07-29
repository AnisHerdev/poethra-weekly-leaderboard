import React from 'react';
import { ClubEvent } from '../types';

interface PolaroidCardProps {
  event: ClubEvent;
  onClick: () => void;
  featured?: boolean;
}

const PolaroidCard: React.FC<PolaroidCardProps> = ({ event, onClick, featured = false }) => {
  const tiltStyle = event.tiltAngle ? { transform: `rotate(${event.tiltAngle}deg)` } : {};

  return (
    <div
      onClick={onClick}
      style={tiltStyle}
      className={`group relative cursor-pointer bg-[#FBF7EE] dark:bg-[#1E2738] p-4 sm:p-5 rounded-[2px] border border-[#E3D7BF] dark:border-parchment/20 shadow-[0_10px_25px_-5px_rgba(27,42,74,0.18)] hover:shadow-[0_22px_45px_-10px_rgba(107,28,42,0.28)] transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] hover:rotate-0 w-full ${
        featured ? 'max-w-md' : 'max-w-sm sm:max-w-md'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View chronicle entry for ${event.title}`}
    >
      {/* Washi Tape Strip on Top */}
      <div 
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-amber-100/70 dark:bg-amber-900/40 border-y border-amber-300/40 dark:border-amber-700/30 backdrop-blur-xs transform -rotate-1 shadow-xs pointer-events-none z-10 opacity-90 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      >
        <div className="w-full h-full border-x-2 border-dashed border-amber-200/50 dark:border-amber-800/40" />
      </div>

      {/* Push Pin Accent */}
      <div 
        className="absolute top-2 right-3 w-3 h-3 rounded-full bg-oxblood-bright/80 dark:bg-lamplight shadow-[1px_2px_4px_rgba(0,0,0,0.3)] z-10 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-1 h-1 rounded-full bg-white/60" />
      </div>

      {/* Photo Frame Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900/10 dark:bg-stone-900 rounded-[1px] mb-3.5 border border-stone-300/40 dark:border-stone-700/50 shadow-inner">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop';
          }}
        />
        {/* Subtle vintage photo warmth overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-amber-900/10 opacity-50 group-hover:opacity-20 transition-opacity pointer-events-none" />
        
        {/* Ink Stamp Date Tag in Corner */}
        <div className="absolute bottom-2.5 right-2.5 bg-oxblood/90 text-parchment text-[9px] font-sans font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-[2px] shadow-md border border-oxblood-light/40">
          {event.date}
        </div>
      </div>

      {/* Polaroid Handwritten Caption Section */}
      <div className="text-center pt-1 pb-1 px-1">
        <h3 className="font-display italic text-lg sm:text-xl font-bold text-ink dark:text-parchment group-hover:text-oxblood dark:group-hover:text-lamplight transition-colors tracking-tight">
          {event.title}
        </h3>
        <p className="text-xs font-sans text-stone-600 dark:text-parchment/70 line-clamp-1 italic mt-0.5">
          {event.imageCaption || event.subtitle}
        </p>
      </div>

      {/* Click Hint Bar */}
      <div className="mt-2 pt-2 border-t border-oxblood/10 dark:border-parchment/10 text-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-oxblood dark:text-oxblood-bright">
          Click to Open Chronicle &rarr;
        </span>
      </div>
    </div>
  );
};

export default PolaroidCard;
