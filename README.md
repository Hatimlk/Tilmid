  <h1>🎓 Tilmid Platform</h1>
  
  <p>
    A comprehensive educational platform designed to support Moroccan students in their academic journey. Offering expert guidance, smart study techniques, and psychological support.
    <br />
    <br />
    <a href="https://tilmide.ma/"><strong>Explore the Website »</strong></a>
    <br />
    <a href="#features">View Demo</a>
    ·
    <a href="#issues">Report Bug</a>
    ·
    <a href="#pull-requests">Request Feature</a>
  </p>
</div>

<br />

## 📖 About The Project

**Tilmid (تلميذ)** is a dedicated educational ecosystem built for Moroccan students, focused on the Baccalaureate journey. We bridge the gap between academic requirements and student well-being by providing a holistic approach to education.

Our platform combines technical innovation with pedagogical expertise to deliver:
*   **Targeted Guidance:** Personalized academic pathways to help students make informed decisions.
*   **Smart Learning:** Advanced memorization techniques and efficient study strategies.
*   **Mental Well-being:** Psychological support resources to manage exam stress and anxiety.

## ✨ Key Features

*   **📊 Bac Simulator:** Advanced tools to simulate exam scores and predict outcomes with high accuracy.
*   **👤 Student Area:** A personalized dashboard for tracking progress, managing schedules, and accessing exclusive resources.
*   **🎓 Coaching Programs:** Tailored coaching offers designed to meet individual student needs.
*   **📝 Rich Content Blog:** A library of educational articles, news, and tips for academic success.
*   **🛠️ Admin Dashboard:** comprehensive management system for content, users, and platform analytics.

## 🛠️ Tech Stack

This project is architected using modern web technologies for performance and scalability.

*   ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
*   ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
*   ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
*   ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
*   ![Puter.js](https://img.shields.io/badge/Puter.js-000000?style=for-the-badge&logo=box&logoColor=white)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   **Node.js** (v20.16+)
*   **npm** or **yarn**

### Installation

1.  **Clone the repository**
    ```sh
    git clone https://github.com/Hatimlk/Tilmid.git
    cd Tilmid
    ```

2.  **Install dependencies**
    ```sh
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory. You can configure the API URL if running a local backend:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
    *(If not set, it defaults to production `https://tilmide.ma/api`)*

4.  **Run the application**
    ```sh
    npm run dev
    ```

## Backend and dashboard setup

The React application supports two API deployments that expose the same `/api`
contract. Use **Node/Express for local development** (`server/`) and the PHP
router (`server-php/`) only on the Apache production host. Do not run both for
the same environment.

### Local Node API

1. Start MySQL or MariaDB on `127.0.0.1:3306`.
2. Create a database named `tilmid_db` and import `server/schema.sql`.
3. Copy `server/.env.example` to `server/.env`, then set a long random
   `JWT_SECRET` and the database credentials.
4. Set `ADMIN_EMAIL`, `ADMIN_USERNAME`, and an
   `ADMIN_BOOTSTRAP_PASSWORD` of at least 12 characters.
5. Run the following commands:

   ```sh
   npm --prefix server install
   npm run server:db-check
   npm run server:seed-admin
   npm run server:start
   ```

6. In another terminal, copy `.env.development.example` to
   `.env.development.local` and run `npm run dev`.

The API readiness endpoint is `http://127.0.0.1:5000/api/health`. It returns
HTTP 503 until the database is reachable.

### Production

Production builds use `VITE_API_URL=https://tilmide.ma/api` from `.env` by
default. Set `VITE_API_URL` explicitly in CI when deploying to another host.
Never use `.env.local` for a development-only URL because Vite loads it during
production builds too.

For the PHP deployment, configure `server-php/.env`, run `migrate.php` and
`seed_admin.php` once using `MIGRATION_SECRET`, and then delete both public
scripts from the deployed server. The PHP runtime needs PDO MySQL, `mbstring`,
Apache rewrite support, and write access to `server-php/uploads`.

### Verification

Run `npm run check` before deployment. This performs strict TypeScript checking
and creates the production bundle. Run `npm --prefix server run check` for the
Node API and `npm run server:db-check` for database connectivity.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📧 Contact

**Hatim** - [Contact via Mail: hatimlakrouni@gmail.com]

Project Link: [https://github.com/Hatimlk/Tilmid](https://github.com/Hatimlk/Tilmid)
