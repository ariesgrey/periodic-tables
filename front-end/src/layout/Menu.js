import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./Menu.css";

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

	return (
		<nav className="navbar bg-dark align-items-start ps-1">
			<div className="container-fluid">
				<Link className="navbar-brand text-light py-2" to="/">
					Periodic Tables
				</Link>
				<ul className="navbar-nav d-flex ps-2">
					<li className="nav-item py-1">
						<Link className="nav-link text-light" to="/dashboard">
							<i className="bi bi-grid-1x2"></i>
							{screenWidth < 768 ? null : "Dashboard"}
						</Link>
					</li>
					<li className="nav-item py-1">
						<Link className="nav-link text-light" to="/search">
							<i className="bi bi-search"></i>
							{screenWidth < 768 ? null : "Search"}
						</Link>
					</li>
					<li className="nav-item py-1">
						<Link className="nav-link text-light" to="/reservations/new">
							<i className="bi bi-calendar-plus"></i>
							{screenWidth < 768 ? null : "New Reservation"}
						</Link>
					</li>
					<li className="nav-item py-1">
						<Link className="nav-link text-light" to="/tables/new">
							<i className="bi bi-plus-square-dotted"></i>
							{screenWidth < 768 ? null : "New Table"}
						</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default Menu;
