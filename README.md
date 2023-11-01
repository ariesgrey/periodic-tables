# Periodic Tables: Restaurant Reservation System

**Live Application:** https://restaurant-reservation-system-frontend-uqbc.onrender.com

## Overview

> "You have been hired as a full stack developer at *Periodic Tables*, a startup that is creating a reservation system for fine dining restaurants.
> The software is used only by restaurant personnel when a customer calls to request a reservation.
> At this point, the customers will not access the system online."

The Periodic Tables web app allows restaurant personnel to track reservations, as well as the tables within the restaurant. This includes the following features/functionalities:
- View reservations by date
- Look up reservations by phone number
- Add new reservations
- Edit or cancel existing reservations
- Add new tables
- Seat a reservation at a free table
- Finish a reservation and free up their table
- Track the status of reservations and tables

The application is built for use on all device sizes, with specialized styling for both smaller and larger screens.

## Technologies & Tools

- React.js
	- React Router
	- React Hooks
- Node
- Express
- Knex
- PostgreSQL
- RESTful APIs
- JavaScript / JSX
- HTML
- Bootstrap 5
- CSS
	- Media Queries
	- Transition + Transform
- Icons from [The Noun Project](https://thenounproject.com/ariesgrey/kit/periodic-tables/)

## Installation

To run this application locally, follow these instructions:
1. Fork and clone this repository, or download .zip file.
2. Create a PostgreSQL database (or multiple if you wish to run multiple environments).
3. In the parent folder, run `cp ./back-end/.env.sample ./back-end/.env`.
4. Update the `./back-end/.env` file with the connection URL(s) to your database instance(s).
5. Run `cp ./front-end/.env.sample ./front-end/.env`.
6. You shouldn't need to make changes to the `./front-end/.env` file (unless you want to connect to a backend at a location other than `http://localhost:5001`).
7. Run `npm install` to install project dependencies.
8. Navigate to the `back-end` folder to run Knex commands (`cd ./back-end`).
9. Run `npx knex migrate:latest` to run migrations.
10. Run `npx knex seed:run` to seed the databases (or skip if you wish to omit seed data).
11. Navigate back to the parent folder (`cd ..`).
12. Run `npm run start:dev` to start.

If you wish to run any of the included tests, they are split up by backend and frontend, as well as by individual user stories (you can view these user stories [here](https://github.com/Thinkful-Ed/starter-restaurant-reservation#product-backlog)).

Run by user story:
- `npm run test:1` runs all the tests for user story 1 (both frontend and backend).
- `npm run test:1:backend` runs only the backend tests for user story 1.
- `npm run test:1:frontend` runs only the frontend tests for user story 1.

Run all:
- `npm test` runs all tests.
- `npm run test:backend` runs all backend tests.
- `npm run test:frontend` runs all frontend tests.
- `npm run test:e2e` runs only all end-to-end tests.

## Pages & Features

### Dashboard

The Dashboard displays reservations by date, defaulting to the current day, and the restaurant's tables. The `<<`, `Today`, and `>>` buttons allow users to navigate to other dates, and view the reservations for those days.

***Note:** Per Thinkful's instructions, "Finished" and "Cancelled" reservations will not be listed on the Dashboard for any dates. They can only be viewed through the Search function.*

![Dashboard](https://github.com/ariesgrey/periodic-tables/assets/133818769/ea5cc366-b7b9-47c2-b8f2-efeb246ddcfe)

#### Reservation

Each reservation card lists the following information:
- Customer Name
- Customer Phone Number
- Reservation ID
- Reservation Time
- Party Size
- Reservation Status - "Booked", "Seated", "Finished", or "Cancelled"

When the reservation's status is "Booked", the following buttons will be available:
- `Edit`: Takes the user to a form where they can edit any of the information listed on the card.
- `Seat`: Takes the user to a form to select a table to seat the Reservation at.
- `Cancel`: Displays a pop-up to confirm cancellation. If accepted, sets the reservation's status to "Cancelled" and removes it from the Dashboard.

![Booked-Reservation](https://github.com/ariesgrey/periodic-tables/assets/133818769/c029062e-1bbb-4c9f-902e-537a1ec9c773)

When the reservation's status is "Seated", the card will list the name of the table they are seated at.

![Seated-Reservation](https://github.com/ariesgrey/periodic-tables/assets/133818769/1d2992f5-3d48-4281-a540-755b7e07a8f4)


When the reservation's status is "Finished", the card will be removed from the Dashboard.

#### Table

Each table card lists the following information:
- Table Name
- Table ID
- Table Capacity
- Table Status - "Free" or "Occupied"

![Free-Table](https://github.com/ariesgrey/periodic-tables/assets/133818769/df960dfb-9acc-425b-85f8-876f300c373f)

When the table's status is "Occupied", the card will list the ID of the reservation seated there, as well as the following button:
- `Finish`: Displays a pop-up to confirm finishing. If accepted, sets the associated reservation's status to "Finished" and removes it from the Dashboard, and sets the table's status to "Free".

![Occupied-Table](https://github.com/ariesgrey/periodic-tables/assets/133818769/bc6dd4a5-3993-4aab-92e1-031383adc1f9)

### Edit Reservation

After clicking the `Edit` button on a reservation, the user is taken to this form (same form as the New Reservation page) with the reservation's current information filled in the associated inputs. The user can edit any of these inputs, as long as the new values still pass all required validation (listed in [New Reservation](#new-reservation) section).

If all entered information is valid, clicking the `Submit` button will save the updated information, and take the user to the Dashboard on the date the reservation is booked for. Any invalid or missing inputs will result in an error message, and remaining on the form page.

Clicking the `Cancel` button will discard any changes and take the user back to the previous page.

![Edit-Reservation](https://github.com/ariesgrey/periodic-tables/assets/133818769/c5cee78c-9ed7-410f-8f12-215f65e8bef9)

### Seat

After clicking the `Seat` button on a reservation, the user is taken to this form to select a table to seat them at. All currently "Free" tables are listed as options, along with their capacities.

Selecting a valid table and clicking `Submit` will take the user back to the Dashboard, with the selected reservation's status set to "Seated" and the selected table's status set to "Occupied". Selecting a table with insufficient capacity for the reservation's party size will result in an error message, and remaining on the form page.

Clicking the `Cancel` button will take the user back to the previous page.

![Seat](https://github.com/ariesgrey/periodic-tables/assets/133818769/363d6f50-bfb4-4c6f-8036-ce34309f4f95)

![Seat-Select](https://github.com/ariesgrey/periodic-tables/assets/133818769/5ecab2c2-c79a-4646-b2ac-92c683b90bee)

### Search

The Search page allows the user to search a customer's phone number, and view all matching reservations of any status. Full or partial phone numbers are accepted.

![Search](https://github.com/ariesgrey/periodic-tables/assets/133818769/e7a5c239-9e92-420a-a0b5-1bf2b98edea1)

### New Reservation

This page allows the user to enter the information to add a new reservation. The following listed inputs are all required, and must pass the given validations:
- **First Name**
- **Last Name**
- **Phone**
- **Party Size**: Must be a number greater than 0.
- **Date**: Must be a valid date, in the future (or current day if time is in the future), and not a Tuesday (restaurant is closed).
- **Time**: Must be a valid time, in the future, and within set business hours (10:30am - 9:30pm).

If all entered information is valid, clicking the `Submit` button will add the new reservation to the database, and take the user to the Dashboard on the date the reservation is booked for. Any invalid or missing inputs will result in an error message, and remaining on the form page.

Clicking the `Cancel` button will take the user back to the previous page.

![Add-Reservation](https://github.com/ariesgrey/periodic-tables/assets/133818769/ba22a634-cc83-42d7-b316-c9e4fdf4a969)

### New Table

This page allows the user to enter the information to add a new table. The following listed inputs are all required, and must pass the given validations:
- **Table Name**: Must be at least 2 characters.
- **Capacity**: Must be a number greater than 0.

If all entered information is valid, clicking the `Submit` button will add the new table to the database, and take the user to the Dashboard. Any invalid or missing inputs will result in an error message, and remaining on the form page.

Clicking the `Cancel` button will take the user back to the previous page.

![Add-Table](https://github.com/ariesgrey/periodic-tables/assets/133818769/b074e063-c677-4fb3-9e6b-9d1781a5ce2b)

## API

### POST '/reservations'

Creates a new entry in the reservations database.

Body *must* contain:
- `first_name` - string
- `last_name` - string
- `mobile_number` - string
- `reservation_date` - date
- `reservation_time` - time
- `people` - integer

Body *may* contain:
- `status` - string *(value must be "booked" if included)*

### GET '/reservations?date=<YYYY-MM-DD>'

Returns all active reservations (`status` is not "finished" or "cancelled") where the `reservation_date` matches the given date, sorted by `reservation_time`.

### GET '/reservations?mobile_number=<###-###-####>'

Returns all reservations where the `mobile_number` value matches the given full or partial phone number.

### GET '/reservations/:reservation_id'

Returns the reservation with the matching `reservation_id`.

### PUT '/reservations/:reservation_id'

Modifies the reservation with the matching `reservation_id`.

Body *must* contain:
- `first_name` - string
- `last_name` - string
- `mobile_number` - string
- `reservation_date` - date
- `reservation_time` - time
- `people` - integer

Body *may* contain:
- `status` - string
- `reservation_id` - integer (created by database)
- `created_at` - timestamp (created by database)
- `updated_at` - timestamp (created by database)

### PUT 'reservations/:reservation_id/status'

Modifies the `status` value for the reservation with the matching `reservation_id`.

Body *must* contain:
- `status` - string

### GET '/tables'

Returns all tables, ordered by `table_name`.

### POST '/tables'

Creates a new entry in the tables database.

Body *must* contain:
- `table_name` - string
- `capacity` - integer

Body *may* contain:
- `status` - string
- `reservation_id` - integer

### PUT '/tables/:table_id/seat'

Modifies the table with the matching `table_id`:
- Sets `status` to "occupied"
- Sets `reservation_id` to the ID given in the body

Modifies the reservation with the matching `reservation_id`:
- Sets `status` to "seated"

Body *must* contain:
- `reservation_id` - integer

### DELETE '/tables/:table_id/seat'

Modifies the table with the matching `table_id`:
- Sets `status` to "free"
- Sets `reservation_id` to null

Modifies the reservation with the matching `reservation_id`:
- Sets `status` to "finished"

### GET '/tables/seated/:reservation_id'

Returns the table with the matching `reservation_id` value.
