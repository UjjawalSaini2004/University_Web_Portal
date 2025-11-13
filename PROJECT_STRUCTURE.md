# University Management Portal - Project Structure

## Technology Stack
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, Vite, TailwindCSS
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt, helmet, cors
- **Email**: Nodemailer
- **File Upload**: Multer
- **Logging**: Winston, Morgan

## Project Directory Structure

```
university-management-portal/
│
├── backend/
│   ├── config/
│   │   ├── db.js                    # Database connection
│   │   ├── cloudinary.js            # File upload config
│   │   └── email.js                 # Email configuration
│   │
│   ├── models/
│   │   ├── User.js                  # User model (Student/Faculty/Admin)
│   │   ├── Department.js            # Department model
│   │   ├── Course.js                # Course model
│   │   ├── Enrollment.js            # Course enrollment model
│   │   ├── Attendance.js            # Attendance model
│   │   ├── Timetable.js             # Timetable model
│   │   ├── StudyMaterial.js         # Study materials model
│   │   ├── Grade.js                 # Grades/marks model
│   │   ├── Notification.js          # Notifications model
│   │   └── CertificateRequest.js    # Certificate requests model
│   │
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── userController.js        # User management
│   │   ├── studentController.js     # Student operations
│   │   ├── facultyController.js     # Faculty operations
│   │   ├── adminController.js       # Admin operations
│   │   ├── courseController.js      # Course management
│   │   ├── attendanceController.js  # Attendance management
│   │   ├── gradeController.js       # Grade management
│   │   └── notificationController.js# Notification management
│   │
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   ├── roleCheck.js             # Role-based access control
│   │   ├── errorHandler.js          # Global error handler
│   │   ├── validator.js             # Request validation
│   │   └── upload.js                # File upload middleware
│   │
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── studentRoutes.js         # Student endpoints
│   │   ├── facultyRoutes.js         # Faculty endpoints
│   │   ├── adminRoutes.js           # Admin endpoints
│   │   └── commonRoutes.js          # Common endpoints
│   │
│   ├── services/
│   │   ├── emailService.js          # Email sending service
│   │   ├── tokenService.js          # Token generation/validation
│   │   └── fileService.js           # File handling service
│   │
│   ├── utils/
│   │   ├── logger.js                # Winston logger
│   │   ├── constants.js             # App constants
│   │   └── helpers.js               # Helper functions
│   │
│   ├── scripts/
│   │   └── seedData.js              # Database seeding script
│   │
│   ├── uploads/                     # Uploaded files (gitignored)
│   ├── logs/                        # Application logs
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Example env file
│   ├── server.js                    # Entry point
│   ├── package.json                 # Dependencies
│   └── README.md                    # Backend documentation
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── assets/                  # Images, fonts, etc.
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── Toast.jsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Signup.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── ResetPassword.jsx
│   │   │   │
│   │   │   ├── student/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── Courses.jsx
│   │   │   │   ├── CourseRegistration.jsx
│   │   │   │   ├── Attendance.jsx
│   │   │   │   ├── Grades.jsx
│   │   │   │   ├── Timetable.jsx
│   │   │   │   ├── StudyMaterials.jsx
│   │   │   │   ├── Certificates.jsx
│   │   │   │   └── Notifications.jsx
│   │   │   │
│   │   │   ├── faculty/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── MyCourses.jsx
│   │   │   │   ├── MarkAttendance.jsx
│   │   │   │   ├── UploadMaterials.jsx
│   │   │   │   ├── ManageGrades.jsx
│   │   │   │   ├── StudentList.jsx
│   │   │   │   └── Announcements.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ManageStudents.jsx
│   │   │       ├── ManageFaculty.jsx
│   │   │       ├── ManageDepartments.jsx
│   │   │       ├── ManageCourses.jsx
│   │   │       ├── ManageTimetable.jsx
│   │   │       ├── CertificateRequests.jsx
│   │   │       └── Analytics.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Authentication state
│   │   │   └── AppContext.jsx       # Global app state
│   │   │
│   │   ├── services/
│   │   │   ├── api.js               # Axios configuration
│   │   │   ├── authService.js       # Auth API calls
│   │   │   ├── studentService.js    # Student API calls
│   │   │   ├── facultyService.js    # Faculty API calls
│   │   │   └── adminService.js      # Admin API calls
│   │   │
│   │   ├── utils/
│   │   │   ├── constants.js         # Constants
│   │   │   ├── helpers.js           # Helper functions
│   │   │   └── validators.js        # Form validators
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js           # Auth hook
│   │   │   └── useToast.js          # Toast notifications hook
│   │   │
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   │
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Example env file
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # TailwindCSS config
│   ├── package.json                 # Dependencies
│   └── README.md                    # Frontend documentation
│
├── documentation/
│   ├── API_DOCUMENTATION.md         # Complete API docs
│   ├── DATABASE_SCHEMA.md           # Database design
│   ├── ER_DIAGRAM.png               # Entity relationship diagram
│   └── DEPLOYMENT_GUIDE.md          # Deployment instructions
│
└── README.md                        # Main project documentation
```

## Key Features Implementation

### Backend Architecture
- **MVC Pattern**: Separation of concerns with Models, Controllers, and Routes
- **Middleware Chain**: Authentication → Role Check → Controller → Response
- **Service Layer**: Business logic abstraction
- **Error Handling**: Centralized error handling middleware
- **Logging**: Request/Response logging with Winston

### Frontend Architecture
- **Component-Based**: Reusable React components
- **Context API**: Global state management
- **Protected Routes**: Role-based route access
- **API Services**: Centralized API call management
- **Responsive Design**: Mobile-first approach with TailwindCSS

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies for token storage
- CORS protection
- Helmet for security headers
- Input validation and sanitization
- Rate limiting on sensitive endpoints

### Database Design
- **MongoDB Collections**: Users, Departments, Courses, Enrollments, Attendance, Timetables, StudyMaterials, Grades, Notifications, CertificateRequests
- **Indexes**: Optimized queries with proper indexing
- **Relationships**: Referenced and embedded documents
- **Validation**: Mongoose schema validation
