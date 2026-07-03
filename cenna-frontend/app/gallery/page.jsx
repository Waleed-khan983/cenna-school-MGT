"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaGraduationCap, FaImages, FaTimes } from "react-icons/fa";
import api from "@/services/api";

export default function GalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [activeFilter, setActiveFilter] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const filters = [
    { label: "All Photos", value: "" },
    { label: "Events", value: "events" },
    { label: "Sports", value: "sports" },
    { label: "Classroom", value: "classroom" },
    { label: "Achievement", value: "achievement" },
    { label: "Function", value: "function" },
    { label: "General", value: "general" },
  ];

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);

        const res = await api.get("/gallery", {
          params: activeFilter ? { category: activeFilter } : {},
        });

        setGallery(res.data.gallery || []);
       
      } catch (error) {
        console.log("Gallery load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, [activeFilter]);

  console.log("Gallery data:", gallery);
 

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
          <FaImages />
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
            <span className="text-gray-300">Gallery</span>
          </nav>

          <h1 className="mb-5 text-4xl font-extrabold leading-tight md:text-6xl">
            Photo Gallery
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-gray-300">
            Capturing the memories, moments, and milestones of CENNA School.
          </p>
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.label}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`cursor-pointer rounded-full border px-5 py-2 text-sm font-semibold transition ${
                  activeFilter === filter.value
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-gray-600 hover:border-black hover:bg-black hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="rounded-3xl border bg-white p-10 text-center font-semibold text-gray-500 shadow-sm">
              Loading gallery...
            </div>
          ) : gallery.length > 0 ? (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-4">
              {gallery.map((item) => (
                <GalleryCard
                  key={item._id}
                  item={item}
                  onClick={() => setSelectedImage(item)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border bg-white p-10 text-center font-semibold text-gray-500 shadow-sm">
              No gallery images available.
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 cursor-pointer bg-black/90"
            />

            <motion.div
              className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
            >
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute right-4 top-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow transition hover:bg-black hover:text-white"
              >
                <FaTimes />
              </button>

              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="max-h-[75vh] w-full object-contain bg-black"
              />

              <div className="p-6">
                <h3 className="text-2xl font-extrabold text-black">
                  {selectedImage.title}
                </h3>

                {selectedImage.description && (
                  <p className="mt-2 text-sm leading-7 text-gray-600">
                    {selectedImage.description}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-black px-3 py-1 text-xs font-bold uppercase text-white">
                    {selectedImage.category}
                  </span>

                  {selectedImage.eventDate && (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                      {new Date(selectedImage.eventDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function GalleryCard({ item, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group relative mb-4 w-full cursor-pointer break-inside-avoid overflow-hidden rounded-xl bg-white shadow-sm"
    >
      <img
        src={item.image}
        alt={item.title}
        className="h-auto w-full object-cover"
      />

      <div className="absolute inset-0 flex items-end bg-black/0 transition duration-300 group-hover:bg-black/50">
        <div className="translate-y-4 p-4 text-left opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <h3 className="text-sm font-extrabold text-white">{item.title}</h3>
          <p className="mt-1 text-xs font-bold uppercase text-yellow-400">
            {item.category}
          </p>
        </div>
      </div>
    </motion.button>
  );
}