import { JSONGrammarLoader } from './JSONGrammarLoader.js';
import { GrammarConfig, RuleConfig, ConditionalRuleConfig } from './types.js';

/**
 * Keyword-based rule builder for easier JSON grammar creation
 * 
 * This class provides a more intuitive way to create rules using common keywords
 * like "if", "then", "values", "weights", etc.
 */
export class KeywordRuleBuilder {
  private loader: JSONGrammarLoader;

  constructor(loader: JSONGrammarLoader) {
    this.loader = loader;
  }

  /**
   * Create a conditional rule using if/then/else keywords
   * 
   * Example usage:
   * ```
   * builder.createConditionalRule('weapon', {
   *   if: "context.character_type === 'warrior'",
   *   then: ['sword', 'axe', 'hammer'],
   *   else: ['dagger', 'staff']
   * });
   * ```
   */
  public createConditionalRule(
    name: string, 
    condition: {
      if: string;
      then: string[];
      else?: string[];
    }
  ): void {
    const ruleConfig: RuleConfig = {
      type: 'conditional',
      conditions: [
        {
          if: condition.if,
          then: condition.then
        }
      ]
    };

    // Add else clause if provided
    if (condition.else) {
      ruleConfig.conditions.push({
        default: condition.else
      });
    }

    this.loader.loadFromConfig({
      rules: { [name]: ruleConfig }
    });
  }

  /**
   * Create a weighted rule using values/weights keywords
   * 
   * Example:
   * ```
   * builder.createWeightedRule('rarity', {
   *   values: ['common', 'rare', 'epic'],
   *   weights: [0.7, 0.25, 0.05]
   * });
   * ```
   */
  public createWeightedRule(
    name: string,
    rule: {
      values: string[];
      weights: number[];
    }
  ): void {
    const ruleConfig: RuleConfig = {
      type: 'weighted',
      values: rule.values,
      weights: rule.weights
    };

    this.loader.loadFromConfig({
      rules: { [name]: ruleConfig }
    });
  }

  /**
   * Create a range rule using min/max keywords
   * 
   * Example:
   * ```
   * builder.createRangeRule('age', {
   *   min: 18,
   *   max: 65,
   *   step: 1
   * });
   * ```
   */
  public createRangeRule(
    name: string,
    range: {
      min: number;
      max: number;
      step?: number;
      type?: 'integer' | 'float';
    }
  ): void {
    const ruleConfig: RuleConfig = {
      type: 'range',
      min: range.min,
      max: range.max,
      step: range.step,
      numberType: range.type || 'integer'
    };

    this.loader.loadFromConfig({
      rules: { [name]: ruleConfig }
    });
  }

  /**
   * Create a template rule using template/variables keywords
   * 
   * Example:
   * ```
   * builder.createTemplateRule('fullName', {
   *   template: '%first% %middle% %last%',
   *   variables: {
   *     first: ['John', 'Jane'],
   *     middle: ['A.', 'B.'],
   *     last: ['Smith', 'Doe']
   *   }
   * });
   * ```
   */
  public createTemplateRule(
    name: string,
    template: {
      template: string;
      variables: { [key: string]: string[] };
    }
  ): void {
    const ruleConfig: RuleConfig = {
      type: 'template',
      template: template.template,
      variables: template.variables
    };

    this.loader.loadFromConfig({
      rules: { [name]: ruleConfig }
    });
  }

  /**
   * Create a sequential rule using sequence keyword
   * 
   * Example:
   * ```
   * builder.createSequentialRule('days', {
   *   sequence: ['Monday', 'Tuesday', 'Wednesday'],
   *   cycle: true
   * });
   * ```
   */
  public createSequentialRule(
    name: string,
    sequence: {
      sequence: string[];
      cycle?: boolean;
    }
  ): void {
    const ruleConfig: RuleConfig = {
      type: 'sequential',
      values: sequence.sequence,
      cycle: sequence.cycle
    };

    this.loader.loadFromConfig({
      rules: { [name]: ruleConfig }
    });
  }

