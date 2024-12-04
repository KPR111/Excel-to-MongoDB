import { Request, Response } from 'express';
import * as XLSX from 'xlsx';
import async from 'async';
import { Candidate, ICandidate } from '../models/candidateModel';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const upload = multer({ dest: 'uploads/' });

export const uploadCandidates = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = XLSX.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: any[] = XLSX.utils.sheet_to_json(worksheet, { 
      defval: '', // Use empty string for empty cells
      blankrows: false // Skip blank rows
    });

    console.log(`Total rows in Excel: ${data.length}`);

    // Define column mapping
    const columnMap: { [key: string]: string[] } = {
      name: ['name of the candidate', 'name', 'fullname', 'candidate name'],
      email: ['email', 'email address', 'emailid', 'e-mail'],
      mobile: ['mobile no.', 'mobile', 'phone', 'contact', 'phonenumber'],
      dob: ['date of birth', 'dob', 'birthdate'],
      experience: ['work experience', 'experience', 'total experience', 'exp'],
      resumeTitle: ['resume title', 'resume headline', 'title'],
      location: ['current location', 'location', 'city'],
      address: ['postal address', 'address'],
      employer: ['current employer', 'employer', 'company'],
      designation: ['current designation', 'designation', 'role']
    };

    const normalizedData = data.map((row, index) => {
      const normalizedRow: Partial<ICandidate> = {};

      // Map Excel columns to database fields
      Object.entries(columnMap).forEach(([modelKey, possibleColumns]) => {
        for (const col of possibleColumns) {
          const foundCol = Object.keys(row).find(
            (key) => key.toLowerCase().trim() === col.toLowerCase()
          );
          if (foundCol) {
            normalizedRow[modelKey as keyof ICandidate] = row[foundCol];
            break;
          }
        }
      });

      console.log(`Normalized Row ${index + 1}:`, normalizedRow);
      return normalizedRow;
    });

    const processedCandidates: string[] = [];
    const skippedCandidates: string[] = [];

    // Process and save candidates
    await async.eachSeries(normalizedData, async (row, callback) => {
      try {
        if (!row.email || !row.name) {
          console.warn(`Skipping row - Missing email or name: ${JSON.stringify(row)}`);
          skippedCandidates.push(row.email || 'Unknown');
          callback(null);
          return;
        }

        const existingCandidate = await Candidate.findOne({ email: row.email.toLowerCase().trim() });
        if (existingCandidate) {
          console.warn(`Duplicate email - Skipping: ${row.email}`);
          skippedCandidates.push(row.email);
          callback(null);
          return;
        }

        const candidate = new Candidate({
          name: row.name?.toString().trim(),
          email: row.email?.toLowerCase().trim(),
          mobile: row.mobile?.toString().trim(),
          dob: row.dob?.toString().trim(),
          experience: row.experience?.toString().trim(),
          resumeTitle: row.resumeTitle?.toString().trim(),
          location: row.location?.toString().trim(),
          address: row.address?.toString().trim(),
          employer: row.employer?.toString().trim(),
          designation: row.designation?.toString().trim(),
        });

        await candidate.save();
        processedCandidates.push(row.email);
        console.log(`Processed candidate: ${row.email}`);
        callback(null);
      } catch (error) {
        console.error(`Error processing candidate: ${JSON.stringify(row)}`, error);
        skippedCandidates.push(row.email || 'Unknown');
        callback(null);
      }
    });

    fs.unlinkSync(req.file.path); // Clean up uploaded file

    res.status(200).json({
      message: 'File processed successfully',
      processedCount: processedCandidates.length,
      skippedCount: skippedCandidates.length,
      processedCandidates,
      skippedCandidates,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error processing file' });
  }
};
