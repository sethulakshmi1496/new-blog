// src/pages/PostDetail.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/posts/${slug}/`).then((res) => {
      setPost(res.data);
    });
  }, [slug]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/" className="text-blue-500 underline">
        Back
      </Link>

      <h1 className="text-3xl font-bold mt-4">{post.title}</h1>
      <p className="text-gray-600">{post.subtitle}</p>

      {post.cover_image && (
        <img
          src={post.cover_image}
          alt=""
          className="my-4 rounded-md shadow"
        />
      )}

      {/* ⭐ Tiptap HTML rendered directly */}
      <div
        className="prose max-w-none mt-4"
        dangerouslySetInnerHTML={{ __html: post.content_html }}
      />
    </div>
  );
}
