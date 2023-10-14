import React from "react";
import Table from "./Table";

function TableList({ tables }) {
	const list = tables.map((table) => {
		return (
			<div className="col" key={table.table_id}>
				<Table
					key={table.table_id}
					table_name={table.table_name}
					capacity={table.capacity}
					status={table.status}
				/>
			</div>
		);
	});

	return <div className="row">{list}</div>;
}

export default TableList;
