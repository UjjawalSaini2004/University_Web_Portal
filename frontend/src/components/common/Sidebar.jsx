import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, APP_NAME } from '../../utils/constants';
import { FiHome, FiBook, FiCalendar, FiFileText, FiAward, FiBell, FiUser, FiLogOut, FiMenu, FiX, FiUserCheck } from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getMenuItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'student':
        return [
          { icon: FiHome, label: 'Dashboard', path: ROUTES.STUDENT_DASHBOARD },
          { icon: FiUser, label: 'Profile', path: ROUTES.STUDENT_PROFILE },
          { icon: FiBook, label: 'My Courses', path: ROUTES.STUDENT_COURSES },
          { icon: FiCalendar, label: 'Attendance', path: ROUTES.STUDENT_ATTENDANCE },
          { icon: FiFileText, label: 'Grades', path: ROUTES.STUDENT_GRADES },
          { icon: FiCalendar, label: 'Timetable', path: ROUTES.STUDENT_TIMETABLE },
          { icon: FiBook, label: 'Study Materials', path: ROUTES.STUDENT_MATERIALS },
          { icon: FiAward, label: 'Certificates', path: ROUTES.STUDENT_CERTIFICATES },
          { icon: FiBell, label: 'Notifications', path: ROUTES.STUDENT_NOTIFICATIONS },
        ];
      case 'faculty':
        return [
          { icon: FiHome, label: 'Dashboard', path: ROUTES.FACULTY_DASHBOARD },
          { icon: FiUser, label: 'Profile', path: ROUTES.FACULTY_PROFILE },
          { icon: FiBook, label: 'My Courses', path: ROUTES.FACULTY_COURSES },
          { icon: FiCalendar, label: 'Mark Attendance', path: ROUTES.FACULTY_ATTENDANCE },
          { icon: FiFileText, label: 'Manage Grades', path: ROUTES.FACULTY_GRADES },
          { icon: FiBook, label: 'Study Materials', path: ROUTES.FACULTY_MATERIALS },
          { icon: FiUser, label: 'Students', path: ROUTES.FACULTY_STUDENTS },
          { icon: FiBell, label: 'Announcements', path: ROUTES.FACULTY_ANNOUNCEMENTS },
        ];
      case 'admin':
        return [
          { icon: FiHome, label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD },
          { icon: FiUser, label: 'Students', path: ROUTES.ADMIN_STUDENTS },
          { icon: FiUser, label: 'Teachers', path: ROUTES.ADMIN_FACULTY },
          { icon: FiBook, label: 'Departments', path: ROUTES.ADMIN_DEPARTMENTS },
          { icon: FiBook, label: 'Courses', path: ROUTES.ADMIN_COURSES },
          { icon: FiCalendar, label: 'Timetable', path: ROUTES.ADMIN_TIMETABLE },
          { icon: FiAward, label: 'Certificates', path: ROUTES.ADMIN_CERTIFICATES },
          { icon: FiFileText, label: 'Analytics', path: ROUTES.ADMIN_ANALYTICS },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b">
            <h1 className="text-xl font-bold text-primary-600">{APP_NAME}</h1>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{user?.fullName}</p>
                <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={logout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiLogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
