require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const Timetable = require('../models/Timetable');
const StudyMaterial = require('../models/StudyMaterial');
const { ROLES } = require('../utils/constants');

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Department.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await Attendance.deleteMany({});
    await Grade.deleteMany({});
    await Timetable.deleteMany({});
    await StudyMaterial.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create Departments
    console.log('📚 Creating departments...');
    const departments = await Department.insertMany([
      {
        name: 'Computer Science and Engineering',
        code: 'CSE',
        description: 'Department of Computer Science and Engineering',
        establishedYear: 2010,
        building: 'Block A',
        floor: '2nd Floor',
        contactEmail: 'cse@university.edu',
        contactPhone: '+91-1234567890',
      },
      {
        name: 'Electronics and Communication Engineering',
        code: 'ECE',
        description: 'Department of Electronics and Communication Engineering',
        establishedYear: 2012,
        building: 'Block B',
        floor: '1st Floor',
        contactEmail: 'ece@university.edu',
        contactPhone: '+91-1234567891',
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        description: 'Department of Mechanical Engineering',
        establishedYear: 2011,
        building: 'Block C',
        floor: '3rd Floor',
        contactEmail: 'me@university.edu',
        contactPhone: '+91-1234567892',
      },
    ]);
    console.log(`✅ Created ${departments.length} departments\n`);

    // Create Admin
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      email: 'admin@university.edu',
      password: 'Admin@123',
      role: ROLES.ADMIN,
      firstName: 'System',
      lastName: 'Administrator',
      phoneNumber: '+91-9876543210',
      dateOfBirth: new Date('1980-01-01'),
      gender: 'male',
      isEmailVerified: true,
      isVerified: true,
      isActive: true,
    });
    console.log('✅ Admin created - Email: admin@university.edu, Password: Admin@123\n');

    // Create Faculty
    console.log('👨‍🏫 Creating faculty members...');
    const faculty1 = await User.create({
      email: 'john.doe@university.edu',
      password: 'Faculty@123',
      role: ROLES.FACULTY,
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+91-9876543211',
      dateOfBirth: new Date('1985-05-15'),
      gender: 'male',
      department: departments[0]._id,
      designation: 'Associate Professor',
      qualification: 'Ph.D. in Computer Science',
      joiningDate: new Date('2015-07-01'),
      employeeId: 'FAC2015CSE101',
      isEmailVerified: true,
      isVerified: true,
      isActive: true,
    });
    const faculty2 = await User.create({
      email: 'jane.smith@university.edu',
      password: 'Faculty@123',
      role: ROLES.FACULTY,
      firstName: 'Jane',
      lastName: 'Smith',
      phoneNumber: '+91-9876543212',
      dateOfBirth: new Date('1987-08-20'),
      gender: 'female',
      department: departments[0]._id,
      designation: 'Assistant Professor',
      qualification: 'M.Tech in CSE',
      joiningDate: new Date('2018-08-01'),
      employeeId: 'FAC2018CSE102',
      isEmailVerified: true,
      isVerified: true,
      isActive: true,
    });
    const faculty3 = await User.create({
      email: 'robert.johnson@university.edu',
      password: 'Faculty@123',
      role: ROLES.FACULTY,
      firstName: 'Robert',
      lastName: 'Johnson',
      phoneNumber: '+91-9876543213',
      dateOfBirth: new Date('1988-12-10'),
      gender: 'male',
      department: departments[1]._id,
      designation: 'Assistant Professor',
      qualification: 'M.Tech in ECE',
      joiningDate: new Date('2019-07-15'),
      employeeId: 'FAC2019ECE101',
      isEmailVerified: true,
      isVerified: true,
      isActive: true,
    });
    const faculty = [faculty1, faculty2, faculty3];
    console.log(`✅ Created ${faculty.length} faculty members\n`);

    // Create Students
    console.log('👨‍🎓 Creating students...');
    const student1 = await User.create({
      email: 'alice.kumar@student.edu',
      password: 'Student@123',
      role: ROLES.STUDENT,
      firstName: 'Alice',
      lastName: 'Kumar',
      phoneNumber: '+91-9876543214',
      dateOfBirth: new Date('2003-01-15'),
      gender: 'female',
      department: departments[0]._id,
      semester: 5,
      admissionYear: 2021,
      enrollmentNumber: '2021CSE1001',
      batch: '2021-2025',
      isEmailVerified: true,
      isVerified: true,
      isActive: true,
    });
    const student2 = await User.create({
      email: 'bob.sharma@student.edu',
      password: 'Student@123',
      role: ROLES.STUDENT,
      firstName: 'Bob',
      lastName: 'Sharma',
      phoneNumber: '+91-9876543215',
      dateOfBirth: new Date('2003-05-20'),
      gender: 'male',
      department: departments[0]._id,
      semester: 5,
      admissionYear: 2021,
      enrollmentNumber: '2021CSE1002',
      batch: '2021-2025',
      isEmailVerified: true,
      isVerified: true,
      isActive: true,
    });
    const student3 = await User.create({
      email: 'charlie.patel@student.edu',
      password: 'Student@123',
      role: ROLES.STUDENT,
      firstName: 'Charlie',
      lastName: 'Patel',
      phoneNumber: '+91-9876543216',
      dateOfBirth: new Date('2003-08-10'),
      gender: 'male',
      department: departments[0]._id,
      semester: 5,
      admissionYear: 2021,
      enrollmentNumber: '2021CSE1003',
      batch: '2021-2025',
      isEmailVerified: true,
      isVerified: true,
      isActive: true,
    });
    const student4 = await User.create({
      email: 'diana.gupta@student.edu',
      password: 'Student@123',
      role: ROLES.STUDENT,
      firstName: 'Diana',
      lastName: 'Gupta',
      phoneNumber: '+91-9876543217',
      dateOfBirth: new Date('2003-11-25'),
      gender: 'female',
      department: departments[0]._id,
      semester: 5,
      admissionYear: 2021,
      enrollmentNumber: '2021CSE1004',
      batch: '2021-2025',
      isEmailVerified: true,
      isVerified: true,
      isActive: true,
    });
    const student5 = await User.create({
      email: 'emily.reddy@student.edu',
      password: 'Student@123',
      role: ROLES.STUDENT,
      firstName: 'Emily',
      lastName: 'Reddy',
      phoneNumber: '+91-9876543218',
      dateOfBirth: new Date('2003-12-30'),
      gender: 'female',
      department: departments[1]._id,
      semester: 5,
      admissionYear: 2021,
      enrollmentNumber: '2021ECE1001',
      batch: '2021-2025',
      isEmailVerified: true,
      isVerified: true,
      isActive: true,
    });
    const students = [student1, student2, student3, student4, student5];
    console.log(`✅ Created ${students.length} students\n`);

    // Create Courses
    console.log('📖 Creating courses...');
    const courses = await Course.insertMany([
      {
        code: 'CSE501',
        name: 'Data Structures and Algorithms',
        description: 'Advanced course on data structures and algorithms',
        department: departments[0]._id,
        credits: 4,
        semester: 5,
        type: 'theory',
        faculty: faculty[0]._id,
        maxStudents: 60,
        academicYear: '2024-2025',
        status: 'active',
      },
      {
        code: 'CSE502',
        name: 'Database Management Systems',
        description: 'Comprehensive course on DBMS concepts and SQL',
        department: departments[0]._id,
        credits: 4,
        semester: 5,
        type: 'theory_practical',
        faculty: faculty[1]._id,
        maxStudents: 60,
        academicYear: '2024-2025',
        status: 'active',
      },
      {
        code: 'CSE503',
        name: 'Operating Systems',
        description: 'Study of modern operating systems',
        department: departments[0]._id,
        credits: 3,
        semester: 5,
        type: 'theory',
        faculty: faculty[0]._id,
        maxStudents: 60,
        academicYear: '2024-2025',
        status: 'active',
      },
      {
        code: 'CSE504',
        name: 'Computer Networks',
        description: 'Networking fundamentals and protocols',
        department: departments[0]._id,
        credits: 3,
        semester: 5,
        type: 'theory',
        faculty: faculty[1]._id,
        maxStudents: 60,
        academicYear: '2024-2025',
        status: 'active',
      },
      {
        code: 'ECE501',
        name: 'Digital Signal Processing',
        description: 'Advanced signal processing techniques',
        department: departments[1]._id,
        credits: 4,
        semester: 5,
        type: 'theory_practical',
        faculty: faculty[2]._id,
        maxStudents: 60,
        academicYear: '2024-2025',
        status: 'active',
      },
    ]);
    console.log(`✅ Created ${courses.length} courses\n`);

    // Create Enrollments
    console.log('📝 Creating enrollments...');
    const enrollments = [];
    // CSE students enrolled in CSE courses
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        enrollments.push({
          student: students[i]._id,
          course: courses[j]._id,
          semester: 5,
          academicYear: '2024-2025',
          status: 'enrolled',
        });
      }
    }
    // ECE student enrolled in ECE course
    enrollments.push({
      student: students[4]._id,
      course: courses[4]._id,
      semester: 5,
      academicYear: '2024-2025',
      status: 'enrolled',
    });
    await Enrollment.insertMany(enrollments);
    console.log(`✅ Created ${enrollments.length} enrollments\n`);

    // Create Attendance Records
    console.log('📅 Creating attendance records...');
    const attendanceRecords = [];
    const dates = [
      new Date('2024-11-01'),
      new Date('2024-11-05'),
      new Date('2024-11-08'),
      new Date('2024-11-12'),
    ];

    for (const date of dates) {
      for (let i = 0; i < 4; i++) {
        for (const course of courses.slice(0, 4)) {
          attendanceRecords.push({
            course: course._id,
            student: students[i]._id,
            date: date,
            status: Math.random() > 0.2 ? 'present' : 'absent',
            markedBy: faculty[Math.floor(Math.random() * 2)]._id,
            classType: 'lecture',
          });
        }
      }
    }
    await Attendance.insertMany(attendanceRecords);
    console.log(`✅ Created ${attendanceRecords.length} attendance records\n`);

    // Create Grades
    console.log('📊 Creating grades...');
    const grades = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        grades.push({
          student: students[i]._id,
          course: courses[j]._id,
          semester: 5,
          academicYear: '2024-2025',
          assessments: {
            internal1: { marks: 15 + Math.floor(Math.random() * 5), maxMarks: 20 },
            internal2: { marks: 16 + Math.floor(Math.random() * 4), maxMarks: 20 },
            assignments: { marks: 8 + Math.floor(Math.random() * 2), maxMarks: 10 },
            endSemester: { marks: 40 + Math.floor(Math.random() * 10), maxMarks: 50 },
          },
          uploadedBy: faculty[j % 2]._id,
          isPublished: true,
          publishedDate: new Date(),
        });
      }
    }
    await Grade.insertMany(grades);
    console.log(`✅ Created ${grades.length} grade records\n`);

    // Create Timetable
    console.log('🗓️  Creating timetable...');
    const timetable = await Timetable.create({
      department: departments[0]._id,
      semester: 5,
      academicYear: '2024-2025',
      schedule: [
        {
          day: 'Monday',
          slots: [
            {
              startTime: '09:00',
              endTime: '10:00',
              course: courses[0]._id,
              faculty: faculty[0]._id,
              room: 'A-301',
              type: 'lecture',
            },
            {
              startTime: '10:00',
              endTime: '11:00',
              course: courses[1]._id,
              faculty: faculty[1]._id,
              room: 'A-302',
              type: 'lecture',
            },
          ],
        },
        {
          day: 'Tuesday',
          slots: [
            {
              startTime: '09:00',
              endTime: '10:00',
              course: courses[2]._id,
              faculty: faculty[0]._id,
              room: 'A-301',
              type: 'lecture',
            },
            {
              startTime: '11:00',
              endTime: '12:00',
              course: courses[3]._id,
              faculty: faculty[1]._id,
              room: 'A-303',
              type: 'lecture',
            },
          ],
        },
        {
          day: 'Wednesday',
          slots: [
            {
              startTime: '09:00',
              endTime: '10:00',
              course: courses[0]._id,
              faculty: faculty[0]._id,
              room: 'A-301',
              type: 'lecture',
            },
          ],
        },
        {
          day: 'Thursday',
          slots: [
            {
              startTime: '10:00',
              endTime: '11:00',
              course: courses[1]._id,
              faculty: faculty[1]._id,
              room: 'Lab-1',
              type: 'practical',
            },
          ],
        },
        {
          day: 'Friday',
          slots: [
            {
              startTime: '09:00',
              endTime: '10:00',
              course: courses[2]._id,
              faculty: faculty[0]._id,
              room: 'A-302',
              type: 'lecture',
            },
            {
              startTime: '11:00',
              endTime: '12:00',
              course: courses[3]._id,
              faculty: faculty[1]._id,
              room: 'A-301',
              type: 'lecture',
            },
          ],
        },
      ],
      isActive: true,
    });
    console.log('✅ Created timetable\n');

    console.log('✨ Database seeding completed successfully!\n');
    console.log('=== Test Credentials ===');
    console.log('\n👤 Admin:');
    console.log('   Email: admin@university.edu');
    console.log('   Password: Admin@123');
    console.log('\n👨‍🏫 Faculty:');
    console.log('   Email: john.doe@university.edu');
    console.log('   Password: Faculty@123');
    console.log('\n👨‍🎓 Student:');
    console.log('   Email: alice.kumar@student.edu');
    console.log('   Password: Student@123');
    console.log('\n========================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
