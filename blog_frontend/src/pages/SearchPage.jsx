import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    axios
      .get(`http://127.0.0.1:8000/api/posts/?search=${query}`)
      .then((res) => setResults(res.data))
      .catch((err) => console.log(err));
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Search results for "{query}"</h1>

      {results.length === 0 && (
        <p className="text-gray-500">No results found.</p>
      )}

      <div className="space-y-6">
        {results.map((p) => (
          <div key={p.slug} className="border-b pb-4">
            <Link
              to={`/post/${p.slug}`}
              className="text-xl font-semibold text-blue-600"
            >
              {p.title}
            </Link>
            <p className="text-gray-600">{p.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
