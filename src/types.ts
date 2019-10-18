import { Node, NodeType } from "figma-js";

export type Shortcut = NodeType | "STYLE";

export type ProcessedFile = {
    fileId: string;
    name: string;
    lastModified: string;
    thumbnailUrl: string;
    version: string;
    children: any;
    shortcuts: Record<Shortcut, Node[]>;
};
