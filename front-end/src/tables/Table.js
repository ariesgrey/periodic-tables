import React from "react";

function Table({ table_name, capacity, status }) {
	return (
		<div className="card">
			<div className="card-body">
				<h5 className="card-title">{table_name}</h5>
				<p className="card-text">{`Capacity: ${capacity}`}</p>
				<p className="card-text">{`Status: ${status}`}</p>
			</div>
		</div>
	);
}

export default Table;
