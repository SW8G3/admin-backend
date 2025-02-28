const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Get all nodes
const getNodes = async (req, res) => {
    try {
        const nodes = await prisma.node.findMany();
        res.json(nodes);
    } catch (error) {
        res.status(500).json({ 'error': error });
    }
}

// Get node by id
const getNodeById = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const node = await prisma.node.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(node);
    } catch (error) {
        res.status(500).json({ 'error': error });
    }
}

// Create a new node
const createNode = async (req, res) => {
    const { hasElevator, hasStairs, hasDoor, searchTags, floor, building, edges } = req.body;
    try {
        const node = await prisma.node.create({
            data: {
                hasElevator,
                hasStairs,
                hasDoor,
                searchTags,
                floor,
                building,
                edges
            }
        });
        res.json(node);
    } catch (error) {
        res.status(500).json({ 'error': error });
    }
}

// Update a node
const updateNode = async (req, res) => {
    const id = Number(req.params.id);
    const { hasElevator, hasStairs, hasDoor, searchTags, floor, building, edges } = req.body;
    try {
        const node = await prisma.node.update({
            where: {
                id: parseInt(id)
            },
            data: {
                hasElevator,
                hasStairs,
                hasDoor,
                searchTags,
                floor,
                building,
                edges
            }
        });
        res.json(node);
    } catch (error) {
        res.status(500).json({ 'error': error });
    }
}

// Delete a node
const deleteNode = async (req, res) => {
    const id = Number(req.params.id);
    try {
        await prisma.edge.deleteMany({
            where: {
                OR: [
                    {
                        nodeAId: parseInt(id)
                    },
                    {
                        nodeBId: parseInt(id)
                    }
                ]
            }
        });
        await prisma.node.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json({ message: 'Node deleted' });
    } catch (error) {
        res.status(500).json({ 'error': error });
    }
}

module.exports = {
    getNodes,
    getNodeById,
    createNode,
    updateNode,
    deleteNode
};