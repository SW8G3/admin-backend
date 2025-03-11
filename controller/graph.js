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

        for (let i = 0; i < edges.length; i++) {
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

module.exports = {
    uploadGraph,
    downloadGraph,
};
