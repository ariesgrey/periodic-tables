import React, { useState } from "react";
import { readTableByReservation, updateReservationStatus } from "../utils/api";
import { currentDateTime } from "../utils/date-time";
import { formatAsTime } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";

import "../App.css";
import {
	CancelIcon,
	EditIcon,
	ReservationPeopleIcon,
	ReservationStatusIcon,
	ReservationTimeIcon,
} from "../icons/Icons";

function Reservation({ reservation }) {
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

	const [cancelError, setCancelError] = useState(null);
	const [tableSeatedAt, setTableSeatedAt] = useState(null);

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
	function getIsDue() {
		// If reservation is for current day...
		if (reservation_date === currentDateTime().slice(0, 10)) {
			const reservationDate = new Date(
				`${reservation_date}T${reservation_time.slice(0, 2)}:${reservation_time.slice(3)}`
			);
			// Accomodate for daylight savings time
			reservationDate.setTime(
				reservationDate.getTime() - reservationDate.getTimezoneOffset() * 60 * 1000
			);
			const now = currentDateTime();

			// If reservation is for current time or earlier and status is booked, return true
			if (reservationDate <= now && status.toLowerCase() === "booked") {
				return true;
			}
		}
		// Return false otherwise
		return false;
	}
	const isDue = getIsDue();

	// When reservation is seated, sets state as name of the table and returns true, otherwise returns false
	function getTableSeatedAt() {
		const abortController = new AbortController();

		const getTable = async () => {
			try {
				const table = await readTableByReservation(reservation_id, abortController.signal);
				setTableSeatedAt(table.table_name);
			} catch (error) {
				setCancelError([error.message]);
			}
		};

		if (status.toLowerCase() === "seated") {
			getTable();
			return true;
		} else {
			return false;
		}
	}

	// Sets status text color based on its value
	function setStatusColor() {
		if (status.toLowerCase() === "booked") {
			return "text-primary";
		} else if (status.toLowerCase() === "seated") {
			return "text-success";
		} else if (status.toLowerCase() === "finished") {
			return "text-dark";
		} else if (status.toLowerCase() === "cancelled") {
			return "text-danger";
		}
	}
	const statusColor = setStatusColor();

	// Sets background darker for cancelled appointments - for Search
	function setCancelledBackground() {
		if (status.toLowerCase() === "cancelled") {
			return "bg-secondary-subtle";
		} else {
			return null;
		}
	}
	const cancelledBackground = setCancelledBackground();

	// Re-format reservation time
	let formattedTime = formatAsTime(reservation_time);
	const hours = formattedTime.slice(0, 2);
	if (hours > 12) {
		formattedTime = `${hours - 12}${formattedTime.slice(2)} PM`;
	} else {
		formattedTime = `${formattedTime} AM`;
	}

	return (
		<div className={`card reservation-card ${cancelledBackground} main-font shadow-sm mb-3`}>
			<ErrorAlert error={cancelError} />
			<div className="card-body p-2">
				<div className="row pb-1">
					<div className="col-6">
						<h5 className="card-title fw-bold text-truncate">{`${last_name}, ${first_name}`}</h5>
						<h6 className="card-subtitle mb-2">{mobile_number}</h6>
						<p className="id text-muted m-0 pt-1">{`ID: ${reservation_id}`}</p>
					</div>
					<div className="col-6 d-flex flex-column">
						<p className="card-text card-col2-margin" title="Reservation Time">
							<ReservationTimeIcon />
							{formattedTime}
							{isDue ? <span className="badge text-bg-warning ms-2">Due</span> : null}
						</p>
						<p className="card-text card-col2-margin" title="Party Size">
							<ReservationPeopleIcon />
							{people}
						</p>
						<p
							data-reservation-id-status={reservation_id}
							className={`card-text text-capitalize fw-bold ${statusColor} m-0`}
							title="Status">
							<ReservationStatusIcon status={status} />
							{status}
						</p>
					</div>
				</div>
				<div className="card-footer footer-height bg-transparent p-0">
					{status.toLowerCase() === "booked" ? (
						<div className="d-flex align-items-center pt-2">
							<a
								href={`/reservations/${reservation_id}/edit`}
								className="btn btn-sm btn-secondary me-auto"
								title="Edit">
								<EditIcon />
							</a>
							<a
								href={`/reservations/${reservation_id}/seat`}
								className="btn btn-sm btn-success py-1 px-2 fw-bold">
								<p className="fs-6 m-0">Seat</p>
							</a>
							<button
								data-reservation-id-cancel={reservation_id}
								type="button"
								className="btn btn-sm btn-danger ms-2"
								title="Cancel"
								onClick={handleCancel}>
								<CancelIcon />
							</button>
						</div>
					) : null}
					{getTableSeatedAt() ? (
						<div className="d-flex align-items-center justify-content-center py-1">
							<p className="card-text seated-text text-center pt-2">{`Seated at ${tableSeatedAt}`}</p>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}

export default Reservation;
