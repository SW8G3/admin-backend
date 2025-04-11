const { getQrCode } = require("../../controller/qr");
const { PrismaClient } = require("@prisma/client");


jest.mock("@prisma/client", () => {
    const mockPrisma = {
        node: {
            findUnique: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient();

describe("getQrCode", () => {
    let req, res;

    beforeEach(() => {
        req = { params: { id: "1" } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            setHeader: jest.fn(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 404 if the node is not found", async () => {
        prisma.node.findUnique.mockResolvedValue(null);

        await getQrCode(req, res);

        expect(prisma.node.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Node not found" });
    });

    it("should return 404 if the QR code is not found", async () => {
        prisma.node.findUnique.mockResolvedValue({ qrCode: null });

        await getQrCode(req, res);

        expect(prisma.node.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "QR code not found" });
    });

    it("should return the QR code as an image", async () => {
        const mockQrCode = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA";
        prisma.node.findUnique.mockResolvedValue({ qrCode: mockQrCode });

        await getQrCode(req, res);

        expect(prisma.node.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        });
        expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "image/png");
        expect(res.send).toHaveBeenCalledWith(
            Buffer.from(mockQrCode.split(",")[1], "base64")
        );
    });

    it("should return 500 if an error occurs", async () => {
        prisma.node.findUnique.mockRejectedValue(new Error("Database error"));

        await getQrCode(req, res);

        expect(prisma.node.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
});