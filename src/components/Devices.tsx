import type { ReactNode } from 'react';

interface PhoneProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * A phone with a thin bezel. Sized by its parent; the bezel scales with it. The
 * screen loads lazily, so a phone hidden by the theme never downloads.
 */
export function Phone({ src, alt, className = '' }: PhoneProps) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone-body">
        <img
          src={src}
          alt={alt}
          width={600}
          height={1340}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

interface WebPageProps {
  children: ReactNode;
  className?: string;
}

/** A web page on its own: a 16:9 screen with rounded corners, no browser bar. */
export function WebPage({ children, className = '' }: WebPageProps) {
  return (
    <div className={`web-page ${className}`}>
      <div className="web-page-body">{children}</div>
    </div>
  );
}
