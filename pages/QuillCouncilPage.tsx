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
  <div className="flex items-center gap-3 sm:gap-6">
    <div className="flex-1 h-px bg-oxblood/10 dark:bg-parchment/10" />
    <h2 className="text-[10px] font-sans uppercase tracking-widest sm:tracking-[0.4em] text-oxblood/70 dark:text-parchment/70 font-black whitespace-nowrap m-0">
      {children}
    </h2>
    <div className="flex-1 h-px bg-oxblood/10 dark:bg-parchment/10" />
  </div>
);

// ── Year Selector (pill tabs at the top) ─────────────────────────────────────
interface YearSelectorProps {
  years: number[];
  selected: number;
  onChange: (year: number) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({ years, selected, onChange }) => {
  if (years.length <= 1) return null; // Hide if only one year exists

  return (
    <div className="flex items-center gap-3 flex-wrap justify-center">
      <span className="text-[10px] font-sans uppercase tracking-widest sm:tracking-[0.4em] text-oxblood/70 dark:text-parchment/70 font-black">
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
              aria-current={isActive ? 'page' : undefined}
              className={`px-5 py-2.5 sm:px-4 sm:py-1.5 rounded-full text-xs font-sans font-bold uppercase tracking-widest
                          border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood/50 dark:focus-visible:ring-parchment/50
                          ${isActive
                            ? 'bg-oxblood text-lamplight border-oxblood shadow-md shadow-oxblood/30'
                            : 'bg-transparent text-oxblood dark:text-parchment/70 border-oxblood/30 dark:border-parchment/30 hover:border-oxblood/70 dark:hover:border-parchment/50 hover:text-oxblood dark:hover:text-parchment'
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

// ── Year Arrow Nav (prev/next beside the section label) ─────────────────────
interface YearArrowNavProps {
  years: number[];
  selected: number;
  onChange: (year: number) => void;
}

// Single chevron button — `flip` mirrors it horizontally for the left arrow
const ChevronBtn: React.FC<{
  onClick: () => void;
  disabled: boolean;
  flip?: boolean;
  id: string;
  title: string;
}> = ({ onClick, disabled, flip, id, title }) => (
  <button
    id={id}
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
    className={`flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-7 sm:h-7 rounded-full border
                transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood/50 dark:focus-visible:ring-parchment/50
                ${disabled
                  ? 'border-oxblood/20 dark:border-parchment/20 text-oxblood/40 dark:text-parchment/40 cursor-not-allowed'
                  : 'border-oxblood/40 dark:border-parchment/30 text-oxblood dark:text-parchment/70 hover:border-oxblood dark:hover:border-parchment/60 hover:bg-oxblood/5 dark:hover:bg-parchment/5'
                }`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-3.5 h-3.5 transition-transform duration-300 ${flip ? '-scale-x-100' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

const YearArrowNav: React.FC<YearArrowNavProps> = ({ years, selected, onChange }) => {
  if (years.length <= 1) return null;

  // years is sorted newest-first, so older = higher index
  const currentIndex = years.indexOf(selected);
  const canGoOlder = currentIndex < years.length - 1;
  const canGoNewer = currentIndex > 0;

  return {
    left: (
      <ChevronBtn
        id="year-nav-prev"
        onClick={() => canGoOlder && onChange(years[currentIndex + 1])}
        disabled={!canGoOlder}
        flip
        title={canGoOlder ? `Go to ${years[currentIndex + 1]}` : 'No older year'}
      />
    ),
    right: (
      <ChevronBtn
        id="year-nav-next"
        onClick={() => canGoNewer && onChange(years[currentIndex - 1])}
        disabled={!canGoNewer}
        title={canGoNewer ? `Go to ${years[currentIndex - 1]}` : 'No newer year'}
      />
    ),
  };
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
  const advisors = useMemo(
    () => yearTeam.filter((m) => m.category === 'advisors'),
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

  // Departments section gets arrow nav on far left and far right of the label row
  const renderDepartmentsSection = (members: TeamMember[], gridClass: string) => {
    const nav = availableYears.length > 1
      ? YearArrowNav({ years: availableYears, selected: selectedYear, onChange: setSelectedYear })
      : null;

    return (
      <section className="w-full max-w-6xl px-4 space-y-8">
        {/* Label row: hairline — [←] DEPARTMENTS — YEAR [→] — hairline */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1 h-px bg-oxblood/10 dark:bg-parchment/10" />
          {nav ? nav.left : null}
          <h2 className="text-[10px] font-sans uppercase tracking-widest sm:tracking-[0.4em] text-oxblood/70 dark:text-parchment/70 font-black whitespace-nowrap m-0">
            The Departments — {selectedYear}
          </h2>
          {nav ? nav.right : null}
          <div className="flex-1 h-px bg-oxblood/10 dark:bg-parchment/10" />
        </div>

        <div className={`grid gap-6 ${gridClass}`}>
          {members.map((m, i) => (
            <TeamCard
              key={m.id}
              member={m}
              size="department"
              index={i}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="flex flex-col gap-10 sm:gap-16 py-8 sm:py-10 md:py-16 items-center">
      {/* HERO */}
      <section className="text-center space-y-4 sm:space-y-6 max-w-3xl px-6 animate-fade-in-up">
        <span className="text-xs font-sans uppercase tracking-widest sm:tracking-[0.5em] text-oxblood dark:text-oxblood-bright font-black opacity-80">
          The Quill Council
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black italic text-ink dark:text-parchment tracking-tighter uppercase">
          The hands behind the <em className="not-italic text-oxblood dark:text-oxblood-bright">ink</em>
        </h1>
        <p className="font-display italic text-oxblood/80 dark:text-parchment/80 text-lg leading-relaxed">
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
            className="stroke-oxblood/60 dark:stroke-oxblood-bright/60"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </section>

      {/* YEAR SELECTOR PILLS — Only shown when multiple years exist */}
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

      {/* THE DEPARTMENTS — Changes per year, with inline arrow nav */}
      {renderDepartmentsSection(departments, 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4')}

      {/* THE GUIDING HANDS */}
      {advisors.length > 0 && renderSection('The Guiding Hands', advisors, 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto')}
    </div>
  );
};

export default QuillCouncilPage;
