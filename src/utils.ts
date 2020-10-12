import { Node } from "figma-js";
import fromEntries from "object.fromentries";
import { Shortcuts, ShortcutType } from "./types";

export function uniqBy(arr: any[], key: string) {
    const set = new Set();
    return arr.filter(el => (v => !set.has(v) && set.add(v))(el[key]));
}

export function groupBy(arr: any[], key: string) {
    return arr.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

export const groupNodes = (nodes: Node[]): Shortcuts =>
    parseShortcutKeys(groupBy(uniqBy(nodes, "id"), "type"));

export const parseShortcutKeys = (obj: Record<string, any>): Shortcuts => {
    const mapKeys: Record<ShortcutType, string> = {
        DOCUMENT: "documents",
        COMPONENT: "components",
        CANVAS: "pages",
        LINE: "lines",
        INSTANCE: "instances",
        FRAME: "frames",
        GROUP: "groups",
        VECTOR: "vectors",
        BOOLEAN: "booleans",
        STAR: "stars",
        ELLIPSE: "ellipses",
        REGULAR_POLYGON: "regularPolygon",
        RECTANGLE: "rectangles",
        TEXT: "texts",
        SLICE: "slices",
        STYLE: "styles",
    };

    return fromEntries(
        Object.entries(obj).map(([k, v]) => [mapKeys[k as ShortcutType], v])
    ) as Shortcuts;
};
