import React from 'react';
import { Link } from 'react-router-dom';

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
            
            {/* FOOTER QUOTE */}
            <div className="w-full text-center py-10">
                <p className="font-display italic text-2xl text-stone-600 dark:text-parchment/70">Etched in ink, celebrated in spirit.</p>
            </div>
        </div>
    );
};

export default HomePage;
