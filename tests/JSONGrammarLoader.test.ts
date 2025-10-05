import { JSONGrammarLoader, KeywordRuleBuilder, createGrammarLoader } from '../src/index';

describe('JSONGrammarLoader', () => {
  let loader: JSONGrammarLoader;

  beforeEach(() => {
    loader = new JSONGrammarLoader();
  });

  test('should load static rules from JSON', () => {
    const config = {
      rules: {
        greeting: {
          type: 'static' as const,
          values: ['Hello', 'Hi', 'Hey']
        }
      }
    };

    loader.loadFromConfig(config);
    const result = loader.parse('%greeting% there!');
    expect(result).toMatch(/^(Hello|Hi|Hey) there!$/);
  });

  test('should load weighted rules from JSON', () => {
    const config = {
      rules: {
        rarity: {
          type: 'weighted' as const,
          values: ['common', 'rare'],
          weights: [0.8, 0.2]
        }
      }
    };

    loader.loadFromConfig(config);
    const result = loader.parse('Found %rarity% item');
    expect(result).toMatch(/^Found (common|rare) item$/);
  });

  test('should load conditional rules from JSON', () => {
    const config = {
      rules: {
        character_type: {
          type: 'static' as const,
          values: ['warrior', 'mage']
        },
        weapon: {
          type: 'conditional' as const,
          conditions: [
            {
              if: "context.character_type === 'warrior'",
              then: ['sword', 'axe']
            },
            {
              default: ['staff', 'wand']
            }
          ]
        }
      }
    };

    loader.loadFromConfig(config);
    const result = loader.parse('%character_type% wields %weapon%', true);
    
    if (result.includes('warrior')) {
      expect(result).toMatch(/warrior wields (sword|axe)/);
    } else {
      expect(result).toMatch(/mage wields (staff|wand)/);
    }
  });

  test('should load sequential rules from JSON', () => {
    const config = {
      rules: {
        days: {
          type: 'sequential' as const,
          values: ['Monday', 'Tuesday', 'Wednesday'],
          cycle: true
        }
      }
    };

    loader.loadFromConfig(config);
    
    expect(loader.parse('%days%')).toBe('Monday');
    expect(loader.parse('%days%')).toBe('Tuesday');
    expect(loader.parse('%days%')).toBe('Wednesday');
    expect(loader.parse('%days%')).toBe('Monday'); // Should cycle back
  });

  test('should load range rules from JSON', () => {
    const config = {
      rules: {
        age: {
          type: 'range' as const,
          min: 18,
          max: 65,
          numberType: 'integer' as const
        }
      }
    };

    loader.loadFromConfig(config);
    const result = parseInt(loader.parse('%age%'));
    expect(result).toBeGreaterThanOrEqual(18);
    expect(result).toBeLessThan(65);
    expect(Number.isInteger(result)).toBe(true);
  });

  test('should load template rules from JSON', () => {
    const config = {
      rules: {
        fullName: {
          type: 'template' as const,
          template: '%first% %last%',
          variables: {
            first: ['John', 'Jane'],
            last: ['Doe', 'Smith']
          }
        }
      }
    };

    loader.loadFromConfig(config);
    const result = loader.parse('%fullName%');
    expect(result).toMatch(/^(John|Jane) (Doe|Smith)$/);
  });

  test('should load function rules from JSON', () => {
    const config = {
      rules: {
        randomNum: {
          type: 'function' as const,
          functionName: 'randomNumber',
          parameters: { min: 1, max: 10 }
        }
      }
    };

    loader.loadFromConfig(config);
    const result = parseInt(loader.parse('%randomNum%'));
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(10);
  });

  test('should handle settings from JSON', () => {
    const config = {
      rules: {
        test: {
          type: 'static' as const,
          values: ['value']
        }
      },
      settings: {
        maxDepth: 50,
        randomSeed: 12345
      }
    };

    loader.loadFromConfig(config);
    expect(loader.getParser().getMaxDepth()).toBe(50);
    expect(loader.getParser().getRandomSeed()).toBe(12345);
  });

  test('should register custom functions', () => {
    loader.registerFunction({
      name: 'customFunc',
      description: 'A custom function',
      handler: () => ['custom result']
    });

    const config = {
      rules: {
        custom: {
          type: 'function' as const,
          functionName: 'customFunc'
        }
      }
    };

    loader.loadFromConfig(config);
    expect(loader.parse('%custom%')).toBe('custom result');
  });
});

describe('KeywordRuleBuilder', () => {
  let loader: JSONGrammarLoader;
  let builder: KeywordRuleBuilder;

  beforeEach(() => {
    const setup = createGrammarLoader();
    loader = setup.loader;
    builder = setup.builder;
  });

  test('should create conditional rule with keywords', () => {
    builder.createConditionalRule('weapon', {
      if: "context.class === 'warrior'",
      then: ['sword', 'axe'],
      else: ['staff', 'wand']
    });

    // This test would need the context to be set properly
    // For now, we just verify the rule was created
    expect(loader.getParser().hasRule('weapon')).toBe(true);
  });

  test('should create weighted rule with keywords', () => {
    builder.createWeightedRule('rarity', {
      values: ['common', 'rare', 'epic'],
      weights: [0.7, 0.25, 0.05]
    });

    const result = loader.parse('%rarity%');
    expect(['common', 'rare', 'epic']).toContain(result);
  });

  test('should create range rule with keywords', () => {
    builder.createRangeRule('level', {
      min: 1,
      max: 100,
      type: 'integer'
    });

    const result = parseInt(loader.parse('%level%'));
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThan(100);
  });

  test('should create template rule with keywords', () => {
    builder.createTemplateRule('character', {
      template: '%name% the %title%',
      variables: {
        name: ['Alice', 'Bob'],
        title: ['Brave', 'Wise']
      }
    });

    const result = loader.parse('%character%');
    expect(result).toMatch(/^(Alice|Bob) the (Brave|Wise)$/);
  });

  test('should create sequential rule with keywords', () => {
    builder.createSequentialRule('sequence', {
      sequence: ['first', 'second', 'third'],
      cycle: false
    });

    expect(loader.parse('%sequence%')).toBe('first');
    expect(loader.parse('%sequence%')).toBe('second');
    expect(loader.parse('%sequence%')).toBe('third');
    expect(loader.parse('%sequence%')).toBe('third'); // Should stick to last
  });

  test('should load keyword config with mixed rule types', () => {
    const keywordConfig = {
      rules: {
        // Static rule (array)
        colors: ['red', 'blue', 'green'],
        
        // Conditional rule (object with if/then)
        greeting: {
          if: "context.time === 'morning'",
          then: ['Good morning!'],
          else: ['Hello!']
        },
        
        // Weighted rule (object with values/weights)
        weather: {
          values: ['sunny', 'cloudy', 'rainy'],
          weights: [0.6, 0.3, 0.1]
        },
        
        // Range rule (object with min/max)
        temperature: {
          min: 20,
          max: 30,
          type: 'integer' as const
        }
      }
    };

    builder.loadKeywordConfig(keywordConfig);

    expect(loader.getParser().hasRule('colors')).toBe(true);
    expect(loader.getParser().hasRule('greeting')).toBe(true);
    expect(loader.getParser().hasRule('weather')).toBe(true);
    expect(loader.getParser().hasRule('temperature')).toBe(true);
  });
});