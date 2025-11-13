const { GRADE_SCALE } = require('./constants');

/**
 * Calculate letter grade from marks
 * @param {number} marks - Marks obtained
 * @returns {string} Letter grade
 */
const calculateGrade = (marks) => {
  for (const [grade, range] of Object.entries(GRADE_SCALE)) {
    if (marks >= range.min && marks <= range.max) {
      return grade;
    }
  }
  return 'F';
};

/**
 * Calculate GPA from grade
 * @param {string} grade - Letter grade
 * @returns {number} GPA points
 */
const calculateGPA = (grade) => {
  const gradePoints = {
    'A+': 4.0,
    'A': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'C': 2.0,
    'D': 1.0,
    'F': 0.0,
  };
  return gradePoints[grade] || 0.0;
};

/**
 * Calculate CGPA from all grades
 * @param {Array} grades - Array of grade objects with grade and credits
 * @returns {number} CGPA
 */
const calculateCGPA = (grades) => {
  if (!grades || grades.length === 0) return 0;
  
  let totalPoints = 0;
  let totalCredits = 0;
  
  grades.forEach(g => {
    const gpa = calculateGPA(g.grade);
    totalPoints += gpa * (g.credits || 3);
    totalCredits += (g.credits || 3);
  });
  
  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
};

/**
 * Calculate attendance percentage
 * @param {number} present - Number of classes attended
 * @param {number} total - Total number of classes
 * @returns {number} Percentage
 */
const calculateAttendancePercentage = (present, total) => {
  if (total === 0) return 0;
  return ((present / total) * 100).toFixed(2);
};

/**
 * Generate random enrollment number
 * @param {string} departmentCode - Department code
 * @param {number} year - Admission year
 * @returns {string} Enrollment number
 */
const generateEnrollmentNumber = (departmentCode, year) => {
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `${year}${departmentCode}${random}`;
};

/**
 * Generate random employee ID
 * @param {string} departmentCode - Department code
 * @returns {string} Employee ID
 */
const generateEmployeeID = (departmentCode) => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900) + 100;
  return `FAC${year}${departmentCode}${random}`;
};

/**
 * Format date to readable string
 * @param {Date} date - Date object
 * @returns {string} Formatted date
 */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Paginate results
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination info
 */
const getPagination = (page = 1, limit = 10) => {
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 10;
  const skip = (parsedPage - 1) * parsedLimit;
  
  return {
    page: parsedPage,
    limit: parsedLimit,
    skip,
  };
};

/**
 * Create pagination response
 * @param {number} total - Total items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination response
 */
const createPaginationResponse = (total, page, limit) => {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1,
  };
};

module.exports = {
  calculateGrade,
  calculateGPA,
  calculateCGPA,
  calculateAttendancePercentage,
  generateEnrollmentNumber,
  generateEmployeeID,
  formatDate,
  getPagination,
  createPaginationResponse,
};
