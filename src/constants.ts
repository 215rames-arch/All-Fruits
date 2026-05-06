import { Fruit } from './types';

export const INITIAL_FRUITS: Fruit[] = [
  {
    id: 'apple-red',
    name: 'Red Fuji Apples',
    description: 'Crisp, sweet, and perfectly juicy red apples from organic orchards.',
    price: 4.99,
    unit: 'kg',
    category: 'Pome',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bccb?auto=format&fit=crop&w=800&q=80',
    stock: 50,
    origin: 'Aomori, Japan',
    nutrition: { calories: 52, fiber: '2.4g', sugar: '10g', vitaminC: '8%' }
  },
  {
    id: 'mango-alphonso',
    name: 'Alphonso Mangoes',
    description: 'The king of fruits. Rich, creamy, and tender textured pulp.',
    price: 12.50,
    unit: 'box',
    category: 'Tropical',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    stock: 20,
    origin: 'Ratnagiri, India',
    nutrition: { calories: 150, fiber: '3g', sugar: '24g', vitaminC: '100%' }
  },
  {
    id: 'blueberry-fresh',
    name: 'Fresh Blueberries',
    description: 'Plump and sweet blueberries, packed with antioxidants.',
    price: 3.99,
    unit: 'punnet',
    category: 'Berry',
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=800&q=80',
    stock: 100,
    origin: 'Oregon, USA',
    nutrition: { calories: 57, fiber: '2.4g', sugar: '10g', vitaminC: '16%' }
  },
  {
    id: 'orange-valencia',
    name: 'Valencia Oranges',
    description: 'Perfect for juicing. Deep orange color and thin skin.',
    price: 2.99,
    unit: 'kg',
    category: 'Citrus',
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80',
    stock: 80,
    origin: 'Valencia, Spain',
    nutrition: { calories: 47, fiber: '2.4g', sugar: '9g', vitaminC: '88%' }
  },
  {
    id: 'banana-cavendish',
    name: 'Cavendish Bananas',
    description: 'Sweet and creamy bananas, perfect for a quick snack.',
    price: 1.50,
    unit: 'kg',
    category: 'Tropical',
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=800&q=80',
    stock: 150,
    origin: 'Ecuador',
    nutrition: { calories: 89, fiber: '2.6g', sugar: '12g', vitaminC: '14%' }
  },
  {
    id: 'strawberry-organic',
    name: 'Organic Strawberries',
    description: 'Sun-ripened, intensely flavored red strawberries.',
    price: 5.50,
    unit: 'punnet',
    category: 'Berry',
    image: 'https://images.unsplash.com/photo-1464965211904-c72145d6907d?auto=format&fit=crop&w=800&q=80',
    stock: 40,
    origin: 'Huelva, Spain',
    nutrition: { calories: 33, fiber: '2g', sugar: '4.9g', vitaminC: '97%' }
  }
];

export const CATEGORIES = ['All', 'Citrus', 'Berry', 'Tropical', 'Pome', 'Stone Fruit', 'Melon'];
