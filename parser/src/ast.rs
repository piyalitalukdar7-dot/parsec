use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Program {
    pub app: Option<AppNode>,
    pub imports: Vec<Import>,
    pub components: Vec<ComponentDef>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Import {
    pub path: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ComponentDef {
    pub name: String,
    pub props: Vec<String>,
    pub children: Vec<Node>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppNode {
    pub meta: Option<MetaNode>,
    pub views: Vec<ViewNode>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MetaNode {
    pub attrs: HashMap<String, AttributeValue>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ViewNode {
    pub path: Option<String>,
    pub children: Vec<Node>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "content")]
pub enum Node {
    Text(String),
    Binding(Binding),
    Element {
        tag: String,
        attrs: HashMap<String, AttributeValue>,
        children: Vec<Node>,
    },
    Component {
        name: String,
        props: HashMap<String, AttributeValue>,
        children: Vec<Node>,
    },
    Conditional {
        condition: Binding,
        then_body: Vec<Node>,
        else_body: Option<Vec<Node>>,
    },
    Loop {
        iterable: Binding,
        item_name: String,
        children: Vec<Node>,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Binding {
    pub expression: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum AttributeValue {
    String(String),
    Number(f64),
    Boolean(bool),
    Binding(Binding),
    List(Vec<AttributeValue>),
    Object(HashMap<String, AttributeValue>),
}

impl AttributeValue {
    pub fn to_string(&self) -> String {
        match self {
            AttributeValue::String(s) => s.clone(),
            AttributeValue::Number(n) => n.to_string(),
            AttributeValue::Boolean(b) => b.to_string(),
            AttributeValue::Binding(b) => format!("{{{}}}", b.expression),
            AttributeValue::List(l) => format!("[{:?}]", l),
            AttributeValue::Object(_) => "{...}".to_string(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_ast_creation() {
        let program = Program {
            app: None,
            imports: vec![],
            components: vec![],
        };
        assert!(program.app.is_none());
    }
}
