import React from "react";

function Reservation({
	reservation_id,
	first_name,
	last_name,
	mobile_number,
	reservation_time,
	people,
}) {
	return (
		<div className="card">
			<div className="card-header">{`Reservation #${reservation_id}`}</div>
			<div className="card-body">
				<h5 className="card-title">{`${last_name}, ${first_name}`}</h5>
				<h6 className="card-subtitle mb-2 text-muted">{mobile_number}</h6>
				<p className="card-text">{`Time: ${reservation_time}`}</p>
				<p className="card-text">{`People: ${people}`}</p>
				<a href={`/reservations/${reservation_id}/seat`} className="btn btn-primary">
					Seat
				</a>
			</div>
		</div>
	);
}

export default Reservation;
