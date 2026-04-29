# Lead Management CRM API

A RESTful API for managing sales leads and tracking their progression through a defined pipeline. Built with Node.js, Express, and MongoDB using a clean, modular structure.

## Tech Stack

**Node.js** was chosen because it is lightweight, widely used for REST APIs, and works well for request/response backend services. Its asynchronous runtime is a good fit for API work that often waits on database operations.

**Express.js** was chosen because it is simple, mature, and easy to understand for a small REST API. It gives enough structure for routes and middleware without adding unnecessary complexity.

**MongoDB with Mongoose** was chosen because a lead fits naturally as a document with fields like name, email, source, and status. Mongoose provides schema validation, timestamps, and model helpers while keeping the database layer straightforward.

## Features

- Full CRUD operations for leads
- Filter leads by status
- Strict lifecycle transitions enforced in the API
- Input validation for required fields and email format
- Centralized error handling

## Lead Status Flow

```text
NEW -> CONTACTED -> QUALIFIED -> CONVERTED
         \
          -> LOST
```

Rules:

- Every lead starts as `NEW`
- Leads can only move forward one step at a time
- A lead can move to `LOST` from any non-terminal stage
- `CONVERTED` and `LOST` are terminal states

## Endpoints

- `POST /leads`
- `GET /leads`
- `GET /leads/:id`
- `PUT /leads/:id`
- `DELETE /leads/:id`
- `PATCH /leads/:id/status`

## API Documentation

Base URL:

```text
http://localhost:3000
```

### Create a lead

`POST /leads`

Request:

```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "phone": "9876543210",
  "source": "Website"
}
```

Response:

```json
{
  "_id": "662f8d1f2a7f5c0012a4b001",
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "phone": "9876543210",
  "source": "Website",
  "status": "NEW",
  "createdAt": "2026-04-29T06:30:00.000Z",
  "updatedAt": "2026-04-29T06:30:00.000Z"
}
```

### Get all leads

`GET /leads`

Optional filter:

```text
GET /leads?status=CONTACTED
```

Response:

```json
[
  {
    "_id": "662f8d1f2a7f5c0012a4b001",
    "name": "Aarav Sharma",
    "email": "aarav@example.com",
    "phone": "9876543210",
    "source": "Website",
    "status": "NEW",
    "createdAt": "2026-04-29T06:30:00.000Z",
    "updatedAt": "2026-04-29T06:30:00.000Z"
  }
]
```

### Get one lead

`GET /leads/:id`

Response:

```json
{
  "_id": "662f8d1f2a7f5c0012a4b001",
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "phone": "9876543210",
  "source": "Website",
  "status": "NEW",
  "createdAt": "2026-04-29T06:30:00.000Z",
  "updatedAt": "2026-04-29T06:30:00.000Z"
}
```

### Update lead details

`PUT /leads/:id`

Status updates are not allowed through this endpoint. Use `PATCH /leads/:id/status` instead.

Request:

```json
{
  "name": "Aarav Sharma",
  "email": "aarav.sharma@example.com",
  "phone": "9876543210",
  "source": "Referral"
}
```

Response:

```json
{
  "_id": "662f8d1f2a7f5c0012a4b001",
  "name": "Aarav Sharma",
  "email": "aarav.sharma@example.com",
  "phone": "9876543210",
  "source": "Referral",
  "status": "NEW",
  "createdAt": "2026-04-29T06:30:00.000Z",
  "updatedAt": "2026-04-29T06:40:00.000Z"
}
```

### Update lead status

`PATCH /leads/:id/status`

Request:

```json
{
  "status": "CONTACTED"
}
```

Response:

```json
{
  "_id": "662f8d1f2a7f5c0012a4b001",
  "name": "Aarav Sharma",
  "email": "aarav.sharma@example.com",
  "phone": "9876543210",
  "source": "Referral",
  "status": "CONTACTED",
  "createdAt": "2026-04-29T06:30:00.000Z",
  "updatedAt": "2026-04-29T06:45:00.000Z"
}
```

Invalid transition response:

```json
{
  "error": "Invalid status transition from NEW to CONVERTED"
}
```

### Delete a lead

`DELETE /leads/:id`

Response:

```json
{
  "message": "Lead deleted successfully"
}
```

## Setup

```bash
npm install
```

Create a `.env` file based on `.env.example`, then run:

```bash
npm run dev
```

The `.env` file should be in the project root, not inside `src`.

## Design Decisions

The project is split into routes, controllers, models, database configuration, and error-handling middleware. This keeps each file focused on one responsibility and makes the code easier to explain without adding unnecessary layers.

Status transitions are handled with an explicit transition map in the controller. This keeps the business rule easy to read: leads move forward step by step, can be marked as `LOST` from any non-terminal status, and cannot change after reaching `CONVERTED` or `LOST`.

Validation is handled in both the Mongoose model and controller. The model validates basic data shape, required fields, email format, unique email, and allowed statuses, while the controller validates workflow rules such as preventing direct status changes through the general update endpoint.

### Trade-offs and Scaling

This is intentionally a simple Level 1 API. It does not include authentication, pagination, rate limiting, Docker, automated tests, or a separate service layer because those would add more complexity than the current scope needs.

At scale, I would add pagination and indexes for lead listing, authentication and authorization, structured logging, automated tests, and environment-specific configuration. If the workflow became more complex, I would move the status-transition logic into a service and add an audit trail for status changes.

For concurrent status transitions, the current implementation reads the lead, checks if the transition is allowed, updates the status, and saves it. In a high-concurrency system, I would make the update atomic by including the expected current status in the database update condition, or by using optimistic concurrency/versioning, so two requests cannot both transition from the same old status at the same time.
