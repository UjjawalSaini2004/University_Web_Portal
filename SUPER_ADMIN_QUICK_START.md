# Super Admin Quick Start Guide

## 🚀 Getting Started

### 1. Login as Super Admin
- URL: http://localhost:5173/login
- Email: `ujjawalsaini2004@gmail.com`
- Password: `UjjawalSaini`

### 2. Access Super Admin Dashboard
After login, you'll be automatically redirected to:
```
http://localhost:5173/superadmin/dashboard
```

## 📊 Dashboard Overview

### Statistics Cards
The dashboard displays 7 key metrics:

1. **Total Students** - Click to view all students
   - Shows pending approval count
   
2. **Total Teachers** - Click to view all teachers
   - Shows pending approval count
   
3. **Total Courses** - Click to view all courses
   - Shows active course count
   
4. **Pending Certificates** - Click to view pending certificates
   - Shows approved certificate count
   
5. **Total Admins** - Click to view all admins
   - Shows pending approval count
   
6. **Total Departments** - Click to view all departments

7. **Total Users** - Overall user count
   - Shows verified user count

### Quick Actions
Four buttons at the bottom:
- **Create Admin** - Add new administrator
- **Create Teacher** - Add new teacher
- **Create Course** - Add new course
- **Create Department** - Add new department

### Recent Activities
View the latest 10 system activities with:
- Action type (color-coded badges)
- Performer name and role
- Description
- Timestamp

## 🎯 Main Features

### 1. Admin Management (`/superadmin/admins`)

**View All Admins:**
- Lists all administrator accounts
- Shows name, email, phone, status, verification
- Actions: Delete

**Create Admin:**
- Click "Create Admin" button
- Fill in the form:
  - First Name, Last Name
  - Email, Password
  - Phone Number
  - Date of Birth
  - Gender
- Submit to create immediately (no approval needed)

**Pending Approvals:**
- Click "Pending Approvals" button (if any pending)
- View all pending admin applications
- Actions: Approve or Deny
- Approved admins move to main admin list

**Delete Admin:**
- Click "Delete" on any admin
- Confirm deletion in modal
- Cannot delete super admin accounts
- Cannot delete yourself

### 2. Teacher Management (`/superadmin/teachers`)

**View All Teachers:**
- Lists all teacher accounts
- Shows name, email, employee ID, department, phone, status
- Actions: Edit, Delete

**Create Teacher:**
- Click "Create Teacher" button
- Fill in comprehensive form:
  - Personal info (name, email, password)
  - Employee ID
  - Phone, Date of Birth, Gender
  - Department selection
  - Qualification
- Submit to create immediately

**Edit Teacher:**
- Click "Edit" on any teacher
- Modify details (cannot change email)
- Save changes

**Pending Approvals:**
- View teachers awaiting approval
- Actions: Approve or Deny
- Approved teachers move to main teacher list

**Delete Teacher:**
- Click "Delete" on any teacher
- Confirm deletion

### 3. Student Management (`/superadmin/students`)
- Same interface as Admin Students page
- View all students
- Approve/deny pending students
- Create students manually
- Edit student details
- Delete students

### 4. Course Management (`/superadmin/courses`)
- Same interface as Admin Courses page
- View all courses
- Create new courses
- Edit course details
- Delete courses
- Assign teachers to courses

### 5. Certificate Management (`/superadmin/certificates`)
- Same interface as Admin Certificates page
- View all certificates
- Filter by status (pending/approved/rejected)
- Approve pending certificates
- Reject certificates with reason

### 6. Department Management (`/superadmin/departments`)
- Same interface as Admin Departments page
- View all departments
- Create new departments
- Edit department details
- Delete departments (if no users assigned)

## 🔐 Security Features

### Role Protection
- All `/superadmin/*` routes require SUPER_ADMIN role
- Regular admins cannot access super admin features
- Teachers and students are blocked

### Activity Logging
Every action is logged with:
- Action type
- Performer (name, role)
- Target (if applicable)
- Description
- Timestamp
- IP address
- User agent

