# University Management Portal - Frontend

Modern React-based frontend for University Management Portal with role-based dashboards and comprehensive features.

## Tech Stack

- **Framework:** React 18.2
- **Build Tool:** Vite 5.0
- **Routing:** React Router 6.20
- **HTTP Client:** Axios 1.6
- **Styling:** TailwindCSS 3.4
- **Charts:** Chart.js 4.4 with react-chartjs-2
- **Icons:** React Icons 4.12
- **Notifications:** React Toastify 9.1
- **Date Handling:** date-fns 3.0
- **State Management:** React Context API

---

## Features

### Authentication
- Login with email and password
- Role-based routing (Student/Faculty/Admin)
- JWT token management
- Auto-logout on token expiry
- Password reset flow
- Demo credentials display

### Student Dashboard
- Overview cards (courses, attendance, CGPA, notifications)
- Recent grades table
- Enrolled courses list
- Attendance percentage tracking
- Study materials browser
- Certificate request form
- Profile management

### Faculty Dashboard
- Overview cards (courses, students, materials)
- Assigned courses management
- Student list per course
- Attendance marking interface
- Grade upload form
- Study materials upload
- Announcement system

### Admin Dashboard
- System statistics cards
- Department-wise analytics (Chart.js)
- Student and faculty management
- Course creation and assignment
- Timetable editor
- Certificate approval workflow
- Recent enrollments tracking

---

## Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/              # Static assets
│   ├── components/
│   │   ├── auth/
│   │   │   └── Login.jsx    # Login page
│   │   ├── student/
│   │   │   └── Dashboard.jsx # Student dashboard
│   │   ├── faculty/
│   │   │   └── Dashboard.jsx # Faculty dashboard
│   │   ├── admin/
│   │   │   └── Dashboard.jsx # Admin dashboard
│   │   └── common/
│   │       ├── Layout.jsx   # Main layout wrapper
│   │       ├── Sidebar.jsx  # Navigation sidebar
│   │       ├── Navbar.jsx   # Top navigation
│   │       ├── Loader.jsx   # Loading spinner
│   │       └── ProtectedRoute.jsx # Route guard
│   ├── context/
│   │   └── AuthContext.jsx  # Auth state management
│   ├── services/
│   │   ├── api.js           # Axios instance
│   │   ├── authService.js   # Auth API calls
│   │   ├── studentService.js # Student API calls
│   │   ├── facultyService.js # Faculty API calls
│   │   └── adminService.js  # Admin API calls
│   ├── utils/
│   │   └── constants.js     # App constants
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .env.example             # Environment template
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Backend API running (see backend README)

---

## Installation

### 1. Navigate to Frontend Directory
```bash
cd frontend
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

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

**For production:**
```env
VITE_API_URL=https://your-backend-url.com/api
```

---

## Running the Application

### Development Mode (with hot reload)
```bash
npm run dev
```

Application runs at: `http://localhost:5173`

### Build for Production
```bash
npm run build
```

Output in `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

---

## Demo Credentials

Make sure backend is seeded with sample data (`npm run seed` in backend).

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

## Features Guide

### 1. Login Flow

1. Open `http://localhost:5173`
2. Enter credentials or use demo credentials
3. Click "Login"
4. Automatically redirected to role-based dashboard

### 2. Student Dashboard

**Overview Cards:**
- Enrolled Courses count
- Attendance percentage
- Current CGPA
- Unread notifications

**Recent Grades Table:**
- Course name and code
- Marks obtained and total
- Grade and GPA
- Semester

**Navigation:**
- Profile - View/edit personal information
- Courses - Browse and register for courses
- Attendance - View attendance records
- Grades - Check semester results
- Timetable - View class schedule
- Study Materials - Download resources
- Certificates - Request documents
- Notifications - Read messages

### 3. Faculty Dashboard

**Overview Cards:**
- Assigned courses
- Total students across courses
- Study materials uploaded

**Recent Materials:**
- List of recently uploaded files
- Course and category
- Upload date

**Navigation:**
- Profile - Update personal details
- Courses - Manage assigned courses
- Students - View enrolled students
- Attendance - Mark daily attendance
- Grades - Upload and publish grades
- Study Materials - Upload resources
- Announcements - Send notifications

### 4. Admin Dashboard

**Statistics Cards:**
- Total students
- Total faculty
- Total courses
- Pending certificate requests

