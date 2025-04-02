const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await prisma.user.findMany({
            where: {
                username: username
            }
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        for (let i = 0; i < user.length; i++) {
            const isPasswordValid = await bcrypt.compare(password, user[i].password);
            if (isPasswordValid) {
                const token = jwt.sign({ id: user[i].id }, process.env.JWT_SECRET, { expiresIn: '24h' });
                return res.json({ token });
            }

        }
        return res.status(401).json({ message: 'Invalid username or password' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const createUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword
            }
        });
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                username: username,
                password: hashedPassword
            }
        });
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({
            where: {
                id: Number(id)
            }
        });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    login,
    createUser,
    getUser,
    updateUser,
    deleteUser
};
