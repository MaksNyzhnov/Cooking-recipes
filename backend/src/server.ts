import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { recipeRoutes } from './routes/recipe.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/recipes', recipeRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 