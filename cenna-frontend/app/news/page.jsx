"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaWhatsapp, FaNewspaper, FaGraduationCap } from "react-icons/fa";
import api from "@/services/api";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = [
    { label: "All", value: "" },
    { label: "Announcement", value: "announcement" },
    { label: "Event", value: "event" },
    { label: "Achievement", value: "achievement" },
    { label: "Holiday", value: "holiday" },
    { label: "Sports", value: "sports" },
    { label: "Academic", value: "academic" },
  ];

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);

        const res = await api.get("/news", {
          params: category ? { category } : {},
        });

        setNews(res.data.news || []);
      } catch (error) {
        console.log("Public news error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [category]);

  return (
    <>
      <motion.a
        href="https://wa.me/+923339038030"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-lg transition hover:bg-green-600"
      >
        <FaWhatsapp />
      </motion.a>

      <section className="relative mt-20 overflow-hidden bg-black px-6 py-20 text-white lg:px-20">
        <div className="absolute right-10 top-10 text-8xl text-white/5">
          <FaNewspaper />
        </div>

        <div className="absolute bottom-10 left-10 text-7xl text-yellow-500/10">
          <FaGraduationCap />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <nav className="mb-6 flex items-center gap-3 text-sm text-gray-400">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-300">News & Events</span>
          </nav>

          <h1 className="mb-5 text-4xl font-extrabold leading-tight md:text-6xl">
            News & Events
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-gray-300">
            Stay informed with the latest announcements, events, holidays,
            achievements, and academic updates.
          </p>
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap gap-3">
            {categories.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setCategory(item.value)}
                className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                  category === item.value
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-yellow-500 hover:text-black"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="rounded-3xl border bg-white p-10 text-center font-semibold text-gray-500 shadow-sm">
              Loading news...
            </div>
          ) : news.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => (
                <motion.div
                  key={item._id}
                  whileHover={{ y: -8 }}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-gray-100 text-6xl text-yellow-600">
                      <FaNewspaper />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-black px-3 py-1 text-xs font-bold uppercase text-white">
                        {item.category}
                      </span>

                      {item.isPinned && (
                        <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-black">
                          Pinned
                        </span>
                      )}
                    </div>

                    <h3 className="mb-3 text-xl font-extrabold text-black">
                      {item.title}
                    </h3>

                    <p className="mb-5 line-clamp-4 text-sm leading-7 text-gray-600">
                      {item.content}
                    </p>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-sm text-gray-400">
                        {item.eventDate
                          ? new Date(item.eventDate).toLocaleDateString()
                          : new Date(item.createdAt).toLocaleDateString()}
                      </span>

                      <span className="text-xs font-bold text-gray-400">
                        Views: {item.views || 0}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border bg-white p-10 text-center font-semibold text-gray-500 shadow-sm">
              No news available.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
