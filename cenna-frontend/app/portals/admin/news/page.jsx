"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchNews,
  addNews,
  editNews,
  removeNews,
} from "@/store/newsSlice";

import PageLoader from "@/components/ui/PageLoader";

const categories = [
  "announcement",
  "event",
  "achievement",
  "holiday",
  "sports",
  "academic",
];

const initialForm = {
  title: "",
  content: "",
  category: "announcement",
  eventDate: "",
  tags: "",
  image: null,
  isPublished: true,
  isPinned: false,
};

export default function AdminNewsPage() {
  const dispatch = useDispatch();

  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [editingNews, setEditingNews] = useState(null);

  const { news, loading, error } = useSelector((state) => state.news);
 console.log("News state:", { news, loading, error });

  useEffect(() => {
    dispatch(fetchNews({ admin: true }));
  }, [dispatch]);

  const filteredNews = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return news;

    return news.filter((item) => {
      return (
        item.title?.toLowerCase().includes(value) ||
        item.category?.toLowerCase().includes(value) ||
        item.content?.toLowerCase().includes(value)
      );
    });
  }, [news, search]);

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingNews(null);
  };

  const buildFormData = () => {
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("category", form.category);
    formData.append("eventDate", form.eventDate);
    formData.append("tags", form.tags);
    formData.append("isPublished", form.isPublished);
    formData.append("isPinned", form.isPinned);

    if (form.image) {
      formData.append("image", form.image);
    }

    console.log(form.image);
    return formData;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title || !form.content) {
      toast.error("Title and content are required");
      return;
    }

    try {
      const formData = buildFormData();

      if (editingNews) {
        await dispatch(
          editNews({
            id: editingNews._id,
            data: formData,
          })
        ).unwrap();

        toast.success("News updated successfully");
      } else {
        await dispatch(addNews(formData)).unwrap();
        toast.success("News created successfully");
      }

      resetForm();
      dispatch(fetchNews({ admin: true }));
    } catch (error) {
      toast.error(error || "Failed to save news");
    }
  };

  const handleEdit = (item) => {
    setEditingNews(item);

    setForm({
      title: item.title || "",
      content: item.content || "",
      category: item.category || "announcement",
      eventDate: item.eventDate ? item.eventDate.slice(0, 10) : "",
      tags: item.tags?.join(", ") || "",
      image: null,
      isPublished: item.isPublished,
      isPinned: item.isPinned,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;

    try {
      await dispatch(removeNews(item._id)).unwrap();
      toast.success("News deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete news");
    }
  };

  if (loading) return <PageLoader text="Loading news..." />;

  return (
    <section className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-black">News Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create, publish, pin, edit, and delete school news.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-3xl border bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-xl font-extrabold">
          {editingNews ? "Edit News" : "Add News"}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />

          <Select
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>

          <Input
            label="Event Date"
            name="eventDate"
            type="date"
            value={form.eventDate}
            onChange={handleChange}
          />

          <Input
            label="Tags"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="exam, holiday, event"
          />

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Image
            </label>

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Content
            </label>

            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={5}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <label className="flex items-center gap-3 font-bold text-gray-700">
            <input
              type="checkbox"
              name="isPublished"
              checked={form.isPublished}
              onChange={handleChange}
            />
            Published
          </label>

          <label className="flex items-center gap-3 font-bold text-gray-700">
            <input
              type="checkbox"
              name="isPinned"
              checked={form.isPinned}
              onChange={handleChange}
            />
            Pin News
          </label>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            className="!cursor-pointer rounded-xl bg-black px-6 py-3 font-bold text-white hover:bg-gray-800"
          >
            {editingNews ? "Update News" : "Create News"}
          </button>

          {editingNews && (
            <button
              type="button"
              onClick={resetForm}
              className="!cursor-pointer rounded-xl bg-gray-200 px-6 py-3 font-bold text-black hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search news..."
        className="mb-6 w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredNews.length > 0 ? (
          filteredNews.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-3xl border bg-white shadow-sm"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="p-5">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white">
                    {item.category}
                  </span>

                  {item.isPinned && (
                    <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-black">
                      Pinned
                    </span>
                  )}

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      item.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.isPublished ? "Published" : "Hidden"}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-black">
                  {item.title}
                </h3>

                <p className="mt-2 line-clamp-3 text-sm text-gray-500">
                  {item.content}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="!cursor-pointer rounded-lg bg-yellow-500 px-4 py-2 text-xs font-bold text-black"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="!cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border bg-white p-10 text-center font-semibold text-gray-500 md:col-span-2 xl:col-span-3">
            No news found.
          </div>
        )}
      </div>
    </section>
  );
}

function Input({ label, name, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      >
        {children}
      </select>
    </div>
  );
}