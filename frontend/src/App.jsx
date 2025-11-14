import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ROUTES, ROLES } from './utils/constants';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminRegister from './components/auth/AdminRegister';

// Student Components
import StudentDashboard from './components/student/Dashboard';
import StudentProfile from './components/student/Profile';
import StudentCourses from './components/student/Courses';
import StudentAttendance from './components/student/Attendance';
import StudentGrades from './components/student/Grades';
import StudentTimetable from './components/student/Timetable';
import StudentMaterials from './components/student/Materials';
import StudentCertificates from './components/student/Certificates';
import StudentNotifications from './components/student/Notifications';

// Faculty Components
import FacultyDashboard from './components/faculty/Dashboard';
import FacultyProfile from './components/faculty/Profile';
import FacultyCourses from './components/faculty/Courses';
import FacultyAttendance from './components/faculty/Attendance';
import FacultyGrades from './components/faculty/Grades';
import FacultyMaterials from './components/faculty/Materials';
import FacultyStudents from './components/faculty/Students';
import FacultyAnnouncements from './components/faculty/Announcements';

// Admin Components
import AdminDashboard from './components/admin/Dashboard';
import AdminStudents from './components/admin/Students';
import AdminFaculty from './components/admin/Faculty';
import AdminDepartments from './components/admin/Departments';
import AdminCourses from './components/admin/Courses';
import AdminTimetable from './components/admin/Timetable';
import AdminCertificates from './components/admin/Certificates';
import AdminAnalytics from './components/admin/Analytics';

// Super Admin Components
import SuperAdminDashboard from './components/superadmin/Dashboard';
import AdminManagement from './components/superadmin/AdminManagement';
import TeacherManagement from './components/superadmin/TeacherManagement';
import AdminApprovals from './components/superadmin/AdminApprovals';
import StudentDetails from './components/superadmin/StudentDetails';
import PendingStudentDetails from './components/superadmin/PendingStudentDetails';
import TeacherDetails from './components/superadmin/TeacherDetails';
import PendingTeacherDetails from './components/superadmin/PendingTeacherDetails';
import AdminDetails from './components/superadmin/AdminDetails';
import PendingAdminDetails from './components/superadmin/PendingAdminDetails';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path="/register-admin" element={<AdminRegister />} />
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />

          {/* Student Routes */}
          <Route
            path={ROUTES.STUDENT_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STUDENT_PROFILE}
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STUDENT_COURSES}
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STUDENT_ATTENDANCE}
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STUDENT_GRADES}
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentGrades />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STUDENT_TIMETABLE}
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentTimetable />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STUDENT_MATERIALS}
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentMaterials />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STUDENT_CERTIFICATES}
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentCertificates />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STUDENT_NOTIFICATIONS}
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentNotifications />
              </ProtectedRoute>
            }
          />

          {/* Faculty Routes */}
          <Route
            path={ROUTES.FACULTY_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.FACULTY_PROFILE}
            element={
              <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                <FacultyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.FACULTY_COURSES}
            element={
              <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                <FacultyCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.FACULTY_ATTENDANCE}
            element={
              <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                <FacultyAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.FACULTY_GRADES}
            element={
              <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                <FacultyGrades />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.FACULTY_MATERIALS}
            element={
              <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                <FacultyMaterials />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.FACULTY_STUDENTS}
            element={
              <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                <FacultyStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.FACULTY_ANNOUNCEMENTS}
            element={
              <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                <FacultyAnnouncements />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Super Admin Routes */}
          <Route
            path={ROUTES.SUPER_ADMIN_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/admins"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <AdminManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/teachers"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <TeacherManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/admin-approvals"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <AdminApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/students"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <AdminStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/students/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <StudentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/students/pending/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <PendingStudentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/teachers/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <TeacherDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/teachers/pending/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <PendingTeacherDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/admins/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <AdminDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/admins/pending/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <PendingAdminDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/courses"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <AdminCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/certificates"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <AdminCertificates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/departments"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <AdminDepartments />
              </ProtectedRoute>
            }
          />
          
          {/* Teacher Routes - same as faculty */}
          <Route
            path={ROUTES.TEACHER_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.FACULTY]}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.ADMIN_STUDENTS}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_FACULTY}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminFaculty />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_DEPARTMENTS}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDepartments />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_COURSES}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_TIMETABLE}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminTimetable />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_CERTIFICATES}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminCertificates />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_ANALYTICS}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
