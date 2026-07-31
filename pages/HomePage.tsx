import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLatestEvent } from '../data/events';
import PolaroidCard from '../components/PolaroidCard';
import EventModal from '../components/EventModal';
import { ClubEvent } from '../types';

// -----------------------------------------------------------------------------
// HandwrittenQuote - Idea 3: Living Typography (v2)
//
// Each word of the quote is revealed individually, staggered in sequence.
// The transition mimics ink being deposited on paper:
//   - starts slightly blurred (wet ink spreading) + offset downward
//   - clears and settles in place as it "dries"
//   - a faint rotation on each word's entry gives it a handmade, uneven feel
//
// Two oxblood ruled lines draw in via SVG stroke-dashoffset.
// No absolutely-positioned off-screen elements → zero mobile overflow risk.
// Respects prefers-reduced-motion.
// -----------------------------------------------------------------------------

const QUOTE = 'Etched in ink, celebrated in spirit.';

// Slightly varied per-word easing offsets so it doesn't feel robotic.
// Values are small rotation deltas in degrees (+ or –).
const WORD_TILTS = [0.2, -0.3, 0.4, -0.2, 0.3, -0.4, 0.2];

const HandwrittenQuote: React.FC = () => {
    const [triggered, setTriggered] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    React.useEffect(() => {
        if (reducedMotion) {
            setTriggered(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setTriggered(true), 200);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.5 }
        );

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [reducedMotion]);

    const words = QUOTE.split(' ');

    // Top line draws immediately; bottom line draws after all words settle.
    const topLineDelay    = 0;          // s
    const wordStartDelay  = 0.8;        // s - after top line finishes
    const perWordGap      = 0.18;       // s between each word
    const wordDuration    = 0.55;       // s for each word's reveal
    const lastWordEnd     = wordStartDelay + (words.length - 1) * perWordGap + wordDuration;
    const bottomLineDelay = lastWordEnd + 0.15;

    const linePath = (delay: number) => ({
        strokeDasharray: '600' as const,
        strokeDashoffset: triggered ? '0' : '600',
        style: {
            transition: reducedMotion
                ? 'none'
                : `stroke-dashoffset 1.1s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
        },
    });

    return (
        <div
            ref={containerRef}
            className="flex flex-col items-center gap-2 py-10 select-none w-full"
        >
            {/* ── Top ruled line ──────────────────────────────────────── */}
            <svg
                viewBox="0 0 600 6"
                className="w-full max-w-sm md:max-w-md h-auto"
                aria-hidden="true"
            >
                <line
                    x1="0" y1="3" x2="600" y2="3"
                    stroke="#6B1C2A" strokeWidth="1" strokeLinecap="round"
                    {...linePath(topLineDelay)}
                />
            </svg>

            {/* ── Word-by-word ink deposit ─────────────────────────── */}
            <p
                className="font-display italic text-xl sm:text-2xl text-stone-600 dark:text-parchment/70 flex flex-wrap justify-center"
                style={{ gap: '0 0.4em', lineHeight: 1.6 }}
            >
                {words.map((word, i) => {
                    const delay = reducedMotion ? 0 : wordStartDelay + i * perWordGap;
                    const tilt  = WORD_TILTS[i % WORD_TILTS.length];

                    return (
                        <span
                            key={i}
                            style={{
                                display: 'inline-block',
                                opacity:   triggered ? 1 : 0,
                                filter:    triggered ? 'blur(0px)' : 'blur(5px)',
                                transform: triggered
                                    ? 'translateY(0px) rotate(0deg)'
                                    : `translateY(5px) rotate(${tilt}deg)`,
                                transition: reducedMotion
                                    ? 'none'
                                    : [
                                        `opacity   ${wordDuration}s ease          ${delay}s`,
                                        `filter    ${wordDuration}s ease          ${delay}s`,
                                        `transform ${wordDuration}s cubic-bezier(0.34, 1.2, 0.64, 1) ${delay}s`,
                                      ].join(', '),
                            }}
                        >
                            {word}
                        </span>
                    );
                })}
            </p>

            {/* ── Bottom ruled line ────────────────────────────────── */}
            <svg
                viewBox="0 0 600 6"
                className="w-full max-w-sm md:max-w-md h-auto"
                aria-hidden="true"
            >
                <line
                    x1="0" y1="3" x2="600" y2="3"
                    stroke="#6B1C2A" strokeWidth="1" strokeLinecap="round"
                    {...linePath(bottomLineDelay)}
                />
            </svg>
        </div>
    );
};

// -----------------------------------------------------------------------------
// HomePage
// -----------------------------------------------------------------------------
const HomePage: React.FC = () => {
    const latestEvent = React.useMemo(() => getLatestEvent(), []);
    const [selectedEvent, setSelectedEvent] = React.useState<ClubEvent | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleOpenModal = (event: ClubEvent) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedEvent(null), 200);
    };

    return (
        <div className="flex flex-col items-center gap-16 py-10 md:py-16">
            {/* HERO SECTION */}
            <div className="relative w-full max-w-6xl aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl shadow-ink/20 group animate-fade-in-up">
                <img 
                    src="/poethra_hero_literary.png" 
                    alt="A literary desk with books and quill" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                    loading="eager"
                    fetchpriority="high"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent flex flex-col justify-end p-6 md:p-12">
                    <h1 className="text-[clamp(2.25rem,5vw,4.25rem)] font-display font-black text-parchment leading-[1.1] tracking-tighter italic uppercase animate-fade-in-up">
                        Words find <br/> their wings.
                    </h1>
                </div>

            </div>

            {/* SECTION 1: THE MANIFESTO - "Why Poéthra Exists" */}
            <section className="w-full max-w-5xl px-4 sm:px-6 space-y-8 animate-fade-in-up">
                <div className="text-center space-y-3 max-w-2xl mx-auto">
                    <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-display font-bold text-ink dark:text-parchment leading-tight">
                        Why Poéthra Exists
                    </h2>
                    <p className="text-stone-600 dark:text-parchment/70 text-base sm:text-lg leading-relaxed italic max-w-xl mx-auto">
                        Rooted in Constitution §4(1) — a sanctuary for original verse, aesthetic thought, and creative expression.
                    </p>
                </div>

                {/* 3 Letterpress Vellum Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {/* Card 1: Cultivate */}
                    <div className="bg-parchment-dark/30 dark:bg-ink-light/40 border border-oxblood/15 dark:border-parchment/15 p-6 sm:p-7 rounded-xl shadow-md hover:shadow-[0_8px_24px_rgba(107,28,42,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 relative group">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="w-9 h-9 rounded-full bg-oxblood text-parchment font-display font-bold text-sm tracking-wider flex items-center justify-center shadow-sm">
                                    I
                                </span>
                                <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-oxblood/60 dark:text-parchment/50 font-bold">
                                    Pillar I
                                </span>
                            </div>
                            <h3 className="text-xl font-display font-bold text-ink dark:text-parchment pt-1">
                                Cultivate
                            </h3>
                            <p className="text-stone-600 dark:text-parchment/75 text-sm sm:text-base leading-relaxed">
                                A nurturing space for aesthetic thought and storytelling, cultivating new writers and encouraging original poets to emerge.
                            </p>
                        </div>
                        <div className="pt-2 border-t border-oxblood/10 dark:border-parchment/10 text-xs font-sans italic text-stone-500 dark:text-parchment/50">
                            Constitution §4(1) • Aesthetic Space
                        </div>
                    </div>

                    {/* Card 2: Perform */}
                    <div className="bg-parchment-dark/30 dark:bg-ink-light/40 border border-oxblood/15 dark:border-parchment/15 p-6 sm:p-7 rounded-xl shadow-md hover:shadow-[0_8px_24px_rgba(107,28,42,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 relative group">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="w-9 h-9 rounded-full bg-oxblood text-parchment font-display font-bold text-sm tracking-wider flex items-center justify-center shadow-sm">
                                    II
                                </span>
                                <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-oxblood/60 dark:text-parchment/50 font-bold">
                                    Pillar II
                                </span>
                            </div>
                            <h3 className="text-xl font-display font-bold text-ink dark:text-parchment pt-1">
                                Perform
                            </h3>
                            <p className="text-stone-600 dark:text-parchment/75 text-sm sm:text-base leading-relaxed">
                                Curated performances, creative writing sessions, lyricism, and spoken word forums that give living voice to poetic art.
                            </p>
                        </div>
                        <div className="pt-2 border-t border-oxblood/10 dark:border-parchment/10 text-xs font-sans italic text-stone-500 dark:text-parchment/50">
                            Constitution §4(1) • Stage & Forums
                        </div>
                    </div>

                    {/* Card 3: Publish */}
                    <div className="bg-parchment-dark/30 dark:bg-ink-light/40 border border-oxblood/15 dark:border-parchment/15 p-6 sm:p-7 rounded-xl shadow-md hover:shadow-[0_8px_24px_rgba(107,28,42,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 relative group">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="w-9 h-9 rounded-full bg-oxblood text-parchment font-display font-bold text-sm tracking-wider flex items-center justify-center shadow-sm">
                                    III
                                </span>
                                <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-oxblood/60 dark:text-parchment/50 font-bold">
                                    Pillar III
                                </span>
                            </div>
                            <h3 className="text-xl font-display font-bold text-ink dark:text-parchment pt-1">
                                Publish
                            </h3>
                            <p className="text-stone-600 dark:text-parchment/75 text-sm sm:text-base leading-relaxed">
                                Publishing members' original works, refining craft, and partnering with publications to support and elevate literary artistry.
                            </p>
                        </div>
                        <div className="pt-2 border-t border-oxblood/10 dark:border-parchment/10 text-xs font-sans italic text-stone-500 dark:text-parchment/50">
                            Constitution §4(1) • Member Works
                        </div>
                    </div>
                </div>

                {/* Constitution Charter Pull-Quote */}
                <div className="pt-4 flex flex-col items-center gap-3 max-w-3xl mx-auto text-center">
                    <svg viewBox="0 0 600 6" className="w-full max-w-md h-auto opacity-75" aria-hidden="true">
                        <line x1="0" y1="3" x2="600" y2="3" stroke="#6B1C2A" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                    <p className="font-display italic text-base sm:text-lg text-ink/80 dark:text-parchment/80 leading-relaxed px-4">
                        “The Society shall aim to promote the appreciation and creation of original verse, lyrical expression, and literary artistry... serving as a nurturing space for aesthetic thought.”
                    </p>
                    <span className="text-xs uppercase tracking-[0.3em] font-bold text-oxblood dark:text-oxblood-bright">
                        — Article 4, Constitution of Poéthra
                    </span>
                    <svg viewBox="0 0 600 6" className="w-full max-w-md h-auto opacity-75" aria-hidden="true">
                        <line x1="0" y1="3" x2="600" y2="3" stroke="#6B1C2A" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                </div>
            </section>

            {/* SECTION 2: THE WRITER'S LEDGER - "What You Gain" */}
            <section className="w-full max-w-5xl px-4 sm:px-6 my-4">
                <div className="bg-parchment-dark/40 dark:bg-ink-light/50 border border-oxblood/20 dark:border-parchment/20 p-6 sm:p-10 md:p-12 rounded-2xl shadow-xl relative overflow-hidden space-y-8">
                    
                    {/* Header Ribbon */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-oxblood/15 dark:border-parchment/15 pb-6">
                        <div>
                            <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-oxblood dark:text-oxblood-bright font-black">
                                Member Privileges & Pursuits
                            </span>
                            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-display font-bold text-ink dark:text-parchment leading-tight">
                                The Writer's Ledger
                            </h2>
                        </div>
                        <div className="inline-flex items-center gap-2 bg-oxblood/10 dark:bg-parchment/10 text-oxblood dark:text-parchment px-3 py-1.5 rounded-full text-xs font-display font-bold border border-oxblood/20 dark:border-parchment/20 self-start sm:self-auto">
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                            </svg>
                            <span>Constitution §4(1)+(2)</span>
                        </div>
                    </div>

                    {/* 4 Concrete Ledger Entries (Staggered 2x2 Grid) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        
                        {/* Entry 1: A Stage */}
                        <div className="group p-5 rounded-xl border border-oxblood/10 dark:border-parchment/10 bg-parchment/50 dark:bg-ink/40 hover:bg-oxblood/5 dark:hover:bg-parchment/5 transition-all duration-300 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-oxblood/10 dark:bg-parchment/10 text-oxblood dark:text-parchment flex items-center justify-center flex-shrink-0 group-hover:bg-oxblood group-hover:text-parchment dark:group-hover:bg-parchment dark:group-hover:text-ink transition-colors duration-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-display font-bold text-ink dark:text-parchment group-hover:text-oxblood dark:group-hover:text-oxblood-bright transition-colors">
                                    A Stage
                                </h3>
                                <p className="text-stone-600 dark:text-parchment/70 text-sm leading-relaxed">
                                    Curated performances, showcases, open forums, and collaborative events where your voice is heard and celebrated.
                                </p>
                            </div>
                        </div>

                        {/* Entry 2: Craft */}
                        <div className="group p-5 rounded-xl border border-oxblood/10 dark:border-parchment/10 bg-parchment/50 dark:bg-ink/40 hover:bg-oxblood/5 dark:hover:bg-parchment/5 transition-all duration-300 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-oxblood/10 dark:bg-parchment/10 text-oxblood dark:text-parchment flex items-center justify-center flex-shrink-0 group-hover:bg-oxblood group-hover:text-parchment dark:group-hover:bg-parchment dark:group-hover:text-ink transition-colors duration-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-display font-bold text-ink dark:text-parchment group-hover:text-oxblood dark:group-hover:text-oxblood-bright transition-colors">
                                    Craft
                                </h3>
                                <p className="text-stone-600 dark:text-parchment/70 text-sm leading-relaxed">
                                    Interactive workshops, dedicated writing sessions, and guidance from established writers & literary mentors.
                                </p>
                            </div>
                        </div>

                        {/* Entry 3: A Panel */}
                        <div className="group p-5 rounded-xl border border-oxblood/10 dark:border-parchment/10 bg-parchment/50 dark:bg-ink/40 hover:bg-oxblood/5 dark:hover:bg-parchment/5 transition-all duration-300 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-oxblood/10 dark:bg-parchment/10 text-oxblood dark:text-parchment flex items-center justify-center flex-shrink-0 group-hover:bg-oxblood group-hover:text-parchment dark:group-hover:bg-parchment dark:group-hover:text-ink transition-colors duration-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-display font-bold text-ink dark:text-parchment group-hover:text-oxblood dark:group-hover:text-oxblood-bright transition-colors">
                                    A Panel
                                </h3>
                                <p className="text-stone-600 dark:text-parchment/70 text-sm leading-relaxed">
                                    Dedicated weekly contest reviewers who actually read, score, and provide thoughtful feedback on every submission.
                                </p>
                            </div>
                        </div>

                        {/* Entry 4: Community */}
                        <div className="group p-5 rounded-xl border border-oxblood/10 dark:border-parchment/10 bg-parchment/50 dark:bg-ink/40 hover:bg-oxblood/5 dark:hover:bg-parchment/5 transition-all duration-300 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-oxblood/10 dark:bg-parchment/10 text-oxblood dark:text-parchment flex items-center justify-center flex-shrink-0 group-hover:bg-oxblood group-hover:text-parchment dark:group-hover:bg-parchment dark:group-hover:text-ink transition-colors duration-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-display font-bold text-ink dark:text-parchment group-hover:text-oxblood dark:group-hover:text-oxblood-bright transition-colors">
                                    Community
                                </h3>
                                <p className="text-stone-600 dark:text-parchment/70 text-sm leading-relaxed">
                                    A warm, welcoming sanctuary of like-minded peers who share your passion for poetry, storytelling, and aesthetic growth.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* INFO SECTION */}
            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 md:gap-12 items-center px-4 sm:px-6">
                <div className="space-y-6">
                    <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-display font-bold text-ink dark:text-parchment leading-tight">
                        The Heart of Our <br/> <span className="text-oxblood">Creative Writing</span> Community.
                    </h2>
                    <p className="text-stone-600 dark:text-parchment/70 text-lg leading-relaxed italic">
                        "Each week, we invite you to step into the quiet sanctuary of the page. To challenge your voice, to find your rhyme, and to belong to something timeless."
                    </p>
                </div>

                <div className="bg-parchment-dark/50 dark:bg-ink-light/70 p-5 sm:p-8 rounded-xl border border-oxblood/10 dark:border-parchment/10 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-oxblood/5 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                    
                    <h3 className="text-xl font-display font-bold text-oxblood dark:text-parchment mb-4 uppercase tracking-widest">The Weekly Ledger</h3>
                    <p className="text-stone-700 dark:text-parchment/80 mb-8 leading-relaxed">
                        Every submission is a piece of history. Every streak is a testament to devotion. Join our panel of reviewers and see your name etched among the triumphants.
                    </p>
                    
                    <Link to="/leaderboard">
                        <button className="w-full bg-oxblood dark:bg-parchment text-parchment dark:text-ink font-bold py-4 px-8 rounded-lg text-sm uppercase tracking-[0.2em] hover:bg-black dark:hover:bg-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-oxblood/20">
                            View the Rankings
                        </button>
                    </Link>
                </div>
            </div>

            {/* LATEST EVENT SPOTLIGHT SECTION */}
            {latestEvent && (
                <div className="w-full max-w-5xl px-4 sm:px-6 my-2 sm:my-4">
                    <div className="bg-parchment-dark/40 dark:bg-ink-light/40 rounded-2xl sm:rounded-3xl border border-oxblood/15 dark:border-parchment/15 p-5 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-12">
                        {/* Polaroid Spotlight Image */}
                        <div className="w-full md:w-1/2 flex justify-center">
                            <PolaroidCard 
                                event={latestEvent} 
                                onClick={() => handleOpenModal(latestEvent)} 
                                featured={true}
                            />
                        </div>

                        {/* Event Info Callout */}
                        <div className="w-full md:w-1/2 space-y-4 sm:space-y-5 text-left">
                            <span className="text-[10px] font-sans uppercase tracking-[0.4em] text-oxblood dark:text-oxblood-bright font-black">
                                Latest Event Spotlight • {latestEvent.date}
                            </span>
                            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-display font-bold text-ink dark:text-parchment leading-tight">
                                {latestEvent.title}
                            </h2>
                            <p className="text-stone-600 dark:text-parchment/70 italic text-base leading-relaxed line-clamp-4">
                                "{latestEvent.description}"
                            </p>

                            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <button
                                    onClick={() => handleOpenModal(latestEvent)}
                                    className="bg-oxblood dark:bg-parchment text-parchment dark:text-ink font-bold py-3 px-6 rounded-lg text-xs uppercase tracking-widest hover:bg-black dark:hover:bg-white transition-all duration-300 shadow-md"
                                >
                                    View Event Details
                                </button>
                                <Link to="/chronicles">
                                    <button className="w-full sm:w-auto border border-oxblood dark:border-parchment text-oxblood dark:text-parchment font-bold py-3 px-6 rounded-lg text-xs uppercase tracking-widest hover:bg-oxblood/10 dark:hover:bg-parchment/10 transition-colors">
                                        Explore All Chronicles &rarr;
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* FOOTER QUOTE - Living Typography */}
            <div className="w-full text-center overflow-hidden">
                <HandwrittenQuote />
            </div>

            {/* EVENT MODAL */}
            <EventModal
                event={selectedEvent}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default HomePage;
