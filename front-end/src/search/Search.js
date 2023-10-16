import React, { useState } from "react";
import { searchByPhone } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "../reservations/Reservation";

function Search() {
	// State set-up for form
	const initialFormData = {
		mobile_number: "",
	};
	const [formData, setFormData] = useState({ ...initialFormData });

	const [searchResults, setSearchResults] = useState([]);
	const [searchError, setSearchError] = useState(null);

	// Change handler for form
	const handleChange = ({ target }) => {
		setFormData({
			...formData,
			[target.name]: target.value,
		});
	};

	// Submit handler for form
	const handleSubmit = async (event) => {
		event.preventDefault();
		const abortController = new AbortController();

		try {
			const results = await searchByPhone(formData.mobile_number, abortController.signal);
			if (results.length > 0) {
				setSearchResults(results);
			}
		} catch (error) {
			setSearchError([error.message]);
		}
	};

	return (
		<>
			<ErrorAlert error={searchError} />
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="mobile_number">Phone Number</label>
					<input
						className="form-control"
						type="text"
						id="mobile_number"
						name="mobile_number"
						placeholder="Enter a customer's phone number"
						required={true}
						value={formData.mobile_number}
						onChange={handleChange}
					/>
				</div>
				<button className="btn btn-primary" type="submit">
					Find
				</button>
			</form>
			{searchResults.length === 0 ? (
				<h5>No reservations found</h5>
			) : (
				searchResults.map((reservation) => (
					<div className="col-6 col-md-4" key={reservation.reservation_id}>
						<Reservation reservation={reservation} />
					</div>
				))
			)}
		</>
	);
}

export default Search;
