import { readFileSync } from 'fs';
import { JSONGrammarLoader, createGrammarLoader, KeywordRuleBuilder } from '../dist/index.js';

/**
 * Demo script showing how to use the Story Grammar JSON Loader
 */
async function runDemo() {
  console.log('🎲 Story Grammar JSON Loader Demo\n');

  // Example 1: Basic usage with explicit rule types
  console.log('📝 Example 1: Loading explicit rule configuration');
  console.log('═'.repeat(50));
  
  const loader = new JSONGrammarLoader();
  
  const basicConfig = {
    rules: {
      hero: {
        type: 'static' as const,
        values: ['Alice', 'Bob', 'Charlie']
      },
      action: {
        type: 'weighted' as const,
        values: ['explores', 'discovers', 'investigates'],
        weights: [0.5, 0.3, 0.2]
      },
      location: {
        type: 'template' as const,
        template: 'the %adjective% %place%',
        variables: {
          adjective: ['ancient', 'mysterious', 'forgotten'],
          place: ['temple', 'forest', 'cave']
        }
      }
    }
  };
  
  loader.loadFromConfig(basicConfig);
  
  for (let i = 0; i < 3; i++) {
    const story = loader.parse('%hero% %action% %location%.');
    console.log(`  ${story}`);
  }

  // Example 2: Using keyword-based rules
  console.log('\n📝 Example 2: Using keyword-based rules');
  console.log('═'.repeat(50));
  
  const { loader: kwLoader, builder } = createGrammarLoader();
  
  // Create rules using keywords instead of explicit types
  builder.createConditionalRule('greeting', {
    if: "context.time_of_day === 'morning'",
    then: ['Good morning!', 'Morning!'],
    else: ['Hello!', 'Hi there!']
  });
  
  builder.createWeightedRule('weather', {
    values: ['sunny', 'cloudy', 'rainy'],
    weights: [0.6, 0.3, 0.1]
  });
  
  builder.createRangeRule('temperature', {
    min: 18,
    max: 30,
    type: 'integer'
  });
  
  // Add some static rules for context
  kwLoader.getParser().addRule('time_of_day', ['morning', 'afternoon']);
  
  const sentences = [
    '%greeting% It\'s %temperature%°C and %weather% today.',
    'The weather is %weather% with a temperature of %temperature%°C.'
  ];
  
  for (const sentence of sentences) {
    const result = kwLoader.parse(sentence, true);
    console.log(`  ${result}`);
  }

  // Example 3: Loading from JSON file
  console.log('\n📝 Example 3: Loading from JSON file');
  console.log('═'.repeat(50));
  
  try {
    const rpgJson = readFileSync('./examples/rpg-character.json', 'utf8');
    const rpgLoader = new JSONGrammarLoader();
    rpgLoader.loadFromJSON(rpgJson);
    
    console.log('📖 Generating RPG character stories:\n');
    
    for (let i = 0; i < 3; i++) {
      const story = rpgLoader.parse('%story_intro%', true);
      console.log(`  ${story}\n`);
    }
    
    // Show individual components
    console.log('🎯 Individual components:');
    console.log(`  Character: ${rpgLoader.parse('%character_name%')}`);
    console.log(`  Class: ${rpgLoader.parse('%character_class%')}`);
    console.log(`  Level: ${rpgLoader.parse('%character_level%')}`);
    console.log(`  Rarity: ${rpgLoader.parse('%item_rarity%')}`);
    console.log(`  Time: ${rpgLoader.parse('%day_cycle%')}`);
    console.log(`  Gold: ${rpgLoader.parse('%random_gold%')}`);
    console.log(`  Dice roll: ${rpgLoader.parse('%dice_roll%')}`);

  } catch (error) {
    console.error('  ❌ Could not load RPG example:', error);
  }

  // Example 4: Advanced keyword configuration
  console.log('\n📝 Example 4: Advanced keyword configuration');
  console.log('═'.repeat(50));
  
  const advancedLoader = new JSONGrammarLoader();
  const advancedBuilder = new KeywordRuleBuilder(advancedLoader);
  
  const keywordConfig = {
    rules: {
      // Static rule (simple array)
      animals: ['cat', 'dog', 'bird', 'fish'],
      
      // Conditional rule using keywords
      animal_sound: {
        if: "context.animals === 'cat'",
        then: ['meow', 'purr'],
        else: ['woof', 'chirp', 'splash']
      },
      
      // Weighted rule using keywords
      size: {
        values: ['tiny', 'small', 'medium', 'large'],
        weights: [0.1, 0.4, 0.4, 0.1]
      },
      
      // Template rule
      description: {
        template: 'The %size% %animals% goes "%animal_sound%"',
        variables: {
          size: ['tiny', 'small', 'medium', 'large'],
          animals: ['cat', 'dog', 'bird', 'fish'],
          animal_sound: ['meow', 'woof', 'chirp', 'splash']
        }
      }
    }
  };
  
  advancedBuilder.loadKeywordConfig(keywordConfig);
  
  for (let i = 0; i < 4; i++) {
    const description = advancedLoader.parse('%description%', true);
    console.log(`  ${description}`);
  }

  // Example 5: Function rules and custom functions
  console.log('\n📝 Example 5: Custom functions and validation');
  console.log('═'.repeat(50));
  
  const functionLoader = new JSONGrammarLoader();
  
  // Register a custom function
  functionLoader.registerFunction({
    name: 'randomColor',
    description: 'Generate a random color',
    handler: () => {
      const colors = ['crimson', 'azure', 'emerald', 'golden', 'violet'];
      return [colors[Math.floor(Math.random() * colors.length)]];
    }
  });
  
  const functionConfig = {
    rules: {
      custom_color: {
        type: 'function' as const,
        functionName: 'randomColor'
      },
      item: {
        type: 'static' as const,
        values: ['sword', 'shield', 'gem', 'potion']
      }
    }
  };
  
  functionLoader.loadFromConfig(functionConfig);
  
  console.log('🎨 Custom function examples:');
  for (let i = 0; i < 3; i++) {
    const result = functionLoader.parse('You found a %custom_color% %item%!');
    console.log(`  ${result}`);
  }
  
  // Show validation
  console.log('\n🔍 Grammar validation:');
  const validation = functionLoader.validate();
  console.log(`  Valid: ${validation.isValid}`);
  console.log(`  Total registered functions: ${functionLoader.getRegisteredFunctions().length}`);
  console.log(`  Available functions: ${functionLoader.getRegisteredFunctions().join(', ')}`);
  
  console.log('\n✨ Demo completed! Check out the examples/ directory for more JSON configurations.');
}

// Run the demo
if (import.meta.url === `file://${process.argv[1]}`) {
  runDemo().catch(console.error);
}

export { runDemo };