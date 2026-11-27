/**
 * @typedef {Object} Instructor
 * @property {string} name
 * @property {string} role
 * @property {string} bio
 */

/**
 * @typedef {Object} Lesson
 * @property {string} id
 * @property {string} title
 * @property {number} durationMin
 * @property {string} body
 * @property {string} deepDive
 * @property {string} takeaway
 * @property {string} language
 * @property {string} code
 */

/**
 * @typedef {Object} Module
 * @property {string} id
 * @property {string} title
 * @property {Lesson[]} lessons
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} prompt
 * @property {[string, string, string, string]} options
 * @property {number} correctIndex
 * @property {string} explanation
 * @property {"easy" | "medium" | "hard"} difficulty
 */

/**
 * @typedef {Object} Quiz
 * @property {string} id
 * @property {number} passingScore
 * @property {number} [timeLimitSec]
 * @property {Question[]} questions
 */

/**
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} subtitle
 * @property {"AI Engineering" | "Cybersecurity" | "Product Design"} category
 * @property {"Beginner" | "Intermediate" | "Advanced"} level
 * @property {number} durationHours
 * @property {number} rating
 * @property {number} learnersCount
 * @property {string} coverImage
 * @property {string} accentColor
 * @property {Instructor} instructor
 * @property {string[]} outcomes
 * @property {string[]} tags
 * @property {Module[]} modules
 * @property {Quiz} quiz
 */

export {};
