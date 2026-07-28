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
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-parchment dark:bg-ink-light rounded-2xl border border-oxblood/20 dark:border-parchment/20 shadow-2xl p-6 sm:p-8 bg-parchment-texture text-stone-900 dark:text-parchment animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-oxblood dark:text-parchment/60 dark:hover:text-lamplight p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-oxblood"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>

        {/* Modal Header */}
        <div className="mb-6 border-b border-oxblood/10 dark:border-parchment/10 pb-4 pr-10">
          <span className="text-[10px] font-sans uppercase tracking-[0.4em] text-oxblood dark:text-oxblood-bright font-black">
            Chronicle Entry • {event.date}
          </span>
          <h2 id="modal-event-title" className="text-2xl sm:text-4xl font-display font-bold mt-1 text-ink dark:text-parchment">
            {event.title}
          </h2>
          <p className="text-sm font-sans text-stone-600 dark:text-parchment/70 italic mt-1">
            {event.subtitle}
          </p>
        </div>

        {/* Modal Grid Body */}
        <div className="grid md:grid-cols-12 gap-6 items-start">
          {/* Polaroid Image Showcase */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="bg-parchment-dark/50 dark:bg-lamplight-glow/10 p-3 rounded-md border border-stone-300/80 dark:border-parchment/20 shadow-xl w-full rotate-[-1deg]">
              <div className="aspect-[4/3] w-full overflow-hidden rounded bg-stone-800">
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
              <p className="font-display italic text-center text-xs text-stone-700 dark:text-parchment/80 mt-2 px-1">
                {event.imageCaption || event.title}
              </p>
            </div>
          </div>

          {/* Description Details */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <h3 className="text-xs font-sans uppercase tracking-widest text-oxblood dark:text-oxblood-bright font-bold mb-2">
                About the Event
              </h3>
              <p className="text-sm sm:text-base leading-relaxed italic text-stone-700 dark:text-parchment/90">
                "{event.description}"
              </p>
            </div>

            {/* Embedded Video Section (if youtubeUrl present) */}
            {embedUrl && (
              <div className="space-y-2">
                <h3 className="text-xs font-sans uppercase tracking-widest text-oxblood dark:text-oxblood-bright font-bold">
                  Event Highlights Video
                </h3>
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-oxblood/20 dark:border-parchment/20 shadow-md">
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
        <div className="mt-8 pt-4 border-t border-oxblood/10 dark:border-parchment/10 flex justify-end">
          <button
            onClick={onClose}
            className="bg-oxblood dark:bg-parchment text-parchment dark:text-ink font-bold py-2.5 px-6 rounded-lg text-xs uppercase tracking-widest hover:bg-black dark:hover:bg-white transition-colors"
          >
            Close Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
