import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";

export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get('http://localhost:4000/bookings').then(response => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  const deleteBooking = () => {
    axios.delete(`http://localhost:4000/bookings/delete/${id}`)
      .then( () => {
        createNotification(booking.place.owner, booking.name, id, booking.place.title, booking.checkIn, booking.checkOut);
        navigate('/account/bookings');
      });
  }

  const createNotification = (userId, name, bookingId, placeTitle, checkIn, checkOut) => {
    axios.post("http://localhost:4000/notiBooking", {
      user: userId,
      name: name,
      booking: bookingId,
      place: placeTitle,
      checkIn: checkIn,
      checkOut: checkOut,
      content: "Delete Booking"
    })
      .then(response => {
        console.log(bookingId)
        console.log("Thông báo đã được tạo thành công");
      })
      .catch(error => {
        console.error("Lỗi khi tạo thông báo:", error);
      });
  }

  if (!booking) {
    return '';
  }

  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking.place.title}</h1>
      <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-4">Your booking information:</h2>
          <BookingDates booking={booking} />
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total price</div>
          <div className="text-3xl">${booking.price}</div>
        </div>
      </div>
      <PlaceGallery place={booking.place} />
      <div className="flex justify-center items-center">
        <button className="mt-5 bg-primary text-white px-6 py-4 rounded-xl text-2xl" onClick={() => deleteBooking(booking._id)}>Delete booking</button>
      </div>

    </div>
  );
}