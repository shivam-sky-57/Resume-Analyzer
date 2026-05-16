# ResumeIQ - AI-Powered Resume Analyzer

ResumeIQ is a state-of-the-art SaaS platform designed to help job seekers optimize their resumes using artificial intelligence. By leveraging the Google Gemini API, it provides deep insights, scoring, and actionable feedback to improve resume visibility and effectiveness.

![Banner](https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop)

## 🚀 Features

- **AI Resume Analysis**: Instant scoring and detailed feedback using Google Gemini AI.
- **Skill Extraction**: Automatically identifies and categorizes your technical and soft skills.
- **Job Matching**: Intelligent job recommendations based on your resume profile via Adzuna API.
- **Interactive Dashboard**: Visualize your progress and resume performance with beautiful charts.
- **Secure Authentication**: Robust user authentication system powered by JWT.
- **Modern UI**: Clean, responsive, and premium design built with React and Tailwind CSS.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Visualization**: Recharts
- **Icons**: Lucide React & Tabler Icons

### Backend
- **Framework**: Spring Boot 3.2
- **Language**: Java 17
- **Security**: Spring Security & JWT
- **Database**: PostgreSQL
- **PDF Processing**: Apache PDFBox
- **External APIs**: Google Gemini AI, Adzuna Job API

## 📋 Prerequisites

- **Java**: JDK 17 or higher
- **Node.js**: v18 or higher
- **Docker**: For running PostgreSQL (optional if using local PG)
- **API Keys**: Google Gemini API Key and Adzuna App ID/Key

## ⚙️ Setup & Installation

### 1. Database Setup (via Docker)
```bash
docker-compose up -d
```

### 2. Backend Configuration
Create a `.env` file in the `backend` directory with the following:
```env
DB_URL=jdbc:postgresql://localhost:5432/resumeiq
DB_USERNAME=resumeiq
DB_PASSWORD=resumeiq123
JWT_SECRET=your_long_secure_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
ADZUNA_APP_ID=your_adzuna_id
ADZUNA_API_KEY=your_adzuna_key
```

### 3. Run Backend
```bash
cd backend
./mvnw spring-boot:run
```

### 4. Frontend Configuration
The frontend connects to `http://localhost:8080` by default.

### 5. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📸 Screenshots

*(Add your screenshots here)*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git checkout origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by [Shivam](https://github.com/shivam-sky-57)
