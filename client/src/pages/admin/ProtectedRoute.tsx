import { useLocation } from "wouter";

export default function ProtectedRoute({ component: Component }) {
  const [, setLocation] = useLocation();
  const isAdmin = localStorage.getItem("isAdmin");

  if (!isAdmin) {
    setLocation("/admin/login");
    return null;
  }

  return <Component />;
}