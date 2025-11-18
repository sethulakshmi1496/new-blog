import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
<div className="bg-red-500 text-white p-4">TEST</div>

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function readTime(m) {
  if (!m) return "2 min read";
  if (typeof m === "number") return `${m} min read`;
  return m;
}

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/posts/")
      .then((res) => setPosts(res.data))
      .catch(() => setPosts([]));
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Medium-style width */}
      <main className="max-w-4xl mx-auto px-4 py-10">

        <h1 className="text-4xl font-extrabold mb-10">Latest Posts</h1>

        <div className="space-y-12">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="flex justify-between gap-6 pb-10 border-b"
            >
              {/* LEFT */}
              <div className="flex-1 flex flex-col justify-between">

                {/* TITLE */}
                <Link
                  to={`/post/${post.slug}`}
                  className="text-2xl font-bold text-gray-900 leading-snug hover:underline"
                >
                  {post.title}
                </Link>

                {/* SUBTITLE */}
                {post.subtitle && (
                  <p className="text-gray-600 mt-2 text-lg">
                    {post.subtitle}
                  </p>
                )}

                {/* META */}
                <div className="flex gap-3 text-gray-500 text-sm mt-4">
                  <span>{formatDate(post.published_date || post.created_at)}</span>
                  <span>•</span>
                  <span>{readTime(post.read_time)}</span>
                </div>
              </div>

              {/* RIGHT IMAGE */}
              <div className="w-[180px] flex-shrink-0">
                {post.cover_image ? (
                  <img
                    src={post.cover_image}
                    alt=""
                    className="w-full h-[120px] object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-full h-[120px] bg-gray-100 border rounded-lg"></div>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
