import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 5001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`===================================================`);
  console.log(` Police DMS Enterprise Server running on port: ${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(`===================================================`);
});
