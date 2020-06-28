import { Node } from "figma-js";
import { uniqBy, groupBy, groupNodes } from "../utils";

describe("uniqBy", () => {
    it("should return unique values by key", () => {
        const nodes = [
            { name: "node 1", id: "1", type: "VECTOR" },
            { name: "node 2", id: "2", type: "VECTOR" },
            { name: "node 2", id: "3", type: "VECTOR" },
        ];

        expect(uniqBy(nodes, "id")).toHaveLength(3);
        expect(uniqBy(nodes, "name")).toHaveLength(2);
        expect(uniqBy(nodes, "type")).toHaveLength(1);
    });

    it("should handle undefined array", () => {
        const nodes: any[] = [];

        expect(uniqBy(nodes, "id")).toHaveLength(0);
    });
});

describe("groupBy", () => {
    it("should group values by key", () => {
        const nodes = [
            { name: "node 1", id: "1", type: "VECTOR" },
            { name: "node 2", id: "2", type: "VECTOR" },
            { name: "node 2", id: "3", type: "VECTOR" },
        ];

        const groupById = groupBy(nodes, "id");
        expect(Object.keys(groupById)).toHaveLength(3);
        Object.values(groupById).forEach(val => {
            expect(val).toHaveLength(1);
        });

        const groupByName = groupBy(nodes, "name");
        expect(Object.keys(groupByName)).toHaveLength(2);
        expect(groupByName["node 1"]).toHaveLength(1);
        expect(groupByName["node 2"]).toHaveLength(2);

        const groupByType = groupBy(nodes, "type");
        expect(Object.keys(groupByType)).toHaveLength(1);
        expect(groupByType.VECTOR).toHaveLength(3);
    });
});

describe("groupNodes", () => {
    it("should group unique id nodes by type", () => {
        const nodes = [
            { name: "node 1", id: "1", type: "VECTOR" },
            { name: "node 2", id: "2", type: "VECTOR" },
            { name: "node 2", id: "3", type: "VECTOR" },
            { name: "node 4", id: "2", type: "VECTOR" },
            { name: "node 5", id: "5", type: "RECTANGLE" },
        ] as Node[];

        const groupedNodes = groupNodes(nodes);

        expect(groupedNodes.vectors).toHaveLength(3);
        expect(groupedNodes.rectangles).toHaveLength(1);
    });
});
