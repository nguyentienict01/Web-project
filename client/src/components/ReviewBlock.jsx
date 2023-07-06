import Image from "../Image";
import { format } from "date-fns";

function ReviewBlock({ review }) {
  const maxRating = 5; // Giả sử đánh giá tối đa là 5
  const formatDate = (date) => {
    return format(new Date(date), "HH:mm:ss dd/MM/yyyy");
  };

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= maxRating; i++) {
      const isActive = i <= review.rating;
      const starColor = isActive ? "#FFCB00" : "currentColor";

      stars.push(
        <svg
          key={i}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="inline-block mr-1 text-gray-200"
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

  return (
    <div className="mb-6 md:mb-10 shadow-md rounded-[16px] overflow-hidden">
      <div className="pt-3 pb-3 md:pb-1 px-4 md:px-16 bg-white bg-opacity-40">
        <div className="flex flex-wrap items-center">
          <img className="mr-6 rounded-full w-14 h-14" src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=2000" alt="" />
          <h4 className="w-full md:w-auto text-xl font-heading font-medium">
            {review?.user.name}
          </h4>
          <div className="w-full md:w-px h-2 md:h-8 mx-8 bg-transparent md:bg-gray-200"></div>
          <span className="mr-4 text-xl font-heading font-medium">
            {review?.rating}
          </span>
          <div className="flex">{renderStars()}</div>
        </div>
      </div>
      <div className="px-4 md:px-16 pt-8 pb-8 bg-white">
        <div className="flex flex-wrap">
          <div className="w-full md:w-2/3 mb-6 md:mb-0">
            <p className="mb-8 max-w-2xl text-darkBlueGray-400 leading-loose">
              {review?.content}
            </p>
          </div>
          <div className="w-full md:w-1/3 text-right">
            <p className="mb-8 text-sm text-gray-300">
              {formatDate(review?.time)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewBlock;
