import React from "react";
import ReservationForm from "./ReservationForm";

function NewReservation() {
	return (
		<div className="container ms-1">
			<h2 className="header-font fw-bold text-center my-4">Add New Reservation</h2>
			<ReservationForm />
		</div>
	);
}

export default NewReservation;
