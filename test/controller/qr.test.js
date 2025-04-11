jest.mock("@prisma/client", () => {
    const mockFindUnique = jest.fn(); 
    return {
      PrismaClient: jest.fn(() => ({
        node: {
          findUnique: mockFindUnique,
        },
      })),
      __mockFindUnique: mockFindUnique,
    };
  });
  
  const { getQrCode } = require("./qr");
  const { __mockFindUnique } = require("@prisma/client");
  
  describe("getQrCode", () => {
    let mockReq, mockRes;
  
    beforeEach(() => {
      mockReq = {
        params: { id: "1" },
      };
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
        setHeader: jest.fn(),
      };
      __mockFindUnique.mockReset(); 
    });
  
    test("Should return 404 if node not found", async () => {
      __mockFindUnique.mockResolvedValue(null);
  
      await getQrCode(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Node not found" });
    });
  
    test("Should return 404 if QR code not found", async () => {
      __mockFindUnique.mockResolvedValue({ id: 1 });
  
      await getQrCode(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "QR code not found" });
    });
  
    test("Should return QR code image if found", async () => {
      const fakeBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA";
      __mockFindUnique.mockResolvedValue({ id: 1, qrCode: fakeBase64 });
  
      await getQrCode(mockReq, mockRes);
  
      expect(mockRes.setHeader).toHaveBeenCalledWith("Content-Type", "image/png");
      expect(mockRes.send).toHaveBeenCalledWith(Buffer.from(fakeBase64.split(",")[1], "base64"));
    });
  
    test("Should return 500 on error", async () => {
      __mockFindUnique.mockRejectedValue(new Error("DB error"));
  
      await getQrCode(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });