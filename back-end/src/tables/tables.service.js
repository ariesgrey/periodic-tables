const knex = require("../db/connection");

// Returns all tables ordered by table name
function list() {
	return knex("tables").select("*").orderBy("table_name");
}

// Creates new table
function create(table) {
	return knex("tables")
		.insert(table)
		.returning("*")
		.then((createdRecords) => createdRecords[0]);
}

// Returns the table matching a given id - helper only
function read(tableId) {
	return knex("tables")
		.select("*")
		.where({ table_id: tableId })
		.then((returnedRecords) => returnedRecords[0]);
}

// Seats a reservation at a table
function seat(updatedTable) {
	return knex("tables")
		.select("*")
		.where({ table_id: updatedTable.table_id })
		.update(updatedTable, "*")
		.then((returnedRecords) => returnedRecords[0]);
}

module.exports = {
	list,
	create,
	read,
	seat,
};
