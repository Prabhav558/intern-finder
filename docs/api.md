# 📚 OpportuNest API Reference

Complete API endpoint documentation for OpportuNest backend.

## Base URL

**Development:** `http://localhost:5000`  
**Production:** `https://api.opportunest.com`

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

Tokens are obtained from `/api/auth/login` or `/api/auth/refresh`.

---

## 🔐 Auth Endpoints

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "role": "STUDENT"
}
```

**Response:** `201 Created`
```json
{
  "id": "user-id",
  "email": "student@example.com",
  "name": "John Doe",
  "role": "STUDENT",
  "token": "jwt-token",
  "refreshToken": "refresh-token"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "token": "jwt-token",
  "refreshToken": "refresh-token",
  "user": {
    "id": "user-id",
    "email": "student@example.com",
    "role": "STUDENT"
  }
}
```

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

**Response:** `200 OK`
```json
{
  "id": "user-id",
  "email": "student@example.com",
  "name": "John Doe",
  "role": "STUDENT"
}
```

### Logout

```http
POST /api/auth/logout
Authorization: Bearer <jwt_token>
```

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh-token"
}
```

**Response:** `200 OK`
```json
{
  "token": "new-jwt-token",
  "refreshToken": "new-refresh-token"
}
```

---

## 👤 Student Endpoints

### Get Student Profile

```http
GET /api/students/profile
Authorization: Bearer <jwt_token>
```

**Response:** `200 OK`
```json
{
  "id": "profile-id",
  "userId": "user-id",
  "rollNo": "20CS001",
  "branch": "Computer Science",
  "graduationYear": 2024,
  "cgpa": 3.8,
  "skills": ["Python", "JavaScript", "React"],
  "interests": ["Web Development", "AI/ML"],
  "resumeUrl": "https://cdn.example.com/resume.pdf",
  "linkedinUrl": "https://linkedin.com/in/john",
  "profileScore": 85
}
```

### Update Student Profile

```http
PUT /api/students/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "branch": "Information Technology",
  "cgpa": 3.9,
  "skills": ["Python", "JavaScript", "React", "Docker"],
  "interests": ["Web Development", "DevOps"]
}
```

**Response:** `200 OK` (same as above)

### Upload Resume

```http
POST /api/students/resume/upload
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

file: <PDF file>
```

**Response:** `201 Created`
```json
{
  "resumeUrl": "https://cdn.example.com/resume.pdf",
  "message": "Resume uploaded successfully"
}
```

### Get Applications

```http
GET /api/students/applications?status=PENDING&limit=10&offset=0
Authorization: Bearer <jwt_token>
```

**Response:** `200 OK`
```json
{
  "applications": [
    {
      "id": "app-id",
      "opportunityId": "opp-id",
      "opportunityTitle": "Summer Intern - Web Dev",
      "status": "PENDING",
      "appliedAt": "2024-01-15T10:30:00Z",
      "companyName": "TechCorp"
    }
  ],
  "total": 5,
  "limit": 10,
  "offset": 0
}
```

### Get Bookmarks

```http
GET /api/students/bookmarks?limit=10&offset=0
Authorization: Bearer <jwt_token>
```

**Response:** `200 OK`
```json
{
  "bookmarks": [
    {
      "id": "bookmark-id",
      "opportunityId": "opp-id",
      "title": "Summer Intern - Web Dev",
      "companyName": "TechCorp",
      "deadline": "2024-02-01T23:59:59Z",
      "savedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 3,
  "limit": 10,
  "offset": 0
}
```

### Save Opportunity

```http
POST /api/students/bookmarks/:opportunityId
Authorization: Bearer <jwt_token>
```

**Response:** `201 Created`
```json
{
  "id": "bookmark-id",
  "message": "Opportunity saved"
}
```

### Unsave Opportunity

```http
DELETE /api/students/bookmarks/:opportunityId
Authorization: Bearer <jwt_token>
```

**Response:** `200 OK`
```json
{
  "message": "Opportunity removed from bookmarks"
}
```

---

## 🎯 Opportunity Endpoints

### List Opportunities

