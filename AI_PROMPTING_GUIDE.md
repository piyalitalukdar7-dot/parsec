When working with PARSEC code in this project, always consult the complete language specification.

## Quick Commands for Copilot/ChatGPT

**Ask for PARSEC app generation:**
```
Generate a PARSEC app for [description]

I'm using PARSEC markup language with these rules:
- Components: <app>, <view>, <stack>, <grid>, <text>, <button>, <input>, <checkbox>, <select>, <for>, <if>
- State binding: {state.fieldName}, {state.items[0]}, {state.count + 1}
- Events: onClick="actionName" data="{param}"
- Backend: GET /state returns state, POST /actions/{actionName} receives {data: ...} and returns {state: {...}}

Requirements:
[list your requirements here]
```

**Ask for backend code:**
```
Create a Node.js backend for this PARSEC app:
[paste PARSEC code]

The backend should handle these actions:
- [action names]
```

**Ask for specific component:**
```
Create a PARSEC [component name] component that:
- [requirement 1]
- [requirement 2]

Use these state values:
{
  "field1": "value",
  "field2": []
}
```

---

## Full Reference Location

The complete PARSEC language specification is in:
📄 **PARSEC_LANGUAGE_REFERENCE.md**

This includes:
✅ All component syntax
✅ State binding examples
✅ Event handling patterns
✅ Backend contract specification
✅ Complete examples (Todo app, Counter app)
✅ Best practices & patterns
✅ Security notes
✅ Performance optimization tips

## How AI Uses This

When you ask Copilot/ChatGPT to generate PARSEC code:

1. **Include the reference**: Copy key sections from `PARSEC_LANGUAGE_REFERENCE.md`
2. **Be specific**: Say exactly what you want (component types, state structure, actions)
3. **Provide context**: Share your backend state shape and action names
4. **Paste examples**: Show the AI similar examples from the reference

---

## Tips for Better AI Results

### ✅ Good Prompts
- "Generate a PARSEC todo app using this state: {...}"
- "Create a PARSEC form component for user registration"
- "Write the backend for this PARSEC code: [paste code]"
- "Fix this PARSEC code: [paste code with issue]"

### ❌ Vague Prompts
- "Make a PARSEC app"
- "Generate code"
- "Help me with PARSEC"

---

## AI-Ready Template

Copy this to your AI chat for best results:

```
I'm building a PARSEC app. Here's the language reference:

## PARSEC Basics
- Components: <app>, <view>, <stack vertical/horizontal>, <grid>, <text>, <button>, <input>, <checkbox>, <select>, <card>, <modal>, <list>, <for>, <if>
- State: {state.fieldName}, {state.items[0]}, {state.count + 1}
- Events: onClick="actionName" data="{param}"
- Attributes: fontSize, fontWeight, color, padding, gap, align, justify, width, height, flex, disabled
- Backend: GET /state (initial state), POST /actions/{name} (action call with {data: ...})

My app needs:
[describe what you want]

State structure:
[paste your state JSON]

Actions needed:
[list action names]
```

---

## When AI Doesn't Know PARSEC

If the AI doesn't recognize PARSEC, provide this minimal example:

```xml
<!-- PARSEC Example: Counter App -->
<app>
  <meta title="Counter" />
  <view>
    <stack vertical align="center" gap="20">
      <!-- Display state -->
      <text fontSize="32">{state.count}</text>
      
      <!-- Buttons that trigger backend actions -->
      <button onClick="increment">Increment</button>
      <button onClick="decrement">Decrement</button>
      
      <!-- Conditional rendering -->
      <if condition="{state.count > 10}">
        <text color="red">Count is high!</text>
      </if>
      
      <!-- Loop example -->
      <for item in "{state.messages}">
        <text>{item}</text>
      </for>
    </stack>
  </view>
</app>
```

Then ask: "Generate a similar PARSEC app for [your use case]"

---

**Need the full reference? Open `PARSEC_LANGUAGE_REFERENCE.md` in this workspace.**