  /**
   * Create a function rule using a predefined function
   * 
   * Example:
   * ```
   * builder.createFunctionRule('randomNumber', {
   *   function: 'randomNumber',
   *   parameters: { min: 1, max: 100 }
   * });
   * ```
   */
  public createFunctionRule(
    name: string,
    func: {
      function: string;
      parameters?: Record<string, unknown>;
    }
  ): void {
    const ruleConfig: RuleConfig = {
      type: 'function',
      functionName: func.function,
      parameters: func.parameters
    };

    this.loader.loadFromConfig({
      rules: { [name]: ruleConfig }
    });
  }

  /**
   * Load multiple rules from a keyword-based configuration object
   * This allows for more natural JSON structure
   */
  public loadKeywordConfig(config: KeywordGrammarConfig): void {
    const grammarConfig: GrammarConfig = {
      rules: {},
      modifiers: config.modifiers,
      settings: config.settings
    };

    // Convert keyword-based rules to proper rule configs
    for (const [name, rule] of Object.entries(config.rules)) {
      grammarConfig.rules[name] = this.convertKeywordRule(rule);
    }

    this.loader.loadFromConfig(grammarConfig);
  }

  /**
   * Convert a keyword-based rule to a proper RuleConfig
   */
  private convertKeywordRule(rule: KeywordRule): RuleConfig {
    // Static rule (simple array)
    if (Array.isArray(rule)) {
      return {
        type: 'static',
        values: rule
      };
    }

    // Object-based rule - detect type by keywords
    const ruleObj = rule;

    // Conditional rule (has if/then)
    if ('if' in ruleObj && 'then' in ruleObj && ruleObj.if && ruleObj.then) {
      const conditions: ConditionalRuleConfig['conditions'] = [{
        if: ruleObj.if,
        then: ruleObj.then
      }];

      if ('else' in ruleObj && ruleObj.else) {
        conditions.push({
          default: ruleObj.else
        });
      }

      return {
        type: 'conditional',
        conditions
      };
    }

    // Weighted rule (has values and weights)
    if ('values' in ruleObj && 'weights' in ruleObj && ruleObj.values && ruleObj.weights) {
      return {
        type: 'weighted',
        values: ruleObj.values,
        weights: ruleObj.weights
      };
    }

    // Range rule (has min/max)
    if ('min' in ruleObj && 'max' in ruleObj && 
        typeof ruleObj.min === 'number' && typeof ruleObj.max === 'number') {
      return {
        type: 'range',
        min: ruleObj.min,
        max: ruleObj.max,
        step: ruleObj.step,
        numberType: (ruleObj as KeywordRuleObject & { type?: 'integer' | 'float' }).type || 'integer'
      };
    }

    // Template rule (has template and variables)
    if ('template' in ruleObj && 'variables' in ruleObj && 
        ruleObj.template && ruleObj.variables) {
      return {
        type: 'template',
        template: ruleObj.template,
        variables: ruleObj.variables
      };
    }

    // Sequential rule (has sequence)
    if ('sequence' in ruleObj && ruleObj.sequence) {
      return {
        type: 'sequential',
        values: ruleObj.sequence,
        cycle: ruleObj.cycle
      };
    }

    // Function rule (has function)
    if ('function' in ruleObj && ruleObj.function) {
      return {
        type: 'function',
        functionName: ruleObj.function,
        parameters: ruleObj.parameters
      };
    }

    throw new Error('Unable to determine rule type from keywords');
  }
}

/**
 * Keyword-based rule types for more intuitive JSON structure
 */
export type KeywordRule = string[] | KeywordRuleObject;

export interface KeywordRuleObject {
  // Conditional rule keywords
  if?: string;
  then?: string[];
  else?: string[];

  // Weighted rule keywords  
  values?: string[];
  weights?: number[];

  // Range rule keywords
  min?: number;
  max?: number;
  step?: number;
  type?: 'integer' | 'float';

  // Template keywords
  template?: string;
  variables?: { [key: string]: string[] };

  // Sequential keywords
  sequence?: string[];
  cycle?: boolean;

  // Function keywords
  function?: string;
  parameters?: Record<string, unknown>;
}

export interface KeywordGrammarConfig {
  rules: {
    [ruleName: string]: KeywordRule;
  };
  modifiers?: string[];
  settings?: {
    maxDepth?: number;
    randomSeed?: number;
  };
}