import mongoose from 'mongoose';

export interface ICandidate extends mongoose.Document {
  name: string;
  email: string;
  mobile?: string;
  dob?: string; // Date of Birth
  experience?: string;
  skills?: string;
  location?: string; // Current Location
  address?: string; // Postal Address
  resumeTitle?: string; // Resume Title
  employer?: string; // Current Employer
  designation?: string; // Current Designation
}

const candidateSchema = new mongoose.Schema<ICandidate>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  mobile: {
    type: String,
    trim: true,
    match: [/^\d{10,15}$/, 'Please enter a valid mobile number'],
  },
  dob: {
    type: String,
    trim: true,
    // match: [/^\d{4}-\d{2}-\d{2}$/, 'Please use the date format YYYY-MM-DD'], // Example: 1990-01-01
  },
  experience: {
    type: String,
    trim: true,
  },
  skills: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  resumeTitle: {
    type: String,
    trim: true,
  },
  employer: {
    type: String,
    trim: true,
  },
  designation: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

export const Candidate = mongoose.model<ICandidate>('Candidate', candidateSchema);
