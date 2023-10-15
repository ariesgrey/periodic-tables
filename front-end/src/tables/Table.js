import React, { useState } from "react";
import { finishTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Table({ table, table_name, capacity, status }) {
	const [finishError, setFinishError] = useState(null);

	// 'Finish' button handler
	const handleFinish = async (event) => {
		event.preventDefault();
		const abortController = new AbortController();

		if (window.confirm(`Is this table ready to seat new guests? This cannot be undone.`)) {
			try {
				// DELETE request to finish table
				await finishTable(table, abortController.signal);
				// Refresh dashboard
				window.location.reload();
			} catch (error) {
				setFinishError([error.message]);
			}
		}
	};

	return (
		<div className="card">
			<ErrorAlert error={finishError} />
			<div className="card-body">
				<h5 className="card-title">{table_name}</h5>
				<p className="card-text">{`Capacity: ${capacity}`}</p>
				<p data-table-id-status={table.table_id} className="card-text">{`Status: ${status}`}</p>
				{status === "Occupied" ? (
					<button
						data-table-id-finish={table.table_id}
						type="button"
						className="btn btn-danger"
						onClick={handleFinish}>
						Finish
					</button>
				) : null}
			</div>
		</div>
	);
}

export default Table;
