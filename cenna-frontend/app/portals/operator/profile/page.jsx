"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
    fetchMyProfile,
    updateProfile,
} from "@/store/profileSlice";

import PageLoader from "@/components/ui/PageLoader";

const FILE_URL =
    process.env.NEXT_PUBLIC_FILE_URL || "http://localhost:5000";

const getImageUrl = (path) => {
    if (!path) return "/images/logo.jpg";

    if (path.startsWith("http")) {
        return path;
    }

    const cleanPath = path.replace(/\\/g, "/");

    return cleanPath.startsWith("/")
        ? `${FILE_URL}${cleanPath}`
        : `${FILE_URL}/${cleanPath}`;
};

export default function OperatorProfilePage() {
    const dispatch = useDispatch();
    const fileRef = useRef(null);

    const { user, loading } = useSelector((state) => state.profile || {});

    const [form, setForm] = useState({
        phone: "",
    });

    const [avatarPreview, setAvatarPreview] = useState("/images/logo.jpg");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        dispatch(fetchMyProfile());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setForm({
                phone: user.phone || "",
            });

            setAvatarPreview(getImageUrl(user.avatar));
        }
    }, [user]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size should be less than 2MB");
            return;
        }

        const localPreview = URL.createObjectURL(file);
        setAvatarPreview(localPreview);

        try {
            setSaving(true);

            const formData = new FormData();
            formData.append("phone", form.phone);
            formData.append("avatar", file);

            await dispatch(updateProfile(formData)).unwrap();
            await dispatch(fetchMyProfile()).unwrap();

            toast.success("Profile image updated successfully");
        } catch (error) {
            setAvatarPreview(getImageUrl(user?.avatar));
            toast.error(error || "Failed to update profile image");
        } finally {
            setSaving(false);

            if (fileRef.current) {
                fileRef.current.value = "";
            }

            URL.revokeObjectURL(localPreview);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);

            const formData = new FormData();
            formData.append("phone", form.phone);

            await dispatch(updateMyProfile(formData)).unwrap();
            await dispatch(fetchMyProfile()).unwrap();

            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading && !user) {
        return <PageLoader text="Loading profile..." />;
    }

    return (
        <section className="space-y-6 p-4 md:p-6">
            <div>
                <h1 className="text-3xl font-extrabold text-black">
                    Operator Profile
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your computer operator account information.
                </p>
            </div>

            <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
                <div className="mb-8 flex flex-col gap-5 border-b pb-6 md:flex-row md:items-center">
                    <div className="flex flex-col items-center gap-3">
                        <img
                            src={avatarPreview}
                            alt="Operator Profile"
                            className="h-28 w-28 rounded-full border-4 border-yellow-500 object-cover"
                        />

                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => fileRef.current?.click()}
                            className="cursor-pointer rounded-xl bg-black px-4 py-2 text-sm font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-500"
                        >
                            {saving ? "Uploading..." : "Change Photo"}
                        </button>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-extrabold text-black">
                            {user?.name || "Computer Operator"}
                        </h2>

                        <p className="mt-1 text-sm font-semibold text-gray-500">
                            {user?.email || "N/A"}
                        </p>

                        <span className="mt-3 inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
                            Computer Operator Portal
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
                    <Input label="Full Name" value={user?.name || ""} disabled />

                    <Input label="Email Address" value={user?.email || ""} disabled />

                    <Input
                        label="Phone Number"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                    />

                    <Input
                        label="Role"
                        value={user?.role === "operator" ? "Computer Operator" : user?.role}
                        disabled
                    />

                    <Input
                        label="Account Status"
                        value={user?.isActive ? "Active" : "Inactive"}
                        disabled
                    />

                    <Input
                        label="Joined Date"
                        value={
                            user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString()
                                : "N/A"
                        }
                        disabled
                    />

                    <Input
                        label="Last Login"
                        value={
                            user?.lastLogin
                                ? new Date(user.lastLogin).toLocaleString()
                                : "N/A"
                        }
                        disabled
                    />

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full cursor-pointer rounded-xl bg-black px-6 py-3 font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-500"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>

                <div className="mt-8 rounded-2xl bg-yellow-50 p-4 text-sm font-semibold text-yellow-700">
                    Note: Name, email, role, and account status are controlled by the
                    school admin and cannot be changed from this page.
                </div>
            </div>
        </section>
    );
}

function Input({ label, name, value, onChange, disabled = false }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
                {label}
            </label>

            <input
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full rounded-xl border px-4 py-3 outline-none ${disabled
                        ? "cursor-not-allowed bg-gray-100 text-gray-500"
                        : "bg-white focus:border-black"
                    }`}
            />
        </div>
    );
}