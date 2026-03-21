import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/Layout.js";
import Home from "./components/pages/Home.js";
import Login from "./components/pages/Login.js";
import Upload from "./components/pages/Upload.js";
import Results from "./components/pages/Results.js";
import PageNotFound from "./components/pages/404.js";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <div className="pageWrapper">
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
