/**
 * PARSEC AST Type Definitions
 * Mirror of Rust AST structures
 */
export interface Program {
    app?: AppNode;
    imports: Import[];
    components: ComponentDef[];
}
export interface Import {
    path: string;
}
export interface ComponentDef {
    name: string;
    props: string[];
    children: Node[];
}
export interface AppNode {
    meta?: MetaNode;
    views: ViewNode[];
}
export interface MetaNode {
    attrs: Record<string, AttributeValue>;
}
export interface ViewNode {
    path?: string;
    children: Node[];
}
export type Node = TextNode | BindingNode | ElementNode | ComponentNode | ConditionalNode | LoopNode;
export interface TextNode {
    type: 'text';
    content: string;
}
export interface BindingNode {
    type: 'binding';
    expression: string;
}
export interface ElementNode {
    type: 'element';
    tag: string;
    attrs: Record<string, AttributeValue>;
    children: Node[];
}
export interface ComponentNode {
    type: 'component';
    name: string;
    props: Record<string, AttributeValue>;
    children: Node[];
}
export interface ConditionalNode {
    type: 'conditional';
    condition: Binding;
    thenBody: Node[];
    elseBody?: Node[];
}
export interface LoopNode {
    type: 'loop';
    iterable: Binding;
    itemName: string;
    children: Node[];
}
export interface Binding {
    expression: string;
}
export type AttributeValue = string | number | boolean | Binding | AttributeValue[] | Record<string, any>;
export interface ParseError {
    type: 'error';
    message: string;
    position: number;
}
/**
 * Type guards
 */
export declare function isTextNode(node: Node): node is TextNode;
export declare function isElementNode(node: Node): node is ElementNode;
export declare function isComponentNode(node: Node): node is ComponentNode;
export declare function isConditionalNode(node: Node): node is ConditionalNode;
export declare function isLoopNode(node: Node): node is LoopNode;
export declare function isBindingNode(node: Node): node is BindingNode;
export declare function isBinding(value: AttributeValue): value is Binding;
