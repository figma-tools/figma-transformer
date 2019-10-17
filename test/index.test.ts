import { processFile } from "../src";
import testFile from "./testFile";
import { FileResponse } from "figma-js";

describe("processFile", () => {
    const fileResponse = processFile(testFile as FileResponse, "cLp23bR627jcuNSoBGkhL04E");

    it("should have correct structure", () => {
        expect(Object.keys(fileResponse)).toEqual([
            "fileId",
            "name",
            "lastModified",
            "thumbnailUrl",
            "version",
            "children",
            "shortcuts",
        ]);
    });

    it("should have the right file information", () => {
        const { fileId, name, version } = fileResponse;

        expect(fileId).toEqual("cLp23bR627jcuNSoBGkhL04E");
        expect(name).toEqual("figma-graphql test file");
        expect(version).toEqual("156513791");
    });
});
