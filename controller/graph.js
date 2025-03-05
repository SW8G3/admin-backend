const { PrismaClient } = require('@prisma/client');
//const { json } = require('express');
const prisma = new PrismaClient();



const uploadGraph = async (req, res) => {
    console.log(req.body);
    try {
        const nodes = req.body.nodes;
        const edges = req.body.edges;
        await prisma.node.createMany({
            data: nodes
        });
        await prisma.edge.createMany({
            data: edges
        });
        res.json({ message: 'Graph uploaded' });
    }
    catch (error) {
        res.status(500).json({ 'error': error });
    }
}



module.exports = {
    uploadGraph
};