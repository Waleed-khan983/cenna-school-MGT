"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchParents, editParent, removeParent } from "@/store/parentSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function AdminParentsPage() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [selectedParent, setSelectedParent] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const { parents, loading, error } = useSelector((state) => state.parents);
  console.log(parents);

  useEffect(() => {
    dispatch(fetchParents());
  }, [dispatch]);

  const filteredParents = useMemo(() => {
    const value = search.toLowerCase().trim();
    if (!value) return parents;

    return parents.filter((parent) => {
      const name = parent.user?.name?.toLowerCase() || "";
      const email = parent.user?.email?.toLowerCase() || "";
      const phone = parent.user?.phone?.toLowerCase() || "";
      const cnic = parent.cnic?.toLowerCase() || "";
      const occupation = parent.occupation?.toLowerCase() || "";

      return (
        name.includes(value) ||
        email.includes(value) ||
        phone.includes(value) ||
        cnic.includes(value) ||
        occupation.includes(value)
      );
    });
  }, [parents, search]);

  const handleDelete = async (parent) => {
    if (!window.confirm(`Delete ${parent.user?.name}?`)) return;

    try {
      await dispatch(removeParent(parent._id)).unwrap();
      toast.success("Parent deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete parent");
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);

      const data = {
        name: formData.get("name"),
         phone: formData.get("phone"),
        cnic: formData.get("cnic"),
         whatsapp: formData.get("whatsapp"),
        address: formData.get("address"),
      };

      await dispatch(editParent({ id: selectedParent._id, data })).unwrap();

      toast.success("Parent updated successfully");
      setSelectedParent(null);
      setEditMode(false);
    } catch (error) {
      toast.error(error || "Failed to update parent");
    }
  };

  if (loading) return <PageLoader text="Loading parents..." />;

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 font-semibold text-red-600">
        {error}
      </div>
    );
  }

  return (
    <section className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black">Parents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage parent accounts and linked children.
          </p>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, CNIC, phone..."
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black md:w-96"
        />
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:block">
        <table className="w-full text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-4 text-center">#</th>
              <th className="px-4 py-4 text-left">Name</th>
             
              <th className="px-4 py-4 text-left">Phone</th>
              <th className="px-4 py-4 text-left">CNIC</th>
               <th className="px-4 py-4 text-center">Children</th>
              <th className="px-4 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredParents.length > 0 ? (
              filteredParents.map((parent, index) => (
                <tr key={parent._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-4 text-center font-bold">{index + 1}</td>
                  <td className="px-4 py-4 font-semibold">{parent.user?.name || "N/A"}</td>
                   <td className="px-4 py-4 text-gray-600">{parent.user?.phone || "N/A"}</td>
                  <td className="px-4 py-4 text-gray-600">{parent.cnic || "N/A"}</td>
                   <td className="px-4 py-4 text-center font-bold">
                    {parent.children?.length || 0}
                  </td>
                  <td className="px-4 py-4">
                    <Actions
                      onView={() => {
                        setSelectedParent(parent);
                        setEditMode(false);
                      }}
                      onEdit={() => {
                        setSelectedParent(parent);
                        setEditMode(true);
                      }}
                      onDelete={() => handleDelete(parent)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center font-semibold text-gray-500">
                  No parents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 xl:hidden">
        {filteredParents.length > 0 ? (
          filteredParents.map((parent) => (
            <div key={parent._id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-black">{parent.user?.name || "N/A"}</h3>
               <p className="text-sm text-gray-600">{parent.user?.phone || "N/A"}</p>
              <p className="mt-3 text-sm"><b>CNIC:</b> {parent.cnic || "N/A"}</p>
               <p className="text-sm"><b>Children:</b> {parent.children?.length || 0}</p>

              <div className="mt-4">
                <Actions
                  mobile
                  onView={() => {
                    setSelectedParent(parent);
                    setEditMode(false);
                  }}
                  onEdit={() => {
                    setSelectedParent(parent);
                    setEditMode(true);
                  }}
                  onDelete={() => handleDelete(parent)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center font-semibold text-gray-500">
            No parents found.
          </div>
        )}
      </div>

      {selectedParent && !editMode && (
        <Modal title="Parent Details" onClose={() => setSelectedParent(null)}>
          <Info label="Name" value={selectedParent.user?.name} />
           <Info label="Phone" value={selectedParent.user?.phone} />
          <Info label="CNIC" value={selectedParent.cnic} />
           <Info label="WhatsApp" value={selectedParent.whatsapp} />
          <Info label="Address" value={selectedParent.address} />
          <Info label="Children Count" value={selectedParent.children?.length || 0} />
        </Modal>
      )}

      {selectedParent && editMode && (
        <Modal title="Edit Parent" onClose={() => setSelectedParent(null)}>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input name="name" label="Name" defaultValue={selectedParent.user?.name} />
            {/* <Input name="email" label="Email" defaultValue={selectedParent.user?.email} /> */}
            <Input name="phone" label="Phone" defaultValue={selectedParent.user?.phone} />
            <Input name="cnic" label="CNIC" defaultValue={selectedParent.cnic} />
            {/* <Input name="occupation" label="Occupation" defaultValue={selectedParent.occupation} /> */}
            <Input name="whatsapp" label="WhatsApp" defaultValue={selectedParent.whatsapp} />
            <Input name="address" label="Address" defaultValue={selectedParent.address} />

            <button
              type="submit"
              className="!cursor-pointer w-full rounded-xl bg-black py-3 font-bold text-white transition hover:bg-gray-800"
            >
              Update Parent
            </button>
          </form>
        </Modal>
      )}
    </section>
  );
}

function Actions({ onView, onEdit, onDelete, mobile = false }) {
  return (
    <div className={`flex gap-2 ${mobile ? "" : "justify-center"}`}>
      <button type="button" onClick={onView} className="!cursor-pointer flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-500">
        View
      </button>
      <button type="button" onClick={onEdit} className="!cursor-pointer flex-1 rounded-lg bg-yellow-500 px-3 py-2 text-xs font-bold text-black hover:bg-yellow-400">
        Edit
      </button>
      <button type="button" onClick={onDelete} className="!cursor-pointer flex-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-500">
        Delete
      </button>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-black">{title}</h2>
          <button type="button" onClick={onClose} className="!cursor-pointer rounded-lg bg-gray-100 px-3 py-2 font-bold text-black hover:bg-gray-200">
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="mb-3 rounded-xl bg-gray-50 p-4">
      <p className="text-xs font-bold uppercase text-gray-400">{label}</p>
      <p className="mt-1 font-semibold text-black">{value || "N/A"}</p>
    </div>
  );
}

function Input({ label, name, defaultValue }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue || ""}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      />
    </div>
  );
}