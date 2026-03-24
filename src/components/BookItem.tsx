import { Edit2, Trash2, Star, BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import type { Book, ReadingStatus } from '../types/book';
import { READING_STATUS_LABELS, READING_STATUS_COLORS } from '../types/book';
import './BookItem.css';

interface BookItemProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

const statusIcons: Record<ReadingStatus, typeof Clock> = {
  unread: Clock,
  reading: BookOpen,
  completed: CheckCircle2,
};

export function BookItem({ book, onEdit, onDelete }: BookItemProps) {
  const StatusIcon = statusIcons[book.status];
  const statusColor = READING_STATUS_COLORS[book.status];

  const renderRating = () => {
    return (
      <div className="book-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            fill={star <= book.rating ? '#f59e0b' : 'none'}
            stroke={star <= book.rating ? '#f59e0b' : '#d1d5db'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="book-item">
      <div className="book-content">
        <div className="book-header">
          <h3 className="book-title">{book.title}</h3>
          <div
            className="book-status"
            style={{
              backgroundColor: `${statusColor}15`,
              color: statusColor,
            }}
          >
            <StatusIcon size={14} />
            <span>{READING_STATUS_LABELS[book.status]}</span>
          </div>
        </div>

        <div className="book-author">
          <span className="label">作者：</span>
          <span className="value">{book.author}</span>
        </div>

        {book.rating > 0 && renderRating()}

        {book.notes && (
          <div className="book-notes">
            <span className="label">备注：</span>
            <span className="value">{book.notes}</span>
          </div>
        )}
      </div>

      <div className="book-actions">
        <button
          className="action-btn edit"
          onClick={() => onEdit(book)}
          title="编辑"
        >
          <Edit2 size={16} />
        </button>
        <button
          className="action-btn delete"
          onClick={() => onDelete(book.id)}
          title="删除"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
