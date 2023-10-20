import React, { useState } from "react";
import { updateReservationStatus } from "../utils/api";
import { today } from "../utils/date-time";
import { formatAsTime } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";

import "../App.css";

function Reservation({ reservation }) {
	const [cancelError, setCancelError] = useState(null);
	const {
		reservation_id,
		first_name,
		last_name,
		mobile_number,
		reservation_date,
		reservation_time,
		people,
		status,
	} = reservation;

	// 'Cancel' button handler
	const handleCancel = async (event) => {
		event.preventDefault();
		const abortController = new AbortController();

		if (window.confirm(`Do you want to cancel this reservation? This cannot be undone.`)) {
			try {
				// PUT request to update reservation status
				await updateReservationStatus(reservation_id, "cancelled", abortController.signal);
				// Refresh page
				window.location.reload();
			} catch (error) {
				setCancelError([error.message]);
			}
		}
	};

	// Returns 'true' if reservation is due to arrive and not yet seated, 'false' otherwise
	const isDue = () => {
		// If reservation is for current day...
		if (reservation_date === today()) {
			const reservationDate = new Date(
				`${reservation_date}T${reservation_time.slice(0, 2)}:${reservation_time.slice(3)}`
			);
			const now = new Date(Date.now());
			// Accomodate for daylight savings time
			reservationDate.setTime(
				reservationDate.getTime() - reservationDate.getTimezoneOffset() * 60 * 1000
			);
			now.setTime(now.getTime() - now.getTimezoneOffset() * 60 * 1000);

			// If reservation is for current time or earlier and status is booked, return true
			if (reservationDate <= now && status.toLowerCase() === "booked") {
				return true;
			}
		}
		// Return false otherwise
		return false;
	};

	// Color coding based on status
	const setStatusColor = () => {
		if (status.toLowerCase() === "booked") {
			return "text-primary";
		} else if (status.toLowerCase() === "seated") {
			return "text-success";
		} else if (status.toLowerCase() === "finished") {
			return "text-dark";
		} else {
			return "text-danger";
		}
	};
	const statusColor = setStatusColor();

	// Re-format reservation time
	let formattedTime = formatAsTime(reservation_time);
	const hours = formattedTime.slice(0, 2);
	if (hours > 12) {
		formattedTime = `${hours - 12}${formattedTime.slice(2)} PM`;
	} else {
		formattedTime = `${formattedTime} AM`;
	}

	return (
		<div className="card reservation-card main-font position-relative">
			<ErrorAlert error={cancelError} />
			<div className="card-body p-2">
				<div className="row pb-1">
					<div className="col-6">
						<h5 className="card-title mb-0">{`${last_name},`}</h5>
						<h5 className="card-title">{`${first_name}`}</h5>
						<h6 className="card-subtitle text-muted">{mobile_number}</h6>
					</div>
					<div className="col-6 d-flex flex-column">
						<p className="card-text m-0">
							<i className="bi bi-clock-fill text-muted icon-right-margin"></i>
							{formattedTime}
							{isDue() ? <span class="badge text-bg-warning ms-2">Due</span> : null}
						</p>
						<p className="card-text m-0">
							<i className="bi bi-people-fill text-muted icon-right-margin"></i>
							{people}
						</p>
						<p
							data-reservation-id-status={reservation_id}
							className={`card-text text-capitalize fw-bold ${statusColor} m-0`}>
							<i className="bi bi-bar-chart-fill text-muted icon-right-margin"></i>
							{status}
						</p>
					</div>
				</div>
				<div className="card-footer bg-transparent px-0 pb-0">
					<div className="d-flex">
						{status.toLowerCase() === "booked" ? (
							<a
								href={`/reservations/${reservation_id}/seat`}
								className="btn btn-sm btn-success me-2">
								Seat
							</a>
						) : null}
						{status.toLowerCase() === "booked" ? (
							<a href={`/reservations/${reservation_id}/edit`} className="btn btn-sm btn-secondary">
								Edit
							</a>
						) : null}
						<button
							data-reservation-id-cancel={reservation_id}
							type="button"
							className="btn btn-sm btn-danger ms-auto"
							onClick={handleCancel}>
							<i className="bi bi-x-lg"></i>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Reservation;
