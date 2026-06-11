import React, { useMemo, useState } from 'react';
import {
  getTeamForYear,
  getFounders,
  getAvailableYears,
  type TeamMember,
} from '../data/teamHistory';
import TeamCard from '../components/TeamCard';

// Small-caps section label flanked by hairlines — same pattern as
// LeaderboardPage's "Hall of Fame" divider.
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-6">
    <div className="flex-1 h-px bg-oxblood/10 dark:bg-parchment/10" />
    <span className="text-[10px] font-sans uppercase tracking-[0.4em] text-oxblood/70 dark:text-parchment/70 font-black whitespace-nowrap">
      {children}
    </span>
    <div className="flex-1 h-px bg-oxblood/10 dark:bg-parchment/10" />
  </div>
);

// ── Year Selector ─────────────────────────────────────────────────────────────
interface YearSelectorProps {
  years: number[];
  selected: number;
  onChange: (year: number) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({ years, selected, onChange }) => {
  if (years.length <= 1) return null; // Hide if only one year exists

  return (
    <div className="flex items-center gap-3 flex-wrap justify-center">
      <span className="text-[10px] font-sans uppercase tracking-[0.4em] text-oxblood/50 dark:text-parchment/40 font-black">
        Year
      </span>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {years.map((year) => {
          const isActive = year === selected;
          return (
            <button
              key={year}
              id={`year-selector-${year}`}
              onClick={() => onChange(year)}
              className={`px-4 py-1.5 rounded-full text-xs font-sans font-bold uppercase tracking-widest
                          border transition-all duration-300
                          ${isActive
                            ? 'bg-oxblood text-lamplight border-oxblood shadow-md shadow-oxblood/30'
                            : 'bg-transparent text-oxblood dark:text-parchment/60 border-oxblood/20 dark:border-parchment/20 hover:border-oxblood/60 dark:hover:border-parchment/40 hover:text-oxblood dark:hover:text-parchment'
                          }`}
            >
              {year}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────

const QuillCouncilPage: React.FC = () => {
  const availableYears = useMemo(() => getAvailableYears(), []);
  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0]);

  const founders = useMemo(() => getFounders(), []);

  const yearTeam = useMemo(() => getTeamForYear(selectedYear), [selectedYear]);

  const leadership = useMemo(
    () => yearTeam.filter((m) => m.category === 'current-leadership'),
    [yearTeam]
  );
  const departments = useMemo(
    () => yearTeam.filter((m) => m.category === 'department'),
    [yearTeam]
  );

  const renderSection = (
    title: string,
    members: TeamMember[],
    gridClass: string
  ) => (
    <section className="w-full max-w-6xl px-4 space-y-8">
      <SectionLabel>{title}</SectionLabel>
      <div className={`grid gap-6 ${gridClass}`}>
        {members.map((m, i) => (
          <TeamCard
            key={m.id}
            member={m}
            size={title.startsWith('The Department') ? 'department' : 'leadership'}
            index={i}
          />
        ))}
      </div>
    </section>
  );

  return (
    <div className="flex flex-col gap-16 py-10 md:py-16 items-center">
      {/* HERO */}
      <section className="text-center space-y-6 max-w-3xl px-6 animate-fade-in-up">
        <span className="text-xs font-sans uppercase tracking-[0.5em] text-oxblood dark:text-oxblood-bright font-black opacity-80">
          The Quill Council
        </span>
        <h1 className="text-5xl md:text-7xl font-display font-black italic text-ink dark:text-parchment tracking-tighter uppercase">
          The hands behind the <em className="not-italic text-oxblood dark:text-oxblood-bright">ink</em>
        </h1>
        <p className="font-display italic text-stone-500 dark:text-parchment/60 text-lg leading-relaxed">
          "Meet the curators, scribes, and stewards who keep Poéthra breathing —
          week after week, page after page."
        </p>

        {/* Decorative oxblood rule, mirror of HandwrittenQuote's lines */}
        <svg
          viewBox="0 0 600 6"
          className="w-full max-w-sm md:max-w-md h-auto mx-auto"
          aria-hidden="true"
        >
          <line
            x1="0"
            y1="3"
            x2="600"
            y2="3"
            stroke="#6B1C2A"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </section>

      {/* YEAR SELECTOR — Only shown when multiple years exist */}
      {availableYears.length > 1 && (
        <div className="w-full max-w-6xl px-4">
          <YearSelector
            years={availableYears}
            selected={selectedYear}
            onChange={setSelectedYear}
          />
        </div>
      )}

      {/* THE HELM — Changes per year */}
      {renderSection('The Helm', leadership, 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto')}

      {/* THE FOUNDERS — Permanent, unaffected by year selector */}
      {renderSection('The Founders', founders, 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto')}

      {/* THE DEPARTMENTS — Changes per year */}
      {renderSection(
        `The Departments — ${selectedYear}`,
        departments,
        'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
      )}
    </div>
  );
};

export default QuillCouncilPage;
