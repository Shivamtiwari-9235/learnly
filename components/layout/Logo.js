export default function Logo({ compact = false }) {
  return (
    <span className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-[#5B4BFF] text-white shadow-sm">
      <svg width="26" height="26" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <circle cx="17" cy="19" r="10.5" stroke="#FFFFFF" strokeWidth="2.4" strokeOpacity="0.95" />
        <circle cx="17" cy="19" r="5.5" stroke="#FFB020" strokeWidth="2.2" />
        <circle cx="17" cy="19" r="2.2" fill="#FFB020" />
        <path d="M29 7L19 17" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M24.5 7H29V11.5" stroke="#FFB020" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {!compact && <span className="font-display font-extrabold text-base tracking-tight">Learnly</span>}
    </span>
  );
}