**Department Chart:**
- Bar chart showing student distribution
- Interactive Chart.js visualization

**Recent Enrollments:**
- Latest course registrations
- Student name, course, status
- Enrollment date

**Navigation:**
- Students - CRUD operations
- Faculty - CRUD operations
- Departments - Manage departments
- Courses - Create and assign courses
- Timetable - Schedule management
- Certificates - Approve/reject requests
- Reports - Analytics and exports

---

## Component Details

### AuthContext

Global authentication state:
- `user` - Current user object
- `token` - JWT token
- `isAuthenticated` - Auth status
- `login(email, password)` - Login function
- `logout()` - Logout function
- `updateUser(data)` - Update user state

### ProtectedRoute

Route guard component:
- Checks authentication status
- Validates user role
- Redirects unauthorized users
- Displays loading state

### Layout

Main layout wrapper:
- Responsive sidebar
- Top navbar
- Content area
- Mobile-friendly

### API Services

All API calls abstracted:
- Automatic token injection
- Error handling
- Response parsing
- 401 auto-logout

---

## Styling with TailwindCSS

### Custom Colors

```javascript
colors: {
  primary: '#3B82F6',    // Blue
  secondary: '#10B981',  // Green
  accent: '#F59E0B',     // Amber
  danger: '#EF4444',     // Red
}
```

### Common Classes

```css
/* Card */
.card { @apply bg-white rounded-lg shadow p-6; }

/* Button */
.btn { @apply px-4 py-2 rounded font-medium transition; }
.btn-primary { @apply bg-primary text-white hover:bg-primary/90; }

/* Input */
.input { @apply w-full px-3 py-2 border rounded focus:ring-2; }

/* Badge */
.badge { @apply px-2 py-1 rounded text-sm font-medium; }
```

---

## API Integration

### Axios Configuration

Base instance in `services/api.js`:
- Base URL from environment
- Request interceptor (add token)
- Response interceptor (handle 401)
- Error parsing

### Example API Call

```javascript
// In component
import { studentService } from '../services/studentService';

const fetchDashboard = async () => {
  try {
    const data = await studentService.getDashboard();
    setDashboardData(data);
  } catch (error) {
    toast.error(error.message);
  }
};
```

---

## State Management

### Context API Structure

```javascript
// AuthContext provides:
{
  user: {
    id: string,
    email: string,
    role: 'student' | 'faculty' | 'admin',
    firstName: string,
    lastName: string,
    fullName: string
  },
  token: string,
  isAuthenticated: boolean,
  login: (email, password) => Promise,
  logout: () => void,
  updateUser: (data) => void
}
```

### Using Context

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user?.fullName}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## Routing Structure

```javascript
/                      → Login (if not authenticated)
/login                 → Login page
/student/*             → Student routes (protected)
  /student/dashboard   → Student dashboard
  /student/profile     → Student profile
  /student/courses     → Courses list
/faculty/*             → Faculty routes (protected)
  /faculty/dashboard   → Faculty dashboard
  /faculty/courses     → Course management
/admin/*               → Admin routes (protected)
  /admin/dashboard     → Admin dashboard
  /admin/students      → Student management
```

---

## Responsive Design

### Breakpoints

- **sm:** 640px (mobile landscape)
- **md:** 768px (tablet)
- **lg:** 1024px (desktop)
- **xl:** 1280px (large desktop)

### Mobile Optimizations

- Collapsible sidebar with hamburger menu
- Stacked cards on mobile
- Responsive tables (scroll on small screens)
- Touch-friendly buttons and inputs
- Optimized font sizes

---

## Performance Optimization

### Implemented Optimizations

1. **Code Splitting**
   - React.lazy for route-based splitting
   - Dynamic imports for heavy components

2. **Asset Optimization**
   - Vite automatic code minification
   - Tree-shaking unused code
   - CSS purging with TailwindCSS

3. **API Calls**
   - Debounced search inputs
   - Pagination for large lists
   - Caching with React Query (future)

4. **Images**
   - Lazy loading
   - Optimized formats (WebP)
   - Responsive images

---

## Testing

### Manual Testing Checklist

- [ ] Login with all three roles
- [ ] Dashboard loads correctly for each role
- [ ] Navigation works
- [ ] Logout functionality
- [ ] API error handling (network off)
- [ ] Token expiry handling
- [ ] Responsive design on mobile
- [ ] Browser compatibility (Chrome, Firefox, Safari)

