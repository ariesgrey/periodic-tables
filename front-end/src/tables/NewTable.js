import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import TableForm from "./TableForm";

function NewTable() {
	// State set-up for TableForm
	const initialFormData = {
		table_name: "",
		capacity: "",
	};
	const [formData, setFormData] = useState({ ...initialFormData });

	const [newTableError, setNewTableError] = useState(null);
	const history = useHistory();

	// Change handler for TableForm
	const handleChange = ({ target }) => {
		setFormData({
			...formData,
			[target.name]: target.value,
		});
	};

	// Submit handler for TableForm
	const handleSubmit = async (event) => {
		event.preventDefault();
		const abortController = new AbortController();

		// Convert 'capacity' value from a string to a number
		formData.capacity = parseInt(formData.capacity);

		try {
			// POST new table function
			await createTable(formData, abortController.signal);
			// Display dashboard page
			history.push("/dashboard");
		} catch (error) {
			setNewTableError([error.message]);
		}
	};

	return (
		<>
			<ErrorAlert error={newTableError} />
			<TableForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
		</>
	);
}

export default NewTable;
