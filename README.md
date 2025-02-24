# Task Buddy - Task Management Application

Task Buddy is a modern task management application built with Next.js, featuring a clean and intuitive interface for managing your daily tasks efficiently.

## Quick Links

🔗 **GitHub Repository**: [https://github.com/jugunu-21/Task_Buddy](https://github.com/jugunu-21/Task_Buddy)

🚀 **Live Demo**: [https://task-buddy-henna.vercel.app/signin](https://task-buddy-henna.vercel.app/signin)

## Features

- **Task Management**
  - Create, update, and delete tasks
  - Organize tasks by categories
  - Set due dates for tasks
  - Track task status (todo, in-progress, completed)

- **User Interface**
  - Clean and modern design
  - Responsive layout for all devices
  - Intuitive task organization
  - Real-time updates

- **Data Management**
  - PostgreSQL database integration
  - Prisma ORM for efficient data handling
  - Redux state management
  - Server-side data fetching

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jugunu-21/Task_Buddy
cd Task_Buddy
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL="postgresql://your-database-url"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Technical Challenges and Solutions

### 1. State Management
- **Challenge**: Managing complex task states across components
- **Solution**: Implemented Redux with async thunks for efficient state management and data synchronization

### 2. Data Persistence
- **Challenge**: Reliable data storage and retrieval
- **Solution**: Integrated Prisma ORM with PostgreSQL for robust data management

### 3. Real-time Updates
- **Challenge**: Keeping UI in sync with data changes
- **Solution**: Utilized Redux state management and efficient re-rendering strategies

### 4. Type Safety
- **Challenge**: Maintaining type safety across the application
- **Solution**: Implemented TypeScript with proper interfaces and type definitions

## Deployment

The application is deployed on Vercel. You can access the live version here:
[Task Buddy App] https://task-buddy-henna.vercel.app/signin


To deploy your own instance:

1. Create a Vercel account
2. Link your repository
3. Configure environment variables
4. Deploy with a single click

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Programming language
- [Prisma](https://www.prisma.io/) - Database ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## License

This project is licensed under the MIT License.
