const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const QRCode = require("qrcode");

const generateQRCode = async (link) => {
    try {
        const qrCodeDataURL = await QRCode.toDataURL(link);
        console.log('QR Code generated successfully!');
        return qrCodeDataURL; // This is a base64-encoded image
    } catch (error) {
        console.error('Error generating QR Code:', error);
        throw error;
    }
};


const uploadGraph = async (req, res) => {
    // Backup existing graph and dump it to a file as JSON
    try {
        const nodes = await prisma.node.findMany();
        const edges = await prisma.edge.findMany();

        // Convert to JSON
        const graphData = JSON.stringify({ nodes, edges }, null, 2);

        // Write to new file with timestamp
        const fs = require("fs");
        const path = require("path");
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const backupFilePath = path.join(__dirname, "..", "backup", `graph-backup-${timestamp}.json`);
        fs.writeFileSync(backupFilePath, graphData);
        console.log(`Graph backup created at ${backupFilePath}`);

    } catch (error) {
        console.error("Error creating graph backup:", error);
        return res.status(500).json({ error: "Error creating graph backup" });
    }

    // Check if the request body contains nodes and edges
    if (!req.body || !req.body.nodes || !req.body.edges) {
        return res.status(400).json({ error: "Invalid request body" });
    }
    console.log(req.body);

    const nodes = req.body.nodes;
    const edges = req.body.edges;

    // Get all node ids that are not connected to any edge
    const nodeIds = nodes.map((node) => node.id);
    const edgeNodeIds = edges.flatMap((edge) => [edge.nodeA, edge.nodeB]);
    const unconnectedNodeIds = nodeIds.filter((id) => !edgeNodeIds.includes(id));

    // Return with an error if there are unconnected nodes
    if (unconnectedNodeIds.length > 0) {
        return res.status(400).json({
            error: "Graph contains unconnected nodes",
            unconnectedNodeIds: unconnectedNodeIds,
        });
    }

    // Drop every node and edge
    try {
        await prisma.node.deleteMany();
        await prisma.edge.deleteMany();
    } catch (error) {
        res.status(500).json({ error: error });
        console.error(error);
    }


    // Then upload the new graph
    try {
        const nodes = req.body.nodes;
        const edges = req.body.edges;

        const baseUrl = "https://10.92.0.113:5173/"; // URL of mobile-frontend

        // Get all node ids that are not connected to any edge
        const nodeIds = nodes.map((node) => node.id);
        const edgeNodeIds = edges.flatMap((edge) => [edge.nodeA, edge.nodeB]);
        const unconnectedNodeIds = nodeIds.filter((id) => !edgeNodeIds.includes(id));

        // Return with an error if there are unconnected nodes
        if (unconnectedNodeIds.length > 0) {
            return res.status(400).json({
                error: "Graph contains unconnected nodes",
                unconnectedNodeIds: unconnectedNodeIds,
            });
        }



        // For each waypoint node, generate a QR code if it does not already exist
        for (const node of nodes) {
            if (!node.qrCode && node.isWaypoint) {
                // TODO: Replace with actual URL eventually
                const qrCode = await generateQRCode(`${baseUrl}destination/node/${node.id}`);
                node.qrCode = qrCode;
            }
        }

        await prisma.node.createMany({
            data: nodes,
        });
        await prisma.edge.createMany({
            data: edges,
        });

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
