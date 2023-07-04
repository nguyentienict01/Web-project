import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserPopover from "./components/UserPopover.jsx";

export default function Header() {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };
  const handleSearch = () => {
    // TODO: Implement handle search
    if (searchInput) {
      navigate(`/search?title=${encodeURIComponent(searchInput)}`);
    }
  };
  return (
    <header className="flex justify-between h-[80px] items-center">
      <Link to={"/"} className="flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
        <span className="font-bold text-xl">Contels</span>
      </Link>
      {
        <div className="flex gap-2 border border-gray-300 rounded-full py-2 px-4 hover:shadow-md shadow-sm transition-all  shadow-gray-300">
          <input
            placeholder="Enter a position"
            onChange={handleInputChange}
          ></input>
          <button
            className="bg-primary text-white p-1 rounded-full"
            onClick={handleSearch}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </div>
      }
      <UserPopover />
    </header>
  );
}
