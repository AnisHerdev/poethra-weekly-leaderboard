import React from 'react';
import type { TeamMember } from '../data/teamHistory';

interface TeamCardProps {
  member: TeamMember;
  size: 'leadership' | 'department';
  /** Stagger index for entrance animation — resets per section on the page. */
  index: number;
}

const TeamCard: React.FC<TeamCardProps> = ({ member, size, index }) => {
  // First letter of the first name — used as the monogram character.
  const monogram = member.name.trim().charAt(0).toUpperCase();

  // Leadership gets a taller portrait stage; department cards are more compact
  // so a 4-up grid stays tight.
  const stageHeight = size === 'leadership' ? 'h-[200px]' : 'h-[140px]';
  const monogramSize = size === 'leadership' ? 'w-24 h-24 text-4xl' : 'w-20 h-20 text-3xl';

  return (
    <article
      aria-label={member.name}
      className="group relative flex flex-col overflow-hidden rounded-2xl
                 bg-parchment-dark/40 dark:bg-ink-light/50
                 border border-oxblood/10 dark:border-parchment/10
                 shadow-md shadow-oxblood/5 dark:shadow-black/20
                 bg-parchment-texture
                 transition-all duration-500
                 hover:-translate-y-1 hover:shadow-xl hover:shadow-oxblood/10 dark:hover:shadow-black/30
                 animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
    >
      {/* ── PORTRAIT STAGE ──────────────────────────────────────── */}
      <div
        className={`relative ${stageHeight}
                    bg-gradient-to-b from-transparent to-parchment-dark/40 dark:to-ink-light/40`}
      >
        {member.imageUrl ? (
          <div
            className="absolute inset-x-0 bottom-0 w-full h-full pointer-events-none transition-transform duration-500 origin-bottom"
            style={{
              transform: `scale(${member.imageSizePercent ? member.imageSizePercent / 100 : 1}) translateY(${member.imagePushDownPercent ? member.imagePushDownPercent : 0}%)`
            }}
          >
            <img
              src={member.imageUrl}
              alt={member.name}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        ) : (
          <div
            aria-hidden="true"
            className={`absolute left-1/2 bottom-4 -translate-x-1/2
                        ${monogramSize} rounded-full bg-oxblood text-lamplight
                        flex items-center justify-center
                        font-display italic font-black
                        ring-1 ring-oxblood-light/30 dark:ring-oxblood/40
                        shadow-inner shadow-oxblood-light/40
                        transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-105`}
          >
            <span className="-mt-0.5">{monogram}</span>
          </div>
        )}

        {/* Subtle oxblood baseline — the museum plinth the figure stands on */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 h-px w-8 bg-oxblood/30 dark:bg-parchment/30" />
      </div>

      {/* ── CAPTION STRIP ───────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 pt-4 pb-5
                      bg-parchment-dark/50 dark:bg-ink-light/90
                      border-t border-oxblood/10 dark:border-parchment/10">
        {/* Name */}
        <h3 className="font-display italic font-black text-xl text-ink dark:text-parchment leading-tight">
          {member.name}
        </h3>

        {/* Role */}
        <p className="mt-1 font-sans uppercase tracking-[0.2em] text-[10px] text-oxblood dark:text-oxblood-bright font-bold">
          {member.role}
        </p>

        {/* Hairline */}
        <div className="mt-3 mb-3 h-px w-8 bg-oxblood/20 dark:bg-parchment/20" />

        {/* Description */}
        <p className="font-display italic text-stone-600 dark:text-parchment/70 text-sm leading-relaxed max-w-[28ch]">
          {member.description}
        </p>
      </div>
    </article>
  );
};

export default TeamCard;
