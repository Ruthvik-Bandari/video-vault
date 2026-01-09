# Video Vault

A full stack video search platform built with **Java Spring Boot** backend and **React + Vite** frontend. Search videos by category and discover content that inspires you.

![Video Vault](https://img.shields.io/badge/Spring%20Boot-3.2.0-green) ![React](https://img.shields.io/badge/React-18.2-blue) ![Java](https://img.shields.io/badge/Java-17-orange)

## Project Structure

```
video-vault/
├── backend/                    # Java Spring Boot Backend
│   ├── src/main/java/com/videovault/
│   │   ├── VideoVaultApplication.java
│   │   ├── controller/
│   │   │   └── VideoController.java
│   │   ├── service/
│   │   │   └── YouTubeService.java
│   │   ├── model/
│   │   │   ├── Video.java
│   │   │   └── SearchResponse.java
│   │   └── config/
│   │       └── CorsConfig.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
└── frontend/                   # React + Vite Frontend
    ├── src/
    │   ├── VideoVault.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## Features

- 🔍 **Category Based Search** - Search videos by topic/category
- 🎬 **Video Grid Display** - Beautiful responsive video cards
- 🚀 **Quick Categories** - One click search for popular categories
- 🌐 **YouTube Integration** - Connect your API key for real results
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Demo Mode** - Works without API key for testing

## Prerequisites

- **Java 17** or higher
- **Maven 3.6+**
- **Node.js 18+** and npm
- (Optional) YouTube Data API v3 key

## Quick Start

### 1. Start the Backend

```bash
cd backend

# Run with Maven
./mvnw spring-boot:run

# Or on Windows
mvnw.cmd spring-boot:run
```

The backend will start on `http://localhost:8080`

### 2. Start the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### 3. Open the App

Navigate to `http://localhost:3000` in your browser.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/videos/search?query={query}` | Search videos by query |
| GET | `/api/videos/search?query={query}&maxResults=20` | Search with custom result count |
| GET | `/api/videos/categories` | Get list of popular categories |
| GET | `/api/videos/health` | Health check endpoint |

### Example API Request

```bash
curl "http://localhost:8080/api/videos/search?query=technology&maxResults=12"
```

### Example Response

```json
{
  "videos": [
    {
      "id": "abc123",
      "title": "Complete Technology Tutorial",
      "thumbnail": "https://...",
      "channel": "TechMaster",
      "description": "Learn everything about...",
      "publishedAt": "Jan 15, 2024"
    }
  ],
  "query": "technology",
  "totalResults": 12
}
```

## Enable YouTube API (Optional)

To get real YouTube video results:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **YouTube Data API v3**
4. Create an API key under Credentials
5. Update `backend/src/main/resources/application.properties`:

```properties
youtube.api.key=YOUR_API_KEY_HERE
youtube.api.enabled=true
```

6. Restart the backend

## Environment Variables

You can also set the API key via environment variables:

```bash
# Linux/Mac
export YOUTUBE_API_KEY=your_api_key
export YOUTUBE_API_ENABLED=true

# Windows
set YOUTUBE_API_KEY=your_api_key
set YOUTUBE_API_ENABLED=true
```

## Build for Production

### Backend

```bash
cd backend
./mvnw clean package
java -jar target/video-vault-backend-1.0.0.jar
```

### Frontend

```bash
cd frontend
npm run build
# Output will be in dist/ folder
```

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2
- Spring Web MVC
- Jackson JSON
- Maven

### Frontend
- React 18
- Vite 5
- Tailwind CSS
- Lucide React Icons

## License

MIT License
