import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <div className=" flex flex-col min-h-screen ">
      <div className="px-[40px] lg:px-[80px] 2xl:px-[100px] relative z-20">
        <Header />
      </div>
      <div className="w-full border border-b border-gray-100"></div>
      <div className="px-[40px] lg:px-[80px] 2xl:px-[100px]">
        <Outlet />
      </div>
     <div className="bottom-0">
          <Footer />
        </div>
    </div>

  );
}

