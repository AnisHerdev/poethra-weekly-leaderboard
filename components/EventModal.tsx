import React, { useEffect } from 'react';
import { ClubEvent } from '../types';
import { CloseIcon } from './icons/UIIcons';

interface EventModalProps {
  event: ClubEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  // Helper to format youtube URL to embed format if needed
  const getEmbedUrl = (url?: string) => {
    if (!url) return '';
    if (url.includes('embed/')) return url;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const embedUrl = getEmbedUrl(event.youtubeUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/80 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-event-title"
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#FBF7EE] dark:bg-[#1E2738] rounded-2xl border border-oxblood/20 dark:border-parchment/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] p-6 sm:p-8 bg-parchment-texture text-stone-900 dark:text-parchment animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-oxblood dark:text-parchment/60 dark:hover:text-lamplight p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-oxblood"
          aria-label="Close chronicle entry"
        >
          <CloseIcon />
        </button>

        {/* Vintage Archival Header Stamp */}
        <div className="mb-6 border-b border-oxblood/15 dark:border-parchment/15 pb-4 pr-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-oxblood dark:bg-lamplight" />
            <span className="text-[10px] font-sans uppercase tracking-[0.4em] text-oxblood dark:text-oxblood-bright font-black">
              Archive Entry • {event.date}
            </span>
          </div>
          <h2 id="modal-event-title" className="text-3xl sm:text-4xl font-display font-bold text-ink dark:text-parchment tracking-tight">
            {event.title}
          </h2>
          <p className="text-sm font-sans text-stone-600 dark:text-parchment/70 italic mt-1 font-medium">
            {event.subtitle}
          </p>
        </div>

        {/* Modal Content Layout */}
        <div className="grid md:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Polaroid Image Showcase */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative bg-[#FAF4E6] dark:bg-stone-800 p-3.5 rounded-[2px] border border-stone-300/80 dark:border-parchment/20 shadow-xl w-full transform -rotate-1">
              {/* Washi Tape Corner */}
              <div 
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-amber-100/80 dark:bg-amber-900/50 border-y border-amber-300/50 transform rotate-1 z-10 pointer-events-none" 
                aria-hidden="true" 
              />
              
              <div className="aspect-[4/3] w-full overflow-hidden rounded-[1px] bg-stone-900">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop';
                  }}
                />
              </div>
              <p className="font-display italic text-center text-xs text-stone-700 dark:text-parchment/80 mt-2.5 px-1 leading-snug font-medium">
                {event.imageCaption || event.title}
              </p>
            </div>
          </div>

          {/* Description & Story Section */}
          <div className="md:col-span-7 space-y-6">
            <div className="bg-parchment-dark/20 dark:bg-ink-light/30 p-5 rounded-xl border border-oxblood/10 dark:border-parchment/10">
              <h3 className="text-xs font-sans uppercase tracking-[0.2em] text-oxblood dark:text-oxblood-bright font-black mb-2 flex items-center gap-1.5">
                <span>✦</span> About the Event
              </h3>
              <p className="text-sm sm:text-base leading-relaxed italic text-stone-800 dark:text-parchment/90 font-display">
                "{event.description}"
              </p>
            </div>

            {/* Embedded Video Section (if youtubeUrl present) */}
            {embedUrl && (
              <div className="space-y-2">
                <h3 className="text-xs font-sans uppercase tracking-widest text-oxblood dark:text-oxblood-bright font-bold flex items-center gap-1.5">
                  <span>🎥</span> Event Highlights Reel
                </h3>
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border-2 border-oxblood/20 dark:border-parchment/20 shadow-lg">
                  <iframe
                    src={embedUrl}
                    title={`${event.title} video highlights`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-8 pt-4 border-t border-oxblood/15 dark:border-parchment/15 flex items-center justify-between">
          <span className="text-[11px] font-sans text-stone-500 dark:text-parchment/50 italic">
            RVU Poéthra Archives
          </span>
          <button
            onClick={onClose}
            className="bg-oxblood dark:bg-parchment text-parchment dark:text-ink font-bold py-2.5 px-6 rounded-lg text-xs uppercase tracking-widest hover:bg-oxblood-light dark:hover:bg-lamplight transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-oxblood"
          >
            Close Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
