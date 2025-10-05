# Story Grammar JSON Loader

A TypeScript library that provides a JSON-based interface for defining [Story Grammar](https://github.com/videlais/story-grammar) rules. This allows you to create complex text generation systems using JSON configuration files instead of writing code directly.

## Features

- 🎯 **JSON Configuration**: Define all rule types using simple JSON syntax
- 🔥 **Keyword Support**: Use intuitive keywords like `if`, `then`, `values`, `weights`
- 🎲 **All Rule Types**: Support for static, weighted, conditional, sequential, range, template, and function rules
- 🛠️ **TypeScript**: Full TypeScript support with comprehensive type definitions
- 🧪 **Well Tested**: Comprehensive test suite with Jest
- 📦 **Zero Config**: Works out of the box with sensible defaults
- 🔧 **Extensible**: Register custom functions and modifiers

## 🎮 Interactive Demo

Try the live interactive demo: **[Story Grammar Loader Demo](https://videlais.github.io/story-grammar-loader/)**

The demo features:

- 🎲 Real-time RPG character story generation
- 📖 Multiple story generation modes
- 🎯 Individual character component display
- ⚙️ JSON configuration inspector
- 🎮 Keyboard shortcuts (Ctrl+Enter, Shift+Enter)

## Quick Start

### Installation

```bash
npm install story-grammar-loader story-grammar
```

### Basic Usage

```typescript
import { JSONGrammarLoader } from 'story-grammar-loader';

const loader = new JSONGrammarLoader();

// Load from JSON configuration
const config = {
  rules: {
    hero: {
      type: 'static',
      values: ['Alice', 'Bob', 'Charlie']
    },
    action: {
      type: 'weighted',
      values: ['explores', 'discovers', 'investigates'],
      weights: [0.5, 0.3, 0.2]
    },
    location: {
      type: 'template',
      template: 'the %adjective% %place%',
      variables: {
        adjective: ['ancient', 'mysterious', 'forgotten'],
        place: ['temple', 'forest', 'cave']
      }
    }
  }
};

loader.loadFromConfig(config);

// Generate text
const story = loader.parse('%hero% %action% %location%.');
console.log(story); // "Alice explores the mysterious temple."
```

### Keyword-Based Rules

For more intuitive JSON configuration, use the keyword-based approach:

```typescript
import { createGrammarLoader } from 'story-grammar-loader';

const { loader, builder } = createGrammarLoader();

// Use natural keywords instead of explicit types
const keywordConfig = {
  rules: {
    // Static rule (simple array)
    animals: ['cat', 'dog', 'bird'],
    
    // Conditional rule (if/then/else)
    sound: {
      if: "context.animals === 'cat'",
      then: ['meow', 'purr'],
      else: ['woof', 'chirp']
    },
    
    // Weighted rule (values/weights)
    size: {
      values: ['small', 'medium', 'large'],
      weights: [0.5, 0.3, 0.2]
    },
    
    // Range rule (min/max)
    age: {
      min: 1,
      max: 15,
      type: 'integer'
    }
  }
};

builder.loadKeywordConfig(keywordConfig);
const result = loader.parse('The %size% %animals% is %age% years old and goes "%sound%"', true);
```

## Rule Types

### Static Rules

Simple arrays of values:

```json
{
  "colors": {
    "type": "static",
    "values": ["red", "blue", "green"]
  }
}
```

**Keyword syntax:**

```json
{
  "colors": ["red", "blue", "green"]
}
```

### Weighted Rules  

Probability-based selection:

```json
{
  "rarity": {
    "type": "weighted", 
    "values": ["common", "rare", "epic"],
    "weights": [0.7, 0.25, 0.05]
  }
}
```

**Keyword syntax:**

```json
{
  "rarity": {
    "values": ["common", "rare", "epic"],
    "weights": [0.7, 0.25, 0.05]
  }
}
```

### Conditional Rules

Context-aware selection:

```json
{
  "weapon": {
    "type": "conditional",
    "conditions": [
      {
        "if": "context.character_class === 'warrior'",
        "then": ["sword", "axe", "hammer"]
      },
      {
        "if": "context.character_class === 'mage'", 
        "then": ["staff", "wand", "orb"]
      },
      {
        "default": ["dagger", "bow"]
      }
    ]
  }
}
```

**Keyword syntax:**

```json
{
  "weapon": {
    "if": "context.character_class === 'warrior'",
    "then": ["sword", "axe", "hammer"],
    "else": ["dagger", "bow"]
  }
}
```

### Sequential Rules

Ordered progression through values:

```json
{
  "days": {
    "type": "sequential",
    "values": ["Monday", "Tuesday", "Wednesday"],
    "cycle": true
  }
}
```

**Keyword syntax:**

```json
{
  "days": {
    "sequence": ["Monday", "Tuesday", "Wednesday"],
    "cycle": true
  }
}
```

### Range Rules

Numeric value generation:

```json
{
  "level": {
    "type": "range", 
    "min": 1,
    "max": 100,
    "step": 1,
    "numberType": "integer"
  }
}
```

**Keyword syntax:**

```json
{
  "level": {
    "min": 1,
    "max": 100,
    "type": "integer"
  }
}
```

### Template Rules

Structured text with embedded variables:

```json
{
  "character": {
    "type": "template",
    "template": "%first% %last% the %title%",
    "variables": {
      "first": ["John", "Jane"],
      "last": ["Smith", "Doe"], 
      "title": ["Brave", "Wise"]
    }
  }
}
```

**Keyword syntax:**

```json
{
  "character": {
    "template": "%first% %last% the %title%",
    "variables": {
      "first": ["John", "Jane"],
      "last": ["Smith", "Doe"],
      "title": ["Brave", "Wise"]
    }
  }
}
```

### Function Rules

Dynamic generation using predefined functions:

```json
{
  "dice": {
    "type": "function",
    "functionName": "diceRoll",
    "parameters": {
      "sides": 20,
      "count": 1
    }
  }
}
```

**Keyword syntax:**

```json
{
  "dice": {
    "function": "diceRoll", 
    "parameters": {
      "sides": 20,
      "count": 1
    }
  }
}
```

## Built-in Functions

The library comes with several built-in functions:

- **`randomNumber`**: Generate random numbers within a range
- **`diceRoll`**: Roll dice (supports multiple dice and different sides)
- **`currentTime`**: Get current time/date in various formats
- **`randomChoice`**: Choose randomly from a provided array

### Custom Functions

Register your own functions:

```typescript
loader.registerFunction({
  name: 'customFunction',
  description: 'My custom function',
  handler: (params) => {
    // Your logic here
    return ['result1', 'result2'];
  }
});
```

## Examples

Check out the `examples/` directory for complete JSON configurations:

- **`rpg-character.json`**: RPG character generator with all rule types
- **`keyword-style.json`**: Keyword-based configuration example

Run the demo to see everything in action:

```bash
npm run build
node examples/demo.js
```

## API Reference

### JSONGrammarLoader

Main class for loading JSON configurations:

```typescript
const loader = new JSONGrammarLoader();

// Load from config object
loader.loadFromConfig(config);

// Load from JSON string  
loader.loadFromJSON(jsonString);

// Generate text
loader.parse(text, preserveContext);

// Register custom functions
loader.registerFunction(definition);

// Get underlying parser
loader.getParser();

// Validate grammar
loader.validate();
```

### KeywordRuleBuilder  

Helper for keyword-based rules:

```typescript  
const builder = new KeywordRuleBuilder(loader);

// Create individual rules
builder.createConditionalRule(name, rule);
builder.createWeightedRule(name, rule);
builder.createRangeRule(name, rule);
builder.createTemplateRule(name, rule);
builder.createSequentialRule(name, rule);

// Load keyword config
builder.loadKeywordConfig(config);
```

### Quick Setup

```typescript
import { createGrammarLoader } from 'story-grammar-loader';

const { loader, builder } = createGrammarLoader();
```

## Development

### Setup

```bash
npm install
npm run build
```

### Testing

```bash
npm test
npm run test:watch
npm run test:coverage
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for your changes
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Related Projects

- [Story Grammar](https://github.com/videlais/story-grammar) - The underlying text generation library
- [Tracery](https://github.com/galaxykate/tracery) - The original inspiration for Story Grammar
