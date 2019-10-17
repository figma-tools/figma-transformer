import groupBy from "lodash/groupBy";
import uniqBy from "lodash/uniqBy";
import { Node } from "figma-js";

export const groupNodes = (nodes: Node[]): Record<string, Node[]> =>
    groupBy(uniqBy(nodes, "id"), "type");
