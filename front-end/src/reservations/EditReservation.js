import React from "react";
import { useParams } from "react-router-dom";
import ReservationForm from "./ReservationForm";

function EditReservation() {
	const { reservation_id } = useParams();

	return (
		<div className="container ms-1">
			<h2 className="header-font fw-bold text-center my-4">Edit Reservation: {reservation_id}</h2>
			<ReservationForm reservation_id={reservation_id} />
		</div>
	);
}

export default EditReservation;
