import React from "react";
import { useHistory } from "react-router-dom";

function ReservationForm({ formData, handleChange, handleSubmit }) {
	const history = useHistory();

	return (
		<form onSubmit={handleSubmit}>
			<div className="form-group">
				<label htmlFor="first_name">First Name</label>
				<input
					className="form-control"
					type="text"
					id="first_name"
					name="first_name"
					placeholder="First Name"
					required={true}
					value={formData.first_name}
					onChange={handleChange}
				/>
			</div>
			<div className="form-group">
				<label htmlFor="last_name">Last Name</label>
				<input
					className="form-control"
					type="text"
					id="last_name"
					name="last_name"
					placeholder="Last Name"
					required={true}
					value={formData.last_name}
					onChange={handleChange}
				/>
			</div>
			<div className="form-group">
				<label htmlFor="mobile_number">Phone Number</label>
				<input
					className="form-control"
					type="text"
					id="mobile_number"
					name="mobile_number"
					placeholder="###-###-####"
					required={true}
					value={formData.mobile_number}
					onChange={handleChange}
				/>
			</div>
			<div className="form-group">
				<label htmlFor="reservation_date">Date</label>
				<input
					className="form-control"
					type="date"
					id="reservation_date"
					name="reservation_date"
					required={true}
					value={formData.reservation_date}
					onChange={handleChange}
				/>
			</div>
			<div className="form-group">
				<label htmlFor="reservation_time">Time</label>
				<input
					className="form-control"
					type="time"
					id="reservation_time"
					name="reservation_time"
					required={true}
					value={formData.reservation_time}
					onChange={handleChange}
				/>
			</div>
			<div className="form-group">
				<label htmlFor="people">Number of People in Party</label>
				<input
					className="form-control"
					type="number"
					id="people"
					name="people"
					min={1}
					required={true}
					value={formData.people}
					onChange={handleChange}
				/>
			</div>
			<div>
				<button className="btn btn-primary" type="submit">
					Submit
				</button>
				<button className="btn btn-secondary" type="button" onClick={() => history.goBack()}>
					Cancel
				</button>
			</div>
		</form>
	);
}

export default ReservationForm;
