Prompt

You are coding inside an existing Node.js + Express backend project with PostgreSQL using the pg Pool library.

Task: Implement a secure user registration feature with the following requirements:

Validation

Use Zod to validate incoming request body (username, password).

Return an appropriate error response if validation fails.

Password Security

Hash passwords using bcrypt with a secure salt.

Database

Use the pg Pool to insert the user into the users table.

Release DB clients properly after queries.

Prevent duplicate usernames — if attempted, return a meaningful error without crashing.

Architecture

Create src/modules/auth/auth.service.js with:

async function registerUser(username, password) — handles validation, hashing, DB insert, and returns created user data.

Create src/modules/auth/auth.controller.js with:

async function register(req, res, next) — reads from req.body, calls registerUser, sends { message, data } with HTTP 201 on success.

Uses try/catch and next(err) for error handling.

Testing

Create src/tests/auth.test.js with a Supertest-based example that:

Sends a POST request to /auth/register.

Checks for 201 status and correct response structure.

Implementation Details

Use async/await everywhere.

Follow clean code practices and proper error handling.

Do not modify unrelated files.

Ensure all new files are properly imported/exported where needed.

Context

We need a secure register endpoint that:

Validates input using Zod

Hashes passwords using bcrypt

Inserts the user into PostgreSQL via pg Pool

Returns { message, data } with HTTP 201 on success

Gracefully handles duplicate usernames

Organizes logic into auth.service.js and auth.controller.js

Uses async/await, try/catch, and proper DB client release

Includes a Supertest example for automated testing

Changes Applied

auth.service.js → Added registerUser(username, password) to handle validation, hashing, and DB insert

auth.controller.js → Added register(req, res, next) to call service, send { message, data }, and use next(err) for errors

Error Handling → Added duplicate username handling without crashing the server

Testing → Added src/tests/auth.test.js with Supertest to test /auth/register endpoint

Best Practices → Used async/await, proper error handling, and clean code structure throughout