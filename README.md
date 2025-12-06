# 🚀 Backend Server Template 2.0

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

**A production-grade Node.js + TypeScript backend with enterprise-level architecture**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## ✨ Features

<table>
<tr>
<td>

🏗️ **Architecture**

- Modular & Scalable Design
- Clean Code Principles
- SOLID Principles
- MVC Pattern

</td>
<td>

🔐 **Security**

- JWT Authentication
- Clerk Integration
- Role-based Access Control
- Rate Limiting

</td>
</tr>
<tr>
<td>

📦 **Database**

- MongoDB + Mongoose
- Schema Validation
- Query Builders
- Aggregation Pipelines

</td>
<td>

🛠️ **Developer Tools**

- ESLint + Prettier
- Husky Git Hooks
- Commitlint
- Hot Reload

</td>
</tr>
</table>

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Tool    | Version | Download                               |
| ------- | ------- | -------------------------------------- |
| Node.js | v18+    | [nodejs.org](https://nodejs.org)       |
| pnpm    | Latest  | `npm install -g pnpm`                  |
| MongoDB | Latest  | [mongodb.com](https://www.mongodb.com) |
| Git     | Latest  | [git-scm.com](https://git-scm.com)     |

---

## 🚀 Quick Start

### 1️⃣ Clone Repository

<details open>
<summary><b>SSH (Recommended)</b></summary>

```bash
git clone git@github.com:Anirbandasjoy/server-template-2.0.git
cd server-template-2.0
pnpm install
```

</details>

<details>
<summary><b>HTTPS</b></summary>

```bash
git clone https://github.com/Anirbandasjoy/server-template-2.0.git
cd server-template-2.0
pnpm install
```

</details>

### 2️⃣ Environment Configuration

Create your `.env` file:

```bash
cp .env.example .env
```

<details>
<summary><b>📝 View Environment Variables</b></summary>

```env
# Server Configuration
PORT=5000
NODE_ENV=development
SERVER_URI=http://localhost:5000
CLIENT_URI=http://localhost:3000
CORS_ORIGINS=http://localhost:3000

# Database
MONGO_URI=mongodb://localhost:27017/authDBEXP

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
CLERK_WEBHOOK_SECRET=your_webhook_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

</details>

### 3️⃣ Initialize Git Hooks

```bash
pnpm run prepare
```

> ✅ This activates pre-commit linting, auto-formatting, and commit message validation

### 4️⃣ Start Development

```bash
pnpm dev
```

Your server is now running at `http://localhost:5000` 🎉

---

## 📜 Available Scripts

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `pnpm dev`             | Start development server with hot reload |
| `pnpm build`           | Build for production                     |
| `pnpm start`           | Start production server                  |
| `pnpm lint`            | Run ESLint                               |
| `pnpm lint:fix`        | Fix ESLint errors                        |
| `pnpm format`          | Format code with Prettier                |
| `pnpm fix-all`         | Run lint:fix and format                  |
| `pnpm seed:superadmin` | Seed super admin user                    |
| `pnpm clear`           | Clean dist/, node_modules/, yarn.lock    |

---

## 📂 Project Structure

```
server-template-2.0/
│
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 errors/          # Error handling
│   │   ├── 📁 helper/          # Helper functions
│   │   ├── 📁 libs/            # Libraries & utilities
│   │   ├── 📁 middlewares/     # Express middlewares
│   │   ├── 📁 modules/         # Feature modules
│   │   │   ├── 📁 auth/        # Authentication
│   │   │   └── 📁 user/        # User management
│   │   ├── 📁 routes/          # Route definitions
│   │   └── 📁 schema/          # Validation schemas
│   │
│   ├── 📁 config/              # Configuration files
│   ├── 📁 scripts/             # Utility scripts
│   ├── 📁 services/            # Business logic services
│   ├── 📁 types/               # TypeScript types
│   ├── 📁 utils/               # Utility functions
│   │
│   ├── 📄 app.ts               # Express app setup
│   └── 📄 index.ts             # Entry point
│
├── 📁 .husky/                  # Git hooks
├── 📁 dist/                    # Compiled code
│
├── 📄 .env.example             # Environment template
├── 📄 tsconfig.json            # TypeScript config
├── 📄 eslint.config.mjs        # ESLint config
├── 📄 commitlint.config.cjs    # Commitlint config
└── 📄 package.json             # Dependencies
```

---

## 🎯 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### ✅ Valid Commits

```bash
feat: add user authentication
fix: resolve login validation bug
docs: update API documentation
style: format code with prettier
refactor: restructure auth module
test: add unit tests for user service
chore: update dependencies
```

### ❌ Invalid Commits

```bash
updated files          # Missing type
Fix bug               # Wrong case
added new feature.    # Period at end
```

> **Note:** Invalid commits will be automatically rejected by Husky

---

## 🔧 Tech Stack

<div align="center">

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

### Database

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)

### Authentication

![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)

### Development Tools

![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![Husky](https://img.shields.io/badge/Husky-00D100?style=for-the-badge)

### Package Manager

![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

</div>

---

## 🚢 Deployment

### Production Build

```bash
# Build the project
pnpm build

# Start production server
pnpm start
```

### Environment Setup

Ensure these variables are set in production:

- `NODE_ENV=production`
- Valid MongoDB connection string
- Production API keys
- Proper CORS origins

### Recommended Platforms

- **[Vercel](https://vercel.com)** - Serverless deployment
- **[Railway](https://railway.app)** - Container deployment
- **[Render](https://render.com)** - Full-stack deployment
- **[AWS EC2](https://aws.amazon.com/ec2/)** - Self-hosted

---

## 🤝 Contributing

Contributions are welcome! Please check out our [Contributing Guide](CONTRIBUTING.md).

### Development Workflow

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

<div align="center">

### **Anirban Das Joy**

Backend Developer | MERN Stack Enthusiast  
**Moulvibazar Polytechnic Institute** — Department of CSE

[![Email](https://img.shields.io/badge/Email-joy600508@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:joy600508@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-Anirbandasjoy-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Anirbandasjoy)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-anirbandasjoy404-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/anirbandasjoy404)
[![Facebook](https://img.shields.io/badge/Facebook-Anirbandasjoy-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://web.facebook.com/Anirbandasjoy)

</div>

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

<div align="center">

**Made with ❤️ by Anirban Das Joy**

</div>
