import Footer from "./Footer";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "./Navbar";
import { Toaster } from "sonner";

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollRestoration
        getKey={(location) => location.pathname}
      />

      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      <Toaster position="top-center" richColors />
    </div>
  );
};

export default Layout;