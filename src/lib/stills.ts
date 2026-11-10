/**
 * The Network Information API: Chrome and Android report Data Saver and a
 * rough connection speed here. Safari and Firefox leave it undefined.
 */
declare global {
  interface Navigator {
    readonly connection?: {
      readonly saveData?: boolean;
      readonly effectiveType?: string;
    };
  }
}

/** Below about 1 Mbps a loop stalls more than it plays. */
const slowConnections = new Set(['slow-2g', '2g', '3g']);

/**
 * Whether to keep the still frames instead of playing video: for reduced
 * motion, Data Saver, or a connection too slow to stream the loops.
 */
export function prefersStills(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true;
  }

  const connection = navigator.connection;

  return (
    connection?.saveData === true ||
    slowConnections.has(connection?.effectiveType ?? '')
  );
}
