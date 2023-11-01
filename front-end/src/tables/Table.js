import React, { useState } from "react";
import { finishTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

import "../App.css";
import { TableCapacityIcon, TableStatusIcon } from "../icons/Icons";

function Table({ table }) {
	const [finishError, setFinishError] = useState(null);
	const { table_id, table_name, capacity, status, reservation_id } = table;

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

	// Color coding based on status
	const setStatusColor = () => {
		if (status.toLowerCase() === "free") {
			return "text-primary";
		} else if (status.toLowerCase() === "occupied") {
			return "text-success";
		}
	};
	const statusColor = setStatusColor();

	return (
		<div className="card table-card main-font shadow-sm mb-3">
			<ErrorAlert error={finishError} />
			<div className="card-body p-2">
				<div className="row pb-1">
					<div className="col-5 col-md-6">
						<h5 className="card-title fw-bold mb-1">{table_name}</h5>
						<p className="id text-muted m-0">{`ID: ${table_id}`}</p>
					</div>
					<div className="col-7 col-md-6 d-flex flex-column">
						<p className="card-text card-col2-margin" title="Capacity">
							<TableCapacityIcon />
							{capacity}
						</p>
						<p
							data-table-id-status={table_id}
							className={`card-text m-0 text-capitalize fw-bold ${statusColor}`}
							title="Status">
							<TableStatusIcon status={status} />
							{status}
						</p>
					</div>
				</div>
				<div className="card-footer footer-height bg-transparent p-0">
					{status.toLowerCase() === "occupied" ? (
						<div className="d-flex align-items-center pt-2">
							<p className="card-text m-0 p-0">{`Occupied by #${reservation_id}`}</p>
							<button
								data-table-id-finish={table_id}
								type="button"
								className="btn btn-dark ms-auto py-1 px-2 fw-bold"
								onClick={handleFinish}>
								<p className="fs-6 m-0">Finish</p>
							</button>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}

export default Table;
