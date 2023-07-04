import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../AddressLink";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import ReviewBlock from "../components/ReviewBlock";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [activeStars, setActiveStars] = useState(0);

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
    axios.get(`http://localhost:4000/reviews/place/${id}`).then((response) => {
      setReviews(response.data);
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

  const handleReviewChange = (event) => {
    setReviewContent(event.target.value);
  };

  const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value));
  };

  const handleRatingClick = (rating) => {
    setActiveStars(rating);
    setRating(rating);
  };

  const renderStars = () => {
    const stars = [];
  
    for (let i = 1; i <= 5; i++) {
      const isActive = i <= activeStars;
      const starColor = isActive ? "#FFCB00" : "currentColor";
  
      stars.push(
        <svg
          key={i}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="inline-block mr-1 text-gray-200 cursor-pointer"
          onClick={() => handleRatingClick(i)}
        >
          <path
            d="M20 7.91677H12.4167L10 0.416763L7.58333 7.91677H0L6.18335 12.3168L3.81668 19.5834L10 15.0834L16.1834 19.5834L13.8167 12.3168L20 7.91677Z"
            fill={starColor}
          ></path>
        </svg>
      );
    }
  
    return stars;
  };
  
  const handleSubmitReview = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/reviews/place/${id}`, {
        rating: rating,
        content: reviewContent,
      }).then((response) => {
        axios.get(`http://localhost:4000/reviews/place/${id}`)
          .then((response) => {
            setReviews(response.data);
          });
      });
      setReviewContent("");
      setActiveStars(0);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };
  

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

      <div className="mt-8 pb-4">
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
          rows="4"
          placeholder="Write a review..."
          value={reviewContent}
          onChange={handleReviewChange}
        ></textarea>
        <div className="flex">
          <label>Rating:</label>
          <div className="ml-4">{renderStars()}</div>
        </div>
        <div className="" style={{marginLeft: "89%"}}>
          <button
            className="px-4 py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleSubmitReview}
          >
            Submit Review
          </button>
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
