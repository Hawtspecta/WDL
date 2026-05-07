from flask import Flask, render_template, jsonify, request
import json
from datetime import datetime

app = Flask(__name__)

# Sample fashion products data
products = [
    {
        "id": 1,
        "name": "Summer Essential Dress",
        "category": "Dresses",
        "price": 129.99,
        "brand": "VogueAI Collection",
        "image_url": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=500&fit=crop",
        "rating": 4.5
    },
    {
        "id": 2,
        "name": "Business Elite Suit",
        "category": "Formal Wear",
        "price": 299.99,
        "brand": "Professional Line",
        "image_url": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop",
        "rating": 4.8
    },
    {
        "id": 3,
        "name": "Evening Glamour Gown",
        "category": "Evening Wear",
        "price": 449.99,
        "brand": "Luxury Collection",
        "image_url": "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400&h=500&fit=crop",
        "rating": 4.9
    },
    {
        "id": 4,
        "name": "Casual Comfort Jeans",
        "category": "Casual Wear",
        "price": 89.99,
        "brand": "Everyday Essentials",
        "image_url": "https://images.unsplash.com/photo-1544966503-7e3c4c355e6a?w=400&h=500&fit=crop",
        "rating": 4.2
    },
    {
        "id": 5,
        "name": "Designer Handbag",
        "category": "Accessories",
        "price": 199.99,
        "brand": "Designer Picks",
        "image_url": "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=500&fit=crop",
        "rating": 4.7
    },
    {
        "id": 6,
        "name": "Silk Scarf Collection",
        "category": "Accessories",
        "price": 59.99,
        "brand": "Luxury Accessories",
        "image_url": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
        "rating": 4.4
    },
    {
        "id": 7,
        "name": "Vintage Leather Jacket",
        "category": "Outerwear",
        "price": 349.99,
        "brand": "Classic Collection",
        "image_url": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=500&fit=crop",
        "rating": 4.6
    },
    {
        "id": 8,
        "name": "Floral Summer Top",
        "category": "Tops",
        "price": 49.99,
        "brand": "Summer Collection",
        "image_url": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
        "rating": 4.3
    },
    {
        "id": 9,
        "name": "Classic White Sneakers",
        "category": "Footwear",
        "price": 119.99,
        "brand": "Urban Style",
        "image_url": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
        "rating": 4.5
    },
    {
        "id": 10,
        "name": "Elegant Watch",
        "category": "Accessories",
        "price": 279.99,
        "brand": "Timeless Classics",
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop",
        "rating": 4.8
    }
]

# Collections data
collections = {
    "summer": {
        "name": "Summer Essentials",
        "description": "Lightweight fabrics and vibrant colors for the perfect summer wardrobe",
        "products": [1, 8, 4, 9],
        "banner_image": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=400&fit=crop"
    },
    "business": {
        "name": "Business Elite",
        "description": "Professional attire that makes a statement in the corporate world",
        "products": [2, 7, 10],
        "banner_image": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=400&fit=crop"
    },
    "evening": {
        "name": "Evening Glamour",
        "description": "Stunning pieces for special occasions and memorable nights out",
        "products": [3, 5, 6],
        "banner_image": "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=1200&h=400&fit=crop"
    },
    "casual": {
        "name": "Casual Comfort",
        "description": "Everyday essentials that combine comfort with contemporary style",
        "products": [4, 8, 9],
        "banner_image": "https://images.unsplash.com/photo-1544966503-7e3c4c355e6a?w=1200&h=400&fit=crop"
    },
    "accessories": {
        "name": "Accessories",
        "description": "Complete your look with our curated selection of accessories",
        "products": [5, 6, 10],
        "banner_image": "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&h=400&fit=crop"
    }
}

@app.route('/')
def index():
    """Homepage route - renders the main fashion discovery page"""
    return render_template('index.html', collections=collections)

@app.route('/collections')
def collections_list():
    """Collections page - shows all available fashion collections"""
    return render_template('collections.html', collections=collections)

@app.route('/collection/<name>')
def collection_detail(name):
    """Dynamic route for individual collection pages"""
    if name not in collections:
        return render_template('404.html'), 404
    
    collection = collections[name]
    collection_products = [product for product in products if product['id'] in collection['products']]
    
    return render_template('collection_detail.html', 
                         collection=collection, 
                         products=collection_products,
                         collection_name=name)

@app.route('/about')
def about():
    """Static about page"""
    return render_template('about.html')

# API Routes for EXP 5
@app.route('/api/products', methods=['GET'])
def get_products():
    """GET /api/products - returns list of all fashion products as JSON"""
    return jsonify({
        "status": "success",
        "data": products,
        "count": len(products),
        "timestamp": datetime.now().isoformat()
    }), 200

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """GET /api/products/<id> - returns single product by ID"""
    product = next((p for p in products if p['id'] == product_id), None)
    
    if product is None:
        return jsonify({
            "status": "error",
            "message": f"Product with ID {product_id} not found"
        }), 404
    
    return jsonify({
        "status": "success",
        "data": product,
        "timestamp": datetime.now().isoformat()
    }), 200

@app.route('/api/collections', methods=['GET'])
def get_collections():
    """GET /api/collections - returns list of all collections"""
    return jsonify({
        "status": "success",
        "data": collections,
        "count": len(collections),
        "timestamp": datetime.now().isoformat()
    }), 200

@app.route('/api/collections/<name>', methods=['GET'])
def get_collection_products(name):
    """GET /api/collections/<name> - returns products in a specific collection"""
    if name not in collections:
        return jsonify({
            "status": "error",
            "message": f"Collection '{name}' not found"
        }), 404
    
    collection = collections[name]
    collection_products = [product for product in products if product['id'] in collection['products']]
    
    return jsonify({
        "status": "success",
        "data": {
            "collection": collection,
            "products": collection_products
        },
        "timestamp": datetime.now().isoformat()
    }), 200

@app.errorhandler(404)
def not_found(error):
    """Custom 404 error handler"""
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    """Custom 500 error handler"""
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
