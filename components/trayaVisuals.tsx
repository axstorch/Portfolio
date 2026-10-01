import React from 'react';
import { TRAYA_FUNNEL, TRAYA_QUADRANTS, TRAYA_INSIGHTS } from '../constants';

/**
 * The funnel from slide 3 of the Traya deck, rebuilt as a real component
 * rather than a screenshot so it stays sharp and readable on any screen.
 */
export const TrayaFunnel: React.FC = () => {
  return (
    <figure className="bg-[#FBF8F4] border border-[#1C1C1C]/10 rounded-xl p-6">
      <figcaption className="text-xs uppercase tracking-[0.2em] text-[#8B5E3C] mb-5">
        Conversion funnel by stage
      </figcaption>

      <ol className="space-y-2">
        {TRAYA_FUNNEL.map((s, i) => {
          const prev = i === 0 ? 100 : TRAYA_FUNNEL[i - 1].percent;
          const drop = prev - s.percent;
          return (
            <li key={s.label}>
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <span className="text-sm text-[#1C1C1C]">{s.label}</span>
                <span className="font-serif text-lg text-[#8B5E3C] tabular-nums">{s.percent}%</span>
              </div>
              <div className="h-2 bg-[#1C1C1C]/8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8B5E3C] rounded-full"
                  style={{ width: `${s.percent}%` }}
                />
              </div>
              <div className="flex items-baseline justify-between gap-3 mt-1">
                <span className="text-xs text-[#6B5D50]">{s.note}</span>
                {i > 0 && (
                  <span className="text-xs text-[#A0432C] tabular-nums">-{drop} pts</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="text-xs text-[#6B5D50] mt-5 pt-4 border-t border-[#1C1C1C]/10 leading-relaxed">
        82% of assessment takers never reach Purchase. The biggest leaks are Kit Preview to
        Checkout (-25 pts) and Checkout to Payment (-17 pts).
      </p>
    </figure>
  );
};

/**
 * The impact against effort matrix from slide 12, drawn as a real 2x2 grid.
 * Placement matches the deck: 5 quick wins, 1 major project, 2 fill-ins.
 */
export const ImpactEffortMatrix: React.FC = () => {
  const find = (needle: string) =>
    TRAYA_INSIGHTS.find((i) => i.title.toLowerCase().includes(needle.toLowerCase()));

  const cells: { q: (typeof TRAYA_QUADRANTS)[number]; insights: string[] }[] = TRAYA_QUADRANTS.map(
    (q) => ({
      q,
      insights:
        q.items.length === 0
          ? []
          : q.items.map((label) => {
              const match =
                find(label) ??
                TRAYA_INSIGHTS.find((i) => label.split(' ')[0].toLowerCase() === i.theme.toLowerCase());
              return match ? `${match.n}. ${match.title}` : label;
            }),
    })
  );

  const grid: typeof cells = [cells[2], cells[1], cells[0], cells[3]];
  const tone: Record<string, string> = {
    quick: 'bg-[#F1E7DC] border-[#8B5E3C]/35',
    major: 'bg-[#EDE7F0] border-[#5B4A6B]/25',
    fill: 'bg-[#F4F4F0] border-[#1C1C1C]/10',
    reconsider: 'bg-[#F4F4F0] border-[#1C1C1C]/10',
  };

  return (
    <figure className="bg-[#FBF8F4] border border-[#1C1C1C]/10 rounded-xl p-6">
      <figcaption className="text-xs uppercase tracking-[0.2em] text-[#8B5E3C] mb-5">
        Impact against effort
      </figcaption>

      <div className="flex gap-2">
        <div className="flex flex-col justify-around text-[10px] uppercase tracking-widest text-[#6B5D50] text-right pr-1">
          <span>High</span>
          <span>Low</span>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-2 gap-2">
            {grid.map(({ q, insights }) => (
              <div
                key={q.key}
                className={`rounded-lg border p-3 min-h-[104px] ${tone[q.key]}`}
              >
                <div className="text-[10px] uppercase tracking-widest text-[#1C1C1C]/70 font-medium">
                  {q.name}
                </div>
                <div className="text-[10px] text-[#6B5D50] mb-2">{q.rule}</div>
                {insights.length === 0 ? (
                  <div className="text-[11px] text-[#8B5E3C] italic">Nothing here</div>
                ) : (
                  <ul className="space-y-0.5">
                    {insights.map((t) => (
                      <li key={t} className="text-[11px] text-[#333] leading-snug">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#6B5D50] mt-2">
            <span className="flex-1 text-center">Low effort</span>
            <span className="flex-1 text-center">High effort</span>
          </div>
          <div className="text-center text-[10px] uppercase tracking-widest text-[#8B5E3C] mt-1">
            Impact
          </div>
        </div>
      </div>
    </figure>
  );
};
