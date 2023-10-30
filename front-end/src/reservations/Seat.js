import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, listTables, seatReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

import "../App.css";

function Seat() {
	// Form state set-up
	const initialFormData = {
		table_id: "",
	};
	const [formData, setFormData] = useState({ ...initialFormData });

	const [tables, setTables] = useState([]);
	const [reservation, setReservation] = useState({});
	const [seatError, setSeatError] = useState(null);

	const history = useHistory();
	const { reservation_id } = useParams();

	// Load reservation and tables
	useEffect(() => {
		const abortController = new AbortController();

		async function loadData() {
			try {
				setSeatError(null);
				const reservationData = await readReservation(reservation_id, abortController.signal);
				const tableList = await listTables(abortController.signal);
				// Filter out occupied tables
				const freeTables = tableList.filter((table) => table.status.toLowerCase() === "free");

				setReservation(reservationData);
				setTables(freeTables);
			} catch (error) {
				setTables([]);
				setSeatError([error.message]);
			}
		}
		loadData();
		return () => abortController.abort();
	}, [reservation_id]);

	// Change handler for form
	const handleChange = ({ target }) => {
		setFormData({
			...formData,
			[target.name]: target.value,
		});
	};

	// Prep and validation - check for sufficient capacity
	const prepareSubmit = (reservation, formData, errors) => {
		// Convert 'table_id' value to number
		formData.table_id = parseInt(formData.table_id);

		const selectedTable = tables.find((table) => table.table_id === formData.table_id);
		if (!selectedTable) {
			errors.push(`Please select a table.`);
		} else if (selectedTable.capacity < reservation.people) {
			errors.push(`Table capacity too small for reservation.`);
		}
	};

	// Submit handler for form
	const handleSubmit = async (event) => {
		event.preventDefault();
		const abortController = new AbortController();

		// Validate
		const errors = [];
		prepareSubmit(reservation, formData, errors);
		// Don't submit PUT if any errors
		if (errors.length) {
			setSeatError({ message: errors });
			return;
		}

		try {
			// PUT updated reservation info
			await seatReservation(reservation_id, formData, abortController.signal);
			// Display dashboard after submitted
			history.push(`/dashboard`);
		} catch (error) {
			setSeatError([error.message]);
		}
	};

	return (
		<div className="container ms-1">
			<h1 className="header-font fw-bold text-center my-4">Seat Reservation #{reservation_id}</h1>
			<fieldset className="border rounded bg-secondary-subtle form-fieldset mb-5">
				<ErrorAlert error={seatError} />
				<form className="form-main sub-header-font" onSubmit={handleSubmit}>
					<div className="row">
						<label htmlFor="table_id" className="col-12 col-md-2 col-form-label col-form-label-lg">
							Select Table
						</label>
						<div className="col-12 col-md-10">
							<select
								className="form-select form-select-lg form-item"
								id="table_id"
								name="table_id"
								value={formData.table_id}
								onChange={handleChange}>
								<option value="">-- Select a Table --</option>
								{tables.map((table) => (
									<option key={table.table_id} value={table.table_id}>
										{table.table_name} - {table.capacity}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="d-flex justify-content-between">
						<button
							className="btn btn-lg btn-secondary"
							type="button"
							onClick={() => history.goBack()}>
							Cancel
						</button>
						<button className="btn btn-lg btn-primary" type="submit">
							Submit
						</button>
					</div>
				</form>
			</fieldset>
		</div>
	);
}

export default Seat;
