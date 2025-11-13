# University Management Portal

A comprehensive full-stack web application for managing university operations with role-based access for Students, Faculty, and Administrators.

## 🎯 Project Overview

The University Management Portal is a modern, scalable web application designed to streamline academic administration, student services, and faculty operations. Built with the MERN stack (MongoDB, Express.js, React, Node.js), it provides intuitive dashboards and comprehensive features for all stakeholders.

### Key Features

✅ **Role-Based Authentication** - Secure JWT-based authentication with three distinct user roles  
✅ **Student Portal** - Course registration, attendance tracking, grade viewing, study materials  
✅ **Faculty Portal** - Attendance marking, grade management, resource upload, announcements  
✅ **Admin Portal** - User management, course creation, timetable scheduling, certificate approval  
✅ **Real-Time Dashboard** - Interactive analytics and statistics for all user types  
✅ **Email Notifications** - Automated emails for verification, password reset, grade updates  
✅ **File Management** - Secure upload and download of study materials  
✅ **Certificate Workflow** - Request, approval, and issuance system  

---

## 📁 Project Structure

```
B.Tech Major Project/
├── backend/                 # Node.js + Express API
│   ├── config/             # Database and email config
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth, validation, error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── services/           # Reusable services
│   ├── utils/              # Helper functions
│   ├── scripts/            # Database seeding
│   ├── uploads/            # File storage
│   ├── logs/               # Application logs
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── README.md
│
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── auth/      # Login page
│   │   │   ├── student/   # Student components
│   │   │   ├── faculty/   # Faculty components
│   │   │   ├── admin/     # Admin components
│   │   │   └── common/    # Shared components
│   │   ├── context/       # React Context (Auth)
│   │   ├── services/      # API integration
│   │   ├── utils/         # Constants and helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
│
└── documentation/          # Project documentation
    ├── API_DOCUMENTATION.md
    ├── DATABASE_SCHEMA.md
    └── DEPLOYMENT_GUIDE.md
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.18
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (jsonwebtoken)
- **Password:** bcryptjs
- **Email:** Nodemailer
- **File Upload:** Multer
- **Logging:** Winston + Morgan
- **Security:** Helmet, CORS, express-rate-limit
- **Validation:** express-validator

### Frontend
- **Library:** React 18.2
- **Build Tool:** Vite 5.0
- **Routing:** React Router 6.20
- **HTTP Client:** Axios 1.6
- **Styling:** TailwindCSS 3.4
- **Charts:** Chart.js 4.4
- **Icons:** React Icons 4.12
- **Notifications:** React Toastify 9.1
- **State:** React Context API

### Database Schema
- **Users** (Students, Faculty, Admin)
- **Departments**
- **Courses**
- **Enrollments**
- **Attendance**
- **Grades**
- **Timetables**
- **Study Materials**
- **Notifications**
- **Certificate Requests**

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- Git

### Installation Steps

#### 1. Clone Repository
```bash
git clone <repository-url>
cd "B.Tech Major Project"
```

#### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment
copy .env.example .env

# Edit .env with your configuration:
# - MongoDB URI
# - JWT secrets
# - Email credentials (Gmail app password)
# - Port (default: 5000)

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

Backend runs at: `http://localhost:5000`

#### 3. Frontend Setup

```bash
# Navigate to frontend (open new terminal)
cd frontend

# Install dependencies
npm install

# Configure environment
copy .env.example .env

# Edit .env:
# VITE_API_URL=http://localhost:5000/api

# Start frontend development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

#### 4. Access Application

Open browser and navigate to: `http://localhost:5173`

---

## 🔑 Demo Credentials

After running `npm run seed` in backend, use these credentials:

### Admin
- **Email:** admin@university.edu
- **Password:** Admin@123
- **Access:** Full system control, user management, analytics

### Faculty
- **Email:** john.doe@university.edu
- **Password:** Faculty@123
- **Access:** Course management, attendance, grades

### Student
- **Email:** alice.kumar@student.edu
- **Password:** Student@123
- **Access:** View courses, grades, attendance, materials

---

## 📚 Documentation

### Comprehensive Guides

1. **[Backend README](backend/README.md)**
   - API endpoints and usage
   - Database configuration
   - Environment variables
   - Testing procedures
   - Troubleshooting

2. **[Frontend README](frontend/README.md)**
   - Component structure
   - State management
   - Styling guide
   - Build and deployment
   - Performance optimization

3. **[API Documentation](documentation/API_DOCUMENTATION.md)**
   - Complete endpoint reference
   - Request/response examples
   - Authentication flow
   - Error codes
   - Rate limiting

4. **[Database Schema](documentation/DATABASE_SCHEMA.md)**
   - Collection structures
   - Relationships and indexes
   - Data constraints
   - Sample data
   - ER diagram

