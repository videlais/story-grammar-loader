/**
 * Story Grammar JSON Loader
 * 
 * This library provides a JSON-based interface for defining Story Grammar rules,
 * making it easy to create complex text generation systems without writing code.
 */

import { JSONGrammarLoader } from './JSONGrammarLoader.js';
import { KeywordRuleBuilder } from './KeywordRuleBuilder.js';

// Main classes
export { JSONGrammarLoader } from './JSONGrammarLoader.js';
export { KeywordRuleBuilder } from './KeywordRuleBuilder.js';

// Types
export type {
  GrammarConfig,
  RuleConfig,
  StaticRuleConfig,
  FunctionRuleConfig,
  WeightedRuleConfig,
  ConditionalRuleConfig,
  SequentialRuleConfig,
  RangeRuleConfig,
  TemplateRuleConfig,
  FunctionDefinition,
  RuleKeywords
} from './types.js';

export type {
  KeywordRule,
  KeywordRuleObject,
  KeywordGrammarConfig
} from './KeywordRuleBuilder.js';

// Re-export from story-grammar for convenience
export { Parser } from 'story-grammar';

/**
 * Quick-start function to create a loader with keyword support
 */
export function createGrammarLoader() {
  const loader = new JSONGrammarLoader();
  const builder = new KeywordRuleBuilder(loader);
  return { loader, builder };
}