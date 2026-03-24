export type ReadingStatus = 'unread' | 'reading' | 'completed';

export interface Book {
  id: string;
  title: string;
  author: string;
  status: ReadingStatus;
  rating: number;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface BookFormData {
  title: string;
  author: string;
  status: ReadingStatus;
  rating: number;
  notes: string;
}

export const READING_STATUS_LABELS: Record<ReadingStatus, string> = {
  unread: '未读',
  reading: '在读',
  completed: '已读',
};

export const READING_STATUS_COLORS: Record<ReadingStatus, string> = {
  unread: '#ef4444',
  reading: '#f59e0b',
  completed: '#10b981',
};
