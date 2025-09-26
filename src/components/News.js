// src/pages/News.js
import React, { useEffect, useState } from "react";
import "./News.css";
import Header from './Header';

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  const fetchNews = async (searchQuery = "") => {
    try {
      setLoading(true);
      const url = searchQuery
        ? `${process.env.REACT_APP_API_BASE}/api/news?q=${encodeURIComponent(searchQuery)}`
        : `${process.env.REACT_APP_API_BASE}/api/news`;
      const res = await fetch(url);
      const data = await res.json();
      setArticles(data.articles || []);
      setError(null);
    } catch (err) {
      console.error("Failed to load news:", err);
      setError("Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNews(query);
  };

  return (
    <>
     {/* Navbar */}
      <Header />
    <div className="news-page">
     

      <div className="news-header">
        <h1 className="news-heading">Wellness & Therapy News</h1>

        <form className="news-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search wellness topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {loading && <h2 className="news-loading">Loading news...</h2>}
      {error && <h2 className="news-error">{error}</h2>}

      <div className="news-container">
        {!loading && articles.length === 0 && <p>No news articles found.</p>}
        {articles.map((article, index) => (
          <div key={index} className="news-card">
            {article.urlToImage ? (
              <img src={article.urlToImage} alt={article.title} className="news-image" />
            ) : (
              <div className="news-placeholder">No image</div>
            )}
            <div className="news-content">
              <h2 className="news-title">{article.title || "No Title"}</h2>
              <p className="news-date">
                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "Unknown date"}
              </p>
              <p className="news-desc">{article.description || "No description available."}</p>
              {article.url && (
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-link">
                  Read Full Article →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div></>
  );
  
}
