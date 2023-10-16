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
	const { reservation_id } = req.params;
	const data = await service.read(reservation_id);
	if (data) {
		// Save reservation data in locals if exists
		res.locals.reservation = data;
		return next();
	}

	next({
		status: 404,
		message: `Reservation ID '${reservation_id}' does not exist.`,
	});
}

// Checks if 'status' is a valid input
function statusIsValid(req, res, next) {
	const { status } = req.body.data;
	const validStatus = ["booked", "seated", "finished"];
	if (validStatus.includes(status)) {
		// Save status in locals if valid
		res.locals.status = status;
		return next();
	}

	next({
		status: 400,
		message: `Invalid status input: ${status}. Status options: ${validStatus.join(", ")}.`,
	});
}

// Checks if new reservation data has 'status' - if so, must be set to 'booked'
function statusIsBooked(req, res, next) {
	const { status } = req.body.data;
	// If status isn't included, or if it is and is set to 'Booked'
	if (!status || (status && status === "booked")) {
		return next();
	}

	next({
		status: 400,
		message: `Status cannot be set to ${status} for a new reservation.`,
	});
}

// Checks if 'status' being updated is set to 'finished' - cannot update
function statusIsNotFinished(req, res, next) {
	const { reservation } = res.locals;
	if (reservation.status !== "finished") {
		return next();
	}

	next({
		status: 400,
		message: `A finished reservation cannot be updated.`,
	});
}

// Checks for date or phone number in request query, finds matching reservations
async function dateOrPhoneQuery(req, res, next) {
	const { date, mobile_number } = req.query;
	let reservationsList;

	// If phone number query, use 'search' with phone number
	if (mobile_number) {
		reservationsList = await service.search(mobile_number);
		res.locals.reservationsList = reservationsList;
	} else {
		// If no date query, default to current date
		if (!date) {
			date = new Date(Date.now());
			// Accomodate for daylight savings
			date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
		}

		const reservations = await service.list(date);
		// Filter out 'finished' reservations
		reservationsList = reservations.filter((reservation) => reservation.status !== "finished");
		res.locals.reservationsList = reservationsList;
	}

	next();
}

/* --- ROUTES --- */

// GET /reservations - list reservations by date
function list(req, res) {
	res.json({ data: res.locals.reservationsList });
}

// POST /reservations/new - add new reservation
async function create(req, res) {
	const reservation = await service.create(req.body.data);
	res.status(201).json({ data: reservation });
}

// GET /reservations/:reservation_id - returns reservation by given id
function read(req, res) {
	res.json({ data: res.locals.reservation });
}

// PUT /reservations/:reservation_id/status - updates status of existing reservation
async function updateStatus(req, res) {
	const { reservation, status } = res.locals;
	const updatedReservationData = {
		...reservation,
		status: status,
	};
	const updatedReservation = await service.update(updatedReservationData);
	res.json({ data: updatedReservation });
}

module.exports = {
	list: [asyncErrorBoundary(dateOrPhoneQuery), list],
	create: [
		hasProperties(requiredProperties),
		dateIsValid,
		notTuesday,
		timeIsValid,
		notInPast,
		peopleIsValid,
		statusIsBooked,
		asyncErrorBoundary(create),
	],
	read: [asyncErrorBoundary(reservationExists), read],
	updateStatus: [
		hasProperties(["status"]),
		asyncErrorBoundary(reservationExists),
		statusIsValid,
		statusIsNotFinished,
		asyncErrorBoundary(updateStatus),
	],
};
