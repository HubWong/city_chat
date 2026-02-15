

import { createRoot } from "react-dom/client";
import AppProviders from './AppProvider'
import { RouterProvider } from "react-router-dom";
import { routesArray } from "@/shared/routes";

createRoot(document.getElementById("root"))
  .render(
    <AppProviders>
      <RouterProvider router={routesArray} />
    </AppProviders>
  );
