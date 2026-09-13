type Props = {
  value: number;
};

export function ProgressBar({ value }: Props) {
  return (
    <div className="progress-bar" aria-label="Session progress">
      <span style={{ width: `${value}%` }} />
    </div>
  );
}
