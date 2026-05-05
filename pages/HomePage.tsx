import React from 'react';
import { Link } from 'react-router-dom';

// -----------------------------------------------------------------------------
// HandwrittenQuote — Idea 3: Living Typography (v2)
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
    const wordStartDelay  = 0.8;        // s — after top line finishes
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
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent flex flex-col justify-end p-8 md:p-12">
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-black text-parchment leading-tight tracking-tighter italic uppercase animate-fade-in-up">
                        Words find <br/> their wings.
                    </h1>
                </div>
            </div>

            {/* INFO SECTION */}
            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-12 items-center px-6">
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-ink dark:text-parchment leading-tight">
                        The Heart of Our <br/> <span className="text-oxblood">Creative Writing</span> Community.
                    </h2>
                    <p className="text-stone-600 dark:text-parchment/70 text-lg leading-relaxed italic">
                        "Each week, we invite you to step into the quiet sanctuary of the page. To challenge your voice, to find your rhyme, and to belong to something timeless."
                    </p>
                </div>

                <div className="bg-parchment-dark/50 dark:bg-ink-light/70 p-8 rounded-xl border border-oxblood/10 dark:border-parchment/10 shadow-xl relative overflow-hidden group">
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
            
            {/* FOOTER QUOTE — Living Typography */}
            <div className="w-full text-center overflow-hidden">
                <HandwrittenQuote />
            </div>
        </div>
    );
};

export default HomePage;
