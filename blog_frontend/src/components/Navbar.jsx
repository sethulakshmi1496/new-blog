import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const doSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${query}`);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

        <Link to="/" className="text-xl font-bold">MyBlog</Link>

        <form onSubmit={doSearch} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search…"
            className="border rounded px-3 py-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="px-3 py-1 bg-black text-white rounded">
            Search
          </button>
        </form>

        <nav className="space-x-3">
          <Link to="/create" className="px-3 py-1 bg-blue-600 text-white rounded">
            Create
          </Link>
        </nav>

      </div>
    </header>
  );
}
