"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchGallery,
  createGallery,
  removeGallery,
} from "@/store/gallerySlice";

import { toast } from "react-toastify";

export default function AdminGalleryPage() {
  const dispatch = useDispatch();

  const { gallery } = useSelector((state) => state.gallery);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "general",
    image: null,
  });

  useEffect(() => {
    dispatch(fetchGallery({ admin: true }));
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("isPublished", "true");
    

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      await dispatch(createGallery(formData)).unwrap();

      toast.success("Image uploaded");

      setForm({
        title: "",
        description: "",
        category: "general",
        image: null,
      });

      dispatch(fetchGallery({ admin: true }));
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete image?")) return;

    await dispatch(removeGallery(id));
  };

  return (
    <section className="p-6">
      <h1 className="mb-6 text-3xl font-extrabold">
        Gallery Management
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-2xl border bg-white p-5"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            className="rounded-xl border p-3"
          />

          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
            className="rounded-xl border p-3"
          >
            <option value="events">Events</option>
            <option value="sports">Sports</option>
            <option value="classroom">Classroom</option>
            <option value="achievement">Achievement</option>
            <option value="function">Function</option>
            <option value="general">General</option>
          </select>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            className="rounded-xl border p-3"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm({
                ...form,
                image: e.target.files[0],
              })
            }
          />
        </div>

        <button
          type="submit"
          className="mt-4 rounded-xl bg-black px-6 py-3 font-bold text-white cursor-pointer transition hover:bg-gray-800"
        >
          Upload Image
        </button>
      </form>

      <div className="grid gap-5 md:grid-cols-3">
        {gallery.map((item) => (
          <div
            key={item._id}
            className="overflow-hidden rounded-2xl border bg-white"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-56 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="font-bold">
                {item.title}
              </h3>

              <button
                onClick={() =>
                  handleDelete(item._id)
                }
                className="mt-3 rounded-lg  bg-red-600 px-4 py-2 text-white cursor-pointer transition hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}