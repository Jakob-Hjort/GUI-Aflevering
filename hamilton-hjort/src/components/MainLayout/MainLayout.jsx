import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

import "./MainLayout.css";

// MainLayout viser de components som skal være synlige på ALLE sider.

export default function MainLayout({ children }) {
  return (
    <div className="appShell">

      <Header />

      <Navbar />

      <main className="appMain">{children}</main>

      <Footer />
    </div>
  );
}
