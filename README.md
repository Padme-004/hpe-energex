# HPE CPP 2025 Project - Developing AI Powered Solutions For Sustainable Resource Management (Hosted Version)

## Overview
A Next.js-based web application for managing homes and devices with role-based authentication, real-time device monitoring, and API key management. This is the hosted version of HPE-CPP-Ui, which could not be hosted as it was part of an organization.

## Features
- Role-based Authentication (Admin/User)
- Responsive Design
- Device Dashboard
- Home Management
- API Key Management
- Real-time Chat
- Real-time Device Status Updates

## Tech Stack
- **Frontend**: Next.js 13+ with App Router
- **UI**: Tailwind CSS
- **Authentication**: JWT-based auth
- **State Management**: React Context
- **Real-time Updates**: Server-Sent Events (SSE)

## Project Structure
```
frontend/my-app/
├── app/
│   ├── (protected)/           # Protected routes
│   │   ├── device-dashboard/
│   │   ├── user-dashboard/
│   │   ├── manage-keys/
│   │   └── chat/
│   ├── components/            # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ClientLayout.tsx
│   └── context/              # Application context
│       └── AuthContext.tsx
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
cd frontend/my-app
npm install
```

3. Run the development server
```bash
npm run dev
```

The application will be available at `https://energex-six.vercel.app/`

## Authentication

The application uses JWT-based authentication with role-based access control:
- **Admin**: Full access to all features including API key management
- **User**: Access to device management and chat features

## Protected Routes
- `/device-dashboard`: Device management
- `/user-dashboard`: User management (Admin only)
- `/manage-keys`: API key management (Admin only)
- `/chat`: Real-time chat
- `/home-detail`: Home details
- `/device-detail`: Device details
- `/change-password`: Password management

## Contributing
1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Open a Pull Request

## Project Maintainers
Y.Nidhi Shenoy

