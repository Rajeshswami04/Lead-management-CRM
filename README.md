# Lead Management CRM API

A RESTful API for managing sales leads and tracking their progression through a defined pipeline. Built with Node.js, Express, and MongoDB using a clean, modular structure.

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

## Setup

```bash
npm install
```

Create a `.env` file based on `.env.example`, then run:

```bash
npm run dev
```

The `.env` file should be in the project root, not inside `src`.
