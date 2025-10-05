import { Parser } from 'story-grammar';
/**
 * JSON Grammar Loader for Story Grammar
 *
 * This class provides a JSON-based interface for defining Story Grammar rules,
 * allowing users to create complex rule sets without writing code directly.
 */
export class JSONGrammarLoader {
    constructor() {
        this.registeredFunctions = new Map();
        this.parser = new Parser();
        this.registerDefaultFunctions();
    }
    /**
     * Load grammar configuration from JSON string
     */
    loadFromJSON(jsonString) {
        try {
            const config = JSON.parse(jsonString);
            this.loadFromConfig(config);
        }
        catch (error) {
            throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Load grammar configuration from a configuration object
     */
    loadFromConfig(config) {
        // Apply settings first
        if (config.settings) {
            if (config.settings.maxDepth !== undefined) {
                this.parser.setMaxDepth(config.settings.maxDepth);
            }
            if (config.settings.randomSeed !== undefined) {
                this.parser.setRandomSeed(config.settings.randomSeed);
            }
        }
        // Load modifiers if specified
        if (config.modifiers) {
            this.loadModifiers(config.modifiers);
        }
        // Load all rules
        for (const [ruleName, ruleConfig] of Object.entries(config.rules)) {
            this.loadRule(ruleName, ruleConfig);
        }
    }
    /**
     * Load a single rule based on its configuration
     */
    loadRule(name, config) {
        switch (config.type) {
            case 'static':
                this.loadStaticRule(name, config);
                break;
            case 'function':
                this.loadFunctionRule(name, config);
                break;
            case 'weighted':
                this.loadWeightedRule(name, config);
                break;
            case 'conditional':
                this.loadConditionalRule(name, config);
                break;
            case 'sequential':
                this.loadSequentialRule(name, config);
                break;
            case 'range':
                this.loadRangeRule(name, config);
                break;
            case 'template':
                this.loadTemplateRule(name, config);
                break;
            default:
                throw new Error(`Unknown rule type: ${config.type}`);
        }
    }
    /**
     * Load static rule
     */
    loadStaticRule(name, config) {
        this.parser.addRule(name, config.values);
    }
    /**
     * Load function rule
     */
    loadFunctionRule(name, config) {
        const functionDef = this.registeredFunctions.get(config.functionName);
        if (!functionDef) {
            throw new Error(`Unknown function: ${config.functionName}`);
        }
        // Create a wrapper that applies parameters if provided
        const wrappedFunction = () => {
            return functionDef.handler(config.parameters || {});
        };
        this.parser.addFunctionRule(name, wrappedFunction);
    }
    /**
     * Load weighted rule
     */
    loadWeightedRule(name, config) {
        this.parser.addWeightedRule(name, config.values, config.weights);
    }
    /**
     * Load conditional rule
     */
    loadConditionalRule(name, config) {
        const conditions = config.conditions.map(condition => {
            if ('default' in condition && condition.default) {
                return { default: condition.default };
            }
            else if ('if' in condition && 'then' in condition && condition.if && condition.then) {
                // Create a function from the condition string
                const conditionFn = this.createConditionFunction(condition.if);
                return {
                    if: conditionFn,
                    then: condition.then
                };
            }
            else {
                throw new Error('Invalid condition format');
            }
        });
        this.parser.addConditionalRule(name, { conditions });
    }
    /**
     * Load sequential rule
     */
    loadSequentialRule(name, config) {
        this.parser.addSequentialRule(name, config.values, {
            cycle: config.cycle !== false // Default to true
        });
    }
    /**
     * Load range rule
     */
    loadRangeRule(name, config) {
        this.parser.addRangeRule(name, {
            min: config.min,
            max: config.max,
            step: config.step,
            type: config.numberType
        });
    }
    /**
     * Load template rule
     */
    loadTemplateRule(name, config) {
        this.parser.addTemplateRule(name, {
            template: config.template,
            variables: config.variables
        });
    }
    /**
     * Create a condition function from a string
     * This is a simple implementation - in production you might want more security
     */
    createConditionFunction(conditionString) {
        return (context) => {
            try {
                // Replace context variable references with actual values
                let evaluableCondition = conditionString;
                // Replace context.variableName with context['variableName']
                evaluableCondition = evaluableCondition.replace(/context\.(\w+)/g, (match, varName) => `context['${varName}']`);
                // Create a function that evaluates the condition
                const func = new Function('context', `return ${evaluableCondition}`);
                return func(context);
            }
            catch {
                // Failed to evaluate condition - return false as fallback
                return false;
            }
        };
    }
    /**
     * Load modifiers based on string names
     */
    loadModifiers(modifierNames) {
        // This would need to import the actual modifiers from story-grammar
        // For now, we'll silently accept modifier names for future implementation
        // In a real implementation, you would:
        // - Import the required modifiers from 'story-grammar'
        // - Call parser.loadModifier() or parser.loadModifiers() for each
        if (modifierNames.length > 0) {
            // TODO: Implement actual modifier loading
        }
    }
    /**
     * Register a custom function that can be used in function rules
     */
    registerFunction(definition) {
        this.registeredFunctions.set(definition.name, definition);
    }
    /**
     * Register default functions that are commonly useful
     */
    registerDefaultFunctions() {
        // Random number generator
        this.registerFunction({
            name: 'randomNumber',
            description: 'Generate a random number within specified range',
            handler: (params = {}) => {
                const min = params.min || 1;
                const max = params.max || 100;
                const num = Math.floor(Math.random() * (max - min + 1)) + min;
                return [num.toString()];
            }
        });
        // Dice roll
        this.registerFunction({
            name: 'diceRoll',
            description: 'Roll dice (e.g., d6, d20)',
            handler: (params = {}) => {
                const sides = params.sides || 6;
                const count = params.count || 1;
                let total = 0;
                for (let i = 0; i < count; i++) {
                    total += Math.floor(Math.random() * sides) + 1;
                }
                return [total.toString()];
            }
        });
        // Current time
        this.registerFunction({
            name: 'currentTime',
            description: 'Get current time in various formats',
            handler: (params = {}) => {
                const now = new Date();
                const format = params.format || 'time';
                switch (format) {
                    case 'time':
                        return [now.toLocaleTimeString()];
                    case 'date':
                        return [now.toLocaleDateString()];
                    case 'datetime':
                        return [now.toLocaleString()];
                    default:
                        return [now.toLocaleTimeString()];
                }
            }
        });
        // Random choice from array
        this.registerFunction({
            name: 'randomChoice',
            description: 'Choose random item from provided array',
            handler: (params = {}) => {
                const choices = params.choices || ['option1', 'option2', 'option3'];
                const randomIndex = Math.floor(Math.random() * choices.length);
                return [choices[randomIndex]];
            }
        });
    }
    /**
     * Get the underlying parser instance for advanced usage
     */
    getParser() {
        return this.parser;
    }
    /**
     * Parse text using the loaded grammar
     */
    parse(text, preserveContext = false) {
        return this.parser.parse(text, preserveContext);
    }
    /**
     * Get list of registered function names
     */
    getRegisteredFunctions() {
        return Array.from(this.registeredFunctions.keys());
    }
    /**
     * Validate the current grammar for issues
     */
    validate() {
        return this.parser.validate();
    }
    /**
     * Clear all rules and start fresh
     */
    clear() {
        this.parser.clearAll();
    }
}
