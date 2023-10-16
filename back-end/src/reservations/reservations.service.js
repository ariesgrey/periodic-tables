const knex = require("../db/connection");

// Returns reservations for a given date, ordered by time
function list(date) {
	return knex("reservations")
		.select("*")
		.where({ reservation_date: date })
		.orderBy("reservation_time");
}

// Creates new reservation
function create(reservation) {
	return knex("reservations")
		.insert(reservation)
		.returning("*")
		.then((createdRecords) => createdRecords[0]);
}

// Returns the reservation matching a given id
function read(reservationId) {
	return knex("reservations")
		.select("*")
		.where({ reservation_id: reservationId })
		.then((returnedRecords) => returnedRecords[0]);
}

// Updates an existing reservation
function update(updatedReservation) {
	return knex("reservations")
		.select("*")
		.where({ reservation_id: updatedReservation.reservation_id })
		.update(updatedReservation, "*")
		.then((returnedRecords) => returnedRecords[0]);
}

module.exports = {
	list,
	create,
	read,
	update,
};
