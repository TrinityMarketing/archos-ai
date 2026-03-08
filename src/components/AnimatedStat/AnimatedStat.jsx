import { useCountUp } from '../../hooks/useCountUp';
import './AnimatedStat.css';

export default function AnimatedStat({ value, suffix = '', prefix = '', label, duration = 2000 }) {
  const { value: count, ref, started } = useCountUp(value, duration);

  return (
    <div className={`animated-stat${started ? ' visible' : ''}`} ref={ref}>
      <span className="animated-stat-value">
        {prefix}{count}{suffix}
      </span>
      <span className="animated-stat-label">{label}</span>
    </div>
  );
}
