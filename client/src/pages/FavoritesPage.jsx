import { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import PlaceImg from "../PlaceImg.jsx";
import AccountNav from "../AccountNav";

export default function FavoritesPage() {
  const { user } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:4000/user-favorites`).then(({ data }) => {
      setFavorites(data);
    });
  }, []);

  return (
    <div>
      <AccountNav />
      {favorites.length > 0 && favorites.map((place, index) => (
        <div key={index} className="mt-4">
          <Link to={'/place/id/' + place._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
            <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
              <PlaceImg place={place} />
            </div>
            <div className="grow-0 shrink">
              <h2 className="text-xl">{place.title}</h2>
              <p className="text-sm mt-2">{place.description}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
