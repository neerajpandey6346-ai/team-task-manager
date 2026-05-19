# 🚀 Taskify

Taskify is a full-stack project management application designed for modern teams. It features a stunning **Glassmorphic UI**, robust role-based access control, and real-time dashboard analytics to help teams stay organized and productive.

## ✨ Key Features

### 🔐 Authentication & Security
- **JWT-Based Auth**: Secure login and signup with JSON Web Tokens.
- **Unified API Architecture**: Custom Bearer token implementation for stable cross-origin requests.
- **Role-Based Access (RBAC)**: Distinct permissions for **Admins** (project creation, member management, deletion) and **Members**.

### 📊 Advanced Dashboard
- **Real-time Analytics**: Visualized task distribution using **Recharts**.
- **Progress Tracking**: Overall completion gauge and priority breakdown.
- **Activity Feed**: Live feed of recent updates across all projects.
- **Personalized Focus**: High-impact summaries of tasks assigned specifically to you.

### 📂 Project & Team Management
- **Project CRUD**: Create, view, update, and delete projects with unique color coding.
- **Member Administration**: Add or remove authorized members from specific projects.
- **Team Directory**: Centralized directory to view all colleagues and their roles.

### 📝 Task Tracking
- **Smart Tasks**: Detailed task management with status transitions (Todo, In Progress, Review, Completed).
- **Priority System**: Categorize work by High, Medium, or Low priority with visual badges.

### 👤 Profile Customization
- **Interactive Avatars**: Select from 6 premium gradient colors for your profile.
- **Identity Management**: Easily update your display name and email.
- **Security**: Dedicated interface for secure password changes.

---

## 🛠️ Tech Stack

**Frontend:**
- **React 18** (Vite)
- **Tailwind CSS** (Premium styling)
- **Lucide React** (Beautiful iconography)
- **Recharts** (Data visualization)
- **Framer Motion** (Smooth animations)

**Backend:**
- **Node.js & Express**
- **Sequelize ORM** (Database management)
- **MySQL / SQLite** (Flexible data storage)
- **JWT & Cookie-Parser** (Security)

---

## 🚀 Getting Started

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd team-task-manager

# Install root dependencies
npm install

# Install client and server dependencies
cd client && npm install
cd ../server && npm install
```

### 2. Environment Setup
Create a `.env` file in the `server` directory:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key_here
DB_NAME=team_task_manager
DB_USER=root
DB_PASS=your_password
DB_HOST=localhost
ALLOWED_ORIGINS=http://localhost:5173
```

### 3. Run Locally
From the root directory, you can run both frontend and backend concurrently:
```bash
npm run dev
```

---

## 🏗️ Project Structure

```text
├── client/                # React application (Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI (Navbar, Sidebar, Dialogs)
│   │   ├── context/       # Auth & Global State
│   │   └── pages/         # View components
├── server/                # Express API
│   ├── controllers/       # Business logic
│   ├── models/            # Sequelize database schemas
│   ├── routes/            # API endpoints
│   └── middleware/        # Auth & Validation
└── README.md
```

---

## 🎨 UI Philosophy
Taskify uses a **Glassmorphic** design language, characterized by:
- **Translucency**: Frosted glass effects on cards and navigation.
- **Vibrant Gradients**: Carefully curated HSL color palettes.
- **Micro-animations**: Subtle hover states and transitions for a premium feel.
- **Dark Mode Optimized**: Built-in support for high-contrast dark environments.