'use client';

import { useSyncExternalStore } from 'react';

const subscribe = (notify: () => void) => {
  const timer = window.setTimeout(notify, 0);
  return () => window.clearTimeout(timer);
};

export default function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
