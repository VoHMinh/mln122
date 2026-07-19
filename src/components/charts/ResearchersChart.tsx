'use client';

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { RESEARCHERS_DATA } from '@/lib/constants';

interface ChartDataItem {
  country: string;
  value: number;
  color: string;
}

type ChartTooltipProps = {
  active?: boolean;
  payload?: Array<{ value?: number | string }>;
  label?: string | number;
};

function CustomTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const value = Number(payload[0].value ?? 0);
  const vnValue = 836;
  const ratio = value > vnValue ? (value / vnValue).toFixed(1) : null;

  return (
    <div className="border border-muted-steel/30 bg-circuit-surface px-4 py-3 shadow-lg">
      <p className="font-display text-sm font-semibold text-pulse-text">{label}</p>
      <p className="font-mono text-lg text-copper-trace">
        {value.toLocaleString('vi-VN')} người / triệu dân
      </p>
      {ratio && <p className="mt-1 text-xs text-muted-steel">Gấp {ratio} lần so với Việt Nam</p>}
    </div>
  );
}

export default function ResearchersChart() {
  const data: ChartDataItem[] = RESEARCHERS_DATA.map((item) => ({
    country: item.country,
    value: item.value,
    color: item.color,
  }));

  return (
    <div className="w-full">
      <h3 className="mb-2 font-display text-lg font-semibold text-pulse-text">
        Nhà nghiên cứu / triệu dân
      </h3>
      <p className="mb-4 text-sm text-muted-steel">
        Khoảng cách nhân lực R&D: Hàn Quốc cao hơn Việt Nam hơn{' '}
        <span className="font-mono text-disruption-amber">11 lần</span>
      </p>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            barCategoryGap="20%"
          >
            <XAxis
              dataKey="country"
              tick={{ fill: '#C8D6E5', fontSize: 12, fontFamily: 'Be Vietnam Pro' }}
              axisLine={{ stroke: '#5A7A9B', strokeWidth: 0.5 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#C8D6E5', fontSize: 12, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 10000]}
              tickFormatter={(value: number) => value.toLocaleString('vi-VN')}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(90, 122, 155, 0.1)' }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {data.map((entry) => (
                <Cell key={entry.country} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs italic text-muted-steel">
        Nguồn: World Bank WDI, số liệu mới nhất có đủ dữ liệu là năm 2023
      </p>
    </div>
  );
}
