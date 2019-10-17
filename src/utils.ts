import { Node } from "figma-js";

function uniqBy(arr: any[], fn: string, set = new Set()) {
    return arr.filter(el => (v => !set.has(v) && set.add(v))(el[fn]));
}

function groupBy(arr: any[], key: string) {
    return arr.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

export const groupNodes = (nodes: Node[]): Record<string, Node[]> =>
    groupBy(uniqBy(nodes, "id"), "type");