### Automated Testing (Setup Required)

```bash
npm run test
```

---

## Building for Production

### 1. Update Environment Variables

Create `.env.production`:
```env
VITE_API_URL=https://your-production-api.com/api
```

### 2. Build

```bash
npm run build
```

### 3. Deploy

Upload `dist/` folder to:
- Vercel (recommended - automatic)
- Netlify
- AWS S3 + CloudFront
- nginx/Apache server

See `../documentation/DEPLOYMENT_GUIDE.md` for details.

---

## Common Issues and Solutions

### 1. Cannot Connect to Backend

**Error:** `Network Error` or `CORS Error`

**Solutions:**
- Check backend is running on port 5000
- Verify `VITE_API_URL` in `.env`
- Check CORS settings in backend
- Disable browser extensions (ad blockers)

### 2. Blank Page After Build

**Error:** White screen in production

**Solutions:**
- Check browser console for errors
- Verify all imports are correct
- Ensure environment variables prefixed with `VITE_`
- Check base path in `vite.config.js`

### 3. Styles Not Loading

**Error:** Unstyled page

**Solutions:**
- Run `npm install` again
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check TailwindCSS config
- Verify `@tailwind` directives in `index.css`

### 4. Authentication Not Working

**Error:** `401 Unauthorized`

**Solutions:**
- Check backend is running and seeded
- Verify credentials (case-sensitive)
- Check browser localStorage for token
- Clear browser cache and localStorage

### 5. Hot Reload Not Working

**Solutions:**
```bash
# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

---

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Supported |
| Firefox | 88+ | ✅ Supported |
| Safari | 14+ | ✅ Supported |
| Edge | 90+ | ✅ Supported |
| IE 11 | - | ❌ Not supported |

---

## Accessibility

### Implemented Features

- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators
- Color contrast compliance (WCAG AA)
- Screen reader friendly

### Future Improvements

- [ ] Full WCAG AAA compliance
- [ ] Keyboard shortcuts
- [ ] High contrast mode
- [ ] Font size controls

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

**Note:** All variables must be prefixed with `VITE_` to be accessible.

---

## Deployment

See `../documentation/DEPLOYMENT_GUIDE.md` for:
- Vercel deployment (recommended)
- Netlify deployment
- Custom server deployment
- Domain configuration
- SSL setup

---

## Contributing

### Code Style

- Use functional components with hooks
- Use arrow functions
- Destructure props
- Use const for components
- Follow TailwindCSS utility-first approach
- Comment complex logic

### File Naming

- Components: PascalCase (e.g., `StudentDashboard.jsx`)
- Services: camelCase (e.g., `authService.js`)
- Utils: camelCase (e.g., `constants.js`)

### Commit Guidelines

```
feat: Add student profile page
fix: Resolve dashboard loading issue
style: Update login page design
refactor: Optimize API service
docs: Update README
```

---

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## Dependencies

### Core
- `react`, `react-dom` - UI library
- `react-router-dom` - Routing
- `axios` - HTTP client

### UI & Styling
- `tailwindcss` - CSS framework
- `react-icons` - Icon library
- `react-toastify` - Notifications

### Charts
- `chart.js`, `react-chartjs-2` - Data visualization

### Utilities
- `date-fns` - Date formatting

### Dev Dependencies
- `vite` - Build tool
- `eslint` - Linting
- `postcss`, `autoprefixer` - CSS processing

---

## Project Roadmap

### Phase 1 (Completed)
- ✅ Authentication system
- ✅ Role-based dashboards
- ✅ Basic navigation

### Phase 2 (In Progress)
- [ ] Additional feature pages
- [ ] Advanced filtering
- [ ] File preview

### Phase 3 (Planned)
- [ ] Real-time notifications (WebSockets)
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] PWA support
- [ ] Offline capabilities
- [ ] Advanced analytics
- [ ] Multi-language support

---

## Performance Metrics

### Lighthouse Scores (Target)

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

### Bundle Size

- Initial load: < 200 KB gzipped
- Total bundle: < 500 KB gzipped

---

## Support

For issues:
1. Check backend is running
2. Check browser console
3. Verify environment variables
4. Review `DEPLOYMENT_GUIDE.md`
5. Contact project maintainers

---

## License

Educational project for B.Tech Major Project.

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Production Ready
