import { BookOpen, CheckCircle2, Clock, Library } from 'lucide-react';
import './StatsCard.css';

interface StatsCardProps {
  total: number;
  completed: number;
  reading: number;
  unread: number;
}

export function StatsCard({ total, completed, reading, unread }: StatsCardProps) {
  const stats = [
    {
      label: '总书籍',
      value: total,
      icon: Library,
      color: '#6366f1',
    },
    {
      label: '已读',
      value: completed,
      icon: CheckCircle2,
      color: '#10b981',
    },
    {
      label: '在读',
      value: reading,
      icon: BookOpen,
      color: '#f59e0b',
    },
    {
      label: '未读',
      value: unread,
      icon: Clock,
      color: '#ef4444',
    },
  ];

  return (
    <div className="stats-container">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card">
          <div
            className="stat-icon"
            style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
          >
            <stat.icon size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
