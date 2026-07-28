import React, { useState, useMemo } from 'react';
import { CLUB_EVENTS, getEventsSortedNewest } from '../data/events';
import { ClubEvent } from '../types';
import PolaroidCard from '../components/PolaroidCard';
import EventModal from '../components/EventModal';

const ChroniclesPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Show events sorted chronologically (newest first for timeline flow)
  const events = useMemo(() => getEventsSortedNewest(), []);

  const handleOpenModal = (event: ClubEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedEvent(null), 200);
  };

  return (
    <div className="flex flex-col items-center gap-12 py-10">
      {/* HERO SECTION */}
      <section className="text-center space-y-4 max-w-3xl px-6 animate-fade-in-up">
        <span className="text-xs font-sans uppercase tracking-[0.5em] text-oxblood dark:text-oxblood-bright font-black opacity-80">
          The Archives
        </span>
        <h1 className="text-5xl md:text-8xl font-display font-black text-ink dark:text-parchment tracking-tighter italic uppercase">
          The Event Chronicles
        </h1>
        <p className="font-display italic text-stone-500 dark:text-parchment/60 text-lg leading-relaxed">
          "A visual scrapbook of our university launches, literary fair stalls, film screenings, and member gatherings—captured in Polaroid snapshots and memory."
        </p>
      </section>

      {/* TIMELINE SECTION */}
      <main className="w-full max-w-6xl px-4 sm:px-6 relative my-6">
        {/* Central Dashed Timeline Axis (Desktop) */}
        <div 
          className="hidden md:block absolute left-1/2 top-4 bottom-4 w-0.5 border-r-2 border-dashed border-oxblood/30 dark:border-parchment/30 -translate-x-1/2 pointer-events-none"
          aria-hidden="true"
        />

        {/* Left Dashed Timeline Axis (Mobile) */}
        <div 
          className="md:hidden absolute left-6 top-4 bottom-4 w-0.5 border-r-2 border-dashed border-oxblood/30 dark:border-parchment/30 pointer-events-none"
          aria-hidden="true"
        />

        {/* Event List */}
        <div className="space-y-16 md:space-y-24 relative">
          {events.map((event, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={event.id}
                className="relative flex flex-col md:flex-row items-center justify-between gap-8 group"
              >
                {/* Timeline Dot Marker */}
                <div 
                  className="absolute left-6 md:left-1/2 top-6 -translate-x-1/2 w-5 h-5 rounded-full bg-oxblood dark:bg-lamplight border-4 border-parchment dark:border-ink shadow-md z-10 group-hover:scale-125 transition-transform"
                  aria-hidden="true"
                />

                {/* DESKTOP ALTERNATING CONTAINER */}
                {/* Left Side (Even = Polaroid, Odd = Details Card) */}
                <div className={`pl-14 md:pl-0 md:w-[45%] flex ${isEven ? 'md:justify-end' : 'md:justify-start md:order-2'}`}>
                  <PolaroidCard event={event} onClick={() => handleOpenModal(event)} />
                </div>

                {/* Right Side (Even = Details Card, Odd = Polaroid) */}
                <div className={`pl-14 md:pl-0 md:w-[45%] flex flex-col justify-center ${isEven ? 'md:order-2' : 'md:order-1 md:items-end text-left md:text-right'}`}>
                  <div className="bg-parchment-dark/30 dark:bg-ink-light/50 p-6 sm:p-8 rounded-2xl border border-oxblood/10 dark:border-parchment/10 shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-lg">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-oxblood dark:text-oxblood-bright font-black block mb-1">
                      {event.date}
                    </span>
                    <h2 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-parchment mb-2">
                      {event.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-parchment/70 italic mb-4 line-clamp-3 leading-relaxed">
                      "{event.description}"
                    </p>

                    {/* Action Link */}
                    <div className="flex items-center justify-end pt-4 border-t border-oxblood/10 dark:border-parchment/10 text-xs">
                      <button
                        onClick={() => handleOpenModal(event)}
                        className="text-oxblood dark:text-oxblood-bright font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
                      >
                        View Chronicle Entry &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* FOOTER CALLOUT */}
      <section className="text-center py-8">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500 dark:text-parchment/50 font-sans italic">
          More chapters are written every semester.
        </p>
      </section>

      {/* DETAILED EVENT MODAL */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ChroniclesPage;
