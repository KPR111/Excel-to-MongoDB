import express from 'express';
import multer from 'multer';
import { uploadCandidates } from '../controllers/candidateController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadCandidates);

export default router;