5. **[Deployment Guide](documentation/DEPLOYMENT_GUIDE.md)**
   - MongoDB Atlas setup
   - Backend deployment (Render/Heroku/Railway)
   - Frontend deployment (Vercel/Netlify)
   - Environment configuration
   - Custom domain setup
   - SSL certificates
   - Monitoring and scaling

---

## 🎨 Features by Role

### 👨‍🎓 Student Features

**Dashboard**
- Overview cards: Enrolled courses, Attendance %, CGPA, Notifications
- Recent grades table with detailed marks

**Academic**
- Browse and register for courses
- View real-time attendance records
- Access semester grades and CGPA
- Download study materials (PDFs, videos, notes)
- View personalized timetable

**Services**
- Request certificates (bonafide, character, transcript)
- Track certificate status
- Receive email notifications
- Update profile information

### 👨‍🏫 Faculty Features

**Dashboard**
- Assigned courses overview
- Total students count
- Recent materials uploaded

**Teaching**
- View enrolled students per course
- Mark attendance (individual/bulk)
- Upload and publish grades
- Create grade breakdowns (internals, assignments, finals)

**Resources**
- Upload study materials with categorization
- Send course announcements
- Manage course content

**Communication**
- Send notifications to students
- Email integration for grade publishing

### 👨‍💼 Admin Features

**Dashboard**
- System-wide statistics
- Department analytics with Chart.js
- Recent enrollments tracking

**User Management**
- Create, update, deactivate students
- Manage faculty accounts
- Role-based access control

**Academic Administration**
- Create and manage departments
- Design course curriculum
- Assign faculty to courses
- Generate and manage timetables

**Certificate Management**
- Approve/reject certificate requests
- Issue certificate numbers
- Set validity periods
- Track certificate history

**Analytics**
- Department-wise student distribution
- Enrollment trends
- Performance metrics

---

## 🔐 Security Features

✅ **Password Security**
- Bcrypt hashing with salt rounds
- Strong password validation
- Secure password reset with time-limited tokens

✅ **JWT Authentication**
- Access tokens (7 days validity)
- Refresh token support (30 days)
- HTTP-only cookie option
- Automatic token refresh

✅ **API Security**
- Rate limiting (100 requests per 15 min)
- Helmet.js security headers
- CORS with origin validation
- Input sanitization (express-validator)

✅ **Data Protection**
- Role-based access control
- Field-level authorization
- File type and size validation
- SQL injection prevention (NoSQL)

---

## 📊 Database Overview

### Collections (10 total)

1. **users** - Multi-role user accounts
2. **departments** - Academic departments
3. **courses** - Course catalog
4. **enrollments** - Student-course mapping
5. **attendances** - Daily attendance records
6. **grades** - Student grades and marks
7. **timetables** - Class schedules
8. **studymaterials** - Uploaded resources
9. **notifications** - User notifications
10. **certificaterequests** - Certificate workflow

### Key Relationships

- Department → Courses (One-to-Many)
- Department → Users (One-to-Many)
- Course → Enrollments (One-to-Many)
- Student → Grades (One-to-Many)
- Course → Study Materials (One-to-Many)

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password/:token` - Reset password

### Student Routes
- `GET /api/students/dashboard` - Dashboard data
- `GET /api/students/courses` - Enrolled courses
- `POST /api/students/courses/register` - Course registration
- `GET /api/students/attendance` - Attendance records
- `GET /api/students/grades` - Grade history
- `GET /api/students/study-materials` - Study materials
- `POST /api/students/certificates/request` - Request certificate

### Faculty Routes
- `GET /api/faculty/dashboard` - Dashboard data
- `GET /api/faculty/courses` - Assigned courses
- `GET /api/faculty/courses/:id/students` - Course students
- `POST /api/faculty/attendance/mark` - Mark attendance
- `POST /api/faculty/grades/upload` - Upload grades
- `POST /api/faculty/study-materials/upload` - Upload material
- `POST /api/faculty/announcements` - Send announcement

### Admin Routes
- `GET /api/admin/dashboard` - System statistics
- `GET /api/admin/students` - List students
- `POST /api/admin/students` - Create student
- `PUT /api/admin/students/:id` - Update student
- `DELETE /api/admin/students/:id` - Deactivate student
- `POST /api/admin/courses` - Create course
- `PUT /api/admin/courses/:id/assign-faculty` - Assign faculty
- `POST /api/admin/timetables` - Create timetable
- `PUT /api/admin/certificates/:id/approve` - Approve certificate

---

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Test health endpoint
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@university.edu","password":"Admin@123"}'
```

### Frontend Testing

1. Login with each role
2. Navigate through all dashboard sections
3. Test CRUD operations
4. Verify responsive design
5. Check error handling

