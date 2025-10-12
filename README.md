# 🏠 ChoreMaster

**A Simple Household Task Management System**  
Transform your chaotic chore routine into an organized experience!

---

## 🛠️ Technologies Used

- **Frontend:** React 18 + TypeScript
- **Styling:** Bootstrap
- **Backend:** .NET 9
- **Database:** PostgreSQL with Entity Framework ORM
- **Authentication:** JWT + OAuth2 (Google)
- **Deployment:** Azure + Terraform
- **Testing:** xUnit + .NET Testcontainers
- **CI/CD Automation:** GitHub Actions

---

## ✨ Core Features

- ✅ Create, edit, and delete chores
- 👥 Manage users (create/edit/delete)
- 🔁 Delegate chores to specific users
- ✔️ Mark tasks as completed and reassign them to a user
- 📜 View full task history
- ⏱️ Configure custom task time thresholds
- 📊 Display relations and time left for each task

---

## 🧩 Overview of the App

<img width="1396" height="740" alt="ChoreMaster Dashboard" src="https://github.com/user-attachments/assets/a8a7edc1-c948-4635-bd1a-97151fe1539e" />

---

## 🚀 Setting It Up Locally

### Backend

#### Prerequisites

- .NET 9 SDK
- Entity Framework CLI tools
- Docker and Docker Compose

#### Setup Steps

1. **Start PostgreSQL database:**

   ```bash
   docker-compose up -d
   ```

2. **Create environment file:**
   Create a `.env` file in the backend directory with your connection string:

   ```env
   DATABASE_CONNECTION_STRING=your_connection_string_here
   ```

3. **Run Entity Framework migrations:**

   ```bash
   dotnet ef database update
   ```

4. **Start the backend:**
   ```bash
   dotnet build
   dotnet run
   ```

---

### Frontend

#### Prerequisites

- Node.js (npm version 10.8.2 or higher)

#### Setup Steps

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

   The app automatically uses `http://localhost:5272/api` for the backend in development.

   ```

   ```
