"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaWhatsapp,
} from "react-icons/fa";

import api from "@/services/api";
import PageLoader from "@/components/ui/PageLoader";

export default function ParentContactPage() {
   

    const [loading, setLoading] = useState(false);
 
 
 

 

  

  if (loading) {
    return <PageLoader text="Loading messages..." />;
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-black">
          Contact School
        </h1>

        <p className="mt-2 text-gray-500">
          Send a message to school administration and view replies.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-black">
            School Office
          </h2>

          <div className="mt-5 space-y-4">
            <ContactInfo
              icon={<FaPhone />}
              label="Phone"
              value="03XX-XXXXXXX"
            />

            <ContactInfo
              icon={<FaWhatsapp />}
              label="WhatsApp"
              value="03XX-XXXXXXX"
            />

            <ContactInfo
              icon={<FaEnvelope />}
              label="Email"
              value="info@cenna.edu.pk"
            />

            <ContactInfo
              icon={<FaMapMarkerAlt />}
              label="Address"
              value="CENNA School & College Pabbi"
            />
          </div>
        </div>

       
      </div>

     
    </section>
  );
}

function ContactInfo({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border p-4">
      <div className="text-xl text-yellow-600">{icon}</div>

      <div>
        <p className="text-sm font-bold text-gray-500">{label}</p>
        <p className="font-bold text-black">{value}</p>
      </div>
    </div>
  );
}