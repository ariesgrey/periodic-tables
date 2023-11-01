import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "../App.css";

/**
 * Defines the main layout of the application.
 *
 * @returns {JSX.Element}
 */
function Layout() {
	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-12 col-lg-2 px-0">
					<Menu />
				</div>
				<div className="col-12 col-lg-10 main-container-padding">
					<Routes />
				</div>
			</div>
		</div>
	);
}

export default Layout;