---

## 🚢 Deployment

### Recommended Services

**Backend:**
- Render (Free tier with auto-sleep)
- Railway (Free tier)
- Heroku (Paid after 2022)

**Frontend:**
- Vercel (Recommended - excellent React support)
- Netlify (Alternative)
- AWS S3 + CloudFront

**Database:**
- MongoDB Atlas (Free 512MB tier)

### Deployment Steps

See detailed guide: [DEPLOYMENT_GUIDE.md](documentation/DEPLOYMENT_GUIDE.md)

**Quick Summary:**
1. Setup MongoDB Atlas cluster
2. Deploy backend to Render
3. Deploy frontend to Vercel
4. Configure environment variables
5. Update CORS settings
6. Test production deployment

**Estimated Monthly Cost:**
- Free tier: $0 (with limitations)
- Production ready: ~$36/month

---

## 📈 Performance

### Optimization Features

**Backend:**
- MongoDB indexes for fast queries
- Pagination for large datasets
- Lean queries for better performance
- Winston logging with rotation
- Compression middleware

**Frontend:**
- Vite for fast builds
- Code splitting with React.lazy
- TailwindCSS purging
- Image optimization
- Cached API responses

### Target Metrics

- API response time: < 200ms
- Page load time: < 2s
- Lighthouse score: 90+
- Bundle size: < 500KB gzipped

---

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check MongoDB connection
- Verify environment variables
- Check port availability (5000)

**Frontend can't connect:**
- Verify backend is running
- Check VITE_API_URL in .env
- Inspect browser console

**Login fails:**
- Ensure database is seeded
- Check credentials (case-sensitive)
- Verify JWT_SECRET is set

**File upload fails:**
- Check uploads/ directory exists
- Verify multer configuration
- Check file size limits

See detailed troubleshooting in individual README files.

---

## 🛣️ Project Roadmap

### Phase 1 ✅ (Completed)
- Authentication system
- Role-based dashboards
- Core CRUD operations
- Basic reporting

### Phase 2 🚧 (In Progress)
- Additional feature pages
- Advanced filtering
- Enhanced analytics
- File preview

### Phase 3 📋 (Planned)
- Real-time notifications (WebSockets)
- Mobile responsive improvements
- PWA support
- Dark mode
- Multi-language support
- Advanced search
- Bulk operations (CSV import/export)
- Parent portal for students
- Fee management module
- Library management
- Examination system
- Placement cell module
- Hostel management

---

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Open Pull Request

### Code Style

- Follow ESLint rules
- Use meaningful variable names
- Comment complex logic
- Write modular, reusable code
- Test before committing

---

## 📜 License

This project is developed for educational purposes as part of B.Tech Major Project.

---

## 👥 Authors

**B.Tech Major Project Team**

---

## 🙏 Acknowledgments

- Express.js and React communities
- MongoDB documentation
- TailwindCSS framework
- Chart.js library
- Open source contributors

---

## 📞 Support

For issues, questions, or contributions:

1. Check documentation files
2. Review troubleshooting sections
3. Inspect application logs
4. Open GitHub issue
5. Contact project maintainers

---

## 📊 Project Statistics

- **Backend Files:** 30+
- **Frontend Components:** 15+
- **API Endpoints:** 50+
- **Database Models:** 10
- **Lines of Code:** 10,000+
- **Development Time:** 3-4 weeks
- **Team Size:** Customizable

---

## 🎓 Learning Outcomes

This project demonstrates:

✅ Full-stack development with MERN stack  
✅ RESTful API design and implementation  
✅ JWT-based authentication and authorization  
✅ Role-based access control (RBAC)  
✅ Database design and optimization  
✅ Modern React patterns (Hooks, Context)  
✅ Responsive UI design with TailwindCSS  
✅ File upload and management  
✅ Email integration  
✅ Error handling and logging  
✅ Security best practices  
✅ Deployment and DevOps  

---

## 🔗 Quick Links

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [API Documentation](documentation/API_DOCUMENTATION.md)
- [Database Schema](documentation/DATABASE_SCHEMA.md)
- [Deployment Guide](documentation/DEPLOYMENT_GUIDE.md)

---

## 📝 Version History

**v1.0.0** (Current)
- Initial release
- Full authentication system
- Role-based dashboards
- Core CRUD operations
- Email notifications
- File management
- Production-ready deployment

---

**Last Updated:** 2024  
**Status:** ✅ Production Ready  
**Maintenance:** Active

---

## 🚀 Get Started Now!

```bash
# Clone and setup
git clone <repository-url>
cd "B.Tech Major Project"

# Backend
cd backend && npm install && npm run seed && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev

# Visit http://localhost:5173
# Login with demo credentials
# Explore the portal!
```

---

**Happy Coding! 🎉**
