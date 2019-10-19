import { processFile } from "../src";
import testFile from "./testFile";
import { FileResponse, Component, ComponentMetadata, Style } from "figma-js";

describe("processFile", () => {
    const fileResponse = processFile(
        testFile as FileResponse,
        "cLp23bR627jcuNSoBGkhL04E"
    );

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

    it("should keep the same info from styles declaration", () => {
        const { shortcuts } = fileResponse;
        const nodeId = "1:12";

        const originalComponent: Style = testFile.styles[nodeId] as Style;
        const parsedComponent = shortcuts.STYLE.find(
            n => n.id === nodeId
        ) as Component & Style;

        const keys = Object.keys(originalComponent) as [keyof Style];

        keys.forEach(key => {
            expect(originalComponent[key]).toEqual(parsedComponent[key]);
        });
    });

    it("should keep the same info from components declaration", () => {
        const { shortcuts } = fileResponse;
        const nodeId = "1:5";

        const originalComponent: ComponentMetadata =
            testFile.components[nodeId];
        const parsedComponent = shortcuts.COMPONENT.find(
            n => n.id === nodeId
        ) as Component & ComponentMetadata;

        const keys = Object.keys(originalComponent) as [
            keyof ComponentMetadata
        ];

        keys.forEach(key => {
            expect(originalComponent[key]).toEqual(parsedComponent[key]);
        });
    });
});
