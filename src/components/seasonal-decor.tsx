import type { SeasonalEvent } from '@/events/seasonal-events';

const PARTICLE_COUNT = 14;

interface SeasonalDecorProps {
  event: SeasonalEvent | null;
}

export function SeasonalDecor({ event }: SeasonalDecorProps) {
  if (!event) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {Array.from({ length: PARTICLE_COUNT }, (_, index) => {
        const Particle = event.particles[index % event.particles.length];
        return (
          <Particle
            key={index}
            className="seasonal-particle"
            style={{
              left: `${(index * 37) % 100}%`,
              animationDelay: `${((index * 7) % 12) * -1}s`,
              animationDuration: `${12 + ((index * 5) % 8)}s`,
              width: `${14 + ((index * 3) % 10)}px`,
              height: `${14 + ((index * 3) % 10)}px`,
              color: event.colors[index % event.colors.length],
            }}
          />
        );
      })}
    </div>
  );
}
