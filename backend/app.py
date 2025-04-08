from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import docx2txt
import PyPDF2
import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Download NLTK resources
nltk.download('punkt')
nltk.download('stopwords')

# Load job data
with open('data/jobs_database.json', 'r') as f:
    JOB_DATABASE = json.load(f)

# Helper functions for resume parsing
def extract_text_from_pdf(pdf_file):
    """Extract text from a PDF file."""
    text = ""
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def extract_text_from_docx(docx_file):
    """Extract text from a DOCX file."""
    return docx2txt.process(docx_file)

def extract_text_from_resume(file):
    """Extract text based on file type."""
    file_extension = os.path.splitext(file.filename)[1].lower()
    
    if file_extension == '.pdf':
        return extract_text_from_pdf(file)
    elif file_extension == '.docx':
        return extract_text_from_docx(file)
    else:
        raise ValueError(f"Unsupported file format: {file_extension}")

def extract_skills(text):
    """Extract skills from resume text using keyword matching."""
    # Common tech skills (this would be a much larger list in production)
    common_skills = [
        "python", "javascript", "react", "node.js", "html", "css", "sql", 
        "mongodb", "aws", "docker", "kubernetes", "machine learning", "data analysis",
        "tensorflow", "pytorch", "nlp", "java", "c++", "php", "ruby", "swift", 
        "ios", "android", "flutter", "django", "flask", "express", "git", 
        "agile", "scrum", "devops", "ci/cd", "rest api", "graphql", "redux",
        "vue.js", "angular", "typescript", "sass", "less", "webpack", "babel",
        "figma", "adobe xd", "sketch", "ui design", "ux design", "responsive design"
    ]
    
    skills = []
    text_lower = text.lower()
    
    for skill in common_skills:
        if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
            skills.append(skill)
    
    return skills

def extract_education(text):
    """Extract education information from resume text."""
    education = []
    
    # Common degree patterns
    degree_patterns = [
        r'\b(Bachelor|BS|BA|B\.S\.|B\.A\.|Master|MS|MA|M\.S\.|M\.A\.|PhD|Ph\.D|Doctorate|Associate|AA|A\.A\.|BSc|MSc|B\.Sc\.|M\.Sc\.)\b'
    ]
    
    # Common university word patterns
    uni_patterns = [
        r'\b(University|College|Institute|School)\b',
    ]
    
    # Extract sentences that might contain education info
    sentences = re.split(r'[.!?]+', text)
    for sentence in sentences:
        if any(re.search(pattern, sentence, re.IGNORECASE) for pattern in degree_patterns) or \
           any(re.search(pattern, sentence, re.IGNORECASE) for pattern in uni_patterns):
            education.append(sentence.strip())
    
    return education

def extract_job_titles(text):
    """Extract potential job titles from resume text."""
    # Common job title keywords
    job_title_keywords = [
        "developer", "engineer", "designer", "manager", "director", "specialist",
        "analyst", "consultant", "administrator", "architect", "scientist",
        "coordinator", "lead", "head", "chief", "officer", "vp", "president"
    ]
    
    job_titles = []
    
    # Look for capitalized phrases that might be job titles
    title_pattern = r'([A-Z][a-z]+(?: [A-Z][a-z]+)*)'
    potential_titles = re.findall(title_pattern, text)
    
    for title in potential_titles:
        title_lower = title.lower()
        if any(keyword in title_lower for keyword in job_title_keywords) and len(title.split()) <= 5:
            job_titles.append(title)
    
    return job_titles

def extract_experience(text):
    """Extract work experience from resume text."""
    experience = []
    
    # Look for date patterns typically found in work experience
    date_pattern = r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\.?\s+\d{4}\s*(-|–|to)\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|Present|Current)\.?\s+\d{0,4}\b'
    
    # Split into paragraphs
    paragraphs = re.split(r'\n\s*\n', text)
    
    for paragraph in paragraphs:
        if re.search(date_pattern, paragraph, re.IGNORECASE):
            experience.append(paragraph.strip())
    
    return experience

def parse_resume(resume_text):
    """Parse the resume text and extract structured information."""
    # Extract various components
    skills = extract_skills(resume_text)
    education = extract_education(resume_text)
    job_titles = extract_job_titles(resume_text)
    experience = extract_experience(resume_text)
    
    return {
        "skills": skills,
        "education": education,
        "job_titles": job_titles,
        "experience": experience,
        "raw_text": resume_text
    }

