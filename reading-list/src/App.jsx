import { useState, useEffect } from 'react'
import './App.css'

const STORAGE_KEY = 'reading-list-books'

const STATUS_OPTIONS = [
  { value: 'unread', label: '未读' },
  { value: 'reading', label: '在读' },
  { value: 'read', label: '已读' }
]

const RATING_OPTIONS = [1, 2, 3, 4, 5]

const initialBook = {
  title: '',
  author: '',
  status: 'unread',
  rating: 0,
  notes: ''
}

function App() {
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(initialBook)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
  }, [books])

  const stats = {
    total: books.length,
    read: books.filter(b => b.status === 'read').length,
    reading: books.filter(b => b.status === 'reading').length
  }

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || book.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.author.trim()) return

    if (editingId) {
      setBooks(books.map(book => 
        book.id === editingId ? { ...formData, id: editingId } : book
      ))
      setEditingId(null)
    } else {
      setBooks([...books, { ...formData, id: Date.now() }])
    }
    setFormData(initialBook)
    setShowForm(false)
  }

  const handleEdit = (book) => {
    setFormData(book)
    setEditingId(book.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm('确定要删除这本书吗？')) {
      setBooks(books.filter(book => book.id !== id))
    }
  }

  const handleCancel = () => {
    setFormData(initialBook)
    setEditingId(null)
    setShowForm(false)
  }

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const getStatusLabel = (status) => {
    return STATUS_OPTIONS.find(s => s.value === status)?.label || status
  }

  const getStatusClass = (status) => {
    return `status-badge status-${status}`
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📚 我的读书清单</h1>
      </header>

      <section className="stats-section">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">总书籍</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.read}</span>
          <span className="stat-label">已读</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.reading}</span>
          <span className="stat-label">在读</span>
        </div>
      </section>

      <section className="controls-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索书名或作者..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">全部状态</option>
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + 添加新书
        </button>
      </section>

      {showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? '编辑图书' : '添加新书'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>书名 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="请输入书名"
                  required
                />
              </div>
              <div className="form-group">
                <label>作者 *</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  placeholder="请输入作者"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>阅读状态</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>评分</label>
                  <div className="rating-input">
                    {RATING_OPTIONS.map(star => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${formData.rating >= star ? 'active' : ''}`}
                        onClick={() => setFormData({...formData, rating: star})}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>备注</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="添加备注..."
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  取消
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? '保存修改' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="books-section">
        {filteredBooks.length === 0 ? (
          <div className="empty-state">
            {books.length === 0 ? (
              <>
                <div className="empty-icon">📖</div>
                <p>还没有添加任何书籍</p>
                <p className="empty-hint">点击"添加新书"开始记录你的阅读之旅</p>
              </>
            ) : (
              <>
                <div className="empty-icon">🔍</div>
                <p>没有找到匹配的书籍</p>
                <p className="empty-hint">试试其他搜索词或筛选条件</p>
              </>
            )}
          </div>
        ) : (
          <div className="books-list">
            {filteredBooks.map(book => (
              <div key={book.id} className="book-card">
                <div className="book-header">
                  <h3 className="book-title">{book.title}</h3>
                  <span className={getStatusClass(book.status)}>
                    {getStatusLabel(book.status)}
                  </span>
                </div>
                <p className="book-author">作者：{book.author}</p>
                {book.rating > 0 && (
                  <p className="book-rating">
                    <span className="stars">{renderStars(book.rating)}</span>
                  </p>
                )}
                {book.notes && (
                  <p className="book-notes">{book.notes}</p>
                )}
                <div className="book-actions">
                  <button 
                    className="btn btn-small btn-edit"
                    onClick={() => handleEdit(book)}
                  >
                    编辑
                  </button>
                  <button 
                    className="btn btn-small btn-delete"
                    onClick={() => handleDelete(book.id)}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="footer">
        <p>共 {filteredBooks.length} 本书籍 {searchTerm && `(搜索: "${searchTerm}")`}</p>
      </footer>
    </div>
  )
}

export default App
