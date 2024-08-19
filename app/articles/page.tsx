'use client';

import { useState, useEffect } from 'react';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]); // 确保初始值为 []
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false); // 添加加载状态
  const [error, setError] = useState(null); // 添加错误状态

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null); // 重置错误状态

      try {
        const res = await fetch(`http://localhost:3000/api/articles/list?page=${currentPage}&searchTerm=${searchTerm}`);
        if (!res.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await res.json();

        // 确保数据格式正确
        setArticles(data.articles || []); // 如果没有 articles，使用空数组
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false); // 请求完成后关闭加载状态
      }
    };

    fetchArticles();
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // 重置到第一页
  };

  return (
    <div>
      <h1>Articles</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>} {/* 加载状态指示 */}
      {error && <p>{error}</p>} {/* 错误状态指示 */}

      {!loading && !error && (
        <ul>
          {articles.map((article) => (
            <li key={article.id}>{article.title}</li>
          ))}
        </ul>
      )}

      <div>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
