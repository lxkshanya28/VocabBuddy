import { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  label: string;
  value: string;
};

export function MetricCard({ icon, label, value }: Props) {
  return (
    <article className="metric-card">
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
