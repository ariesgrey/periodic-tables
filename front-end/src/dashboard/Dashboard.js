import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
	// Check for date query, replace default if exists
	const dateQuery = useQuery().get("date");
	if (dateQuery) {
		date = dateQuery;
	}

	const [reservations, setReservations] = useState([]);
	const [dashboardError, setDashboardError] = useState(null);

	// Load reservations for given date
	useEffect(() => {
		const abortController = new AbortController();

		async function loadDashboard() {
			try {
				setDashboardError(null);
				const reservationList = await listReservations(
					{ date },
					abortController.signal
				);
				setReservations(reservationList);
			} catch (error) {
				setReservations([]);
				setDashboardError([error.message]);
			}
		}
		loadDashboard();
		return () => abortController.abort();
	}, [date]);

	return (
		<main>
			<h1>Dashboard</h1>
			<div className="d-md-flex mb-3">
				<h4 className="mb-0">Reservations for {date}</h4>
			</div>
			<ErrorAlert error={dashboardError} />
			{JSON.stringify(reservations)}
		</main>
	);
}

export default Dashboard;
