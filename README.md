# ResumeIQ - AI Powered Resume Analyzer

ResumeIQ is a comprehensive full-stack application designed to analyze resumes using AI and provide insightful feedback, alongside job matching capabilities. The platform allows users to securely upload their resumes, receive AI-generated improvement suggestions, and discover relevant job postings based on their skill sets.

## Features

- **AI Resume Analysis**: Upload resumes (PDF format) and receive detailed analysis and suggestions powered by the Gemini API.
- **Job Recommendations**: Get tailored job listings matching your resume using the Adzuna API integration.
- **Secure Authentication**: Robust user authentication and session management using JWT (JSON Web Tokens) and Spring Security.
- **Interactive Dashboard**: View analysis history, user statistics, and job matches through an intuitive and responsive UI.
- **Data Persistence**: Reliable and structured data storage using PostgreSQL.

## Tech Stack

### Frontend
- **React 18** with **Vite** for fast, modern web development
- **Tailwind CSS** for responsive styling and utility-first design
- **React Router** for seamless client-side navigation
- **Recharts** for data visualization
- **Lucide & Tabler Icons** for crisp UI elements

### Backend
- **Java 17** with **Spring Boot 3.2**
- **Spring Security** with stateless JWT authentication
- **Spring Data JPA** for robust database operations
- **Apache PDFBox** for robust PDF parsing and text extraction
- **PostgreSQL** for relational data persistence
- **Docker** for database containerization

---

## Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites

- Java Development Kit (JDK) 17
- Node.js (v18 or higher)
- Maven
- Docker and Docker Compose (for running the PostgreSQL database)

### Installation & Setup

#### 1. Clone the repository

```bash
git clone <repository-url>
cd Resume-Analyzer
```

#### 2. Start the Database (Docker)

Use the provided `docker-compose.yml` to spin up the PostgreSQL database:

```bash
docker-compose up -d
```

This will start a PostgreSQL instance on port `5432` with the necessary database and credentials.

#### 3. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file in the `backend` directory with the following variables:

   ```env
   DB_URL=jdbc:postgresql://localhost:5432/resumeiq
   DB_USERNAME=resumeiq
   DB_PASSWORD=resumeiq123
   
   GEMINI_API_KEY=your_gemini_api_key_here
   
   ADZUNA_APP_ID=your_adzuna_app_id_here
   ADZUNA_API_KEY=your_adzuna_api_key_here
   
   JWT_SECRET=your_secure_jwt_secret_key_here
   ```

3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend server will start on `http://localhost:8080`.*

#### 4. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend application will be accessible at `http://localhost:5173`.*

## Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. Register for a new account or log in with existing credentials.
3. Access the dashboard to upload your PDF resume for instant AI-powered analysis and matching job recommendations.
