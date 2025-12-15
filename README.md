# Poéthra Leaderboard

A comprehensive React application designed to manage and showcase the weekly leaderboard for the Poéthra poetry competition. This application allows administrators to manage participants, input weekly results, and tracks performance metrics like streaks and total points.

## Features

- **Dynamic Leaderboard**: Real-time ranking of participants based on total accumulated points.
- **Weekly Results**: Track winners (1st, 2nd, 3rd) for each week and semester.
- **Participant Management**: Add and remove participants from the system.
- **Streaks & History**: Automatically calculates current streaks and maintains a history of participation.
- **Winners Gallery**: Dedicated page to showcase past weekly winners and their winning entries.
- **Admin Dashboard**: Secure administrative interface for updating results and managing data.
- **Responsive Design**: Built with a mobile-first approach using Tailwind CSS.
- **Dark Mode**: Fully supported dark mode interface.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Routing**: React Router Dom
- **Styling**: Tailwind CSS
- **Backend/Database**: Firebase Firestore
- **State Management**: React Context (Theme)

## Prerequisites

- Node.js (Latest LTS version recommended)
- A Firebase project with Firestore enabled

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd poéthra-leaderboard-password
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a `.env.local` file in the root directory.
   - Add your Firebase configuration keys (refer to `src/firebase.ts` for required keys):
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Run the application**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

- `/src` - Core application code and Firebase configuration
- `/pages` - Application route components (Leaderboard, Winners, Admin, etc.)
- `/services` - Firestore service functions
- `/components` - Reusable UI components
- `/contexts` - Context providers (Theme, etc.)

## License

This project is licensed under the MIT License.
