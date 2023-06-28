import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <div className="min-h-screen mx-auto flex flex-col ">
        <div className="top-0 max-w-4xl mx-auto z-30">
          <Header />
        </div>
        <div className="px-8 flex flex-col max-w-6xl mx-auto flex-grow">
          <Outlet />
        </div>
        <div className="bottom-0">
          <Footer />
        </div>
      </div>
    </>
  );
}

