import { Parser } from 'story-grammar';
import { GrammarConfig, FunctionDefinition } from './types.js';
/**
 * JSON Grammar Loader for Story Grammar
 *
 * This class provides a JSON-based interface for defining Story Grammar rules,
 * allowing users to create complex rule sets without writing code directly.
 */
export declare class JSONGrammarLoader {
    private parser;
    private registeredFunctions;
    constructor();
    /**
     * Load grammar configuration from JSON string
     */
    loadFromJSON(jsonString: string): void;
    /**
     * Load grammar configuration from a configuration object
     */
    loadFromConfig(config: GrammarConfig): void;
    /**
     * Load a single rule based on its configuration
     */
    private loadRule;
    /**
     * Load static rule
     */
    private loadStaticRule;
    /**
     * Load function rule
     */
    private loadFunctionRule;
    /**
     * Load weighted rule
     */
    private loadWeightedRule;
    /**
     * Load conditional rule
     */
    private loadConditionalRule;
    /**
     * Load sequential rule
     */
    private loadSequentialRule;
    /**
     * Load range rule
     */
    private loadRangeRule;
    /**
     * Load template rule
     */
    private loadTemplateRule;
    /**
     * Create a condition function from a string
     * This is a simple implementation - in production you might want more security
     */
    private createConditionFunction;
    /**
     * Load modifiers based on string names
     */
    private loadModifiers;
    /**
     * Register a custom function that can be used in function rules
     */
    registerFunction(definition: FunctionDefinition): void;
    /**
     * Register default functions that are commonly useful
     */
    private registerDefaultFunctions;
    /**
     * Get the underlying parser instance for advanced usage
     */
    getParser(): Parser;
    /**
     * Parse text using the loaded grammar
     */
    parse(text: string, preserveContext?: boolean): string;
    /**
     * Get list of registered function names
     */
    getRegisteredFunctions(): string[];
    /**
     * Validate the current grammar for issues
     */
    validate(): import("story-grammar").ValidationResult;
    /**
     * Clear all rules and start fresh
     */
    clear(): void;
}
