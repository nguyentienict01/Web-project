import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className=" flex flex-col min-h-screen ">
      <div className="px-[40px] lg:px-[80px] 2xl:px-[100px]">
        <Header />
      </div>
      <div className="w-full border border-b border-gray-100"></div>
      <div className="px-[40px] lg:px-[80px] 2xl:px-[100px] flex-1">
        <Outlet />
      </div>
      <div className="bottom-0">
        <Footer />
      </div>
    </div>
  );
}
