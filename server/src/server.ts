import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import candidateRoutes from './routes/candidateRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://kaukuntla:kaukuntla@cluster0.okw2icx.mongodb.net/klimb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as mongoose.ConnectOptions)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', candidateRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});