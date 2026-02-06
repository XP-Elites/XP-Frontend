import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/layouts/Layout.js";
import Home from "./components/pages/Home.js";
import PageNotFound from "./components/pages/404.js";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
