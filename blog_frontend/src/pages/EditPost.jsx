// src/pages/EditPost.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BlogEditor from "../components/Editor";
import Navbar from "../components/Navbar";

export default function EditPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [content, setContent] = useState("");  // UPDATED
  const [saving, setSaving] = useState(false);

  // Load post only once
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/posts/${slug}/`).then((res) => {
      setPost(res.data);
      setTitle(res.data.title || "");
      setSubtitle(res.data.subtitle || "");
      setContent(res.data.content_html || "");  // set HTML not JSON
    });
  }, [slug]);

  const updatePost = async () => {
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);

      if (coverImage) {
        formData.append("cover_image", coverImage);
      }

      // send HTML, NOT JSON → prevents auto saving bugs
      formData.append("content_html", content);

      const res = await axios.put(
        `http://127.0.0.1:8000/api/posts/${slug}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      window.location.href = `/post/${res.data.slug}`;
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async () => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/posts/${slug}/`);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Edit Post</h1>

        <div className="space-y-4">
          <input
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full border rounded px-3 py-2"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />

          <div>
            <p className="text-sm font-medium">Change Cover Image</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
            />
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Content</p>
            <BlogEditor content={content} setContent={setContent} />
          </div>

          <div className="flex gap-3">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={updatePost}
              disabled={saving}
            >
              {saving ? "Saving..." : "Update"}
            </button>

            <button
              className="px-4 py-2 border rounded text-red-600"
              onClick={deletePost}
            >
              Delete
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
