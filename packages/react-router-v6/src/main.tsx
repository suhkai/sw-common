import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// Route component and configs
import Root from "./routes/root";
import {
  loader as rootLoader,
  action as rootAction,
} from "./routes/root.helper";

import ErrorBoundary from "./routes/root.helper.comp";

// Contact component and configs
import Contact from "./routes/contact";
import {
  loader as contactLoader,
  action as contactAction,
} from "./routes/contact.helper";

// Edit Contacts
import EditContact from "./routes/edit";
import { action as editAction } from "./routes/edit.helper";

// Destroy Contracts
import { action as destroyAction } from "./routes/destroy.helper";

// Index
import Index from "./routes/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    action: rootAction,
    //ErrorBoundary: ErrorBoundary,
    children: [
      {
        ErrorBoundary: ErrorBoundary,
        children: [
          { index: true, element: <Index /> },
          {
            path: "contacts/:contactId",
            element: <Contact />,
            loader: contactLoader,
            action: contactAction,
          },
          {
            path: "contacts/:contactId/edit",
            element: <EditContact />,
            loader: contactLoader,
            action: editAction,
          },
          {
            path: "contacts/:contactId/destroy",
            action: destroyAction,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
