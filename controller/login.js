const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const prisma = new PrismaClient();


const getToken = async ( req, res ) => {
    try {
        res.send("You are in! You hacker...");
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
  getToken
};