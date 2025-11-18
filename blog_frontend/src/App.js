// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import SearchPage from "./pages/SearchPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* Create post */}
        <Route path="/create" element={<CreatePost />} />

        {/* Post detail */}
        <Route path="/post/:slug" element={<PostDetail />} />

        {/* Fallback 404 page */}
        <Route path="*" element={<h1 className="p-8 text-center text-2xl">
          404 — Page Not Found
        </h1>} />
        <Route path="/search" element={<SearchPage />} />

      </Routes>
    </BrowserRouter>
  );
}
