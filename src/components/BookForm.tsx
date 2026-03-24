import { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import type { BookFormData, ReadingStatus } from '../types/book';
import { READING_STATUS_LABELS } from '../types/book';
import './BookForm.css';

interface BookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookFormData) => void;
  initialData?: BookFormData;
  title?: string;
}

const defaultFormData: BookFormData = {
  title: '',
  author: '',
  status: 'unread',
  rating: 0,
  notes: '',
};

const statusOptions: ReadingStatus[] = ['unread', 'reading', 'completed'];

export function BookForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = '新增图书',
}: BookFormProps) {
  const [formData, setFormData] = useState<BookFormData>(defaultFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof BookFormData, string>>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || defaultFormData);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BookFormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '请输入书名';
    }
    if (!formData.author.trim()) {
      newErrors.author = '请输入作者';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleChange = (field: keyof BookFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const renderStars = () => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-btn ${star <= formData.rating ? 'active' : ''}`}
            onClick={() => handleChange('rating', star)}
          >
            <Star
              size={24}
              fill={star <= formData.rating ? '#f59e0b' : 'none'}
              stroke={star <= formData.rating ? '#f59e0b' : '#d1d5db'}
            />
          </button>
        ))}
        <span className="rating-text">
          {formData.rating > 0 ? `${formData.rating} 星` : '未评分'}
        </span>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-group">
            <label htmlFor="title">
              书名 <span className="required">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="请输入书名"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="author">
              作者 <span className="required">*</span>
            </label>
            <input
              id="author"
              type="text"
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
              placeholder="请输入作者"
              className={errors.author ? 'error' : ''}
            />
            {errors.author && <span className="error-message">{errors.author}</span>}
          </div>

          <div className="form-group">
            <label>阅读状态</label>
            <div className="status-options">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`status-btn ${formData.status === status ? 'active' : ''}`}
                  onClick={() => handleChange('status', status)}
                >
                  {READING_STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>评分</label>
            {renderStars()}
          </div>

          <div className="form-group">
            <label htmlFor="notes">备注</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="添加一些备注..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn-primary">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
