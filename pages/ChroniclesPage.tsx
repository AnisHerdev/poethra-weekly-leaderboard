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
    <div className="flex flex-col items-center gap-10 py-8 px-4 sm:px-6">
      {/* HERO SECTION */}
      <section className="text-center space-y-4 max-w-3xl animate-fade-in-up">
        <span className="text-xs font-sans uppercase tracking-[0.5em] text-oxblood dark:text-oxblood-bright font-black opacity-80">
          The Archives
        </span>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black text-ink dark:text-parchment tracking-tight italic uppercase">
          The Event Chronicles
        </h1>
        <p className="font-display italic text-stone-600 dark:text-parchment/70 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          "A visual scrapbook of our university launches, literary fair stalls, film screenings, and member gatherings—captured in Polaroid snapshots and memory."
        </p>
      </section>

      {/* TIMELINE SECTION */}
      <main className="w-full max-w-5xl relative my-4">
        {/* Central Dashed Timeline Axis (Desktop) */}
        <div
          className="hidden md:block absolute left-1/2 top-4 bottom-4 w-0.5 border-r-2 border-dashed border-oxblood/30 dark:border-parchment/30 -translate-x-1/2 pointer-events-none"
          aria-hidden="true"
        />

        {/* Left Dashed Timeline Axis (Mobile) */}
        <div
          className="md:hidden absolute left-5 top-4 bottom-4 w-0.5 border-r-2 border-dashed border-oxblood/30 dark:border-parchment/30 pointer-events-none"
          aria-hidden="true"
        />

        {/* EVENT LIST */}
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
                  className="absolute left-5 md:left-1/2 top-8 -translate-x-1/2 w-6 h-6 rounded-full bg-oxblood dark:bg-lamplight border-4 border-parchment dark:border-ink shadow-md z-10 group-hover:scale-125 transition-transform flex items-center justify-center"
                  aria-hidden="true"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-parchment dark:bg-ink" />
                </div>

                {/* DESKTOP ALTERNATING CONTAINER */}
                {/* Left Side (Even = Polaroid, Odd = Details Card) */}
                <div
                  className={`pl-12 md:pl-0 md:w-[46%] flex ${
                    isEven ? 'md:justify-end' : 'md:justify-start md:order-2'
                  }`}
                >
                  <PolaroidCard event={event} onClick={() => handleOpenModal(event)} />
                </div>

                {/* Right Side (Even = Details Card, Odd = Polaroid) */}
                <div
                  className={`pl-12 md:pl-0 md:w-[46%] flex flex-col justify-center ${
                    isEven ? 'md:order-2' : 'md:order-1 md:items-end text-left md:text-right'
                  }`}
                >
                  <div className="bg-[#FAF6EC] dark:bg-[#1C2638] p-6 sm:p-7 rounded-2xl border border-[#E2D6BE] dark:border-parchment/15 shadow-[0_8px_20px_-6px_rgba(27,42,74,0.12)] hover:shadow-[0_16px_32px_-8px_rgba(107,28,42,0.2)] transition-all duration-300 w-full max-w-lg relative group/card">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-oxblood dark:text-oxblood-bright font-black block mb-1">
                      {event.date}
                    </span>

                    <h2 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-parchment mb-2 tracking-tight">
                      {event.title}
                    </h2>
                    
                    <p className="text-xs font-sans text-oxblood/80 dark:text-oxblood-bright/80 font-bold mb-3 italic">
                      {event.subtitle}
                    </p>

                    <p className="text-xs sm:text-sm text-stone-600 dark:text-parchment/75 italic mb-4 line-clamp-3 leading-relaxed font-display">
                      "{event.description}"
                    </p>

                    {/* Action Link */}
                    <div className="flex items-center justify-end pt-4 border-t border-oxblood/10 dark:border-parchment/10 text-xs">
                      <button
                        onClick={() => handleOpenModal(event)}
                        className="text-oxblood dark:text-oxblood-bright font-bold uppercase tracking-wider hover:underline flex items-center gap-1.5 group-hover/card:translate-x-1 transition-transform"
                      >
                        <span>View Chronicle Entry</span>
                        <span aria-hidden="true">&rarr;</span>
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
      <section className="w-full max-w-3xl my-6">
        <div className="bg-parchment-dark/30 dark:bg-ink-light/30 border border-oxblood/15 dark:border-parchment/15 rounded-2xl p-6 text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-oxblood dark:text-oxblood-bright font-black">
            The Living Record
          </p>
          <p className="font-display italic text-stone-600 dark:text-parchment/70 text-sm">
            "More chapters are written every semester. Have photos or memories from a past Poéthra event?"
          </p>
          <div className="pt-2">
            <span className="text-[11px] font-sans text-stone-500 dark:text-parchment/50 uppercase tracking-widest font-bold">
              Submit your memories to the club archives &bull; RV University Poéthra
            </span>
          </div>
        </div>
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
