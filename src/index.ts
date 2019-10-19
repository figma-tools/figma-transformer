import {
    Document,
    FileResponse,
    Style,
    ComponentMetadata,
    Node,
} from "figma-js";
import { groupNodes } from "./utils";
import { ProcessedFile } from "./types";

export function processFile(data: FileResponse, id: string): ProcessedFile {
    const {
        name,
        lastModified,
        thumbnailUrl,
        version,
        document,
        styles,
        components,
    } = data;

    const [processedNodes, processedShortcuts] = processNodes(
        document,
        styles,
        components,
        id
    );

    return {
        fileId: id,
        name,
        lastModified,
        thumbnailUrl,
        version,
        children: processedNodes[0].children,
        shortcuts: groupNodes(processedShortcuts),
    };
}

export function processNodes(
    nodes: Document,
    documentStyles: { [key: string]: Style },
    components: { [key: string]: ComponentMetadata },
    fileId: string
) {
    const parsedStyles = new Map(Object.entries(documentStyles));
    const parsedComponents = new Map(Object.entries(components));

    const traverseChildren = (node: any, parentId: string) => {
        const { id, styles, children, ...rest } = node;
        let nodeStyles: any[] = [];

        // If node has styles definitions populate that with the actual styles
        if (styles != null) {
            nodeStyles = Object.entries(styles).map(([key, styleId]) => {
                const documentStyle = parsedStyles.get(styleId as string);

                return {
                    id: styleId,
                    ...documentStyle,
                    styles: node[`${key}s`],
                    typeStyles: node.style,
                    type: "STYLE",
                };
            });
        }

        // Reached a leaf so returning the simplified node
        if (children == null || children.length === 0) {
            return [[{ id, parentId, fileId, ...rest }], nodeStyles];
        }

        // If it gets here then it means it has children
        // so we're going to recursively go through them
        // and combine everything
        const [parsedChildren, shortcuts] = children.reduce(
            (acc: [Node[], Node[]], child: Node) => {
                const [accChildren, accShortcuts] = acc;
                const [tChildren, tShortcuts] = traverseChildren(child, id);
                return [
                    [...accChildren, ...tChildren],
                    [...accShortcuts, ...tChildren, ...tShortcuts],
                ];
            },
            [[], []]
        );

        const componentInfo = parsedComponents.get(id);

        // Finally we return the parsed node with the
        // parsed children grouped by type
        const parsedNode = {
            id,
            parentId,
            fileId,
            ...rest,
            ...(componentInfo && componentInfo),
            children: parsedChildren,
            shortcuts: groupNodes(shortcuts),
        };

        return [[parsedNode], shortcuts];
    };

    return traverseChildren(nodes, "0:0");
}
