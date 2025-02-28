const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const prisma = new PrismaClient();


// Append an egde to a node
const appendEdge = async ( edge, nodeID ) => {
    try {
        const node = await prisma.node.update({
            where: {
                id: parseInt(nodeID)
            },
            data: {
                edges: {
                    connect: {
                        id: edge.id
                    }
                }
            }
        });
        return node;
    } catch (error) {
        return error;
    }
}

// Find edges connected to a node
const getEdges = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const node = await prisma.node.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                edges: true
            }
        });
        res.json(node.edges);
    } catch (error) {
        res.status(500).json({ 'error': error });
    }
}

const getEdgeById = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const edge = await prisma.edge.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(edge);
    } catch (error) {
        res.status(500).json({ 'error': error });
    }
}

// Create an edge connecting two nodes
const createEdge = async (req, res) => {
    const { nodeAId, nodeBId } = req.body;
    try {
        const edge = await prisma.edge.create({
            data: {
                nodeAId,
                nodeBId
            }
        });
        
        await appendEdge(edge, id);
        await appendEdge(edge, nodeBId)
        
        res.json(edge);
    } catch (error) {
        res.status(500).json({ 'error': error });
    }
}

// Remove an edge from a node
const removeEdge = async ( edge, nodeID ) => {
    try {
        const node = await prisma.node.update({
            where: {
                id: parseInt(nodeID)
            },
            data: {
                edges: {
                    disconnect: {
                        id: edge.id
                    }
                }
            }
        });
        return node;
    } catch (error) {
        return json({ 'error': error });
    }
}

// Delete an edge
const deleteEdge = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const edge = await prisma.edge.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        await removeEdge(edge, edge.nodeAId);
        await removeEdge(edge, edge.nodeBId);
        await prisma.edge.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json({ message: 'Edge deleted' });
    } catch (error) {
        res.status(500).json({ 'error': error });
    }
}

module.exports = {
    appendEdge,
    getEdges,
    getEdgeById,
    createEdge,
    removeEdge,
    deleteEdge
};