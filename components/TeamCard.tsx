import React from 'react';
import type { TeamMember } from '../data/team';

interface TeamCardProps {
  member: TeamMember;
  size: 'leadership' | 'department';
  /** Stagger index for entrance animation — resets per section on the page. */
  index: number;
}

const TeamCard: React.FC<TeamCardProps> = ({ member, size, index }) => {
  // First letter of the first name — used as the monogram character.
  const monogram = member.name.trim().charAt(0).toUpperCase();

  const monogramClasses =
    size === 'leadership'
      ? 'w-20 h-20 text-3xl'
      : 'w-16 h-16 text-2xl';

  return (
    <article
      aria-label={member.name}
      className="group relative flex flex-col items-center text-center p-6 rounded-2xl
                 bg-parchment-dark/40 dark:bg-ink-light/50
                 border border-oxblood/10 dark:border-parchment/10
                 shadow-md shadow-oxblood/5 dark:shadow-black/20
                 bg-parchment-texture
                 transition-all duration-500
                 hover:-translate-y-1 hover:shadow-xl hover:shadow-oxblood/10 dark:hover:shadow-black/30
                 animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
    >
      {/* Monogram — wax-seal stamp */}
      {member.imageUrl ? (
        <img
          src={member.imageUrl}
          alt={member.name}
          className={`${monogramClasses} rounded-full object-cover mb-4 ring-1 ring-oxblood/20 dark:ring-parchment/20`}
        />
      ) : (
        <div
          aria-hidden="true"
          className={`${monogramClasses} mb-4 rounded-full bg-oxblood text-lamplight
                      flex items-center justify-center
                      font-display italic font-black
                      ring-1 ring-oxblood-light/30 dark:ring-oxblood/40
                      shadow-inner shadow-oxblood-light/40
                      transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-105`}
        >
          <span className="-mt-0.5">{monogram}</span>
        </div>
      )}

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
    </article>
  );
};

export default TeamCard;
