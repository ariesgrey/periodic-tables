import React from "react";
import Table from "./Table";

function TableList({ tables }) {
	const list = tables.map((table) => {
		return (
			<div className="" key={table.table_id}>
				<Table
					key={table.table_id}
					table={table}
					table_name={table.table_name}
					capacity={table.capacity}
					status={table.status}
				/>
			</div>
		);
	});

	return <div className="">{list}</div>;
}

export default TableList;
