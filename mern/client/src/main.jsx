import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import App from "./App";
import Home from "./components/Public/Home";
import Record from "./components/Admin/Record";
import RecordList from "./components/Admin/Recordlist";
import Login from "./components/Admin/Login";
import Unauthorized from "./components/Admin/Unauthorized"; // import it
import AdminHome from "./components/Admin/AdminHome"
import Transaction from "./components/Admin/Transaction"
import "./index.css";
//REACT BOOTSTRAP
import 'bootstrap/dist/css/bootstrap.min.css';

// Axios setup for cookies
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5050";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/admin/login",
    element: <Login />,
  },
  {
    path: "/unauthorized", // <-- add this
    element: <Unauthorized onBackToLogin={() => window.location.href = "/admin/login"} />,
  },
  //Protected Admin Routes
  {
    path: "/admin",
    //Layout/Dashboard component that wraps all admin routes
    element: <App />,
    children: [
      { index: true, element: <AdminHome /> }, //Dashbooard
      {path: "agents", element: <RecordList />},
      { path: "create", element: <Record /> },
      { path: "edit/:id", element: <Record /> },
      //Transactions added:
      { path: "transaction", element: <Transaction />}
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);