### Restrictions
- Cannot delete super admin accounts
- Cannot promote users to super admin
- Cannot change super admin roles
- Cannot delete yourself
- Cannot delete departments with users

## 📝 Common Workflows

### Workflow 1: Approve Pending Teacher
1. Go to Dashboard
2. See pending teachers count in "Total Teachers" card
3. Click on "Total Teachers" card OR navigate to `/superadmin/teachers`
4. Click "Pending Approvals" button
5. Review teacher details
6. Click "Approve" to accept or "Deny" to reject
7. Teacher receives verification status

### Workflow 2: Create New Admin
1. Navigate to `/superadmin/admins`
2. Click "Create Admin" button
3. Fill in all required fields:
   - Email (must be unique)
   - Password (secure password)
   - First Name, Last Name
   - Phone (optional)
   - Date of Birth (optional)
   - Gender (optional)
4. Click "Create Admin"
5. Admin is created immediately (no approval needed)
6. Admin can login right away

### Workflow 3: Manage Teacher Details
1. Go to `/superadmin/teachers`
2. Find teacher in list
3. Click "Edit"
4. Modify details (email cannot be changed)
5. Click "Update Teacher"
6. Changes saved immediately

### Workflow 4: Monitor System Activity
1. Go to Dashboard
2. View "Recent Activities" section
3. Click "View All" to see full activity log
4. Filter by:
   - Action type
   - Date range
   - Performer
5. Monitor all system events

## 🎨 UI Components

### Tables
- Sortable columns
- Loading states
- Empty states
- Hover effects
- Pagination (where applicable)

### Modals
- Centered overlay
- Click outside to close
- ESC key to close
- Scrollable content
- Header/body/footer sections

### Buttons
- Color-coded by action:
  - Blue (primary) - Create, Save
  - Green (success) - Approve
  - Red (danger) - Delete, Deny
  - Yellow (warning) - Pending
  - Gray (secondary) - Cancel

### Badges
- Color-coded status:
  - Green - Active, Verified, Approved
  - Red - Inactive, Rejected
  - Yellow - Pending
  - Gray - Default

### Forms
- Clear labels
- Required field indicators (*)
- Validation errors in red
- Helper text in gray
- Date pickers
- Dropdowns

## 🚨 Error Handling

### Common Errors
- **401 Unauthorized** - Token expired, login again
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource doesn't exist
- **400 Bad Request** - Invalid data (check form)
- **500 Server Error** - Contact system admin

### Toast Notifications
- **Success** (green) - Action completed
- **Error** (red) - Action failed
- **Warning** (yellow) - Caution needed
- **Info** (blue) - Information

## 📞 Support

### Troubleshooting

**Cannot access super admin features:**
- Verify you're logged in as super admin
- Check role in user profile
- Clear cache and re-login

**Pending approvals not showing:**
- Refresh the page
- Check if already approved/denied
- Verify waitlist_users collection

**Cannot delete user:**
- Check if user is super admin (cannot delete)
- Check if trying to delete yourself (prevented)
- Verify user ID is correct

### Backend API Base URL
```
http://localhost:5000/api/superadmin/
```

### Frontend Routes
```
/superadmin/dashboard      - Main dashboard
/superadmin/admins         - Admin management
/superadmin/teachers       - Teacher management
/superadmin/students       - Student management
/superadmin/courses        - Course management
/superadmin/certificates   - Certificate management
/superadmin/departments    - Department management
```

---

## ⚡ Pro Tips

1. **Quick Navigation**: Click on stat cards to jump directly to management pages
2. **Keyboard Shortcuts**: Press ESC to close modals quickly
3. **Bulk Actions**: Handle multiple pending approvals in one session
4. **Activity Monitoring**: Check Recent Activities regularly for audit
5. **Data Validation**: System prevents duplicate emails and invalid roles
6. **Responsive Design**: Works on desktop, tablet, and mobile

---

**Last Updated**: November 13, 2025
**Version**: 1.0.0
