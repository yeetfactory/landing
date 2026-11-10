import type { ReactNode } from 'react';

const looks = {
  /** The one main action in a group. */
  primary: 'bg-fg text-bg hover:opacity-85',
  secondary: 'border border-fg/20 text-fg hover:border-fg/60',
  /** Over footage, in either theme. */
  glass:
    'border border-white/30 bg-black/10 text-white backdrop-blur-md hover:border-white/70',
} as const;

interface PillLinkProps {
  href: string;
  children: ReactNode;
  look?: keyof typeof looks;
  className?: string;
}

export function PillLink({
  href,
  children,
  look = 'secondary',
  className = '',
}: PillLinkProps) {
  return (
    <a
      href={href}
      className={`inline-flex h-11 items-center rounded-full px-[1.125rem] text-[0.9375rem] font-medium transition sm:px-5 ${looks[look]} ${className}`}
    >
      {children}
    </a>
  );
}
