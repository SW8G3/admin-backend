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

/**
 * A* algorithm to find the shortest path between two nodes.
 * @param {Object} start - The starting node.
 * @param {Object} goal - The goal node.
 * @param {Array<Object>} edges - The list of edges in the graph.
 * @param {Function} heuristic - The heuristic function to estimate cost.
 * @returns {Array<Object>} - The shortest path as a list of nodes.
 */
function aStarRoute(start, goal, edges, heuristic) {
    const openSet = new Set([start.id]);
    const cameFrom = new Map();

    const gScore = new Map();
    gScore.set(start.id, 0);

    const fScore = new Map();
    fScore.set(start.id, heuristic(start, goal));

    while (openSet.size > 0) {
        // Get the node in openSet with the lowest fScore
        let current = null;
        let lowestFScore = Infinity;
        for (const nodeId of openSet) {
            const score = fScore.get(nodeId) || Infinity;
            if (score < lowestFScore) {
                lowestFScore = score;
                current = nodeId;
            }
        }

        if (current === goal.id) {
            // Reconstruct the path
            const path = [];
            while (current) {
                path.unshift(current);
                current = cameFrom.get(current);
            }
            return path;
        }

        openSet.delete(current);

        // Get neighbors of the current node
        const neighbors = edges.filter(edge => edge.from === current || edge.to === current);
        for (const edge of neighbors) {
            const neighbor = edge.from === current ? edge.to : edge.from;

            // Ensure gScore for current is initialized
            const tentativeGScore = (gScore.get(current) ?? Infinity) + (edge.distance || 1);

            if (tentativeGScore < (gScore.get(neighbor) ?? Infinity)) {
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentativeGScore);
                fScore.set(neighbor, tentativeGScore + heuristic({ id: neighbor }, goal));

                if (!openSet.has(neighbor)) {
                    openSet.add(neighbor);
                }
            }
        }
    }

    // If we reach here, no path was found
    return [];
}

// Example heuristic function (Euclidean distance)
function heuristic(nodeA, nodeB) {
    // Replace with actual coordinates if available
    const dx = (nodeA.position?.[0] || 0) - (nodeB.position?.[0] || 0);
    const dy = (nodeA.position?.[1] || 0) - (nodeB.position?.[1] || 0);
    return Math.sqrt(dx * dx + dy * dy);
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
        const route = aStarRoute(from, to, edges, heuristic);
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
