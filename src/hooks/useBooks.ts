import { useState, useEffect, useCallback } from 'react';
import type { Book, BookFormData, ReadingStatus } from '../types/book';

const STORAGE_KEY = 'reading-list-books';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBooks(parsed);
      } catch {
        setBooks([]);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  }, [books, isLoaded]);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const addBook = useCallback((data: BookFormData) => {
    const now = Date.now();
    const newBook: Book = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setBooks(prev => [newBook, ...prev]);
    return newBook;
  }, []);

  const updateBook = useCallback((id: string, data: BookFormData) => {
    setBooks(prev =>
      prev.map(book =>
        book.id === id
          ? { ...book, ...data, updatedAt: Date.now() }
          : book
      )
    );
  }, []);

  const deleteBook = useCallback((id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  }, []);

  const getBookById = useCallback((id: string) => {
    return books.find(book => book.id === id);
  }, [books]);

  const getStats = useCallback(() => {
    const total = books.length;
    const completed = books.filter(b => b.status === 'completed').length;
    const reading = books.filter(b => b.status === 'reading').length;
    const unread = books.filter(b => b.status === 'unread').length;
    return { total, completed, reading, unread };
  }, [books]);

  const filterBooks = useCallback((
    searchQuery: string,
    statusFilter: ReadingStatus | 'all'
  ) => {
    return books.filter(book => {
      const matchesSearch =
        !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus =
        statusFilter === 'all' || book.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [books]);

  return {
    books,
    isLoaded,
    addBook,
    updateBook,
    deleteBook,
    getBookById,
    getStats,
    filterBooks,
  };
}
