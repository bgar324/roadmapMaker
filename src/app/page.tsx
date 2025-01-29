"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/timeline?name=${encodeURIComponent(name)}`); // Pass the name via query params
  };

  return (
    <div className="flex items-center justify-center h-screen bg-customBg">
      <div className="p-8 bg-gray-800 text-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Welcome!</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="name" className="text-sm">
            What's your name?
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded transition duration-200"
          >
            Go to your roadmap
          </button>
        </form>
      </div>
    </div>
  );
}
