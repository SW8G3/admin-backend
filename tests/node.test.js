const { getNodes, getNodeById, createNode, updateNode, deleteNode, dropNodes } = require('../controller/node');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        node: {
            findMany: jest.fn()
        }
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe('Node Controller', () => {
    test('should get all nodes', async () => {
        const mockNodes = [{ id: 1, name: 'Node 1' }, { id: 2, name: 'Node 2' }];
        prisma.node.findMany.mockResolvedValue(mockNodes);

        const req = {};
        const res = {
            json: jest.fn()
        };

        await getNodes(req, res);

        expect(prisma.node.findMany).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(mockNodes);
    });

    test('should get node by id', async () => {
        // Mock implementation and assertions for getNodeById
    });

    test('should create a new node', async () => {
        // Mock implementation and assertions for createNode
    });

    test('should update a node', async () => {
        // Mock implementation and assertions for updateNode
    });

    test('should delete a node', async () => {
        // Mock implementation and assertions for deleteNode
    });

    test('should drop all nodes', async () => {
        // Mock implementation and assertions for dropNodes
    });
});
