import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (

    <>
      <div className="min-h-screen mx-auto">
        <div className="px-8 flex flex-col max-w-4xl mx-auto">
          <div className="sticky top-0">
            <Header />
          </div>
          <div className="">
            <Outlet />
          </div>
          <div style={{ height: "1000px" }}></div>
        </div>
        
        <div className="bottom-0 sticky">
          <Footer />
        </div>
      </div>


    </>
  );
}
