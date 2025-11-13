# University Management Portal - API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "role": "student|faculty|admin",
  "firstName": "string",
  "lastName": "string",
  "phoneNumber": "string",
  "dateOfBirth": "date",
  "gender": "male|female|other",
  // Student specific
  "department": "objectId",
  "semester": 1-8,
  "admissionYear": "number",
  // Faculty specific
  "designation": "string",
  "qualification": "string",
  "joiningDate": "date"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token"
  }
}
```

---

### POST /auth/login
Login user

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "objectId",
      "email": "string",
      "role": "string",
      "firstName": "string",
      "lastName": "string",
      "fullName": "string"
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

---

### GET /auth/me
Get current user profile

**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* full user object */ }
  }
}
```

---

### POST /auth/forgot-password
Request password reset

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

---

### POST /auth/reset-password/:token
Reset password with token

**Request Body:**
```json
{
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## Student Endpoints

### GET /students/dashboard
Get student dashboard data

**Auth Required:** Yes (Student)

**Response:**
```json
{
  "success": true,
  "data": {
    "enrolledCoursesCount": 5,
    "overallAttendance": 85.5,
    "cgpa": 8.5,
    "recentGrades": [],
    "unreadNotificationsCount": 3,
    "pendingCertificatesCount": 1
  }
}
```

---

### GET /students/courses
Get enrolled courses

**Auth Required:** Yes (Student)

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "enrollments": [],
    "pagination": {
      "total": 10,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

---

### POST /students/courses/register
Register for a course

**Auth Required:** Yes (Student)

**Request Body:**
```json
{
  "courseId": "objectId"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully enrolled in course",
  "data": {
    "enrollment": { /* enrollment object */ }
  }
}
```

---

### GET /students/attendance
Get attendance records

**Auth Required:** Yes (Student)

**Query Parameters:**
- `courseId`: objectId (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "attendanceRecords": [],
    "summary": [
      {
        "course": {},
        "total": 20,
        "present": 18,
        "percentage": 90
      }
    ]
  }
}
```

---

### GET /students/grades
Get grades

**Auth Required:** Yes (Student)

**Response:**
```json
{
  "success": true,
  "data": {
    "grades": [],
    "cgpa": 8.5
  }
}
```

---

### GET /students/timetable
Get timetable

**Auth Required:** Yes (Student)

**Response:**
```json
{
  "success": true,
  "data": {
    "timetable": { /* timetable object */ }
  }
}
```

---

### GET /students/study-materials
Get study materials

**Auth Required:** Yes (Student)

**Query Parameters:**
- `courseId`: objectId (optional)
- `category`: string (optional)
- `page`: number
- `limit`: number

**Response:**
```json
{
  "success": true,
  "data": {
    "materials": [],
    "pagination": {}
  }
}
```

---

### POST /students/certificates/request
Request certificate

**Auth Required:** Yes (Student)

**Request Body:**
```json
{
  "certificateType": "bonafide|character|course_completion|transcript",
  "purpose": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Certificate request submitted successfully",
  "data": {
    "certificateRequest": {}
  }
}
```

---

## Faculty Endpoints

### GET /faculty/dashboard
Get faculty dashboard data

**Auth Required:** Yes (Faculty)

**Response:**
```json
{
  "success": true,
  "data": {
    "coursesCount": 3,
    "totalStudents": 150,
    "recentMaterials": []
  }
}
```

---

### GET /faculty/courses
Get assigned courses

