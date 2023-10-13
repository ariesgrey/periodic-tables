/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/* --- VALIDATION MIDDLEWARE --- */

const requiredProperties = [
	"first_name",
	"last_name",
	"mobile_number",
	"reservation_date",
	"reservation_time",
	"people",
];

// Checks if given reservation data has all required properties
function hasProperties(properties) {
	return function (req, res, next) {
		const { data = {} } = req.body;
		try {
			properties.forEach((property) => {
				// If a required property is missing or empty, throw error
				if (!data[property] || data[property] === "") {
					return next({
						status: 400,
						message: `A '${property}' property is required.`,
					});
				}
			});

			next();
		} catch (error) {
			next(error);
		}
	};
}

// Checks if 'reservation_date' property is a valid date input
function dateIsValid(req, res, next) {
	const { reservation_date } = req.body.data;
	// Convert YYYY-MM-DD format to ISO date format - so 'Date.parse()' works across all browsers
	try {
		const dateISO = new Date(reservation_date).toISOString();
		if (dateISO && Date.parse(dateISO) > 0) {
			return next();
		} else {
			// Invalid 'next()' within 'catch' block
			throw new Error();
		}
	} catch {
		next({
			status: 400,
			message: `Invalid field: 'reservation_date' must be a valid date.`,
		});
	}
}

// Checks if 'reservation_time' is a valid time input
function timeIsValid(req, res, next) {
	const { reservation_time } = req.body.data;
	// Validate HH:MM time format
	let regex = new RegExp("([01]?[0-9]|2[0-3]):([0-5][0-9])");
	if (regex.test(reservation_time)) {
		return next();
	}

	next({
		status: 400,
		message: `Invalid field: 'reservation_time' must be a valid time.`,
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
		timeIsValid,
		peopleIsValid,
		asyncErrorBoundary(create),
	],
	read: [asyncErrorBoundary(reservationExists), read],
};
