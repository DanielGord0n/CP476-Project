# Campus Study Spot Reservation System (CP476)

## Project Overview
A full-stack web application that allows students to reserve study/work spots around campus (e.g., library desks, group rooms, quiet pods). The system prevents conflicting bookings and provides visibility into availability and peak usage times.

---

## Target Users
- Students (primary users)
- Admin/staff (manage study spots and policies)

---

## Primary Workflow (CRUD)
- View available study spots
- Create a reservation
- View reservation details
- Edit or cancel a reservation
- Prevent conflicting reservations (server-side validation)

---

## Features

### Must Have
- Spot listing with availability
- Make and cancel reservations
- Conflict prevention (no overlapping reservations)
- Input validation (date/time rules, required fields)

### Should Have
- My Reservations page
- Admin CRUD for study spots (add/edit/remove)
- Basic usage analytics (peak hours)

### Could Have
- Busy times visualization (based on historical reservation counts)
- Filters (building, quiet/group, capacity)

---

## Tech Stack
- Front-end: HTML, CSS, JavaScript
- Back-end: Node.js + Express
- Database: MySQL

---

## Repository Structure

/backend
  /routes
    spots.js
    reservations.js
    users.js
  db.js
  server.js

/docs
  wireframes
  milestone files

index.html
script.js
style.css
README.md

---

## Milestone 03 Progress

### Completed
- Fully connected backend to MySQL database
- Functional API routes with real data:
  - /api/spots
  - /api/reservations
  - /api/users
- Implemented CRUD operations for reservations:
  - GET (retrieve)
  - POST (create)
  - PUT (update)
  - DELETE (remove)
- Implemented input validation:
  - Required fields enforced
  - Start time must be before end time
- Implemented business logic:
  - Prevent overlapping reservations for the same study spot
- Backend tested through application workflow

---

## Database Setup

### 1. Create Database

```sql
CREATE DATABASE wlunest;
USE wlunest;
```

### 2. Create Tables

```sql
CREATE TABLE Building (
  building_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  campus VARCHAR(100)
);

CREATE TABLE StudySpot (
  spot_id INT AUTO_INCREMENT PRIMARY KEY,
  building_id INT,
  spot_code VARCHAR(50),
  name VARCHAR(100),
  floor INT,
  capacity INT,
  spot_type VARCHAR(50),
  is_active BOOLEAN,
  FOREIGN KEY (building_id) REFERENCES Building(building_id)
);

CREATE TABLE User (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100),
  email VARCHAR(100),
  role VARCHAR(50)
);

CREATE TABLE Reservation (
  reservation_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  spot_id INT,
  start_time DATETIME,
  end_time DATETIME,
  status VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES User(user_id),
  FOREIGN KEY (spot_id) REFERENCES StudySpot(spot_id)
);
```
### 3. Insert Sample Data

```sql
INSERT INTO Building (name, campus) VALUES
("Arts Building", "Waterloo"),
("Science Building", "Waterloo"),
("Library", "Waterloo");

INSERT INTO StudySpot (building_id, spot_code, name, floor, capacity, spot_type, is_active) VALUES
(1, "A101", "Quiet Study Room", 1, 4, "quiet", true),
(2, "B205", "Group Study Room", 2, 8, "group", true),
(3, "C12", "Silent Pod", 3, 2, "quiet", true);

INSERT INTO User (full_name, email, role) VALUES
("Test User", "test@email.com", "student");
```
### 4. How to Run Locally

**Front-End**

Option 1:  
Open `index.html` directly in your browser  

Option 2:  
Use VS Code Live Server

### 5. Back-End

1. **Navigate to backend:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure database connection in `db.js`:**
```javascript
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "YOUR_PASSWORD",
  database: "wlunest"
});
```

4. **Start server:**
```bash
npm start
```

5. **Open backend:**
```
http://localhost:3000  

Front-end runs separately (via browser or Live Server), while the backend API runs on http://localhost:3000.
```

### 6. API Endpoints

#### Study Spots
- `GET /api/spots`
- `GET /api/spots/:id`

#### Reservations
- `GET /api/reservations`
- `POST /api/reservations`
- `PUT /api/reservations/:id`
- `DELETE /api/reservations/:id`

#### Users
- `GET /api/users`
- `POST /api/users`

---

### 7. Validation and Business Logic

- Required fields: `user_id`, `spot_id`, `start_time`, `end_time`
- `start_time` must be before `end_time`
- Reservations cannot overlap for the same study spot
- Invalid inputs return error responses from backend

---

### 8. Milestone 03 Team Contributions

- All API endpoints were tested through the frontend application workflow (no external tools such as Postman were used)

#### Daniel
- Backend implementation (Express + MySQL integration)
- API route development (CRUD operations)
- Input validation and overlap prevention logic
- Testing through application workflow
- README updates and documentation

#### Gordon
- Front-end implementation
- UI/UX improvements
- Integration with backend APIs

#### May
- Database schema design
- Table relationships and normalization
- SQL implementation support

## Limitations

- Reservation “View” functionality is not fully implemented (currently logs to console)
- Some frontend data (e.g., heatmap usage) is hardcoded and not yet connected to real database data
- Reservation display uses spot IDs instead of names due to limited backend response data
- No user authentication system (default user_id is used)

## Future Improvements

- Implement full reservation detail view
- Add user authentication and login system
- Connect heatmap visualization to real usage data
- Improve frontend-backend data mapping (include spot names in reservation responses)