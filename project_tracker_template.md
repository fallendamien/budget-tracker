# 🚀 Project Master Tracker

> **Tip:** Copy this structure into Notion (as a Database) or Obsidian.

## 📋 Master Dashboard View

| Project Name            | Status      | Tech Stack        | Hosting             | Database (Prod) | Repo URL      |
|:----------------------- |:----------- |:----------------- |:------------------- |:--------------- |:------------- |
| **Zone Detection Demo** | 🟢 Live     | Vue 3, Laravel 11 | Render + Cloudflare | TiDB (MySQL)    | [GitHub Link] |
| **Project 2**           | 🟡 Dev      | Nuxt, Supabase    | Vercel              | Postgres        | [Link]        |
| **Project 3**           | 🔴 Archived | React, Node       | Heroku              | Mongo           | [Link]        |

---

## 📄 Project Detail Template

_(Duplicate this section for each new project)_

# [Project Name]

### 🔗 Quick Links

- **Live Site**: [https://example.com](https://example.com)
- **Admin Panel**: [https://admin.example.com](https://admin.example.com)
- **Repo**: [https://github.com/user/repo](https://github.com/user/repo)
- **Design (Figma)**: [Link]

### 🛠 Tech Stack

- **Frontend**: Vue 3 (Vite, Pinia, Tailwind)
- **Backend**: Laravel 11 (PHP 8.2)
- **Database**:
  - **Local**: SQLite (`database/database.sqlite`)
  - **Prod**: TiDB Serverless (MySQL)
- **Hosting**:
  - Frontend: Cloudflare Pages
  - Backend: Render.com (Web Service)

### 🔑 Environment & Config

> _⚠️ DO NOT paste real passwords here. Use 1Password/LastPass._

- **Env File**: `.env` (See `.env.example`)
- **Node Version**: v20.x
- **PHP Version**: 8.2+
- **Commands**:
  - Dev: `npm run dev` / `php artisan serve`
  - Build: `npm run build`
  - Deploy: Auto-deploy on push to `master`

### 📝 Notes & Quirks

- **Known Issue**: Don't use `GROUP_CONCAT` (SQLite incompatibility).
- **Setup**: Requires `php artisan migrate --seed` on fresh install.
- **Monitoring**: UptimeRobot pinging `/api/v1/health`.
