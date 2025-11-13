# University Management Portal - Backend

RESTful API backend for University Management Portal supporting role-based operations for students, faculty, and administrators.

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.18
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Email Service:** Nodemailer
- **File Upload:** Multer
- **Logging:** Winston & Morgan
- **Security:** Helmet, CORS, express-rate-limit
- **Validation:** express-validator

---

## Features

### Authentication System
- User registration with role-based fields (student/faculty/admin)
- JWT-based authentication with refresh tokens
- Email verification workflow
- Password reset via email with token expiry
- Secure password hashing with bcrypt

### Student Operations
- Dashboard with enrollment stats, attendance, CGPA
- Course registration and management
- View attendance records and percentage
- Access grades and semester results
- Download study materials
- Request certificates (bonafide, character, transcript)
- Receive notifications

### Faculty Operations
- Dashboard with course and student statistics
- Manage assigned courses
- Mark attendance (bulk/individual)
- Upload and publish grades
- Upload study materials (PDFs, docs, videos)
- Send announcements to students

### Admin Operations
- Complete system dashboard with analytics
- User management (CRUD for students, faculty)
- Department and course management
- Timetable creation and updates
- Certificate request approval workflow
- Assign faculty to courses
- System-wide reporting

---

## Project Structure

```
backend/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── email.js              # Nodemailer configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── studentController.js  # Student operations
│   ├── facultyController.js  # Faculty operations
│   └── adminController.js    # Admin operations
├── middleware/
│   ├── auth.js              # JWT verification
│   ├── roleCheck.js         # Role-based access control
│   ├── errorHandler.js      # Global error handling
│   ├── validator.js         # Request validation
│   └── upload.js            # File upload handling
├── models/
│   ├── User.js              # User schema (multi-role)
│   ├── Department.js        # Department schema
│   ├── Course.js            # Course schema
│   ├── Enrollment.js        # Enrollment tracking
│   ├── Attendance.js        # Attendance records
│   ├── Grade.js             # Grade management
│   ├── Timetable.js         # Class schedules
│   ├── StudyMaterial.js     # Study resources
│   ├── Notification.js      # User notifications
│   └── CertificateRequest.js # Certificate workflow
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── studentRoutes.js     # Student endpoints
│   ├── facultyRoutes.js     # Faculty endpoints
│   └── adminRoutes.js       # Admin endpoints
├── services/
│   ├── tokenService.js      # JWT operations
│   ├── emailService.js      # Email templates
│   └── fileService.js       # File operations
├── utils/
│   ├── logger.js            # Winston logger
│   ├── constants.js         # App constants
│   └── helpers.js           # Helper functions
├── scripts/
│   └── seedData.js          # Database seeding
├── uploads/                  # File upload directory
├── logs/                     # Application logs
├── .env.example             # Environment template
├── .gitignore
├── package.json
└── server.js                # Entry point
```

---

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Gmail account (for email service)

---

## Installation

### 1. Clone Repository
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env`:
```bash
copy .env.example .env  # Windows
```

Edit `.env` with your configuration:
```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/university_portal
# Or MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/university_portal

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_key
JWT_REFRESH_EXPIRE=30d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=University Portal <noreply@university.edu>

# Frontend URL (for email links)
CLIENT_URL=http://localhost:5173
```

**To generate secure JWT secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**To get Gmail App Password:**
1. Enable 2-factor authentication on your Gmail
2. Go to Google Account → Security → App passwords
3. Generate new app password for "Mail"
4. Use this password in `EMAIL_PASSWORD`

### 4. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Server from mongodb.com
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at mongodb.com/cloud/atlas
2. Create cluster and database user
3. Whitelist your IP (0.0.0.0/0 for development)
4. Copy connection string to `MONGO_URI`

---

## Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server runs at: `http://localhost:5000`

---

## Database Seeding

Populate database with sample data (departments, users, courses):

```bash
npm run seed
```

This creates:
- 3 Departments (Computer Science, Electronics, Mechanical)
- 1 Admin user
- 3 Faculty members
- 5 Students
- 5 Courses
- Sample enrollments, attendance, grades

### Demo Credentials

**Admin:**
- Email: `admin@university.edu`
- Password: `Admin@123`

**Faculty:**
- Email: `john.doe@university.edu`
- Password: `Faculty@123`

**Student:**
- Email: `alice.kumar@student.edu`
- Password: `Student@123`

---

## API Testing

### Using cURL

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@university.edu\",\"password\":\"Admin@123\"}"
```

**Get Current User (with token):**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Import collection from `docs/postman_collection.json` (if available)
2. Set base URL: `http://localhost:5000/api`
3. Login to get token
4. Add token to Authorization header for protected routes

---

## API Documentation

Full API documentation available at:
- **File:** `../documentation/API_DOCUMENTATION.md`
- **Endpoint:** `http://localhost:5000/api/docs` (if implemented)

### Key Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

**Student:**
- `GET /api/students/dashboard` - Dashboard data
- `GET /api/students/courses` - Enrolled courses
- `POST /api/students/courses/register` - Register for course
- `GET /api/students/attendance` - Attendance records
- `GET /api/students/grades` - Grade history

**Faculty:**
- `GET /api/faculty/dashboard` - Dashboard data
- `GET /api/faculty/courses` - Assigned courses
- `POST /api/faculty/attendance/mark` - Mark attendance
- `POST /api/faculty/study-materials/upload` - Upload material
- `POST /api/faculty/grades/upload` - Upload grades

