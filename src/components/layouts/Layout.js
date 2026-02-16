import { useLocation } from "react-router-dom";
import Header from "./Header.js";
import Navbar from "./Navbar.js";
import Footer from "./Footer.js";

function Layout(props) {
  const { pathname } = useLocation();
  const hideOn = ["/"]; // adjust routes
  const hideNavbar = hideOn.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  return (
    <div className="centrepane">
      <Header />
      {!hideNavbar && <Navbar />}
      <main>{props.children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
