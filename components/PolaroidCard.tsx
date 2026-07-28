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
      className={`group cursor-pointer bg-parchment-dark/40 dark:bg-lamplight-glow/10 p-3 sm:p-4 rounded-sm border border-stone-300/60 dark:border-parchment/20 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] hover:rotate-0 w-full ${
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
      aria-label={`View details for ${event.title}`}
    >
      {/* Photo Frame Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900/10 dark:bg-stone-800 rounded-sm mb-3 border border-stone-400/20">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-500"
          loading="lazy"
          onError={(e) => {
            // Fallback placeholder if image fails to load
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop';
          }}
        />
        {/* Subtle vintage vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity pointer-events-none" />
        
        {/* Date Tag in Top Corner */}
        <div className="absolute top-2 right-2 bg-oxblood/90 text-parchment text-[10px] font-sans font-bold uppercase tracking-widest px-2 py-1 rounded shadow-md">
          {event.date}
        </div>
      </div>

      {/* Polaroid Handwritten Caption Section */}
      <div className="text-center pt-1 pb-2 px-1">
        <h3 className="font-display italic text-lg sm:text-xl font-bold text-stone-900 dark:text-parchment group-hover:text-oxblood dark:group-hover:text-lamplight transition-colors">
          {event.title}
        </h3>
        <p className="text-xs font-sans text-stone-600 dark:text-parchment/70 line-clamp-1 italic mt-0.5">
          {event.imageCaption || event.subtitle}
        </p>
      </div>
    </div>
  );
};

export default PolaroidCard;
