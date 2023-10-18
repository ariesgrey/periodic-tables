import React, { useState } from "react";
import { updateReservationStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Reservation({ reservation }) {
	const [cancelError, setCancelError] = useState(null);

	// 'Cancel' button handler
	const handleCancel = async (event) => {
		event.preventDefault();
		const abortController = new AbortController();

		if (window.confirm(`Do you want to cancel this reservation? This cannot be undone.`)) {
			try {
				// PUT request to update reservation status
				await updateReservationStatus(
					reservation.reservation_id,
					"cancelled",
					abortController.signal
				);
				// Refresh page
				window.location.reload();
			} catch (error) {
				setCancelError([error.message]);
			}
		}
	};

	return (
		<div className="card">
			<ErrorAlert error={cancelError} />
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
				{reservation.status === "booked" ? (
					<a
						href={`/reservations/${reservation.reservation_id}/edit`}
						className="btn btn-secondary">
						Edit
					</a>
				) : null}
				<button
					data-reservation-id-cancel={reservation.reservation_id}
					type="button"
					className="btn btn-secondary"
					onClick={handleCancel}>
					Cancel
				</button>
			</div>
		</div>
	);
}
// may need to change edit button 'href'

export default Reservation;
