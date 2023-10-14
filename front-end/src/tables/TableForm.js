import React from "react";
import { useHistory } from "react-router-dom";

function TableForm({ formData, handleChange, handleSubmit }) {
	const history = useHistory();

	return (
		<form onSubmit={handleSubmit}>
			<div className="form-group">
				<label htmlFor="table_name">Table Name</label>
				<input
					className="form-control"
					type="text"
					id="table_name"
					name="table_name"
					placeholder="Table Name"
					minLength={2}
					required={true}
					value={formData.table_name}
					onChange={handleChange}
				/>
			</div>
			<div className="form-group">
				<label htmlFor="capacity">Capacity</label>
				<input
					className="form-control"
					type="number"
					id="capacity"
					name="capacity"
					min={1}
					required={true}
					value={formData.capacity}
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

export default TableForm;
