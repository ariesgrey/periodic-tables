import React from "react";
import Reservation from "./Reservation";
import { formatAsTime } from "../utils/date-time";

function ReservationList({ reservations }) {
	const list = reservations.map((reservation) => {
		// Re-format reservation time
		let formattedTime = formatAsTime(reservation.reservation_time);
		const hours = formattedTime.slice(0, 2);
		if (hours > 12) {
			formattedTime = `${hours - 12}${formattedTime.slice(2)} PM`;
		} else {
			formattedTime = `${formattedTime} AM`;
		}

		return (
			<div className="col-6 col-md-4" key={reservation.reservation_id}>
				<Reservation reservation={reservation} />
			</div>
		);
	});

	return <div className="row">{list}</div>;
}

export default ReservationList;
