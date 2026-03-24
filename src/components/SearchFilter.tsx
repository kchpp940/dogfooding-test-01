import { Search, Plus } from 'lucide-react';
import type { ReadingStatus } from '../types/book';
import { READING_STATUS_LABELS } from '../types/book';
import './SearchFilter.css';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: ReadingStatus | 'all';
  onStatusChange: (status: ReadingStatus | 'all') => void;
  onAddClick: () => void;
}

const statusOptions: { value: ReadingStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'unread', label: READING_STATUS_LABELS.unread },
  { value: 'reading', label: READING_STATUS_LABELS.reading },
  { value: 'completed', label: READING_STATUS_LABELS.completed },
];

export function SearchFilter({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onAddClick,
}: SearchFilterProps) {
  return (
    <div className="search-filter-container">
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="搜索书名或作者..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-section">
        <div className="status-filter">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              className={`filter-btn ${statusFilter === option.value ? 'active' : ''}`}
              onClick={() => onStatusChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button className="add-btn" onClick={onAddClick}>
          <Plus size={18} />
          新增图书
        </button>
      </div>
    </div>
  );
}
