import { describe, it, expect } from "vitest";
import { getStockStatus } from "../stockUtils";

describe("stockUtils", () => {
  describe("getStockStatus", () => {
    it("should return 'out' when stock is 0", () => {
      expect(getStockStatus(0)).toBe("out");
    });

    it("should return 'low' when stock is between 1 and 10", () => {
      expect(getStockStatus(1)).toBe("low");
      expect(getStockStatus(5)).toBe("low");
      expect(getStockStatus(10)).toBe("low");
    });

    it("should return 'ok' when stock is greater than 10", () => {
      expect(getStockStatus(11)).toBe("ok");
      expect(getStockStatus(100)).toBe("ok");
    });
  });
});
