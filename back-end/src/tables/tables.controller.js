/**
 * List handler for table resources
 */
const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

/* --- VALIDATION MIDDLEWARE --- */

const requiredPropertiesCreate = ["table_name", "capacity"];

const requiredPropertiesUpdate = ["reservation_id"];

// Checks if 'table_name' property is a valid input
function nameIsValid(req, res, next) {
	const { table_name } = req.body.data;
	// Must be at least 2 characters
	if (table_name.length >= 2) {
		return next();
	}

	next({
		status: 400,
		message: `Invalid field: 'table_name' must be at least 2 characters.`,
	});
}

// Checks if 'capacity' property is a valid number input
function capacityIsValid(req, res, next) {
	const { capacity } = req.body.data;
	const isNumber = Number.isInteger(capacity);
	// Must be a number and greater than 0
	if (isNumber && capacity > 0) {
		return next();
	}

	next({
		status: 400,
		message: `Invalid field: 'capacity' must be a number greater than 0.`,
	});
}

// Checks if a table exists with the given id
async function tableExists(req, res, next) {
	const { table_id } = req.params;
	const data = await service.read(table_id);
	if (data) {
		// Save table data in locals if exists
		res.locals.table = data;
		return next();
	}

	next({
		status: 404,
		message: `Table ID '${table_id}' does not exist.`,
	});
}

// Checks if a reservation exists with the given id
async function reservationExists(req, res, next) {
	const { reservation_id } = req.body.data;
	const reservation = await reservationService.read(reservation_id);
	if (reservation) {
		// Save reservation data in locals if exists
		res.locals.reservation = reservation;
		return next();
	}

	next({
		status: 404,
		message: `Reservation ID '${reservation_id}' does not exist.`,
	});
}

// Checks if a table has enough capacity for a reservation
function tableHasCapacity(req, res, next) {
	const { capacity } = res.locals.table;
	const { people } = res.locals.reservation;
	if (capacity >= people) {
		return next();
	}

	next({
		status: 400,
		message: `Table does not have sufficient capacity for reservation.`,
	});
}

// Checks if a table is currently free
function tableIsFree(req, res, next) {
	const { status } = res.locals.table;
	if (status === "Free") {
		return next();
	}

	next({
		status: 400,
		message: `Table is already occupied.`,
	});
}

/* --- ROUTES --- */

// GET /tables - list tables by name
async function list(req, res) {
	res.json({ data: await service.list() });
}

// POST /tables/new - add new table
async function create(req, res) {
	const table = await service.create(req.body.data);
	res.status(201).json({ data: table });
}

// PUT /tables/:table_id/seat - seat a reservation at a table
async function seat(req, res) {
	const { table } = res.locals;
	const { reservation_id } = res.locals.reservation;
	const updatedTable = {
		...table,
		reservation_id: reservation_id,
		status: "Occupied",
	};

	res.json({ data: await service.seat(updatedTable) });
}

module.exports = {
	list: asyncErrorBoundary(list),
	create: [
		hasProperties(requiredPropertiesCreate),
		nameIsValid,
		capacityIsValid,
		asyncErrorBoundary(create),
	],
	seat: [
		hasProperties(requiredPropertiesUpdate),
		asyncErrorBoundary(tableExists),
		asyncErrorBoundary(reservationExists),
		tableHasCapacity,
		tableIsFree,
		asyncErrorBoundary(seat),
	],
};
