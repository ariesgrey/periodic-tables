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

	// Track errors
	const [newReservationError, setNewReservationError] = useState([]);

	const history = useHistory();

	// Change handler for ReservationForm
	const handleChange = ({ target }) => {
		let value = target.value;
		// Convert 'people' value from a string to a number
		if (target.name === "people") {
			value = parseInt(value);
		}

		setFormData({
			...formData,
			[target.name]: value,
		});
	};

	// Submit handler for ReservationForm
	const handleSubmit = (event) => {
		event.preventDefault();
		const abortController = new AbortController();

		// POST new reservation function
		async function addReservation() {
			try {
				await createReservation(formData, abortController.signal);
				// Display dashboard for date of new reservation
				history.push(`/dashboard?date=${formData.reservation_date}`);
			} catch (error) {
				setNewReservationError([...newReservationError, error.message]);
			}
		}
		addReservation();
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
