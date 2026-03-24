import { BookX, Search } from 'lucide-react';
import './EmptyState.css';

interface EmptyStateProps {
  type?: 'empty' | 'search';
  message?: string;
}

export function EmptyState({ type = 'empty', message }: EmptyStateProps) {
  const isSearch = type === 'search';
  const Icon = isSearch ? Search : BookX;
  const defaultMessage = isSearch ? '没有找到匹配的图书' : '还没有添加任何图书';
  const subMessage = isSearch
    ? '尝试使用其他关键词搜索'
    : '点击"新增图书"按钮开始记录你的阅读清单';

  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={48} />
      </div>
      <h3>{message || defaultMessage}</h3>
      <p>{subMessage}</p>
    </div>
  );
}
