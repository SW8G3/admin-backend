const { uploadGraph, downloadGraph } = require('./graph.js');
const QRCode = require("qrcode");

// Mock prisma client
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
    return {
        PrismaClient: jest.fn(() => mockPrisma),
    };
});

// Mock QRCode
jest.mock("qrcode", () => ({
    toDataURL: jest.fn(),
}));

describe("Graph API", () => {
    let prisma; // Declare prisma here

    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new (require('@prisma/client')).PrismaClient(); // Instantiate the Prisma client
    });

    test("uploadGraph should delete and insert graph data", async () => {
        const mockReq = {
            body: {
                nodes: [
                    { id: 1, isWaypoint: true },
                    { id: 2, isWaypoint: false },
                ],
                edges: [{ id: "e1", from: 1, to: 2 }],
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        QRCode.toDataURL.mockResolvedValue("mockedQRCode");

        await uploadGraph(mockReq, mockRes);

        // Use the mocked prisma client in the test
        expect(prisma.node.deleteMany).toHaveBeenCalled();
        expect(prisma.edge.deleteMany).toHaveBeenCalled();
        expect(QRCode.toDataURL).toHaveBeenCalledWith("https://localhost:5173/destination/node/1");

        expect(prisma.node.createMany).toHaveBeenCalledWith({
            data: expect.any(Array),
        });
        expect(prisma.edge.createMany).toHaveBeenCalledWith({
            data: mockReq.body.edges,
        });
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Graph uploaded" });
    });

    test("downloadGraph should return nodes and edges", async () => {
        const mockNodes = [{ id: 1 }];
        const mockEdges = [{ id: "e1" }];

        prisma.node.findMany.mockResolvedValue(mockNodes);
        prisma.edge.findMany.mockResolvedValue(mockEdges);

        const mockReq = {};
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await downloadGraph(mockReq, mockRes);

        expect(prisma.node.findMany).toHaveBeenCalled();
        expect(prisma.edge.findMany).toHaveBeenCalled();
        expect(mockRes.json).toHaveBeenCalledWith({
            nodes: mockNodes,
            edges: mockEdges,
        });
    });
});