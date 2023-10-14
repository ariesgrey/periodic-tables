/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

/* --- VALIDATION MIDDLEWARE --- */

const requiredProperties = [
	"first_name",
	"last_name",
	"mobile_number",
	"reservation_date",
	"reservation_time",
	"people",
];

// Checks if 'reservation_date' property is a valid date input
function dateIsValid(req, res, next) {
	const { reservation_date } = req.body.data;
	// Convert YYYY-MM-DD format to ISO date format - so 'Date.parse()' works across all browsers
	try {
		const date = new Date(reservation_date);
		const dateISO = date.toISOString();
		if (dateISO && Date.parse(dateISO) > 0) {
			return next();
		} else {
			throw new Error();
		}
	} catch (error) {
		next({
			status: 400,
			message: `Invalid field: 'reservation_date' must be a valid date.`,
		});
	}
}

// Checks if 'reservation_date' is a tuesday
function notTuesday(req, res, next) {
	const { reservation_date, reservation_time } = req.body.data;
	// 'Date-time form' interpreted as local time
	const reservationDate = new Date(
		`${reservation_date}T${reservation_time.slice(0, 2)}:${reservation_time.slice(3)}`
	);

	if (reservationDate.getDay() !== 2) {
		return next();
	}

	next({
		status: 400,
		message: `Invalid field: 'reservation_date' must not be a Tuesday - restaurant closed.`,
	});
}

// Checks if 'reservation_time' is a valid time input
function timeIsValid(req, res, next) {
	const { reservation_time } = req.body.data;
	// Validate HH:MM time format
	let regex = new RegExp("([01]?[0-9]|2[0-3]):([0-5][0-9])");
	if (regex.test(reservation_time)) {
		// Check if within business hours
		const earliestTime = 1030;
		const latestTime = 2120;
		const reservationTime = reservation_time.substring(0, 2) + reservation_time.substring(3);
		if (reservationTime >= earliestTime && reservationTime <= latestTime) {
			return next();
		}
	}

	next({
		status: 400,
		message: `Invalid field: 'reservation_time' must be a valid time during business hours.`,
	});
}

// Checks if 'reservation_date' and 'reservation_time' are not in the past
function notInPast(req, res, next) {
	const { reservation_date, reservation_time } = req.body.data;
	// 'Date-time form' interpreted as local time
	const reservationDate = new Date(
		`${reservation_date}T${reservation_time.slice(0, 2)}:${reservation_time.slice(3)}`
	);
	const now = new Date(Date.now());
	// Accomodate for daylight savings time
	reservationDate.setTime(
		reservationDate.getTime() - reservationDate.getTimezoneOffset() * 60 * 1000
	);
	now.setTime(now.getTime() - now.getTimezoneOffset() * 60 * 1000);

	if (reservationDate > now) {
		return next();
	}

	next({
		status: 400,
		message: `Reservation must be in the future.`,
	});
}

// Checks if 'people' property is a valid number input
function peopleIsValid(req, res, next) {
	const { people } = req.body.data;
	const isNumber = Number.isInteger(people);
	// Must be a number and greater than 0
	if (isNumber && people > 0) {
		return next();
	}

	next({
		status: 400,
		message: `Invalid field: 'people' must be a number greater than 0.`,
	});
}

// Checks if a reservation exists with the given id
async function reservationExists(req, res, next) {
	const { reservationId } = req.params;
	const data = await service.read(reservationId);
	if (data) {
		// Save reservation data in locals if exists
		res.locals.reservation = data;
		return next();
	}

	next({
		status: 404,
		message: `Reservation ID '${reservationId}' does not exist.`,
	});
}

/* --- ROUTES --- */

// GET /reservations - list reservations by date
async function list(req, res) {
	// Get date from request query
	const { date } = req.query;
	// Default date to current day if none provided in query
	if (!date) {
		date = new Date();
	}

	res.json({ data: await service.list(date) });
}

// POST /reservations/new - add new reservation
async function create(req, res) {
	const reservation = await service.create(req.body.data);
	res.status(201).json({ data: reservation });
}

// GET /reservations/:reservationId - returns reservation by given id
function read(req, res) {
	res.json({ data: res.locals.reservation });
}

module.exports = {
	list: asyncErrorBoundary(list),
	create: [
		hasProperties(requiredProperties),
		dateIsValid,
		notTuesday,
		timeIsValid,
		notInPast,
		peopleIsValid,
		asyncErrorBoundary(create),
	],
	read: [asyncErrorBoundary(reservationExists), read],
};
