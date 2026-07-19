import type { CarryOverItem } from '@/types';

export default function CarryOverLedger({ items }: { items: CarryOverItem[] }) {
  if (!items.length) {
    return <p className="game2-empty-ledger">Không có nghĩa vụ mới mang sang chặng sau.</p>;
  }
  return (
    <div className="game2-ledger">
      {items.map((item) => (
        <div key={item.id} className={`is-${item.tone.toLowerCase()}`}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

