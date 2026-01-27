
import express from 'express';
import cors from 'cors';
import productRoutes from './api/products/products.routes';
import downloadRoutes from './api/downloads/downloads.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/downloads', downloadRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
