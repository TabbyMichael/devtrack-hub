# DevTrack Frontend

Welcome to the DevTrack Frontend repository! This application provides a user-friendly interface for tracking projects, sessions, and analytics, helping users manage their development time effectively.

## Features

*   **Project Management**: Create, view, update, and delete projects.
*   **Session Tracking**: Start, stop, pause, and resume development sessions.
*   **Analytics Dashboard**: Visualize daily totals, streaks, and project aggregates.
*   **Real-time Updates**: WebSocket integration for live session status updates.
*   **User Authentication**: Secure login and registration with JWT.
*   **Role-Based Access Control (RBAC)**: Manage user permissions based on roles.
*   **Responsive UI**: Built with modern UI components for a seamless experience across devices.

## Technologies Used

This project is built with a modern frontend stack to ensure a robust, scalable, and maintainable application:

*   **Framework**: [React](https://react.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **State Management**: [Zustand](https://zustand-bear.github.io/blog/)
*   **UI Components**: [shadcn-ui](https://ui.shadcn.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Routing**: [React Router](https://reactrouter.com/en/main)
*   **API Client**: [Axios](https://axios-http.com/)

## Getting Started

Follow these instructions to set up and run the DevTrack frontend locally.

### Prerequisites

Make sure you have the following installed on your machine:

*   [Node.js](https://nodejs.org/en/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <YOUR_GIT_URL>
    cd devtrack-hub/FrontEnd
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Environment Variables**:
    Create a `.env` file in the `FrontEnd` directory based on `.env.example`.
    ```
    VITE_API_BASE_URL=http://localhost:3000/api
    ```
    (Adjust the API base URL if your backend is running on a different address/port.)

### Running the Development Server

To start the development server with hot-reloading:

```bash
npm run dev
# or
yarn dev
```

The application will typically be available at `http://localhost:5173`.

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the application for production to the `dist` folder.
*   `npm run lint`: Runs ESLint to check for code quality issues.
*   `npm run preview`: Serves the production build locally for testing.

## Project Structure

The project follows a standard React application structure:

```
FrontEnd/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, icons, etc.
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # shadcn-ui components
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and configurations
│   ├── pages/              # Top-level page components (e.g., Dashboard, Auth)
│   ├── services/           # API integration and other external services
│   ├── store/              # Zustand store for global state management
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Entry point of the application
│   ├── vite-env.d.ts       # Vite environment type definitions
│   └── ...
├── .env.example            # Example environment variables
├── index.html              # Main HTML file
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── ...
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for utility-first styling and [shadcn-ui](https://ui.shadcn.com/) for accessible and customizable UI components.

## Contribution

We welcome contributions to the DevTrack project! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## License

[Specify your license here, e.g., MIT License]