```http
GET /api/opportunities?type=INTERNSHIP&domain=tech&limit=20&offset=0
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `type`: INTERNSHIP, HACKATHON, SCHOLARSHIP, etc.
- `domain`: technology, finance, etc.
- `deadline`: before|after|between:2024-02-01:2024-03-01
- `location`: remote, onsite, etc.
- `mode`: REMOTE, ONSITE, HYBRID
- `minStipend`: minimum stipend amount
- `sort`: latest, deadline, matches

**Response:** `200 OK`
```json
{
  "opportunities": [
    {
      "id": "opp-id",
      "title": "Summer Intern - Web Dev",
      "companyName": "TechCorp",
      "type": "INTERNSHIP",
      "deadline": "2024-02-01T23:59:59Z",
      "location": "Bangalore",
      "mode": "HYBRID",
      "stipend": "₹50,000/month",
      "matchScore": 85,
      "isBookmarked": false
    }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0
}
```

### Get Opportunity Detail

```http
GET /api/opportunities/:opportunityId
Authorization: Bearer <jwt_token>
```

**Response:** `200 OK`
```json
{
  "id": "opp-id",
  "title": "Summer Intern - Web Dev",
  "description": "Full opportunity description...",
  "companyName": "TechCorp",
  "type": "INTERNSHIP",
  "deadline": "2024-02-01T23:59:59Z",
  "location": "Bangalore",
  "mode": "HYBRID",
  "stipend": "₹50,000/month",
  "requiredSkills": ["React", "Node.js", "MongoDB"],
  "tags": ["frontend", "startup", "remote"],
  "eligibility": {
    "minCgpa": 3.0,
    "allowedBranches": ["CSE", "IT"],
    "allowedYears": [3, 4]
  },
  "applicationLink": "https://application.link",
  "matchScore": 85,
  "isBookmarked": false,
  "totalApplications": 245
}
```

### Apply for Opportunity

```http
POST /api/opportunities/:opportunityId/apply
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "resumeUrl": "https://cdn.example.com/resume.pdf",
  "coverLetter": "I am passionate about web development..."
}
```

**Response:** `201 Created`
```json
{
  "id": "app-id",
  "opportunityId": "opp-id",
  "status": "PENDING",
  "appliedAt": "2024-01-20T10:30:00Z",
  "message": "Application submitted successfully"
}
```

---

## 📊 Admin Endpoints

### Get Admin Dashboard Stats

```http
GET /api/admin/stats
Authorization: Bearer <jwt_token>
```

**Requires:** Admin role

**Response:** `200 OK`
```json
{
  "totalOpportunities": 450,
  "totalStudents": 2500,
  "applicationsToday": 145,
  "activeOpportunities": 320,
  "applicationTrend": [
    {
      "date": "2024-01-15",
      "count": 120
    }
  ],
  "typeDistribution": {
    "INTERNSHIP": 200,
    "HACKATHON": 100,
    "SCHOLARSHIP": 150
  }
}
```

### Get All Users

```http
GET /api/admin/users?branch=CSE&year=3&limit=20
Authorization: Bearer <jwt_token>
```

**Requires:** Admin role

**Response:** `200 OK`
```json
{
  "users": [
    {
      "id": "user-id",
      "email": "student@example.com",
      "name": "John Doe",
      "branch": "CSE",
      "graduationYear": 2024,
      "isActive": true
    }
  ],
  "total": 450,
  "limit": 20,
  "offset": 0
}
```

### Create Opportunity

```http
POST /api/admin/opportunities
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Summer Intern - Web Dev",
  "description": "Full description...",
  "companyName": "TechCorp",
  "type": "INTERNSHIP",
  "deadline": "2024-02-01T23:59:59Z",
  "location": "Bangalore",
  "mode": "HYBRID",
  "stipend": "₹50,000/month",
  "requiredSkills": ["React", "Node.js"],
  "minCgpa": 3.0,
  "allowedBranches": ["CSE", "IT"],
  "allowedYears": [3, 4],
  "tags": ["frontend", "startup"]
}
```

**Requires:** Admin role

**Response:** `201 Created`
```json
{
  "id": "opp-id",
  "message": "Opportunity created successfully"
}
```

---

## 🤖 AI Service Endpoints

### Get Recommendations

```http
POST /ai/recommend
Content-Type: application/json
X-Internal-Key: <AI_API_KEY>

{
  "studentId": "user-id"
}
```

**Response:** `200 OK`
```json
{
  "recommendations": [
    {
      "opportunityId": "opp-id",
      "title": "Summer Intern - Web Dev",
      "score": 0.87,
      "reason": "Matches your Python and web development skills",
      "matchTags": ["frontend", "startup"]
    }
  ],
  "generatedAt": "2024-01-20T10:30:00Z"
}
```

### Analyze Resume

```http
POST /ai/resume/analyze
Content-Type: multipart/form-data
X-Internal-Key: <AI_API_KEY>

file: <PDF file>
```

**Response:** `200 OK`
```json
{
  "atsScore": 85,
  "grade": "A",
  "extractedSkills": ["Python", "React", "SQL"],
  "missingSkills": ["Docker", "Kubernetes"],
  "suggestions": [
    "Add quantifiable achievements to your experience",
    "Include more technical skills"
  ],
  "recommendedOpportunities": ["opp-id-1", "opp-id-2"]
}
```

### Check Eligibility

```http
POST /ai/eligibility/check
Content-Type: application/json
X-Internal-Key: <AI_API_KEY>

{
  "studentId": "user-id",
  "opportunityId": "opp-id"
}
```

**Response:** `200 OK`
```json
{
  "eligible": true,
  "score": 0.95,
  "checks": [
    {
      "field": "cgpa",
      "passed": true,
      "message": "Your CGPA (3.8) meets the requirement (3.0)"
    },
    {
      "field": "branch",
      "passed": true,
      "message": "CSE is in allowed branches"
    }
  ],
  "summary": "You meet all eligibility criteria"
}
```

---

## Error Responses

All endpoints return standard error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400,
  "timestamp": "2024-01-20T10:30:00Z"
}
```

### Common Status Codes

- `200 OK` — Success
- `201 Created` — Resource created
- `400 Bad Request` — Invalid request
- `401 Unauthorized` — Missing or invalid token
- `403 Forbidden` — Insufficient permissions
- `404 Not Found` — Resource not found
- `409 Conflict` — Resource already exists
- `500 Internal Server Error` — Server error

---

## Rate Limiting

All endpoints are rate-limited:

- **Standard:** 100 requests per minute per user
- **AI Endpoints:** 10 requests per minute per user

Rate limit info is returned in response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705760400
```

---

**Last Updated:** 2024-01-20  
**API Version:** 1.0.0
