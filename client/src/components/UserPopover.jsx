import { Popover, Transition } from "@headlessui/react";
import { useContext, Fragment } from "react";
import { UserContext } from "../UserContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const linkClass =
  "w-full flex items-center gap-2 rounded-lg p-4 py-3 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50";

const userItems = [
  {
    label: "Bookings",
    to: "/account/bookings",
  },
  {
    label: "Acommodations",
    to: "/account/places",
  },
  {
    label: "Notifications",
    to: "/account/notifications",
  },
  {
    label: "Favorite Places",
    to: "/account/favorites",
  },
  {
    label: "Logout",
    to: "",
  },
];

const guestItems = [
  {
    label: "Login",
    to: "/login",
  },
  {
    label: "Register",
    to: "/register",
  },
];

export default function UserPopover() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  async function logout() {
    await axios.post("/logout");
    setUser(null);
    navigate("/");
  }

  return (
    <Popover className="relative">
      <Popover.Button>
        <div className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 transition-all !shadow-md hover:!shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 relative top-1"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {!!user && <div>{user.name}</div>}
        </div>
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute right-0 z-10 mt-3 w-[240px] transform px-4 sm:px-0 lg:max-w-3xl bg-white">
          {({ close }) => (
            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
              {(user ? userItems : guestItems)?.map((item, index) => {
                if (item.label)
                  return (
                    <div key={index} className="relative bg-white w-full">
                      <Link
                        to={item.to || ""}
                        onClick={() => {
                          close();
                          if (item.label !== "Logout") return;
                          logout();
                        }}
                        className={linkClass}
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {item.label}
                        </span>
                      </Link>
                    </div>
                  );
                return <hr key={index} className="my-2 " />;
              })}
            </div>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
