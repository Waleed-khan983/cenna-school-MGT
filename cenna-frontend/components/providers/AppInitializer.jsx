"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSettings } from "@/store/settingSlice";

export default function AppInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  return null;
}