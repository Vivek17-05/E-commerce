import { Router } from "express";
import { AppDataSource } from "../db/db.config";
import { User } from "../entities/user.entity";
import { Product } from "../entities/product.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth.middleware";

const router = Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: {email: email } });

    if(existingUser){
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = userRepository.create({ name, email, password });
    await userRepository.save(user);

    res.status(201).json(user);
}) ;

// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email: email } });

    if(!user){
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Compare the password
    const validPassword  = await bcrypt.compare(password, user.password);
    if(!validPassword){
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Generate a token
    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY as string, { expiresIn: '1h' });
    res.json({ token });
}) ;

// Updating user details
router.put('/update', auth, async (req, res) => {
    const { name, email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: {id: (req as any).token.id  }});

    if(!user){
        return res.status(404).json({ message: 'User not found' });
    }
    if(name){
        user.name = name;
    }
    if(email){
        user.email = email;
    }
    if(password){
        user.password = password? await bcrypt.hash(password, 10): user.password;
    }

    await userRepository.save(user);
    res.json(user);
});

// Deleting a user
router.delete('/delete', auth, async (req, res) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: {id: (req as any).token.id  }});

    if(!user){
        return res.status(404).json({ message: 'User not found' });
    }
    await userRepository.remove(user);
    res.json({ message: 'User deleted' });
}) ;

// Get user cart
router.get('/cart', auth, async (req, res) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne( { where: {
        id: (req as any).token.id
    }, relations: ['cart'] });
    if(!user){
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.cart);
}) ;

// Add product to cart
router.post('/cart/:id', auth, async (req, res) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: {id: (req as any).token.id  }});
    if(!user){
        return res.status(404).json({ message: 'User not found' });
    }
    const productRepository = AppDataSource.getRepository(Product);
    const productId = parseInt(req.params.id);
    const product = await productRepository.findOne({ where: { id: productId } });

    if(!product){
        return res.status(404).json({ message: 'Product not found' });
    }
    console.log(product) ;
    console.log(user.cart) ;
    if(!user.cart){
        user.cart = [] ;
    }
    user.cart.push(product);
    await userRepository.save(user);
    res.json(user.cart);
});

export default router;