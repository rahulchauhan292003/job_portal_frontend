import React from "react";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <Toaster position="top-right" />

       <Navbar/>

      <AppRoutes />
    </>
  );
};

export default App;