def calculate_skill_match(resume_skills, job_skills):
    """Calculate the percentage of skills that match between resume and job."""
    if not job_skills or not resume_skills:
        return 0
    
    # Convert to lowercase for comparison
    resume_skills_lower = [skill.lower() for skill in resume_skills]
    job_skills_lower = [skill.lower() for skill in job_skills]
    
    # Find matching skills
    matching_skills = [skill for skill in resume_skills_lower if skill in job_skills_lower]
    
    # Calculate percentage match
    skill_match_percentage = (len(matching_skills) / len(job_skills_lower)) * 100
    
    return min(skill_match_percentage, 100)  # Cap at 100%

def calculate_title_match(resume_titles, job_title):
    """Calculate how well the resume job titles match the job title."""
    if not resume_titles or not job_title:
        return 0
    
    # Convert to lowercase for comparison
    resume_titles_lower = [title.lower() for title in resume_titles]
    job_title_lower = job_title.lower()
    
    # Calculate similarity using word overlap
    vectorizer = TfidfVectorizer(stop_words='english')
    
    try:
        tfidf_matrix = vectorizer.fit_transform(resume_titles_lower + [job_title_lower])
        similarity_scores = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])[0]
        
        # Get the best match
        if len(similarity_scores) > 0:
            title_match_percentage = float(max(similarity_scores) * 100)
            return min(title_match_percentage, 100)  # Cap at 100%
    except:
        # If TF-IDF fails (e.g., due to empty strings), use a simpler approach
        for title in resume_titles_lower:
            if job_title_lower in title or title in job_title_lower:
                return 70  # Give a decent score for partial matches
    
    return 0

def calculate_education_match(resume_education, job_education):
    """Calculate how well the resume education matches the job education requirements."""
    if not resume_education:
        return 0
    
    # Look for degree levels in the resume
    degree_levels = {
        "bachelor": ["bachelor", "bs", "ba", "b.s.", "b.a.", "bsc", "b.sc"],
        "master": ["master", "ms", "ma", "m.s.", "m.a.", "msc", "m.sc"],
        "phd": ["phd", "ph.d", "doctorate", "doctoral"],
        "associate": ["associate", "aa", "a.a."]
    }
    
    # Check if job requires a specific degree
    required_degree = None
    for level, keywords in degree_levels.items():
        if any(keyword in job_education.lower() for keyword in keywords):
            required_degree = level
            break
    
    if not required_degree:
        return 50  # No specific degree required
    
    # Check if resume has the required degree or higher
    degree_weights = {
        "associate": 1,
        "bachelor": 2,
        "master": 3,
        "phd": 4
    }
    
    required_weight = degree_weights.get(required_degree, 0)
    
    # Find highest degree in resume
    highest_degree = None
    highest_weight = 0
    
    resume_education_text = " ".join(resume_education).lower()
    
    for level, keywords in degree_levels.items():
        if any(keyword in resume_education_text for keyword in keywords):
            weight = degree_weights.get(level, 0)
            if weight > highest_weight:
                highest_weight = weight
                highest_degree = level
    
    if not highest_degree:
        return 0  # No degree found in resume
    
    if highest_weight >= required_weight:
        return 100  # Has required degree or higher
    else:
        return 50  # Has degree, but not at required level

def calculate_job_match(resume_data, job):
    """Calculate the overall match percentage between a resume and a job."""
    # Calculate skill match
    skill_match = calculate_skill_match(resume_data["skills"], job["requiredSkills"] + job.get("preferredSkills", []))
    
    # Calculate title match
    title_match = calculate_title_match(resume_data["job_titles"], job["title"])
    
    # Calculate education match
    education_match = calculate_education_match(resume_data["education"], job["education"])
    
    # Calculate experience match (simplified - just checking if experience exists)
    experience_match = min(len(resume_data["experience"]) * 20, 100)  # 20 points per experience entry, max 100
    
    # Calculate overall match with weighted components
    weights = {
        "skills": 0.4,
        "title": 0.2,
        "education": 0.2,
        "experience": 0.2
    }
    
    overall_match = (
        skill_match * weights["skills"] +
        title_match * weights["title"] +
        education_match * weights["education"] +
        experience_match * weights["experience"]
    )
    
    # Prepare category scores for detailed feedback
    category_scores = {
        "skills": skill_match,
        "experience": experience_match,
        "education": education_match
    }
    
    # Find matching and missing keywords
    matching_keywords = []
    missing_keywords = []
    
    resume_skills_lower = [skill.lower() for skill in resume_data["skills"]]
    
    for skill in job["requiredSkills"]:
        if skill.lower() in resume_skills_lower:
            matching_keywords.append(skill)
        else:
            missing_keywords.append(skill)
    
    return {
        "job_id": job["id"],
        "score": overall_match,
        "categoryScores": category_scores,
        "matchingKeywords": matching_keywords,
        "missingKeywords": missing_keywords
    }

