import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import "../App.css";
import {
	DashboardFillIcon,
	DashboardIcon,
	ReservationFillIcon,
	ReservationIcon,
	SearchFillIcon,
	SearchIcon,
	TableFillIcon,
	TableIcon,
} from "../icons/Icons";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);

	// Reload on window resize
	useEffect(() => {
		function handleResize() {
			setScreenWidth(window.innerWidth);
		}

		window.addEventListener("resize", handleResize);
	});

	// Use location to set active nav link
	const location = useLocation();
	// Returns 'true' if page name matches current location pathname, 'false' otherwise
	function isActive(path) {
		if (location.pathname === path) {
			return "page";
		} else {
			return null;
		}
	}

	return (
		<nav className="navbar bg-dark align-items-start ps-1">
			<div className="container-fluid">
				<Link className="navbar-brand text-light pb-2" to="/">
					Periodic Tables
				</Link>
				{screenWidth < 992 ? null : <hr className="border border-light" style={{ width: "96%" }} />}
				<ul className="navbar-nav d-flex ps-1">
					<li className="nav-item my-2" aria-current={isActive("/dashboard")}>
						<Link className="nav-link text-light" to="/dashboard">
							{isActive("/dashboard") ? <DashboardFillIcon /> : <DashboardIcon />}
							{screenWidth < 992 ? null : "Dashboard"}
						</Link>
					</li>
					<li className="nav-item my-2" aria-current={isActive("/search")}>
						<Link className="nav-link text-light" to="/search">
							{isActive("/search") ? <SearchFillIcon /> : <SearchIcon />}
							{screenWidth < 992 ? null : "Search"}
						</Link>
					</li>
					<li className="nav-item my-2" aria-current={isActive("/reservations/new")}>
						<Link className="nav-link text-light" to="/reservations/new">
							{isActive("/reservations/new") ? <ReservationFillIcon /> : <ReservationIcon />}
							{screenWidth < 992 ? null : "New Reservation"}
						</Link>
					</li>
					<li className="nav-item my-2" aria-current={isActive("/tables/new")}>
						<Link className="nav-link text-light" to="/tables/new">
							{isActive("/tables/new") ? <TableFillIcon /> : <TableIcon />}
							{screenWidth < 992 ? null : "New Table"}
						</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default Menu;
