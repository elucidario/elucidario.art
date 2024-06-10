import React from "react";
import ReactDOM from "react-dom/client";
import Page from "./Page.tsx";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { SystemProvider } from "@/provider";

const router = createBrowserRouter([
    {
        element: (() => {
            return (
                <SystemProvider>
                    <Outlet />
                </SystemProvider>
            );
        })(),
        children: [
            {
                path: "/",
                element: <Page />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
