import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { Controller } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { perkList } from "../common/constants";
import { classNames } from "../common/helpers";

export default function PerkSlider({ activePerk, setActivePerk }) {
  const [swiperController, setSwiperController] = useState();
  const [canNext, setCanNext] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const filteredPerkList = perkList.filter(
    (item) => !["resort", "villa", "beach"].includes(item.value)
  );
  useEffect(() => {
    const handleResize = () => {
      if (swiperController) {
        setCanPrev(!swiperController?.isBeginning);
        setCanNext(!swiperController?.isEnd);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [swiperController]);
  return (
    <div className={"relative"}>
      <Swiper
        modules={[Controller]}
        onSwiper={setSwiperController}
        slidesPerView={10}
        spaceBetween={48}
        breakpoints={{
          320: {
            slidesPerView: 3,
          },
          640: {
            slidesPerView: 4,
          },
          1000: {
            slidesPerView: 5,
          },
          1280: {
            slidesPerView: 6,
          },
        }}
        onSlideChange={(event) => {
          setCanPrev(!event?.isBeginning);
          setCanNext(!event?.isEnd);
        }}
      >
        {filteredPerkList?.map((content, index) => {
          return (
            <SwiperSlide key={index}>
              <div
                className={classNames(
                  "flex w-full justify-center transition-all opacity-70 hover:opacity-100 cursor-pointer border-b-2 border-black/0 hover:border-black/50",
                  activePerk === content.value
                    ? "!border-black !border-b-2 !opacity-100"
                    : ""
                )}
                onClick={() => setActivePerk(content?.value)}
              >
                <div
                  className={
                    "flex w-full flex-col items-center justify-center gap-2"
                  }
                >
                  {/* <Image
                    className={"h-[24px] w-[24px] object-contain"}
                    src={content.image?.url || ""}
                    alt={content.name || ""}
                    width={24}
                    height={24}
                  /> */}
                  <content.icon />
                  <h4
                    className={
                      "mb-6 w-full max-w-[200px] text-center text-sm sm:max-w-[100%] font-semibold"
                    }
                  >
                    {content?.name}
                  </h4>
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
