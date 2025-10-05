/**
 * Keyword-based rule builder for easier JSON grammar creation
 *
 * This class provides a more intuitive way to create rules using common keywords
 * like "if", "then", "values", "weights", etc.
 */
export class KeywordRuleBuilder {
    constructor(loader) {
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
    createConditionalRule(name, condition) {
        const ruleConfig = {
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
    createWeightedRule(name, rule) {
        const ruleConfig = {
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
    createRangeRule(name, range) {
        const ruleConfig = {
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
    createTemplateRule(name, template) {
        const ruleConfig = {
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
    createSequentialRule(name, sequence) {
        const ruleConfig = {
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
    createFunctionRule(name, func) {
        const ruleConfig = {
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
    loadKeywordConfig(config) {
        const grammarConfig = {
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
    convertKeywordRule(rule) {
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
            const conditions = [{
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
                numberType: ruleObj.type || 'integer'
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
