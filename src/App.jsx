import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";

// Pages
import Home from "./pages/Home.jsx";
import Alerts from "./pages/Alerts.jsx";
import Visualization from "./pages/Visualization.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/visualization" element={<Visualization />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}
