import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";

/**
 * Defines the main layout of the application.
 *
 * @returns {JSX.Element}
 */
function Layout() {
	return (
		<div className="container-fluid px-0">
			<div className="row me-0">
				<div className="col-md-2">
					<Menu />
				</div>
				<div className="col-md-10">
					<Routes />
				</div>
			</div>
		</div>
	);
}

export default Layout;
