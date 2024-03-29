import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookThisPlace(e) {
    e.preventDefault();
    if (numberOfGuests > place.maxGuests) {
      alert(`The max number of guests for this place is ${place.maxGuests}`);
      return;
    }
    try {
      const response = await axios.post("http://localhost:4000/bookings", {
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        phone,
        place: place._id,
        price: numberOfNights * place.price,
      });
      const bookingId = response.data._id;
      setRedirect(`/account/bookings/${bookingId}`);
      const placeTitle = place.title; 
      console.log(placeTitle)
      createNotification(place.owner, name, bookingId, placeTitle, checkIn, checkOut);
    } catch (error) {
      if (error.response && error.response.data.message === "No available room") {
        alert("No available room. Please choose another time.");
      }
      else if (error.response && error.response.data.message === "Invalid time") {
        alert("Invalid check in and check out time. Please choose another time.");
      }
      else {
        console.log(error);
      }
    }
  }  

  async function createNotification(userId, name, bookingId, placeTitle, checkIn, checkOut) {
    try {
      await axios.post("http://localhost:4000/notiBooking", {
        user: userId,
        name: name,
        booking: bookingId,
        place: placeTitle,
        checkIn: checkIn,
        checkOut: checkOut,
        content: "Booking"
      });
      console.log("Thông báo đã được tạo thành công");
    } catch (error) {
      console.error("Lỗi khi tạo thông báo:", error);
    }
  }
  

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <form onSubmit={bookThisPlace} className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in:</label>
            <input
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              required
            />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <input
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              required
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input
            type="number"
            value={numberOfGuests}
            onChange={(ev) => setNumberOfGuests(ev.target.value)}
            required
          />
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              required
            />
            <label>Phone number:</label>
            <input
              type="tel"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
              required
            />
          </div>
        )}
      </div>
      <button type="submit" className="primary mt-4 text-center">
        Book this place
        {numberOfNights > 0 && <span> ${numberOfNights * place.price}</span>}
      </button>
    </form>
  );
}
