# University Management Portal - Database Schema

## Database: MongoDB

---

## Collections

### 1. Users Collection

**Collection Name:** `users`

**Purpose:** Stores all users (students, faculty, admin) with role-based fields

**Schema:**
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (required, hashed),
  role: String (enum: ['student', 'faculty', 'admin'], required),
  firstName: String (required),
  lastName: String (required),
  phoneNumber: String,
  dateOfBirth: Date,
  gender: String (enum: ['male', 'female', 'other']),
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  
  // Student specific fields
  studentProfile: {
    enrollmentNumber: String (unique for students),
    department: ObjectId (ref: 'Department'),
    semester: Number (1-8),
    admissionYear: Number,
    currentYear: Number,
    bloodGroup: String
  },
  
  // Faculty specific fields
  facultyProfile: {
    employeeId: String (unique for faculty),
    department: ObjectId (ref: 'Department'),
    designation: String,
    qualification: String,
    specialization: String,
    joiningDate: Date,
    experience: Number
  },
  
  // Admin specific fields
  adminProfile: {
    employeeId: String (unique for admins),
    designation: String,
    department: String
  },
  
  isActive: Boolean (default: true),
  isEmailVerified: Boolean (default: false),
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  profilePicture: String,
  lastLogin: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email` (unique)
- `studentProfile.enrollmentNumber` (unique, sparse)
- `facultyProfile.employeeId` (unique, sparse)
- `role`
- `isActive`

**Virtual Fields:**
- `fullName`: `firstName + lastName`

---

### 2. Departments Collection

**Collection Name:** `departments`

**Purpose:** Stores academic department information

**Schema:**
```javascript
{
  _id: ObjectId,
  code: String (unique, required),
  name: String (required),
  description: String,
  hodName: String,
  hodEmail: String,
  hodPhone: String,
  establishedYear: Number,
  totalSeats: Number,
  building: String,
  floor: String,
  isActive: Boolean (default: true),
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `code` (unique)
- `isActive`

**Virtual Fields:**
- `studentCount`: Count of students in department
- `facultyCount`: Count of faculty in department
- `courseCount`: Count of courses in department

---

### 3. Courses Collection

**Collection Name:** `courses`

**Purpose:** Stores course information

**Schema:**
```javascript
{
  _id: ObjectId,
  code: String (unique, required),
  name: String (required),
  description: String,
  department: ObjectId (ref: 'Department', required),
  faculty: ObjectId (ref: 'User'),
  credits: Number (required, 1-10),
  semester: Number (required, 1-8),
  type: String (enum: ['theory', 'practical', 'theory_practical'], required),
  maxStudents: Number (default: 60),
  enrolledStudents: Number (default: 0),
  academicYear: String,
  syllabus: String,
  prerequisites: [String],
  learningOutcomes: [String],
  isActive: Boolean (default: true),
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `code` (unique)
- `department`
- `faculty`
- `semester`
- `isActive`

---

### 4. Enrollments Collection

**Collection Name:** `enrollments`

**Purpose:** Tracks student enrollments in courses

**Schema:**
```javascript
{
  _id: ObjectId,
  student: ObjectId (ref: 'User', required),
  course: ObjectId (ref: 'Course', required),
  semester: Number (required),
  academicYear: String (required),
  enrollmentDate: Date (default: now),
  status: String (enum: ['enrolled', 'completed', 'dropped', 'failed'], default: 'enrolled'),
  finalGrade: String,
  finalGPA: Number,
  completionDate: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `student`
- `course`
- `{student: 1, course: 1, academicYear: 1}` (compound, unique)
- `status`

---

### 5. Attendance Collection

**Collection Name:** `attendances`

**Purpose:** Tracks daily attendance records

**Schema:**
```javascript
{
  _id: ObjectId,
  student: ObjectId (ref: 'User', required),
  course: ObjectId (ref: 'Course', required),
  date: Date (required),
  status: String (enum: ['present', 'absent', 'late', 'excused'], required),
  markedBy: ObjectId (ref: 'User', required),
  markedAt: Date (default: now),
  classType: String (enum: ['lecture', 'practical', 'tutorial']),
  remarks: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `student`
- `course`
- `date`
- `{student: 1, course: 1, date: 1}` (compound, unique)

---

### 6. Grades Collection

**Collection Name:** `grades`

**Purpose:** Stores student grades and marks

**Schema:**
```javascript
{
  _id: ObjectId,
  student: ObjectId (ref: 'User', required),
  course: ObjectId (ref: 'Course', required),
  semester: Number (required),
  academicYear: String (required),
  
  assessments: {
    internal1: {
      marks: Number,
      maxMarks: Number,
      date: Date
    },
    internal2: {
      marks: Number,
      maxMarks: Number,
      date: Date
    },
    assignments: {
      marks: Number,
      maxMarks: Number
    },
    endSemester: {
      marks: Number,
      maxMarks: Number,
      date: Date
    }
  },
  
  totalMarks: Number (calculated),
  maxTotalMarks: Number (calculated),
  percentage: Number (calculated),
  grade: String (calculated: A+, A, B+, B, C, D, F),
  gradePoint: Number (calculated: 0-10),
  
  isPublished: Boolean (default: false),
  publishedAt: Date,
  remarks: String,
  uploadedBy: ObjectId (ref: 'User'),
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `student`
- `course`
- `{student: 1, course: 1, academicYear: 1}` (compound, unique)
- `isPublished`

**Pre-save Middleware:**
- Auto-calculates `totalMarks`, `percentage`, `grade`, `gradePoint`

---

### 7. Timetables Collection

**Collection Name:** `timetables`

**Purpose:** Stores class schedules

**Schema:**
```javascript
{
  _id: ObjectId,
  department: ObjectId (ref: 'Department', required),
  semester: Number (required),
  academicYear: String (required),
  effectiveFrom: Date,
  effectiveTo: Date,
  
  schedule: [
    {
      day: String (enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required),
      slots: [
        {
          startTime: String (required),
          endTime: String (required),
          course: ObjectId (ref: 'Course'),
          faculty: ObjectId (ref: 'User'),
          room: String,
          type: String (enum: ['lecture', 'practical', 'tutorial']),
          isBreak: Boolean (default: false)
        }
      ]
    }
  ],
  
  isActive: Boolean (default: true),
  createdBy: ObjectId (ref: 'User'),
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `department`
- `semester`
- `academicYear`
- `{department: 1, semester: 1, academicYear: 1, isActive: 1}` (compound)

---

### 8. Study Materials Collection

**Collection Name:** `studymaterials`

**Purpose:** Stores uploaded study materials and resources

**Schema:**
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  course: ObjectId (ref: 'Course', required),
  uploadedBy: ObjectId (ref: 'User', required),
  
  fileDetails: {
    filename: String (required),
    originalName: String (required),
    path: String (required),
    mimetype: String,
    size: Number
  },
  
  category: String (enum: ['notes', 'assignment', 'question_paper', 'reference_book', 'video', 'other'], required),
  tags: [String],
  semester: Number,
  downloadCount: Number (default: 0),
  isActive: Boolean (default: true),
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `course`
- `uploadedBy`
- `category`
- `isActive`

---

### 9. Notifications Collection

**Collection Name:** `notifications`

**Purpose:** Stores system notifications for users

**Schema:**
```javascript
{
  _id: ObjectId,
  recipient: ObjectId (ref: 'User', required),
  sender: ObjectId (ref: 'User'),
  type: String (enum: ['announcement', 'grade_published', 'attendance_alert', 'certificate_update', 'course_update', 'system'], required),
  title: String (required),
  message: String (required),
  relatedEntity: {
    entityType: String (enum: ['course', 'grade', 'attendance', 'certificate']),
    entityId: ObjectId
  },
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  isRead: Boolean (default: false),
  readAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `recipient`
- `isRead`
- `type`
- `createdAt` (descending)

---

### 10. Certificate Requests Collection

**Collection Name:** `certificaterequests`

**Purpose:** Manages certificate request workflow

**Schema:**
```javascript
{
  _id: ObjectId,
  student: ObjectId (ref: 'User', required),
  certificateType: String (enum: ['bonafide', 'character', 'course_completion', 'transcript'], required),
  purpose: String (required),
  
  status: String (enum: ['pending', 'approved', 'rejected', 'issued'], default: 'pending'),
  requestDate: Date (default: now),
  
  // Approval details
  approvedBy: ObjectId (ref: 'User'),
  approvedDate: Date,
  rejectedReason: String,
  
  // Certificate details
  certificateNumber: String,
  issueDate: Date,
  validUntil: Date,
  
  remarks: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `student`
- `status`
- `certificateType`
- `requestDate` (descending)

---

## Relationships

### One-to-Many

1. **Department → Users (Students)**
   - `departments._id` → `users.studentProfile.department`
   
2. **Department → Users (Faculty)**
   - `departments._id` → `users.facultyProfile.department`
   
3. **Department → Courses**
   - `departments._id` → `courses.department`
   
4. **User (Faculty) → Courses**
   - `users._id` → `courses.faculty`
   
5. **User (Student) → Enrollments**
   - `users._id` → `enrollments.student`
   
6. **Course → Enrollments**
   - `courses._id` → `enrollments.course`
   
7. **User (Student) → Attendance**
   - `users._id` → `attendances.student`
   
8. **Course → Attendance**
   - `courses._id` → `attendances.course`
   
9. **User (Student) → Grades**
   - `users._id` → `grades.student`
   
10. **Course → Grades**
    - `courses._id` → `grades.course`
    
11. **Course → Study Materials**
    - `courses._id` → `studymaterials.course`
    
12. **User → Notifications**
    - `users._id` → `notifications.recipient`
    
13. **User (Student) → Certificate Requests**
    - `users._id` → `certificaterequests.student`

### Many-to-One

All inverse of the above relationships.

---

## Entity Relationship Diagram

```
┌─────────────┐
│ DEPARTMENTS │
└──────┬──────┘
       │
       │ 1:N
       │
       ├──────────────────┐
       │                  │
       ▼                  ▼
┌─────────┐         ┌──────────┐
│  USERS  │────────▶│ COURSES  │
│         │  1:N    │          │
│ Student │         │          │
│ Faculty │         └────┬─────┘
│  Admin  │              │
└────┬────┘              │
     │                   │
     │ 1:N               │ 1:N
     │                   │
     ▼                   ▼
┌──────────────┐   ┌──────────────┐
│ ENROLLMENTS  │◀──┤              │
└──────┬───────┘   │              │
       │           │              │
       │ 1:N       │              │
       ▼           │              │
┌──────────────┐   │              │
│  ATTENDANCE  │◀──┤              │
└──────────────┘   │              │
                   │              │
┌──────────────┐   │              │
│    GRADES    │◀──┤              │
└──────────────┘   │              │
                   │              │
┌──────────────┐   │              │
│ TIMETABLES   │◀──┤              │
└──────────────┘   │              │
                   │              │
┌──────────────┐   │              │
│STUDY MATERIALS│◀─┤              │
└──────────────┘   │              │
                   │              │
┌──────────────┐   │              │
│NOTIFICATIONS │   │              │
└──────────────┘   │              │
                   │              │
┌──────────────┐   │              │
│ CERTIFICATE  │   │              │
│  REQUESTS    │   │              │
└──────────────┘   └──────────────┘
```

---

## Data Constraints

### Users
- Email must be unique and valid
- Password must be hashed (bcrypt)
- Role-specific profiles validated conditionally
- Students must have enrollment number, semester, department
- Faculty must have employee ID, designation, department

### Courses
- Course code must be unique (e.g., CSE101)
- Credits between 1-10
- Semester between 1-8
- Cannot exceed maxStudents enrollment

### Enrollments
- Student can enroll in course only once per academic year
- Student must belong to course's department
- Student's semester must match course semester

### Attendance
- Cannot mark attendance for future dates
- One attendance record per student per course per day
- Status must be valid enum value

### Grades
- Marks cannot exceed maxMarks
- Grade auto-calculated based on percentage
- Can only publish once

### Timetables
- No slot time conflicts for same department/semester
- Faculty cannot be assigned to overlapping slots
- Room cannot be double-booked

---

## Sample Data Structure

### Sample Student User
```json
{
  "email": "alice.kumar@student.edu",
  "role": "student",
  "firstName": "Alice",
  "lastName": "Kumar",
  "phoneNumber": "9876543210",
  "studentProfile": {
    "enrollmentNumber": "2024CSE001",
    "department": "ObjectId(dept)",
    "semester": 3,
    "admissionYear": 2024
  },
  "isActive": true,
  "isEmailVerified": true
}
```

### Sample Course
```json
{
  "code": "CSE301",
  "name": "Data Structures and Algorithms",
  "department": "ObjectId(dept)",
  "faculty": "ObjectId(faculty)",
  "credits": 4,
  "semester": 3,
  "type": "theory_practical",
  "maxStudents": 60,
  "enrolledStudents": 45
}
```

### Sample Grade
```json
{
  "student": "ObjectId(student)",
  "course": "ObjectId(course)",
  "semester": 3,
  "academicYear": "2024-25",
  "assessments": {
    "internal1": { "marks": 18, "maxMarks": 20 },
    "internal2": { "marks": 19, "maxMarks": 20 },
    "assignments": { "marks": 9, "maxMarks": 10 },
    "endSemester": { "marks": 45, "maxMarks": 50 }
  },
  "totalMarks": 91,
  "maxTotalMarks": 100,
  "percentage": 91,
  "grade": "A+",
  "gradePoint": 10,
  "isPublished": true
}
```

---

## Indexes for Performance

### Critical Indexes
1. Users: `email`, `role`, `studentProfile.enrollmentNumber`
2. Courses: `code`, `department`, `faculty`
3. Enrollments: Compound `{student, course, academicYear}`
4. Attendance: Compound `{student, course, date}`
5. Grades: Compound `{student, course, academicYear}`
6. Notifications: `{recipient, isRead, createdAt}`

### Query Optimization
- Use projection to limit returned fields
- Populate only necessary referenced documents
- Use lean queries when virtuals not needed
- Implement pagination for large datasets
