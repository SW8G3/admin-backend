const { uploadGraph, downloadGraph } = require("./graph");
const { PrismaClient } = require("@prisma/client");
const QRCode = require("qrcode");

// Mock Prisma client
jest.mock("@prisma/client", () => {
    const mockPrisma = {
        node: {
            deleteMany: jest.fn(),
            createMany: jest.fn(),
            findMany: jest.fn(),
        },
        edge: {
            deleteMany: jest.fn(),
            createMany: jest.fn(),
            findMany: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

// Mock QRCode generation
jest.mock("qrcode", () => ({
    toDataURL: jest.fn(),
}));

const prisma = new PrismaClient();

describe("Graph Controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("uploadGraph", () => {
        it("should upload nodes and edges successfully", async () => {
            const req = {
                body: {
                    nodes: [
                        { id: "1", isWaypoint: true, qrCode: null },
                        { id: "2", isWaypoint: false },
                    ],
                    edges: [
                        { from: "1", to: "2" },
                    ],
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            QRCode.toDataURL.mockResolvedValue("mockQRCode");

            await uploadGraph(req, res);

            expect(prisma.node.deleteMany).toHaveBeenCalled();
            expect(prisma.edge.deleteMany).toHaveBeenCalled();
            expect(prisma.node.createMany).toHaveBeenCalledWith({
                data: [
                    { id: "1", isWaypoint: true, qrCode: "mockQRCode" },
                    { id: "2", isWaypoint: false },
                ],
            });
            expect(prisma.edge.createMany).toHaveBeenCalledWith({
                data: [{ from: "1", to: "2" }],
            });
            expect(res.json).toHaveBeenCalledWith({ message: "Graph uploaded" });
        });

        it("should return an error if stray nodes are detected", async () => {
            const req = {
                body: {
                    nodes: [
                        { id: "1", isWaypoint: true, qrCode: null },
                        { id: "2", isWaypoint: false },
                        { id: "3", isWaypoint: false },
                    ],
                    edges: [
                        { from: "1", to: "2" },
                    ],
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await uploadGraph(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "Stray nodes detected. The following node IDs are not connected to any edges: 3",
            });
        });

        it("should handle errors during database operations", async () => {
            prisma.node.deleteMany.mockRejectedValue(new Error("Database error"));

            const req = { body: { nodes: [], edges: [] } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await uploadGraph(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: new Error("Database error") });
        });
    });

    describe("downloadGraph", () => {
        it("should return nodes and edges successfully", async () => {
            const mockNodes = [{ id: "1" }, { id: "2" }];
            const mockEdges = [{ from: "1", to: "2" }];

            prisma.node.findMany.mockResolvedValue(mockNodes);
            prisma.edge.findMany.mockResolvedValue(mockEdges);

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await downloadGraph(req, res);

            expect(prisma.node.findMany).toHaveBeenCalled();
            expect(prisma.edge.findMany).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ nodes: mockNodes, edges: mockEdges });
        });

        it("should handle errors during database operations", async () => {
            prisma.node.findMany.mockRejectedValue(new Error("Database error"));

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await downloadGraph(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: new Error("Database error") });
        });
    });
});