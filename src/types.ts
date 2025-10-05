/**
 * JSON Schema types for Story Grammar rules
 * These interfaces define the structure of JSON files containing rule definitions
 */

/**
 * Basic rule with simple string array values
 */
export interface StaticRuleConfig {
  type: 'static';
  values: string[];
}

/**
 * Function rule configuration
 * Note: Functions cannot be serialized in JSON, so this supports predefined function names
 */
export interface FunctionRuleConfig {
  type: 'function';
  functionName: string;
  parameters?: Record<string, unknown>;
}

/**
 * Weighted rule with probability distributions
 */
export interface WeightedRuleConfig {
  type: 'weighted';
  values: string[];
  weights: number[];
}

/**
 * Conditional rule configuration
 */
export interface ConditionalRuleConfig {
  type: 'conditional';
  conditions: Array<{
    if?: string; // JavaScript condition as string that will be evaluated
    then: string[];
    default?: never;
  } | {
    if?: never;
    then?: never;
    default: string[];
  }>;
}

/**
 * Sequential rule configuration
 */
export interface SequentialRuleConfig {
  type: 'sequential';
  values: string[];
  cycle?: boolean;
}

/**
 * Range rule configuration
 */
export interface RangeRuleConfig {
  type: 'range';
  min: number;
  max: number;
  step?: number;
  numberType: 'integer' | 'float';
}

/**
 * Template rule configuration
 */
export interface TemplateRuleConfig {
  type: 'template';
  template: string;
  variables: { [key: string]: string[] };
}

/**
 * Union type of all possible rule configurations
 */
export type RuleConfig = 
  | StaticRuleConfig
  | FunctionRuleConfig
  | WeightedRuleConfig
  | ConditionalRuleConfig
  | SequentialRuleConfig
  | RangeRuleConfig
  | TemplateRuleConfig;

/**
 * Complete grammar configuration from JSON
 */
export interface GrammarConfig {
  rules: {
    [ruleName: string]: RuleConfig;
  };
  modifiers?: string[];
  settings?: {
    maxDepth?: number;
    randomSeed?: number;
  };
}

/**
 * Predefined function definitions for function rules
 */
export interface FunctionDefinition {
  name: string;
  description: string;
  handler: (params?: Record<string, unknown>) => string[];
}

/**
 * Keywords mapping for easier JSON rule definition
 */
export interface RuleKeywords {
  // Static rule keywords
  if: string;
  then: string[];
  else?: string[];
  
  // Weighted rule keywords
  values: string[];
  weights: number[];
  
  // Range rule keywords
  min: number;
  max: number;
  step?: number;
  
  // Template keywords
  template: string;
  variables: { [key: string]: string[] };
  
  // Sequential keywords
  sequence: string[];
  cycle?: boolean;
}