**Admin:**
- `GET /api/admin/dashboard` - System statistics
- `GET /api/admin/students` - List all students
- `POST /api/admin/courses` - Create course
- `PUT /api/admin/courses/:id/assign-faculty` - Assign faculty
- `PUT /api/admin/certificates/:id/approve` - Approve certificate

---

## Security Features

### Implemented Security Measures

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - Password strength validation
   - Password reset with time-limited tokens

2. **JWT Authentication**
   - Access tokens (7 days)
   - Refresh tokens (30 days)
   - Token validation on every protected route

3. **HTTP Security Headers** (Helmet)
   - XSS protection
   - Content Security Policy
   - HTTP Strict Transport Security

4. **Rate Limiting**
   - 100 requests per 15 minutes per IP
   - Prevents brute force attacks

5. **CORS Configuration**
   - Restricted origins
   - Credentials support

6. **Input Validation**
   - express-validator on all inputs
   - Sanitization of user data
   - File type and size validation

7. **Error Handling**
   - No sensitive data in error messages
   - Centralized error handling
   - Environment-aware responses

---

## File Upload Configuration

Supported file types:
- **Documents:** PDF, DOC, DOCX, PPT, PPTX
- **Images:** JPG, JPEG, PNG, GIF
- **Videos:** MP4, AVI, MOV

Size limits:
- Documents: 10 MB
- Images: 5 MB
- Videos: 50 MB

Upload directory: `uploads/`

---

## Logging

### Log Levels

- **error:** System errors
- **warn:** Warnings
- **info:** General information
- **http:** HTTP requests (Morgan)
- **debug:** Debug information

### Log Files

- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs
- Console output in development

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## Testing

### Manual Testing

Test all endpoints with demo credentials:
1. Login as each role (admin, faculty, student)
2. Test dashboard APIs
3. Test CRUD operations
4. Test file uploads
5. Test email notifications

### Automated Testing (Setup Required)

```bash
npm test
```

---

## Database Management

### Backup Database

```bash
# Local MongoDB
mongodump --db university_portal --out ./backup

# MongoDB Atlas
mongodump --uri="mongodb+srv://..." --out ./backup
```

### Restore Database

```bash
mongorestore --db university_portal ./backup/university_portal
```

### Clear Database

```bash
# Connect to MongoDB
mongo university_portal

# Drop all collections
db.dropDatabase()

# Re-seed
npm run seed
```

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` or `production` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection | `mongodb://localhost:27017/dbname` |
| `JWT_SECRET` | JWT signing secret | 32+ character string |
| `JWT_EXPIRE` | JWT expiry time | `7d` |
| `EMAIL_HOST` | SMTP server | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | Email username | `your@email.com` |
| `EMAIL_PASSWORD` | Email password | App password |
| `CLIENT_URL` | Frontend URL | `http://localhost:5173` |

---

## Common Issues and Solutions

### 1. MongoDB Connection Failed

**Error:** `MongoNetworkError: failed to connect`

**Solutions:**
- Check if MongoDB is running: `mongod`
- Verify `MONGO_URI` in `.env`
- Check network/firewall settings
- For Atlas: whitelist IP address

### 2. Email Not Sending

**Error:** `Invalid login: 535 Authentication failed`

**Solutions:**
- Enable 2FA on Gmail
- Generate App Password (not regular password)
- Check `EMAIL_USER` and `EMAIL_PASSWORD`
- Verify SMTP settings

### 3. JWT Authentication Failed

**Error:** `401 Unauthorized`

**Solutions:**
- Check token format: `Bearer <token>`
- Verify `JWT_SECRET` matches
- Check token expiry
- Login again to get fresh token

### 4. File Upload Failed

**Error:** `MulterError: File too large`

**Solutions:**
- Check file size limits in `middleware/upload.js`
- Verify file type is supported
- Ensure `uploads/` directory exists and is writable

### 5. Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solutions:**
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change port in .env
PORT=5001
```

---

## Performance Optimization

### Database Indexes

Already configured in models:
- User email (unique)
- Enrollment compound index
- Attendance compound index
- Query-specific indexes

### Recommended Practices

1. Use pagination for large datasets
2. Populate only necessary fields
3. Use lean queries when virtuals not needed
4. Enable MongoDB query caching
5. Implement Redis for session storage (advanced)

---

## Deployment

See `../documentation/DEPLOYMENT_GUIDE.md` for detailed deployment instructions to:
- Render
- Heroku
- Railway
- AWS/GCP/Azure

---

## Contributing

### Code Style

- Use ES6+ features
- Follow ESLint rules
- Use async/await (not callbacks)
- Write descriptive variable names
- Comment complex logic

### Commit Messages

```
feat: Add student dashboard API
fix: Resolve email sending issue
docs: Update README with setup instructions
refactor: Optimize grade calculation
```

---

## License

This project is developed for educational purposes as part of B.Tech Major Project.

---

## Support

For issues or questions:
1. Check `DEPLOYMENT_GUIDE.md`
2. Check `API_DOCUMENTATION.md`
3. Review error logs in `logs/`
4. Contact project maintainers

---

## Roadmap

Future enhancements:
- [ ] Real-time notifications (WebSockets/Socket.io)
- [ ] Advanced analytics dashboard
- [ ] Bulk operations (CSV import/export)
- [ ] Mobile API optimization
- [ ] GraphQL API option
- [ ] Advanced search and filters
- [ ] Automated testing suite
- [ ] Performance monitoring
- [ ] Multi-language support
- [ ] File storage in cloud (S3/Cloudinary)

---

## Credits

- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- Nodemailer - Email service
- Winston - Logging
- Multer - File upload

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Production Ready
