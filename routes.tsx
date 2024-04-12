import { createBrowserRouter } from "react-router-dom";

import ProjectsPage from "./src/pages/ProjectsPage";
import HomePage from "./src/pages/HomePage";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/projects", element: <ProjectsPage /> },
]);
