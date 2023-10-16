import React from "react";

function Reservation({ reservation }) {
	return (
		<div className="card">
			<div className="card-header">{`Reservation #${reservation.reservation_id}`}</div>
			<div className="card-body">
				<h5 className="card-title">{`${reservation.last_name}, ${reservation.first_name}`}</h5>
				<h6 className="card-subtitle mb-2 text-muted">{reservation.mobile_number}</h6>
				<p className="card-text">{`Time: ${reservation.reservation_time}`}</p>
				<p className="card-text">{`People: ${reservation.people}`}</p>
				<p
					data-reservation-id-status={reservation.reservation_id}
					className="card-text">{`Status: ${reservation.status}`}</p>
				{reservation.status === "booked" ? (
					<a href={`/reservations/${reservation.reservation_id}/seat`} className="btn btn-primary">
						Seat
					</a>
				) : null}
			</div>
		</div>
	);
}

export default Reservation;
