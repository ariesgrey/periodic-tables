import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

function NewReservation() {
	// State set-up for ReservationForm
	const initialFormData = {
		first_name: "",
		last_name: "",
		mobile_number: "",
		reservation_date: "",
		reservation_time: "",
		people: "",
	};
	const [formData, setFormData] = useState({ ...initialFormData });

	const [newReservationError, setNewReservationError] = useState(null);
	const history = useHistory();

	// Change handler for ReservationForm
	const handleChange = ({ target }) => {
		setFormData({
			...formData,
			[target.name]: target.value,
		});
	};

	// Validation + data preparation before submit
	const prepareSubmit = (data, errors) => {
		// Date + time validation
		const date = data.reservation_date;
		const time = data.reservation_time;
		// 'Date-time form' interpreted as local time
		const reservationDate = new Date(`${date}T${time.slice(0, 2)}:${time.slice(3)}`);
		const now = new Date(Date.now());
		// Accomodate for daylight savings time
		reservationDate.setTime(
			reservationDate.getTime() - reservationDate.getTimezoneOffset() * 60 * 1000
		);
		now.setTime(now.getTime() - now.getTimezoneOffset() * 60 * 1000);

		// Check if in the past
		if (reservationDate < now) {
			errors.push(`Reservation must be in the future.`);
		}
		// Check if a tuesday
		if (reservationDate.getDay() === 2) {
			errors.push(`Reservation must not be on a Tuesday - restaurant closed.`);
		}
		// Check if outside business hours
		const earliestTime = 1030;
		const latestTime = 2120;
		const reservationTime = time.substring(0, 2) + time.substring(3);
		if (reservationTime < earliestTime || reservationTime > latestTime) {
			errors.push(`Reservation must be between 10:30am and 9:30pm.`);
		}

		// Convert 'people' value from a string to a number
		data.people = parseInt(data.people);
	};

	// Submit handler for ReservationForm
	const handleSubmit = async (event) => {
		event.preventDefault();
		const abortController = new AbortController();

		// Validate
		const errors = [];
		prepareSubmit(formData, errors);
		// Don't submit POST if any errors
		if (errors.length) {
			setNewReservationError({ message: errors });
			return;
		}

		try {
			// POST new reservation function
			await createReservation(formData, abortController.signal);
			// Display dashboard for date of new reservation
			history.push(`/dashboard?date=${formData.reservation_date}`);
		} catch (error) {
			setNewReservationError([error.message]);
		}
	};

	return (
		<>
			<ErrorAlert error={newReservationError} />
			<ReservationForm
				formData={formData}
				handleChange={handleChange}
				handleSubmit={handleSubmit}
			/>
		</>
	);
}

export default NewReservation;
