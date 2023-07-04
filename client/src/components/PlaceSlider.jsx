import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { Controller, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "../Image";
import { classNames } from "../common/helpers";
import { useNavigate } from "react-router-dom";

function PlaceSlider({ places = [] }) {
  const [swiperController, setSwiperController] = useState();
  const [canNext, setCanNext] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const navigate = useNavigate();
  const handleClickPlaceCard = (id) => {
    navigate("/place/id/" + id);
  };
  useEffect(() => {
    const handleResize = () => {
      if (swiperController) {
        setCanPrev(!swiperController?.isBeginning);
        setCanNext(!swiperController?.isEnd);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    document.addEventListener("DOMContentLoaded", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("DOMContentLoaded", handleResize);
    };
  }, [swiperController]);
  return (
    <div className={"relative"}>
      <Swiper
        modules={[Controller, Pagination]}
        onSwiper={setSwiperController}
        slidesPerView={10}
        spaceBetween={48}
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          1000: {
            slidesPerView: 4,
          },
          1280: {
            slidesPerView: 4,
          },
        }}
        onSlideChange={(event) => {
          setCanPrev(!event?.isBeginning);
          setCanNext(!event?.isEnd);
        }}
        pagination={{
          class: "!bottom-[0px]",
        }}
        wrapperClass="items-stretch pb-[40px]"
      >
        {places?.map((place, index) => {
          return (
            <SwiperSlide key={index} className="h-auto">
              <div
                className={classNames(
                  "flex w-full h-full justify-center transition-all cursor-pointer"
                )}
                onClick={() => handleClickPlaceCard(place._id)}
              >
                <div
                  className={
                    "flex w-full flex-col items-center justify-center gap-3"
                  }
                >
                  <Image
                    className={
                      "w-full aspect-square object-cover rounded-[12px]"
                    }
                    src={place.photos?.[0] || ""}
                    alt={place.title || ""}
                    width={100}
                    height={100}
                  />
                  <div className="flex flex-col gap-[2px] w-full flex-1">
                    <div className="flex justify-between gap-1">
                      <h4 className="text-base font-semibold line-clamp-1">
                        {place.title}, {place.address}
                      </h4>
                      <span className="text-base flex items-center">
                        <StarIcon className="w-4 h-4 mr-1" />{" "}
                        <span className="text-sm">
                          {Number(place.rating)?.toFixed(2) || "0.00"}
                        </span>
                      </span>
                    </div>
                    <p className="text-sm text-secondary flex-1 line-clamp-2">
                      {place.address}
                    </p>
                    <p className="text-sm">
                      <span className="text-md font-semibold">
                        {place.price}$ /{" "}
                      </span>{" "}
                      <span>night</span>
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {canPrev ? (
        <button
          onClick={() => {
            swiperController?.slidePrev();
          }}
          className={`absolute left-[-1%] top-[50%] rounded-full w-7 h-7 bg-white drop-shadow sm:top-[40%] md:left-[-2%] flex justify-center items-center hover:shadow-lg transition-all`}
          style={{
            transform: "translateY(-50%)",
            zIndex: 10,
          }}
        >
          <ChevronLeftIcon className="w-3 h-3" />
        </button>
      ) : null}
      {canNext ? (
        <button
          onClick={() => {
            swiperController?.slideNext();
          }}
          className={
            "absolute right-[-1%] top-[50%] rounded-full  w-7 h-7 bg-white drop-shadow sm:top-[40%] md:right-[-2%] flex justify-center items-center hover:shadow-lg transition-all"
          }
          style={{
            transform: "translateY(-50%)",
            zIndex: 10,
          }}
        >
          <ChevronRightIcon className="w-3 h-3" />
        </button>
      ) : null}
    </div>
  );
}

export default PlaceSlider;
