import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";
import ReviewBlock from "../components/ReviewBlock";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`http://localhost:4000/places/id/${id}`).then((response) => {
      setPlace(response.data);
    });

    axios.get(`http://localhost:4000/user-favorites`).then((response) => {
      const favoritePlaces = response.data;
      setIsFavorited(
        favoritePlaces.some((favoritePlace) => favoritePlace._id === id)
      );
    });
  }, [id]);

  if (!place) return "";

  const toggleFavorite = async () => {
    try {
      if (isFavorited) {
        const response = await axios.delete(
          `http://localhost:4000/user/favorites/remove/${id}`
        );
        setIsFavorited(false);
      } else {
        const response = await axios.post(
          `http://localhost:4000/user/favorites/${id}`
        );
        setIsFavorited(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const reviews = [
    {
      user: "John",
      rating: "4.5",
      content: "Too good tobe true",
    },
    {
      user: "John",
      rating: "3",
      content: "Too good tobe true",
    },
    {
      user: "John",
      rating: "4.5",
      content: "Too good tobe true",
    },
    {
      user: "John",
      rating: "2",
      content: "Too good tobe true",
    },
  ];
  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8 rounded-2xl ">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl">{place.title}</h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isFavorited ? "red" : "none"}
          viewBox="0 0 24 24"
          strokeWidth={1.0}
          stroke="currentColor"
          className="w-8 h-8 hover:cursor-pointer"
          onClick={toggleFavorite}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </div>
      <AddressLink>{place.address}</AddressLink>
      <PlaceGallery place={place} />
      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            {place.description}
          </div>
          Check-in: {place.checkIn}
          <br />
          Check-out: {place.checkOut}
          <br />
          Max number of guests: {place.maxGuests}
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t ">
        <div>
          <h2 className="font-semibold text-2xl">Extra info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
          {place.extraInfo}
        </div>
      </div>

      <div className="flex flex-col bg-white -mx-8 px-8 py-8 border-t">
        <h2 className="font-semibold text-2xl mb-8">Reviews</h2>
        <div className="flex flex-col">
          {reviews?.map((review, index) => {
            return <ReviewBlock review={review} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
}