**Auth Required:** Yes (Faculty)

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": []
  }
}
```

---

### GET /faculty/courses/:courseId/students
Get students enrolled in a course

**Auth Required:** Yes (Faculty)

**Response:**
```json
{
  "success": true,
  "data": {
    "students": []
  }
}
```

---

### POST /faculty/attendance/mark
Mark attendance

**Auth Required:** Yes (Faculty)

**Request Body:**
```json
{
  "course": "objectId",
  "date": "date",
  "attendance": [
    {
      "student": "objectId",
      "status": "present|absent|late|excused",
      "remarks": "string"
    }
  ],
  "classType": "lecture|practical|tutorial"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance marked successfully"
}
```

---

### POST /faculty/study-materials/upload
Upload study material

**Auth Required:** Yes (Faculty)

**Content-Type:** multipart/form-data

**Form Data:**
- `file`: File
- `title`: string
- `description`: string
- `course`: objectId
- `category`: string
- `tags`: string (comma-separated)

**Response:**
```json
{
  "success": true,
  "message": "Study material uploaded successfully",
  "data": {
    "material": {}
  }
}
```

---

### POST /faculty/grades/upload
Upload grades

**Auth Required:** Yes (Faculty)

**Request Body:**
```json
{
  "student": "objectId",
  "course": "objectId",
  "semester": 1-8,
  "academicYear": "string",
  "assessments": {
    "internal1": { "marks": 18, "maxMarks": 20 },
    "internal2": { "marks": 19, "maxMarks": 20 },
    "assignments": { "marks": 9, "maxMarks": 10 },
    "endSemester": { "marks": 45, "maxMarks": 50 }
  },
  "remarks": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Grades uploaded successfully",
  "data": {
    "grade": {}
  }
}
```

---

### PUT /faculty/grades/:id/publish
Publish grade (make visible to student)

**Auth Required:** Yes (Faculty)

**Response:**
```json
{
  "success": true,
  "message": "Grade published successfully",
  "data": {
    "grade": {}
  }
}
```

---

### POST /faculty/announcements
Send announcement

**Auth Required:** Yes (Faculty)

**Request Body:**
```json
{
  "title": "string",
  "message": "string",
  "courseId": "objectId",
  "priority": "low|medium|high"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Announcement sent successfully",
  "data": {
    "notification": {}
  }
}
```

---

## Admin Endpoints

### GET /admin/dashboard
Get admin dashboard data

**Auth Required:** Yes (Admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 500,
    "totalFaculty": 50,
    "totalDepartments": 10,
    "totalCourses": 100,
    "pendingCertificates": 5,
    "recentEnrollments": [],
    "departmentStats": []
  }
}
```

---

### GET /admin/students
Get all students

**Auth Required:** Yes (Admin)

**Query Parameters:**
- `page`: number
- `limit`: number
- `department`: objectId
- `semester`: number
- `search`: string

**Response:**
```json
{
  "success": true,
  "data": {
    "students": [],
    "pagination": {}
  }
}
```

---

### POST /admin/students
Add new student

**Auth Required:** Yes (Admin)

**Request Body:** (Same as registration)

**Response:**
```json
{
  "success": true,
  "message": "Student added successfully",
  "data": {
    "student": {}
  }
}
```

---

### PUT /admin/students/:id
Update student

**Auth Required:** Yes (Admin)

**Request Body:** (Fields to update)

**Response:**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "student": {}
  }
}
```

---

### DELETE /admin/students/:id
Deactivate student

**Auth Required:** Yes (Admin)

**Response:**
```json
{
  "success": true,
  "message": "Student deactivated successfully"
}
```

---

### GET /admin/faculty
Get all faculty

**Auth Required:** Yes (Admin)

**Query Parameters:** (Similar to students)

**Response:** (Similar to students)

---

### POST /admin/courses
Create course

**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "code": "string",
  "name": "string",
  "description": "string",
  "department": "objectId",
  "credits": 1-10,
  "semester": 1-8,
  "type": "theory|practical|theory_practical",
  "maxStudents": 60,
  "academicYear": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "course": {}
  }
}
```

---

### PUT /admin/courses/:courseId/assign-faculty
Assign faculty to course

**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "facultyId": "objectId"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Faculty assigned to course successfully",
  "data": {
    "course": {}
  }
}
```

---

### POST /admin/timetables
Create/Update timetable

**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "department": "objectId",
  "semester": 1-8,
  "academicYear": "string",
  "schedule": [
    {
      "day": "Monday",
      "slots": [
        {
          "startTime": "09:00",
          "endTime": "10:00",
          "course": "objectId",
          "faculty": "objectId",
          "room": "A-301",
          "type": "lecture"
        }
      ]
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Timetable saved successfully",
  "data": {
    "timetable": {}
  }
}
```

---

### PUT /admin/certificates/:id/approve
Approve certificate request

**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "certificateNumber": "string",
  "validUntil": "date",
  "remarks": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Certificate approved successfully",
  "data": {
    "request": {}
  }
}
```

---

### PUT /admin/certificates/:id/reject
Reject certificate request

**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "rejectedReason": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Certificate request rejected",
  "data": {
    "request": {}
  }
}
```

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [ /* validation errors if any */ ]
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limiting

- Window: 15 minutes
- Max Requests: 100 per IP
- Exceeded: Returns 429 (Too Many Requests)
