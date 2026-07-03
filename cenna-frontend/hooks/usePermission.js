import { useSelector } from "react-redux";

export default function usePermission(permission) {
  const permissions =
    useSelector((state) => state.auth?.permissions) || [];

  if (permissions.includes("*")) {
    return true;
  }

  return permissions.includes(permission);
}