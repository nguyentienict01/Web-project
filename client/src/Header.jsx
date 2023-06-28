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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 -rotate-90"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
        <span className="font-bold text-xl">airbnb</span>
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
