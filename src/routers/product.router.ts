import { Router } from "express";
import { AppDataSource } from "../db/db.config";
import { Product } from "../entities/product.entity";

const router = Router();

// Add a new product
router.post('/add', async (req, res) => {
    const { name, price } = req.body;
    const productRepository = AppDataSource.getRepository(Product);
    const product = productRepository.create({ name, price });
    await productRepository.save(product);
    res.status(201).json(product);
}) ;

// Get all products
router.get('/all', async (req, res) => {
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find();
    res.json(products);
}) ;

// Update product details
router.put('/update/:id', async (req, res) => {
    const { name, price } = req.body;
    const productRepository = AppDataSource.getRepository(Product);
    const productId = parseInt(req.params.id);
    const product = await productRepository.findOne({ where: {id:productId} });
    if(!product){
        return res.status(404).json({ message: 'Product not found' });
    }
    product.name = name;
    product.price = price;
    await productRepository.save(product);
    res.json(product);
}) ;

// Delete a product
router.delete('/delete/:id', async (req, res) => {
    const productRepository = AppDataSource.getRepository(Product);
    const productId = parseInt(req.params.id);
    const product = await productRepository.findOne({ where: {id:productId} });
    if(!product){
        return res.status(404).json({ message: 'Product not found' });
    }
    await productRepository.remove(product);
    res.json({ message: 'Product deleted' });
}) ;

export default router;