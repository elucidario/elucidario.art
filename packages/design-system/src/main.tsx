import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Page from "./Page";

const router = createBrowserRouter([
    {
        children: [
            {
                path: "/",
                element: <Page />,
            },
            // {
            //     path: "/soon",
            //     element: <Soon />,
            // },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
