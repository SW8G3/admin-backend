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
            // Check for a direction from the "from" node to the edge
            const fromDirection = await prisma.direction.findFirst({
                where: {
                    nodeId: edges[i].from,
                    edgeId: edges[i].id,
                },
            });
            if (!fromDirection) {
                await prisma.direction.create({
                    data: {
                        nodeId: edges[i].from,
                        edgeId: edges[i].id,
                    },
                });
            }

            // Check for a direction from the "to" node to the edge
            const toDirection = await prisma.direction.findFirst({
                where: {
                    nodeId: edges[i].to,
                    edgeId: edges[i].id,
                },
            });
            if (!toDirection) {
                await prisma.direction.create({
                    data: {
                        nodeId: edges[i].to,
                        edgeId: edges[i].id,
                    },
                });
            }
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

function findRoute(from, to, edges, directions) {
    console.log("From:", from, "To:", to, "Edges:", edges, "Directions:", directions);
    const visited = new Set();
    const queue = [];
    const parent = {};

    queue.push(from);
    visited.add(from.id);

    while (queue.length > 0) {
        const current = queue.shift();
        console.log("Current Node:", current);

        if (current.id === to.id) {
            const route = [];
            let node = to;
            while (node.id !== from.id) {
                route.push(node);
                node = parent[node.id];
            }
            route.push(from);
            return route.reverse();
        }

        // Traverse edges
        for (let i = 0; i < edges.length; i++) {
            if (edges[i].from === current.id && !visited.has(edges[i].to)) {
                visited.add(edges[i].to);
                parent[edges[i].to] = current;
                queue.push({ id: edges[i].to });
            } else if (edges[i].to === current.id && !visited.has(edges[i].from)) {
                visited.add(edges[i].from);
                parent[edges[i].from] = current;
                queue.push({ id: edges[i].from });
            }
        }

        // Traverse directions (if applicable)
        for (let i = 0; i < directions.length; i++) {
            if (directions[i].nodeId === current.id && !visited.has(directions[i].edgeId)) {
                visited.add(directions[i].edgeId);
                parent[directions[i].edgeId] = current;
                queue.push({ id: directions[i].edgeId });
            }
        }
    }

    return [];
}

const getRoute = async (req, res) => {

    try {
        const from = await prisma.node.findFirst({
            where: {
                id: req.body.from,
            },
        });
        if (!from) {
            res.status(404).json({ error: "Node not found" });
            return;
        }
        const to = await prisma.node.findFirst({
            where: {
                id: req.body.to,
            },
        });
        if (!to) {
            res.status(404).json({ error: "Node not found" });
            return;
        }
        
        const edges = await prisma.edge.findMany();
        const directions = await prisma.direction.findMany();
        const route = findRoute(from, to, edges, directions);
        console.log("From Node:", from);
        console.log("To Node:", to);
        console.log("Edges:", edges);
        console.log("Directions:", directions);
        res.json({ route });
    } catch (error) {
        res.status(500).json({ error: error });
        console.error(error);
    }
}

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
    getRoute,
    getDirectionPhoto,
};
