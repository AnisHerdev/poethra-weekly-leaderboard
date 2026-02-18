# Poéthra Weekly Leaderboard

A comprehensive React application designed to track, display, and archive the performance of participants in the **Poéthra** poetry competition. This platform serves as a central hub for viewing weekly rankings, celebrating winners, and monitoring participation streaks.
🔗 Live Demo: https://poethra-leaderboard.web.app/

## Project Overview

This project is a modern, responsive web application built to gamify the poetry writing experience. It connects to **Firebase Firestore** to fetch real-time data about participants and weekly competition results.

Key capabilities include:
- **Live Leaderboard**: Automatically ranks participants by total points and consistency (streaks).
- **Hall of Fame**: Highlights top achievers across different metrics (Best Rank, Longest Streak, Consistency).
- **Winners' Gallery**: An interactive "Winners' Nook" that presents past weekly winners (1st, 2nd, 3rd place) in a stylized, book-themed interface.
- **Dark Mode**: Fully supported, immersive dark theme for night-time reading.

## Why I Built This

I developed this platform to solve the challenges of managing the **Poéthra** weekly writing competition manually. Previously, we relied on Excel sheets to track leaderboards, which was time-consuming and prone to human error. This application automates the scoring and streak calculations, replacing spreadsheets with a polished, reliable, and visually engaging experience for our community.

*Note: This repository facilitates the public-facing view for participants. The admin dashboard used for data entry is a separate project.*

## Key Features

*   **Dynamic Ranking System**:
    *   Primary sorting by Total Points.
    *   Secondary sorting by Current Streak (breaking ties).
    *   Visual "Fire" indicators for active streaks.
*   **Winners' Nook (Archive)**:
    *   Browsable history of past weeks (Year/Semester/Week).
    *   Interactive "Book" cards for winners.
    *   Modal view to read winning entry details (Title, Content).
*   **Search & Filtering**: Real-time search to instantly find specific participants on the leaderboard.
*   **Responsive UI**: Mobile-first design using Tailwind CSS, ensuring accessibility across devices.
*   **Performance**: Optimized data fetching and caching strategies using standard React hooks.

## Technology Stack

*   **Frontend Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
*   **Routing**: [React Router DOM](https://reactrouter.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Backend / Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
*   **State Management**: React `useState` / `Context` API
*   **Icons**: Custom SVG components

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (Latest LTS version recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)
*   A **Firebase Project** with Firestore enabled

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AnisHerdev/poethra-weekly-leaderboard.git
    cd poethra-weekly-leaderboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env.local` file in the root directory and add your Firebase credentials (you can find these in your Firebase Project Settings):

    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

## Running the Project Locally

To start the development server:

```bash
npm run dev
```

The application will typically be available at `http://localhost:5173`.

To build the project for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Usage

### For Participants/Users
*   **Leaderboard Page**: View your current standing. Use the search bar to find your name. Check the "Hall of Fame" cards at the bottom for special mentions.
*   **Winners Page**: Navigate to the "Winners' Nook" via the menu. Use the arrows to browse different weeks. Click on a winner's book to view their entry details.

### For Developers
*   **Data Toggle**: The application can switch between Production and Test data collections.
    *   *Note*: Currently, this is handled via the `IS_PRODUCTION` constant in `services/leaderboardService.ts`. Set it to `true` for production data or `false` for test data.
*   **Firestore Structure**:
    *   `participants_production` / `participants_test`: Stores user profiles, scores, and streaks.
    *   `weekly_results_production` / `weekly_results_test`: Stores archived weekly results and winner info.

## Project Structure

```
/src
  ├── components/       # Reusable UI components (Header, WinnerBook, etc.)
  ├── pages/            # Main route pages
  │   ├── LeaderboardPage.tsx  # Main ranking logic and display
  │   └── WinnersPage.tsx      # Archive/Gallery view
  ├── services/         # Firebase service functions (fetchLeaderboard, etc.)
  ├── contexts/         # React Contexts (e.g., ThemeProvider)
  ├── types.ts          # TypeScript interfaces for Participants, Results, etc.
  ├── firebase.ts       # Firebase initialization
  ├── App.tsx           # Main application layout and routing
  └── main.tsx          # Entry point
```
