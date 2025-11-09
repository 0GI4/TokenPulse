import { createBrowserRouter } from "react-router-dom";
import Overview from "../pages/Overview";
import TokenDashboard from "../pages/TokenDashboard";

export const router = createBrowserRouter([
  { path: "/", element: <Overview /> },
  { path: "/token/:id", element: <TokenDashboard /> },
]);
