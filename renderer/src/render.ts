/**
 * PARSEC AST to HTML/DOM Renderer
 */

import {
  Node,
  ElementNode,
  ComponentNode,
  ConditionalNode,
  LoopNode,
  AttributeValue,
  isTextNode,
  isElementNode,
  isComponentNode,
  isConditionalNode,
  isLoopNode,
  isBindingNode,
  isBinding,
} from './ast';

export interface RenderContext {
  state: Record<string, any>;
  onAction?: (actionName: string, data?: any) => void;
}

/**
 * Evaluate a binding expression within the given state context
 */
export function evaluateBinding(expression: string, state: Record<string, any>): any {
  try {
    // Create a safe evaluation function
    // In production, this should use a proper expression evaluator for security
    const func = new Function('state', `return ${expression}`);
    return func(state);
  } catch (error) {
    console.error(`Failed to evaluate binding: ${expression}`, error);
    return null;
  }
}

/**
 * Evaluate an attribute value (may contain bindings)
 */
export function evaluateAttribute(
  value: AttributeValue,
  state: Record<string, any>
): any {
  if (isBinding(value)) {
    return evaluateBinding(value.expression, state);
  } else if (Array.isArray(value)) {
    return value.map((v) => evaluateAttribute(v, state));
  } else if (typeof value === 'object' && value !== null) {
    const result: Record<string, any> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = evaluateAttribute(val, state);
    }
    return result;
  }
  return value;
}

/**
 * Build React props from element attributes
 */
export function buildProps(
  attrs: Record<string, AttributeValue>,
  state: Record<string, any>,
  onAction?: (actionName: string, data?: any) => void
): Record<string, any> {
  const props: Record<string, any> = {};

  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'onClick' || key === 'onChange' || key === 'onSubmit') {
      // Handle event handlers
      if (isBinding(value)) {
        const expression = value.expression;
        props[key] = () => {
          // Parse action call: actionName(data)
          const match = expression.match(/(\w+)\((.*?)\)/);
          if (match) {
            const actionName = match[1];
            const dataExpr = match[2];
            const data = dataExpr ? evaluateBinding(dataExpr, state) : undefined;
            onAction?.(actionName, data);
          }
        };
      }
    } else {
      // Regular attributes
      props[key] = evaluateAttribute(value, state);
    }
  }

  return props;
}

/**
 * Render a single node to HTML string or React element
 */
export function renderNode(node: Node, context: RenderContext): string {
  if (isTextNode(node)) {
    return escapeHtml(node.content);
  }

  if (isBindingNode(node)) {
    const value = evaluateBinding(node.expression, context.state);
    return escapeHtml(String(value));
  }

  if (isElementNode(node)) {
    return renderElement(node, context);
  }

  if (isComponentNode(node)) {
    return renderComponent(node, context);
  }

  if (isConditionalNode(node)) {
    const condition = evaluateBinding(node.condition.expression, context.state);
    const body = condition ? node.thenBody : node.elseBody || [];
    return body.map((n) => renderNode(n, context)).join('');
  }

  if (isLoopNode(node)) {
    const iterable = evaluateBinding(node.iterable.expression, context.state);
    if (!Array.isArray(iterable)) {
      return '';
    }

    return iterable
      .map((item) => {
        const itemContext: RenderContext = {
          state: {
            ...context.state,
            [node.itemName]: item,
            item, // Also available as 'item'
          },
          onAction: context.onAction,
        };
        return node.children.map((n) => renderNode(n, itemContext)).join('');
      })
      .join('');
  }

  return '';
}

/**
 * Render an element node
 */
function renderElement(node: ElementNode, context: RenderContext): string {
  const tag = node.tag.toLowerCase();
  const attrs = buildProps(node.attrs, context.state, context.onAction);
  const attrString = Object.entries(attrs)
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return value ? key : '';
      }
      return `${key}="${escapeHtml(String(value))}"`;
    })
    .filter(Boolean)
    .join(' ');

  const opening = attrString ? `<${tag} ${attrString}>` : `<${tag}>`;
  const children = node.children.map((n) => renderNode(n, context)).join('');
  const closing = `</${tag}>`;

  return `${opening}${children}${closing}`;
}

/**
 * Render a component node
 */
function renderComponent(node: ComponentNode, context: RenderContext): string {
  // Components would be registered and resolved here
  // For now, render as a div with component name
  const attrs = buildProps(node.props, context.state, context.onAction);
  const attrString = Object.entries(attrs)
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return value ? key : '';
      }
      return `data-${key}="${escapeHtml(String(value))}"`;
    })
    .filter(Boolean)
    .join(' ');

  const opening = attrString
    ? `<div class="component-${node.name}" ${attrString}>`
    : `<div class="component-${node.name}">`;
  const children = node.children.map((n) => renderNode(n, context)).join('');
  const closing = `</div>`;

  return `${opening}${children}${closing}`;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Render multiple nodes
 */
export function renderNodes(nodes: Node[], context: RenderContext): string {
  return nodes.map((node) => renderNode(node, context)).join('');
}
