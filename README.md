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
- Prevent conflicting reservations (server-side validation planned)

---

## Features

### Must Have
- Spot listing with availability  
- Make and cancel reservations  
- Conflict prevention (no overlapping reservations)  
- Input validation (date/time rules)

### Should Have
- “My Reservations” page  
- Admin CRUD for study spots (add/edit/remove)  
- Basic usage analytics (peak hours)

### Could Have
- “Busy times” visualization (based on historical reservation counts)  
- Filters (building, quiet/group, capacity)

---

## Tech Stack (Course Technologies)

- **Front-end:** HTML, CSS, JavaScript  
- **Back-end:** Node.js + Express  
- **Database:** MySQL (relational schema designed in Milestone 02)

---

## Repository Structure

---

# Milestone 02 Progress

### Completed
- Functional front-end UI (using mock data)
- Full relational database schema (ER diagram + SQL CREATE TABLE statements)
- Runnable Express back-end server
- Initial route structure for:
  - `/api/spots`
  - `/api/reservations`
  - `/api/users`
- Updated project documentation

---

# How to Run Locally

## Front-End

Option 1:
- Open `index.html` directly in your browser  

Option 2:
- Use VS Code Live Server extension

---

## Back-End

1. Navigate to the backend folder:

```cd backend```

2. Install dependencies:

```npm install```

3. Start the server:

```npm start```

4. Open in your browser:
http://localhost:3000

You should see:
```WLUNest Backend is running```


You can test API routes:
- `http://localhost:3000/api/spots`
- `http://localhost:3000/api/reservations`
- `http://localhost:3000/api/users`

---

# Milestone 02 Team Contributions

**Daniel**
- Backend setup (Express server + route structure)
- README updates
- Project integration planning

**Gordon**
- Front-end implementation
- UI refinement
- ER diagram creation

**May**
- SQL database schema
- Constraints and normalization
- Database documentation