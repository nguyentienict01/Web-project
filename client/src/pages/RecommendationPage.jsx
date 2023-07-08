import { useState, useEffect, useMemo } from "react";
import PerkSlider from "../components/PerkSlider";
import axios from "axios";
import PlaceSlider from "../components/PlaceSlider";

function RecommendationPage() {
  const [places, setPlaces] = useState([]);
  const [activePerk, setActivePerk] = useState("");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [sortOrder, setSortOrder] = useState(""); // Thêm state để lưu trữ thứ tự sắp xếp

  useEffect(() => {
    const getPlaces = async () => {
      const response = await axios.get("/places");
      setPlaces(response?.data);
    };
    getPlaces();
  }, []);

  const placesByPerk = useMemo(() => {
    return activePerk
      ? places?.filter((place) => place.perks?.includes(activePerk))
      : places;
  }, [places, activePerk]);

  const beachPlaces = useMemo(() => {
    return placesByPerk?.filter((place) => place.perks.includes("beach"));
  }, [placesByPerk]);

  const villaPlaces = useMemo(() => {
    return placesByPerk?.filter((place) => place.perks.includes("villa"));
  }, [placesByPerk]);

  const resortPlaces = useMemo(() => {
    return placesByPerk?.filter((place) => place.perks.includes("resort"));
  }, [placesByPerk]);

  const filterByPriceRange = (place) => {
    return place.price >= priceRange[0] && place.price <= priceRange[1];
  };

  const sortPlacesByPrice = (places, order) => {
    return places.slice().sort((a, b) => {
      if (order === "lowToHigh") {
        return a.price - b.price;
      } else if (order === "highToLow") {
        return b.price - a.price;
      }
      return 0;
    });
  };

  const handleSortByPrice = (order) => {
    setSortOrder(order);
  };

  const sortedPlacesByPrice = useMemo(() => {
    return sortPlacesByPrice(placesByPerk, sortOrder);
  }, [placesByPerk, sortOrder]);

  return (
    <div className="flex flex-col py-10 gap-4">
      <PerkSlider activePerk={activePerk} setActivePerk={setActivePerk} />
      <div className="flex flex-col md:flex-row range-price-name">
        <div className="flex md:mt-8 md:space-x-8">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={() => handleSortByPrice("lowToHigh")}
          >
            Low to high price
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleSortByPrice("highToLow")}
          >
            High to low price
          </button>
        </div>
        <div className="w-full md:w-5/12 mt-4 md:mt-0">
          <label
            htmlFor="minmax-range"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Price
          </label>
          <div className="w-full flex range-price-name">
            <span>0$</span>
            <span>300$</span>
          </div>
          <input
            id="minmax-range"
            type="range"
            list="tickmarks"
            min="0"
            max="300"
            step="20"
            className="w-full h-2 bg-blue-100 appearance-none"
            onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
          />
        </div>
      </div>
      <div className="flex flex-col divide-y">
        <div className="flex flex-col w-full gap-5">
          <h2 className="text-2xl font-semibold">All Places</h2>
          {sortedPlacesByPrice.length ? (
            <PlaceSlider
              places={sortedPlacesByPrice.filter(filterByPriceRange)}
            />
          ) : (
            <span className="text-md mb-10"> No places available</span>
          )}
        </div>
        <div className="flex flex-col w-full gap-5 pt-5">
          <h2 className="text-2xl font-semibold">Beach Places</h2>
          {beachPlaces?.length ? (
            <PlaceSlider places={beachPlaces} />
          ) : (
            <span className="text-md mb-10"> No beach places available</span>
          )}
        </div>
        <div className="flex flex-col w-full gap-5 pt-5">
          <h2 className="text-2xl font-semibold">Villa Places</h2>
          {villaPlaces?.length ? (
            <PlaceSlider places={villaPlaces} />
          ) : (
            <span className="text-md mb-10"> No villa places available</span>
          )}
        </div>
        <div className="flex flex-col w-full gap-5 pt-5">
          <h2 className="text-2xl font-semibold">Resort Places</h2>
          {resortPlaces?.length ? (
            <PlaceSlider places={resortPlaces} />
          ) : (
            <span className="text-md mb-10"> No resort places available</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecommendationPage;
