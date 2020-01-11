import { Node, NodeType } from "figma-js";

export type Shortcut = NodeType | "STYLE";

export type Shortcuts = Record<Shortcut, TransformedNode[]>;

export type TransformedNode = Node & { shortcuts?: Shortcuts };

export type ProcessedFile = {
    fileId: string;
    name: string;
    lastModified: string;
    thumbnailUrl: string;
    version: string;
    children: any;
    shortcuts: Shortcuts;
};
