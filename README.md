# 🎬 Personal Movie Database (React + Supabase)

🔴 **Live Demo:** [Click here to view the App](https://bobicentr.github.io/movie-table/)

> **Status:** 🚧 Work in Progress (Active Development)

A dynamic dashboard for managing a personal movie watchlist. This application demonstrates the integration between a **Frontend** (React), a **Backend-as-a-Service** (Supabase), and **External APIs** (OMDb).

The goal of the project is to build a hybrid system where users can search for global movie data and save it to their private persistent database.

## 🛠 Tech Stack

*   **Frontend:** React.js (Vite), JavaScript (ES6+)
*   **Styling:** Bootstrap 5 (Responsive Layout)
*   **Database:** Supabase (PostgreSQL)
*   **External API:** OMDb API (Fetching movie metadata like posters, ratings, plots)
*   **Architecture:** Component-based, State-driven UI

## ⚡ Key Features (Implemented)

*   **Database Integration:**
    *   Real-time data fetching from **Supabase** via `@supabase/supabase-js`.
    *   Data mapping from database columns to UI components.
*   **Hybrid Data Flow:**
    *   Search for movies via **OMDb API** (External).
    *   Save selected movies to **Supabase** (Internal DB).
*   **UI/UX:**
    *   Transformation from Card Grid to **Table View** for better data density.
    *   Live Search with Autocomplete (Dropdown list with posters).
    *   Responsive design (Mobile-friendly).
*   **CRUD Operations:**
    *   **Create:** Add movies to the database with auto-filled metadata.
    *   **Read:** Display watchlist with sorting.
    *   **Delete:** Remove records from the database.

## 🚀 Roadmap (Upcoming Features)

This project is currently being refactored and expanded. Planned updates:

- [ ] **Client-side Filtering:** Search by title, type, and year without extra API calls.
- [ ] **Admin Panel:** Implementation of Supabase Auth (RLS) to secure delete/add actions.
- [ ] **Advanced Sorting:** Sort by Rating or Year.
- [ ] **Edit Mode:** Ability to add custom user reviews or change "Watched" status.

## 📦 How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/bobicentr/movie-table.git
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```

---
*Created by [Your Name/Nickname]*
