import { useState } from 'react';

import { getActiveEvent, type SeasonalEvent } from '@/events/seasonal-events';

export function useActiveEvent(): SeasonalEvent | null {
  const [event] = useState(() => {
    const override = new URLSearchParams(window.location.search).get('event');
    return getActiveEvent(new Date(), override);
  });
  return event;
}
