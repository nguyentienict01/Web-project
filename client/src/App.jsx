import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import PlacesPage from "./pages/PlacesPage";
import FavoritesPage from './pages/FavoritesPage';
import PlaceSearchPage from "./pages/PlaceSearchPage";
import PlacesFormPage from "./pages/PlacesFormPage";
import PlacePage from "./pages/PlacePage";
import BookingsPage from "./pages/BookingsPage";
import BookingPage from "./pages/BookingPage";
import NotificationsPage from "./pages/NotificationsPage";
import RecommendationPage from "./pages/RecommendationPage";
import 'swiper/swiper-bundle.css';


axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RecommendationPage />} />
          <Route path="/recommendations" element={<RecommendationPage />} />
          <Route path="/account/notifications" element={<NotificationsPage />} />
          <Route path="/search" element={<PlaceSearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account/favorites" element={<FavoritesPage />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlacesFormPage />} />
          <Route path="/account/places/:id" element={<PlacesFormPage />} />
          <Route path="/place/id/:id" element={<PlacePage />} />
          <Route path="/account/bookings" element={<BookingsPage />} />
          <Route path="/account/bookings/:id" element={<BookingPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
