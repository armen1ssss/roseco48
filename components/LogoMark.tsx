/**
 * Знак лаборатории: росток из логотипа. Используется в шапке, подвале и как favicon.
 * Цвет передаётся пропом — на тёмном фоне знак белый.
 */
export function LogoMark({
  size = 30,
  color = 'var(--ink)',
  title,
}: {
  size?: number;
  color?: string;
  title?: string;
}) {
  return (
    <svg
      className="logo__mark"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d="M16 27V12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M16 14c-4.6-.6-7.4-3.6-7.6-8.4 4.9.3 7.7 3.4 7.6 8.4Z" fill="#9CAF88" />
      <path d="M16 17c3.8-.5 6.1-3 6.3-6.9-4 .2-6.4 2.8-6.3 6.9Z" fill="#D27A5A" />
      <path d="M6 27c3.4 2 6.7 2.6 10 2.6s6.6-.6 10-2.6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
