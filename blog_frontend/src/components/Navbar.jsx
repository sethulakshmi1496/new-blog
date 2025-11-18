import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold">MyBlog</Link>

        <div className="flex items-center gap-4">
          <Link
            to="/create"
            className="px-4 py-2 bg-black text-white rounded-full"
          >
            Write
          </Link>
          <a
            href="/admin/"
            className="px-4 py-2 border rounded-full hover:bg-gray-100"
          >
            Admin
          </a>
        </div>
      </div>
    </header>
  );
}
