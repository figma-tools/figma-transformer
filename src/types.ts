import {
    Node,
    NodeType,
    Component,
    Canvas,
    Instance,
    Line,
    Frame,
    Group,
    Vector,
    Star,
    Ellipse,
    BooleanGroup,
    RegularPolygon,
    Rectangle,
    Text,
    Slice,
    Style,
    ComponentMetadata,
    Paint,
    TypeStyle,
} from "figma-js";

export type ShortcutType = NodeType | "STYLE";

export type NodeWithShortcuts<T extends Node> = T & { shortcuts?: Shortcuts };
export type StyleNode = Style & Node & { styles: Paint; textStyles: TypeStyle };
export type Shortcuts = Record<
    "components",
    NodeWithShortcuts<Component & ComponentMetadata>[]
> &
    Record<"pages", NodeWithShortcuts<Canvas>[]> &
    Record<"lines", NodeWithShortcuts<Line>[]> &
    Record<"instances", NodeWithShortcuts<Instance>[]> &
    Record<"frames", NodeWithShortcuts<Frame>[]> &
    Record<"groups", NodeWithShortcuts<Group>[]> &
    Record<"vectors", NodeWithShortcuts<Vector>[]> &
    Record<"booleans", NodeWithShortcuts<BooleanGroup>[]> &
    Record<"stars", NodeWithShortcuts<Star>[]> &
    Record<"ellipses", NodeWithShortcuts<Ellipse>[]> &
    Record<"regularPolygons", NodeWithShortcuts<RegularPolygon>[]> &
    Record<"rectangles", NodeWithShortcuts<Rectangle>[]> &
    Record<"texts", NodeWithShortcuts<Text>[]> &
    Record<"slices", NodeWithShortcuts<Slice>[]> &
    Record<"styles", StyleNode[]>;

export type ProcessedFile = {
    fileId?: string;
    name: string;
    lastModified: string;
    thumbnailUrl: string;
    version: string;
    children: any;
    shortcuts: Shortcuts;
};
