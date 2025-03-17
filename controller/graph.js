const { PrismaClient } = require("@prisma/client");
//const { json } = require('express');
const prisma = new PrismaClient();

const uploadGraph = async (req, res) => {
    console.log(req.body);
    // First drop all edges and nodes from the database
    try {
        await prisma.edge.deleteMany();
        await prisma.node.deleteMany();
    } catch (error) {
        res.status(500).json({ error: error });
        console.error(error);
    }
    // Then upload the new graph
    try {
        const nodes = req.body.nodes;
        const edges = req.body.edges;
        await prisma.node.createMany({
            data: nodes,
        });
        await prisma.edge.createMany({
            data: edges,
        });

        // Drop all directions with no image
        await prisma.direction.deleteMany({
            where: {
                imageUrl: null,
            },
        });

        for (let i = 0; i < edges.length; i++) {
            // Ensure that database does not contain duplicate directions, i.e., skip iteration if there exists one with the same nodeId and edgeId
            const direction = await prisma.direction.findFirst({
                where: {
                    nodeId: edges[i].from,
                    edgeId: edges[i].id,
                },
            });
            if (direction) continue

            await prisma.direction.create({
                data: {
                    nodeId: edges[i].from,
                    edgeId: edges[i].id,
                    //imageUrl: null,
                },
            });

            await prisma.direction.create({
                data: {
                    nodeId: edges[i].to,
                    edgeId: edges[i].id,
                    //imageUrl: null,
                },
            });
        }

        res.json({ message: "Graph uploaded" });
    } catch (error) {
        res.status(500).json({ error: error });
        console.error(error);
    }
};

const downloadGraph = async (req, res) => {
    try {
        const nodes = await prisma.node.findMany();
        const edges = await prisma.edge.findMany();
        res.json({ nodes, edges });
    } catch (error) {
        res.status(500).json({ error: error });
        console.error(error);
    }
};

const getDirectionPhoto = async (req, res) => {
    try {
        const direction = await prisma.direction.findFirst({
            where: {
                nodeId: req.body.nodeId,
                edgeId: req.body.edgeId,
            },
        });
        if (!direction) {
            res.status(404).json({ error: "Direction not found" });
            return;
        }
        console.log(direction);
        res.json({ imageUrl: direction.imageUrl });
    } catch (error) {
        res.status(500).json({ error: error });
        console.error(error);
    }
};

/**
 * 
 * @param {Node} from 
 * @param {Node} to 
 * 
 * @returns {Array<Node>}
 */

module.exports = {
    uploadGraph,
    downloadGraph,
    getDirectionPhoto,
};
