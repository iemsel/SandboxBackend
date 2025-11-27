# Team 1 Sandbox UVC
## Description
The project originated from an assignment by IVN to develop an ICT solution that actively involves teachers and parents in creating and maintaining green, sustainable schoolyards. The scope of the assignment includes:
Educational: fostering knowledge about sustainability
Creative: designing and sharing ideas for outdoor activities
Participatory: supporting maintenance and care of green spaces
Playful: using gamification and interactive digital tools
## Team members
- Sanne Jimkes
- Naimi de Jong
- Alexander Atanasov
- Iulia Băcanu
- Dimitar Parvanov
- Jakub Holík

# GreenClues – Microservices Backend

GreenClues is a microservice-based backend that supports a digital tool for teachers to plan and run outdoor, nature-based learning activities – even at schools without a fully green-blue schoolyard.

The system focuses on:
- **Teachers** – planning, saving, and reusing outdoor lesson ideas
- **Nature-based learning** – structured activities linked to season, yard context and difficulty
- **Modular architecture** – independent services for auth, ideas, and planning

---

## Architecture Overview

This backend is built as a set of Dockerized Node.js microservices:

- **API Gateway**
  - Single entrypoint for the frontend (`http://localhost:3010`)
  - Proxies requests to individual services
  - Exposes `/health` for quick status checks

- **Auth Service**
  - User registration and login
  - Password hashing with bcrypt
  - JWT generation and verification
  - Own MariaDB schema (`auth_db`)

- **Ideas Service**
  - Stores teacher-created outdoor learning ideas
  - Filterable by season, subject, difficulty, and yard context
  - Favorite system for teachers to bookmark activities
  - Own MariaDB schema (`ideas_db`)

- **Planner Service**
  - Day/lesson plans for specific classes and dates
  - Attaches ideas as scheduled items with time and location
  - Own MariaDB schema (`planner_db`)

- **MariaDB**
  - Central database instance with separate schemas per service
  - Initialized via `db/init.sql`

All services communicate over an internal Docker network. The frontend only talks to the **gateway**.

---

## Tech Stack

- **Runtime:** Node.js (Express)
- **Database:** MariaDB (via Docker)
- **Auth:** JWT (JSON Web Tokens), bcrypt
- **Containerization:** Docker & Docker Compose
- **Testing:** Jest (integration tests via HTTP against the running stack)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd SandboxBackend

