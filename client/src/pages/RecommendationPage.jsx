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
  return (
    <div className="flex flex-col py-10 gap-4">
      <PerkSlider activePerk={activePerk} setActivePerk={setActivePerk} />
      <div className="flex flex-col w-full gap-5">
        <h2 className="text-2xl font-semibold">By Ratings</h2>
        <PlaceSlider places={placesByPerk} />
      </div>
    </div>
  );
}

export default RecommendationPage;
