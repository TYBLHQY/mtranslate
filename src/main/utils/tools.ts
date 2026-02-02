export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number = 500,
): (...args: Args) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, wait);
  };
}
