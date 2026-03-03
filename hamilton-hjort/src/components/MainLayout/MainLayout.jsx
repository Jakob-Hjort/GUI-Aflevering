import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

import "./MainLayout.css";

// MainLayout viser de components som skal være synlige på ALLE sider.
// Selve sidens indhold kommer ind som children.
export default function MainLayout({ children }) {
  return (
    <div className="appShell">
      {/* Øverst: header */}
      <Header />

      {/* Navigation (links mellem routes) */}
      <Navbar />

      {/* Her indsætter vi den side, som Routeren vælger */}
      <main className="appMain">{children}</main>

      {/* Nederst: footer */}
      <Footer />
    </div>
  );
}
