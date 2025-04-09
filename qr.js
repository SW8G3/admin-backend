const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getQrCode = async (req, res) => {
    const { id } = req.params;
    
    try {
        const node = await prisma.node.findUnique({
            where: { id: parseInt(id) },
        });

        if (!node) {
            return res.status(404).json({ error: "Node not found" });
        }

        const qrData = node.qrCode;
        if (!qrData) {
            return res.status(404).json({ error: "QR code not found" });
        }
        res.setHeader("Content-Type", "image/png");
        res.send(Buffer.from(qrData.split(",")[1], "base64"));
    }
    catch (error) {
        console.error("Error fetching QR code:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    getQrCode,
};