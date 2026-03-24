import { useState, useMemo } from 'react';
import { Library } from 'lucide-react';
import { useBooks } from './hooks/useBooks';
import { StatsCard } from './components/StatsCard';
import { SearchFilter } from './components/SearchFilter';
import { BookForm } from './components/BookForm';
import { BookItem } from './components/BookItem';
import { EmptyState } from './components/EmptyState';
import type { Book, BookFormData, ReadingStatus } from './types/book';
import './App.css';

function App() {
  const {
    books,
    isLoaded,
    addBook,
    updateBook,
    deleteBook,
    getStats,
    filterBooks,
  } = useBooks();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReadingStatus | 'all'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const stats = getStats();
  const filteredBooks = useMemo(() => {
    return filterBooks(searchQuery, statusFilter);
  }, [filterBooks, searchQuery, statusFilter]);

  const handleAddClick = () => {
    setEditingBook(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (book: Book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingBook(null);
  };

  const handleFormSubmit = (data: BookFormData) => {
    if (editingBook) {
      updateBook(editingBook.id, data);
    } else {
      addBook(data);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这本书吗？')) {
      deleteBook(id);
    }
  };

  const formInitialData: BookFormData | undefined = editingBook
    ? {
        title: editingBook.title,
        author: editingBook.author,
        status: editingBook.status,
        rating: editingBook.rating,
        notes: editingBook.notes,
      }
    : undefined;

  if (!isLoaded) {
    return (
      <div className="app-container">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  const isEmpty = books.length === 0;
  const isSearchEmpty = !isEmpty && filteredBooks.length === 0;

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <Library size={28} />
          <h1>我的阅读清单</h1>
        </div>
      </header>

      <main className="app-main">
        <StatsCard
          total={stats.total}
          completed={stats.completed}
          reading={stats.reading}
          unread={stats.unread}
        />

        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          onAddClick={handleAddClick}
        />

        <div className="book-list">
          {isEmpty ? (
            <EmptyState type="empty" />
          ) : isSearchEmpty ? (
            <EmptyState type="search" />
          ) : (
            filteredBooks.map((book) => (
              <BookItem
                key={book.id}
                book={book}
                onEdit={handleEditClick}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </main>

      <BookForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={formInitialData}
        title={editingBook ? '编辑图书' : '新增图书'}
      />
    </div>
  );
}

export default App;
