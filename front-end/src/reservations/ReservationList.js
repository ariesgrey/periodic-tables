import React from "react";
import Reservation from "./Reservation";

function ReservationList({ reservations }) {
	const list = reservations.map((reservation) => {
		return (
			<div className="col-md-4" key={reservation.reservation_id}>
				<Reservation reservation={reservation} />
			</div>
		);
	});

	return <div className="row">{list}</div>;
}

export default ReservationList;
