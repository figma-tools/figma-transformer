import { processFile } from "..";
import testFile from "./testFile.json";
import {
    FileResponse,
    ComponentMetadata,
    Style,
    Text,
    VectorBase,
    Component,
} from "figma-js";

describe("processFile", () => {
    const fileResponse = processFile(testFile as FileResponse);

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

        expect(fileId).toBeUndefined();
        expect(name).toEqual("figma-graphql test file");
        expect(version).toBeDefined();
    });

    it("should have the fileId when defined", () => {
        const { fileId, name, version } = processFile(
            testFile as FileResponse,
            "cLp23bR627jcuNSoBGkhL04E"
        );

        expect(fileId).toEqual("cLp23bR627jcuNSoBGkhL04E");
        expect(name).toEqual("figma-graphql test file");
        expect(version).toBeDefined();
    });

    it("should keep the same info from styles declaration", () => {
        const { shortcuts } = fileResponse;
        const nodeId = "1:12";

        const originalComponent: Style = testFile.styles[nodeId] as Style;
        const parsedComponent = shortcuts.styles.find(n => n.id === nodeId);
        const keys = Object.keys(originalComponent) as [keyof Style];

        keys.forEach(key => {
            expect(originalComponent[key]).toEqual(
                parsedComponent && parsedComponent[key]
            );
        });
    });

    it("should keep the same info from components declaration", () => {
        const { shortcuts } = fileResponse;
        const nodeId = "1:5";

        const originalComponent: ComponentMetadata =
            testFile.components[nodeId];
        const parsedComponent = shortcuts.components.find(n => n.id === nodeId);

        const keys = Object.keys(originalComponent) as [
            keyof ComponentMetadata
        ];

        expect(parsedComponent).toBeDefined();

        keys.forEach(key => {
            expect(originalComponent[key]).toEqual(
                parsedComponent && parsedComponent[key]
            );
        });
    });

    it("should create the correct shortcuts", () => {
        const { shortcuts } = fileResponse;
        expect(shortcuts.pages).toHaveLength(2);
        expect(shortcuts.instances).toHaveLength(2);
        expect(shortcuts.rectangles).toHaveLength(4);
        expect(shortcuts.styles).toHaveLength(
            Object.keys(testFile.styles).length
        );
        expect(shortcuts.texts).toHaveLength(4);
        expect(shortcuts.frames).toHaveLength(3);
        expect(shortcuts.components).toHaveLength(
            Object.keys(testFile.components).length
        );
        expect(shortcuts.groups).toHaveLength(1);
    });

    it("should add fill styles to STYLE shortcut", () => {
        const { shortcuts } = fileResponse;
        const { styles } = shortcuts;

        const style = styles.find(style => style.styleType === "FILL");

        expect(style).toBeDefined();

        const originalStyles = getObjects(
            testFile,
            style?.styleType.toLowerCase(),
            style?.id
        );

        const originalStyle = originalStyles[0] as VectorBase;

        expect(style?.styles).toBe(originalStyle.fills);
    });

    it("should add text styles to STYLE shortcut", () => {
        const { shortcuts } = fileResponse;
        const { styles } = shortcuts;
        const style = styles.find(style => style.styleType === "TEXT");

        expect(style).toBeDefined();

        const originalStyles = getObjects(
            testFile,
            style?.styleType.toLowerCase(),
            style?.id
        );

        const originalStyle = originalStyles[0] as Text;

        expect(style?.textStyles).toBe(originalStyle.style);
    });

    it("should add effect styles to STYLE shortcut", () => {
        const { shortcuts } = fileResponse;
        const { styles } = shortcuts;
        const style = styles.find(style => style.styleType === "EFFECT");

        expect(style).toBeDefined();

        const originalStyles = getObjects(
            testFile,
            style?.styleType.toLowerCase(),
            style?.id
        );

        const originalStyle = originalStyles[0] as VectorBase;

        expect(style?.styles).toBe(originalStyle.effects);
    });

    it("should add component info to COMPONENT shortcut", () => {
        const { shortcuts } = fileResponse;
        const { components } = shortcuts;
        const component = components.find(
            component => component.name === "Rectangle"
        );

        expect(component).toBeDefined();

        const originalComponents = getObjects(testFile, "id", component?.id);
        const originalComponent = originalComponents[0] as Component;
        const {
            children,
            ...originalComponentWithoutChildren
        } = originalComponent;

        Object.entries(originalComponentWithoutChildren).forEach(
            ([key, val]) => {
                expect(component && component[key as keyof Component]).toEqual(
                    val
                );
            }
        );

        expect(component?.children).toHaveLength(children.length);
    });
});

function getObjects(
    obj: Record<string, any>,
    key?: string,
    val?: any,
    parent?: any
): Record<string, any>[] {
    var objects: Record<string, any>[] = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == "object") {
            objects = objects.concat(getObjects(obj[i], key, val, obj));
        }
        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        else if ((i === key && obj[i] === val) || (i === key && val === "")) {
            //
            objects.push(parent);
        } else if (obj[i] === val && key === "") {
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) === -1) {
                objects.push(parent);
            }
        }
    }
    return objects.flat();
}
