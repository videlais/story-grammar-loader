import { JSONGrammarLoader } from './JSONGrammarLoader.js';
/**
 * Keyword-based rule builder for easier JSON grammar creation
 *
 * This class provides a more intuitive way to create rules using common keywords
 * like "if", "then", "values", "weights", etc.
 */
export declare class KeywordRuleBuilder {
    private loader;
    constructor(loader: JSONGrammarLoader);
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
    createConditionalRule(name: string, condition: {
        if: string;
        then: string[];
        else?: string[];
    }): void;
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
    createWeightedRule(name: string, rule: {
        values: string[];
        weights: number[];
    }): void;
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
    createRangeRule(name: string, range: {
        min: number;
        max: number;
        step?: number;
        type?: 'integer' | 'float';
    }): void;
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
    createTemplateRule(name: string, template: {
        template: string;
        variables: {
            [key: string]: string[];
        };
    }): void;
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
    createSequentialRule(name: string, sequence: {
        sequence: string[];
        cycle?: boolean;
    }): void;
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
    createFunctionRule(name: string, func: {
        function: string;
        parameters?: Record<string, unknown>;
    }): void;
    /**
     * Load multiple rules from a keyword-based configuration object
     * This allows for more natural JSON structure
     */
    loadKeywordConfig(config: KeywordGrammarConfig): void;
    /**
     * Convert a keyword-based rule to a proper RuleConfig
     */
    private convertKeywordRule;
}
/**
 * Keyword-based rule types for more intuitive JSON structure
 */
export type KeywordRule = string[] | KeywordRuleObject;
export interface KeywordRuleObject {
    if?: string;
    then?: string[];
    else?: string[];
    values?: string[];
    weights?: number[];
    min?: number;
    max?: number;
    step?: number;
    type?: 'integer' | 'float';
    template?: string;
    variables?: {
        [key: string]: string[];
    };
    sequence?: string[];
    cycle?: boolean;
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
