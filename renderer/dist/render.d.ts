/**
 * PARSEC AST to HTML/DOM Renderer
 */
import { Node, AttributeValue } from './ast';
export interface RenderContext {
    state: Record<string, any>;
    onAction?: (actionName: string, data?: any) => void;
}
/**
 * Evaluate a binding expression within the given state context
 */
export declare function evaluateBinding(expression: string, state: Record<string, any>): any;
/**
 * Evaluate an attribute value (may contain bindings)
 */
export declare function evaluateAttribute(value: AttributeValue, state: Record<string, any>): any;
/**
 * Build React props from element attributes
 */
export declare function buildProps(attrs: Record<string, AttributeValue>, state: Record<string, any>, onAction?: (actionName: string, data?: any) => void): Record<string, any>;
/**
 * Render a single node to HTML string or React element
 */
export declare function renderNode(node: Node, context: RenderContext): string;
/**
 * Render multiple nodes
 */
export declare function renderNodes(nodes: Node[], context: RenderContext): string;