def generate_resume_suggestions(resume_data, job_matches):
    """Generate suggestions for improving the resume based on job matches."""
    suggestions = []
    
    # Check if there are at least 5 skills
    if len(resume_data["skills"]) < 5:
        suggestions.append({
            "category": "skills",
            "priority": "high",
            "text": "Add more technical skills to your resume. Try to list at least 8-10 relevant skills.",
            "example": "JavaScript, React, Node.js, HTML, CSS, SQL"
        })
    
    # Find missing skills from top jobs
    missing_skills = set()
    for job_match in job_matches[:3]:  # Look at top 3 job matches
        missing_skills.update(job_match["missingKeywords"])
    
    if missing_skills:
        top_missing = list(missing_skills)[:5]  # Take top 5 missing skills
        suggestions.append({
            "category": "skills",
            "priority": "high",
            "text": f"Add these key skills that are missing from your resume but required by your target jobs:",
            "example": ", ".join(top_missing)
        })
    
    # Check for education section
    if len(resume_data["education"]) == 0:
        suggestions.append({
            "category": "education",
            "priority": "medium",
            "text": "Add your education details, including degree, institution, and graduation year.",
            "example": "Bachelor of Science in Computer Science, University of Washington, 2020"
        })
    
    # Check for work experience
    if len(resume_data["experience"]) < 2:
        suggestions.append({
            "category": "experience",
            "priority": "high",
            "text": "Add more detailed work experience with quantifiable achievements.",
            "example": "Increased website performance by 40% through optimization of React components and implementing code splitting."
        })
    
    # Formatting suggestions
    suggestions.append({
        "category": "formatting",
        "priority": "low",
        "text": "Use bullet points to highlight achievements and responsibilities in your work experience.",
        "example": "• Developed responsive web applications using React\n• Implemented RESTful APIs with Node.js and Express"
    })
    
    # Add more targeted suggestions based on job type
    job_titles = [match.get("title", "").lower() for match in job_matches[:3]]
    job_title_text = " ".join(job_titles)
    
    if "developer" in job_title_text or "engineer" in job_title_text:
        suggestions.append({
            "category": "experience",
            "priority": "medium",
            "text": "Include specific coding projects with links to your GitHub or portfolio.",
            "example": "E-commerce Platform (GitHub: github.com/username/project) - Built with React, Node.js, and MongoDB."
        })
    elif "data" in job_title_text or "scientist" in job_title_text:
        suggestions.append({
            "category": "experience",
            "priority": "medium",
            "text": "Highlight data analysis projects with specific metrics and results.",
            "example": "Developed predictive model achieving 92% accuracy for customer churn prediction, saving an estimated $500K annually."
        })
    elif "designer" in job_title_text:
        suggestions.append({
            "category": "experience",
            "priority": "medium",
            "text": "Include a link to your design portfolio and highlight specific UX/UI projects.",
            "example": "Redesigned mobile app interface resulting in 35% increase in user engagement and 28% longer session times."
        })
    
    return suggestions

@app.route('/api/process-resume', methods=['POST'])
def process_resume():
    """Process uploaded resume and return matches and suggestions."""
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file uploaded"}), 400
    
    resume_file = request.files['resume']
    
    if resume_file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    try:
        # Extract text from resume
        resume_text = extract_text_from_resume(resume_file)
        
        # Parse resume to extract structured information
        resume_data = parse_resume(resume_text)
        
        # Calculate job matches
        job_matches = []
        for job in JOB_DATABASE:
            job_match = calculate_job_match(resume_data, job)
            # Enrich with job details for the frontend
            job_match.update({
                "title": job["title"],
                "company": job["company"],
                "location": job["location"],
                "experienceLevel": job["experienceLevel"],
                "description": job["description"]
            })
            job_matches.append(job_match)
        
        # Sort job matches by score
        job_matches.sort(key=lambda x: x["score"], reverse=True)
        
        # Generate resume improvement suggestions
        suggestions = generate_resume_suggestions(resume_data, job_matches)
        
        return jsonify({
            "resumeData": resume_data,
            "jobMatches": job_matches,
            "suggestions": suggestions
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)