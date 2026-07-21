const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample fashion collections data
const collections = [
    {
        id: 1,
        name: "Summer Collection 2024",
        description: "Trending summer fashion items",
        items: [
            { id: 1, name: "Floral Dress", price: 89.99, category: "Dresses" },
            { id: 2, name: "Denim Shorts", price: 49.99, category: "Bottoms" },
            { id: 3, name: "Sandals", price: 39.99, category: "Footwear" }
        ]
    },
    {
        id: 2,
        name: "Winter Essentials",
        description: "Cozy winter fashion must-haves",
        items: [
            { id: 4, name: "Wool Coat", price: 199.99, category: "Outerwear" },
            { id: 5, name: "Cashmere Sweater", price: 129.99, category: "Knitwear" },
            { id: 6, name: "Leather Boots", price: 159.99, category: "Footwear" }
        ]
    },
    {
        id: 3,
        name: "Street Style",
        description: "Urban fashion trends",
        items: [
            { id: 7, name: "Graphic Tee", price: 29.99, category: "Tops" },
            { id: 8, name: "Cargo Pants", price: 69.99, category: "Bottoms" },
            { id: 9, name: "Sneakers", price: 89.99, category: "Footwear" }
        ]
    }
];

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'VogueAI Collections API - Running on port 5000' });
});

app.get('/api/collections', (req, res) => {
    res.json(collections);
});

app.get('/api/collections/:id', (req, res) => {
    const collection = collections.find(c => c.id === parseInt(req.params.id));
    if (!collection) {
        return res.status(404).json({ error: 'Collection not found' });
    }
    res.json(collection);
});

app.get('/api/products', (req, res) => {
    const allProducts = collections.flatMap(c => c.items);
    res.json(allProducts);
});

app.get('/api/products/:id', (req, res) => {
    const allProducts = collections.flatMap(c => c.items);
    const product = allProducts.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

// Start server
app.listen(PORT, () => {
    console.log(`VogueAI Collections API running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('- GET /api/collections');
    console.log('- GET /api/collections/:id');
    console.log('- GET /api/products');
    console.log('- GET /api/products/:id');
});
