# JobMatcher - AI Resume Analyzer & Job Matching App

JobMatcher is a modern web application that analyzes user resumes and matches them with job descriptions based on skills, experience, and education. This application provides personalized job recommendations and resume improvement suggestions.

![JobMatcher App](https://placeholder.com/jobmatcher-screenshot.png)

## Features

- **Resume Upload & Parsing**: Upload PDF or DOCX resumes and extract key information
- **Job Matching Algorithm**: Match resumes to jobs based on skills, experience, and education
- **Resume Feedback Engine**: Get personalized suggestions to improve your resume
- **Interactive Dashboard**: View top matches with beautiful visualizations
- **Modern UI**: Dark mode with neon gradients and sleek animations

## Tech Stack

### Frontend
- React.js
- Framer Motion for animations
- Recharts for data visualization
- Custom CSS with dark mode styling

### Backend
- Python Flask API
- NLP for resume parsing (NLTK)
- Document processing libraries (PyPDF2, docx2txt)
- Cosine similarity for matching algorithm

## Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- npm or yarn

## Getting Started

### Clone the repository

```bash
git clone https://github.com/yourusername/jobmatcher.git
cd jobmatcher
```

### Backend Setup

1. Create a Python virtual environment:

```bash
cd backend
python -m venv venv
```

2. Activate the virtual environment:

```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Install Python dependencies:

```bash
pip install -r requirements.txt
```

4. Create data directory and add sample jobs:

```bash
mkdir -p data
# Copy the mockJobs.json file to data/jobs_database.json
```

5. Start the Flask server:

```bash
python app.py
```

The backend will be running at http://localhost:5000.

### Frontend Setup

1. Install dependencies:

```bash
cd ../frontend
npm install
```

2. Start the development server:

```bash
npm start
```

The frontend will be running at http://localhost:3000.

## Project Structure

- `/frontend`: React application
  - `/src/components`: React components
  - `/src/pages`: Page layouts
  - `/src/styles`: CSS styles
  - `/src/data`: Mock data for testing

- `/backend`: Python Flask API
  - `/resume_parser`: Resume parsing modules
  - `/job_matcher`: Job matching algorithm
  - `/data`: Job database

## API Endpoints

- `POST /api/process-resume`: Upload and process a resume
  - Request: `multipart/form-data` with 'resume' file field
  - Response: JSON with resumeData, jobMatches, and suggestions

## Future Enhancements

- User authentication and profile storage
- More advanced NLP for better resume parsing
- Expanded job database with real-time updates
- Cover letter generation based on resume and job
- Integration with job application platforms

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from modern job search platforms
- Thanks to the open-source communities behind React, Flask, and the various libraries used in this project