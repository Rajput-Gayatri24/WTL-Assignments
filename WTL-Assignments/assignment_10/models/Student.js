const mongoose = require('mongoose');

// =========================================================================
// WTL Assignment 10: Student Data Schema with Mongoose
// =========================================================================

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long']
    },
    prn: {
      type: String,
      required: [true, 'PRN is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: ['Computer', 'IT', 'AI&DS', 'ENTC', 'Mechanical', 'Civil'],
      default: 'Computer'
    },
    year: {
      type: String,
      default: 'TY'
    },
    semester: {
      type: Number,
      default: 5,
      min: 1,
      max: 8
    },
    gpa: {
      type: Number,
      required: [true, 'GPA is required'],
      min: [0.0, 'GPA cannot be less than 0.0'],
      max: [10.0, 'GPA cannot exceed 10.0']
    },
    skills: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Virtual property to calculate performance category
studentSchema.virtual('performanceTier').get(function () {
  if (this.gpa >= 9.0) return 'Distinction (O Grade)';
  if (this.gpa >= 8.0) return 'First Class with Distinction (A+ Grade)';
  if (this.gpa >= 7.0) return 'First Class (A Grade)';
  if (this.gpa >= 6.0) return 'Higher Second Class (B+ Grade)';
  return 'Average / Pass';
});

// Configure JSON output to include virtuals
studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Student', studentSchema);
