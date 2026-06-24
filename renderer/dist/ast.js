/**
 * PARSEC AST Type Definitions
 * Mirror of Rust AST structures
 */
/**
 * Type guards
 */
export function isTextNode(node) {
    return 'type' in node && node.type === 'text';
}
export function isElementNode(node) {
    return 'type' in node && node.type === 'element';
}
export function isComponentNode(node) {
    return 'type' in node && node.type === 'component';
}
export function isConditionalNode(node) {
    return 'type' in node && node.type === 'conditional';
}
export function isLoopNode(node) {
    return 'type' in node && node.type === 'loop';
}
export function isBindingNode(node) {
    return 'type' in node && node.type === 'binding';
}
export function isBinding(value) {
    return typeof value === 'object' && 'expression' in value && !Array.isArray(value);
}
