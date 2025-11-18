// src/pages/CreatePost.jsx

import React, { useState } from "react";
import axios from "axios";
import Editor from "../components/Editor";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [content, setContent] = useState("");

  const submitPost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);

    if (coverImage) {
      formData.append("cover_image", coverImage);
    }

    formData.append("content_html", content);

    try {
      await axios.post("http://127.0.0.1:8000/api/posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Post published!");
      window.location.reload();
    } catch (error) {
      alert("Publish failed: " + JSON.stringify(error.response?.data));
    }
  };

  return (
    <form
      onSubmit={submitPost}
      encType="multipart/form-data"
      className="p-10 max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-6">Create Post</h1>

      <input
        type="text"
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 mr-2"
        required
      />

      <input
        type="text"
        placeholder="Subtitle"
        onChange={(e) => setSubtitle(e.target.value)}
        className="border p-2 mr-2"
      />

      <label className="ml-4">Cover Image: </label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setCoverImage(e.target.files[0])}
      />

      <div className="mt-6">
        <Editor content={content} setContent={setContent} />
      </div>

      <button
        type="submit"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Publish
      </button>
    </form>
  );
}
