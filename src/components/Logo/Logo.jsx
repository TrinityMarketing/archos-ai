export default function Logo({ className = '' }) {
  return (
    <svg
      className={`logo-icon ${className}`}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16 2L28 26H4L16 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="16" cy="14" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
