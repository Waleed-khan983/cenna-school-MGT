import { useSelector } from "react-redux";

export default function useSchoolSettings() {
  const { settings } = useSelector(
    (state) => state.settings || {}
  );

  return settings || {};
}