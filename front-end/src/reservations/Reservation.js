import React from "react";

function Reservation({
	reservation,
	reservation_id,
	first_name,
	last_name,
	mobile_number,
	reservation_time,
	people,
	status,
}) {
	return (
		<div className="card">
			<div className="card-header">{`Reservation #${reservation_id}`}</div>
			<div className="card-body">
				<h5 className="card-title">{`${last_name}, ${first_name}`}</h5>
				<h6 className="card-subtitle mb-2 text-muted">{mobile_number}</h6>
				<p className="card-text">{`Time: ${reservation_time}`}</p>
				<p className="card-text">{`People: ${people}`}</p>
				<p
					data-reservation-id-status={reservation.reservation_id}
					className="card-text">{`Status: ${status}`}</p>
				{status === "booked" ? (
					<a href={`/reservations/${reservation_id}/seat`} className="btn btn-primary">
						Seat
					</a>
				) : null}
			</div>
		</div>
	);
}

export default Reservation;
