import { useState, useEffect, useMemo } from "react";
import PerkSlider from "../components/PerkSlider";
import axios from "axios";
import PlaceSlider from "../components/PlaceSlider";

function RecommendationPage() {
  const [places, setPlaces] = useState([]);
  const [activePerk, setActivePerk] = useState("");
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
    return placesByPerk?.filter((place) => place.type === "beach");
  }, [placesByPerk]);

  const villaPlaces = useMemo(() => {
    return placesByPerk?.filter((place) => place.type === "villa");
  }, [placesByPerk]);

  const resortPlaces = useMemo(() => {
    return placesByPerk?.filter((place) => place.type === "resort");
  }, [placesByPerk]);

  return (
    <div className="flex flex-col py-10 gap-4">
      <PerkSlider activePerk={activePerk} setActivePerk={setActivePerk} />
      <div className="flex flex-col divide-y">
        <div className="flex flex-col w-full gap-5">
          <h2 className="text-2xl font-semibold">All Places</h2>
          {placesByPerk?.length ? (
            <PlaceSlider places={placesByPerk} />
          ) : (
            <span className="text-md mb-10"> No places available</span>
          )}{" "}
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
