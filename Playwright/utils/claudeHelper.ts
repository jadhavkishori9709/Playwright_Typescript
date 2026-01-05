import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Cost tracking data structure
 */
interface CostEntry {
    timestamp: string;
    feature: string;
    inputTokens: number;
    outputTokens: number;
    cost: number;
}

/**
 * Response cache entry
 */
interface CacheEntry {
    response: string;
    timestamp: number;
    usage: Anthropic.Usage;
}

/**
 * Claude AI Helper for Playwright Testing
 * Optimized for student usage with cost tracking and caching
 */
export class ClaudeHelper {
    private client: Anthropic;
    private model: string = 'claude-sonnet-4-20250514';
    private costLogPath: string;
    private cache: Map<string, CacheEntry> = new Map();
    private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
    private readonly BUDGET_LIMIT = 5.0; // $5 for students
    private readonly MAX_RETRIES = 3;

    constructor(apiKey?: string) {
        this.client = new Anthropic({
            apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
        });

        // Set up cost tracking
        const projectRoot = process.cwd();
        const costDir = path.join(projectRoot, '.claude-costs');
        if (!fs.existsSync(costDir)) {
            fs.mkdirSync(costDir, { recursive: true });
        }
        this.costLogPath = path.join(costDir, 'cost-log.json');
    }

    /**
     * Generate test scenarios based on page content
     */
    async generateTestScenarios(pageContent: string, pageName: string): Promise<string> {
        // Compress content to reduce tokens
        const compressedContent = this.compressHtml(pageContent);

        const cacheKey = `scenarios:${pageName}:${this.hashContent(compressedContent)}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            console.log('✅ Using cached response (FREE!)');
            return cached;
        }

        const message = await this.executeWithRetry(async () => {
            return await this.client.messages.create({
                model: this.model,
                max_tokens: 2000,
                messages: [
                    {
                        role: 'user',
                        content: `Analyze this ${pageName} page and suggest comprehensive test scenarios:\n\n${compressedContent}`,
                    },
                ],
            });
        });

        const response = this.extractTextContent(message);
        this.saveToCache(cacheKey, response, message.usage);
        this.logCost('Test Scenarios', message.usage);

        return response;
    }

    /**
     * Generate Page Object Model code
     */
    async generatePageObject(pageHtml: string, pageName: string): Promise<string> {
        const compressedHtml = this.compressHtml(pageHtml);
        const cacheKey = `pom:${pageName}:${this.hashContent(compressedHtml)}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            console.log('✅ Using cached POM (FREE!)');
            return cached;
        }

        const message = await this.executeWithRetry(async () => {
            return await this.client.messages.create({
                model: this.model,
                max_tokens: 4000,
                messages: [
                    {
                        role: 'user',
                        content: `Generate a TypeScript Page Object Model class for this ${pageName} page. Include selectors and methods:\n\n${compressedHtml}`,
                    },
                ],
            });
        });

        const response = this.extractTextContent(message);
        this.saveToCache(cacheKey, response, message.usage);
        this.logCost('Page Object Generation', message.usage);

        return response;
    }

    /**
     * Analyze test failures and suggest fixes
     */
    async analyzeTestFailure(
        errorMessage: string,
        testCode: string,
        screenshot?: string
    ): Promise<string> {
        const cacheKey = `failure:${this.hashContent(errorMessage + testCode)}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            console.log('✅ Using cached analysis (FREE!)');
            return cached;
        }

        const message = await this.executeWithRetry(async () => {
            return await this.client.messages.create({
                model: this.model,
                max_tokens: 3000,
                messages: [
                    {
                        role: 'user',
                        content: `Analyze this Playwright test failure and suggest fixes:\n\nError: ${errorMessage}\n\nTest Code:\n${testCode}`,
                    },
                ],
            });
        });

        const response = this.extractTextContent(message);
        this.saveToCache(cacheKey, response, message.usage);
        this.logCost('Failure Analysis', message.usage);

        return response;
    }

    /**
     * Generate test data
     */
    async generateTestData(dataType: string, count: number = 5): Promise<any[]> {
        const cacheKey = `data:${dataType}:${count}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            console.log('✅ Using cached test data (FREE!)');
            return JSON.parse(cached);
        }

        const message = await this.executeWithRetry(async () => {
            return await this.client.messages.create({
                model: this.model,
                max_tokens: 2000,
                messages: [
                    {
                        role: 'user',
                        content: `Generate ${count} realistic test data entries for: ${dataType}. Return as JSON array only, no explanation.`,
                    },
                ],
            });
        });

        const content = this.extractTextContent(message);
        this.saveToCache(cacheKey, content, message.usage);
        this.logCost('Test Data Generation', message.usage);

        try {
            // Extract JSON from markdown code blocks if present
            const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\[[\s\S]*\]/);
            const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
            return JSON.parse(jsonStr);
        } catch {
            console.warn('Failed to parse test data, returning empty array');
            return [];
        }
    }

    /**
     * Generate API tests from OpenAPI spec
     */
    async generateApiTests(spec: any, endpointPath: string): Promise<string> {
        const cacheKey = `api:${endpointPath}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            console.log('✅ Using cached API tests (FREE!)');
            return cached;
        }

        const message = await this.executeWithRetry(async () => {
            return await this.client.messages.create({
                model: this.model,
                max_tokens: 3000,
                messages: [
                    {
                        role: 'user',
                        content: `Generate Playwright API tests for this endpoint:\n\nPath: ${endpointPath}\nSpec: ${JSON.stringify(spec, null, 2)}`,
                    },
                ],
            });
        });

        const response = this.extractTextContent(message);
        this.saveToCache(cacheKey, response, message.usage);
        this.logCost('API Test Generation', message.usage);

        return response;
    }

    /**
     * Generate mobile-specific tests
     */
    async generateMobileTests(pageContent: string, devices: string[]): Promise<string> {
        const compressedContent = this.compressHtml(pageContent);
        const cacheKey = `mobile:${devices.join(',')}:${this.hashContent(compressedContent)}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            console.log('✅ Using cached mobile tests (FREE!)');
            return cached;
        }

        const message = await this.executeWithRetry(async () => {
            return await this.client.messages.create({
                model: this.model,
                max_tokens: 3000,
                messages: [
                    {
                        role: 'user',
                        content: `Generate mobile-specific Playwright tests for devices: ${devices.join(', ')}\n\nPage content:\n${compressedContent}`,
                    },
                ],
            });
        });

        const response = this.extractTextContent(message);
        this.saveToCache(cacheKey, response, message.usage);
        this.logCost('Mobile Test Generation', message.usage);

        return response;
    }

    /**
     * Execute API call with retry logic
     */
    private async executeWithRetry<T>(fn: () => Promise<T>): Promise<T> {
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
            try {
                // Check budget before making call
                this.checkBudget();
                return await fn();
            } catch (error: any) {
                lastError = error;

                if (error.status === 429) {
                    // Rate limit - wait and retry
                    const waitTime = Math.pow(2, attempt) * 1000;
                    console.log(`Rate limited. Waiting ${waitTime}ms before retry ${attempt}/${this.MAX_RETRIES}...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                } else if (error.status >= 500) {
                    // Server error - retry
                    console.log(`Server error. Retry ${attempt}/${this.MAX_RETRIES}...`);
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                } else {
                    // Other error - don't retry
                    throw error;
                }
            }
        }

        throw lastError || new Error('Max retries exceeded');
    }

    /**
     * Extract text content from Claude response
     */
    private extractTextContent(message: Anthropic.Message): string {
        const textBlocks = message.content.filter((block) => block.type === 'text');
        return textBlocks.map((block: any) => block.text).join('\n');
    }

    /**
     * Get usage statistics from last response
     */
    getUsageStats(message: Anthropic.Message) {
        return {
            inputTokens: message.usage.input_tokens,
            outputTokens: message.usage.output_tokens,
            estimatedCost: this.calculateCost(
                message.usage.input_tokens,
                message.usage.output_tokens
            ),
        };
    }

    /**
     * Calculate estimated cost in USD
     */
    private calculateCost(inputTokens: number, outputTokens: number): number {
        const INPUT_COST_PER_MILLION = 3.0;
        const OUTPUT_COST_PER_MILLION = 15.0;

        const inputCost = (inputTokens / 1_000_000) * INPUT_COST_PER_MILLION;
        const outputCost = (outputTokens / 1_000_000) * OUTPUT_COST_PER_MILLION;

        return inputCost + outputCost;
    }

    /**
     * Log cost to file
     */
    private logCost(feature: string, usage: Anthropic.Usage): void {
        const cost = this.calculateCost(usage.input_tokens, usage.output_tokens);

        const entry: CostEntry = {
            timestamp: new Date().toISOString(),
            feature,
            inputTokens: usage.input_tokens,
            outputTokens: usage.output_tokens,
            cost,
        };

        let logs: CostEntry[] = [];
        if (fs.existsSync(this.costLogPath)) {
            const content = fs.readFileSync(this.costLogPath, 'utf-8');
            logs = JSON.parse(content);
        }

        logs.push(entry);
        fs.writeFileSync(this.costLogPath, JSON.stringify(logs, null, 2));

        console.log(`💰 Cost: $${cost.toFixed(4)} | Total: $${this.getTotalCost().toFixed(4)} / $${this.BUDGET_LIMIT}`);
    }

    /**
     * Get total cost from logs
     */
    getTotalCost(): number {
        if (!fs.existsSync(this.costLogPath)) {
            return 0;
        }

        const content = fs.readFileSync(this.costLogPath, 'utf-8');
        const logs: CostEntry[] = JSON.parse(content);

        return logs.reduce((sum, entry) => sum + entry.cost, 0);
    }

    /**
     * Check if budget limit is exceeded
     */
    private checkBudget(): void {
        const total = this.getTotalCost();
        const remaining = this.BUDGET_LIMIT - total;

        if (remaining <= 0) {
            throw new Error(`Budget limit of $${this.BUDGET_LIMIT} exceeded! Total spent: $${total.toFixed(2)}`);
        }

        if (remaining < 0.50) {
            console.warn(`⚠️  Low budget! Only $${remaining.toFixed(2)} remaining of $${this.BUDGET_LIMIT}`);
        }
    }

    /**
     * Get cost report
     */
    getCostReport(): string {
        if (!fs.existsSync(this.costLogPath)) {
            return 'No costs logged yet.';
        }

        const content = fs.readFileSync(this.costLogPath, 'utf-8');
        const logs: CostEntry[] = JSON.parse(content);

        const total = logs.reduce((sum, entry) => sum + entry.cost, 0);
        const byFeature = logs.reduce((acc, entry) => {
            acc[entry.feature] = (acc[entry.feature] || 0) + entry.cost;
            return acc;
        }, {} as Record<string, number>);

        let report = `\n📊 Claude AI Cost Report\n`;
        report += `${'='.repeat(50)}\n`;
        report += `Total Spent: $${total.toFixed(4)} / $${this.BUDGET_LIMIT}\n`;
        report += `Remaining: $${(this.BUDGET_LIMIT - total).toFixed(4)}\n`;
        report += `\nBreakdown by Feature:\n`;

        for (const [feature, cost] of Object.entries(byFeature)) {
            report += `  ${feature}: $${cost.toFixed(4)}\n`;
        }

        report += `\nTotal API Calls: ${logs.length}\n`;
        report += `${'='.repeat(50)}\n`;

        return report;
    }

    /**
     * Compress HTML to reduce tokens
     */
    private compressHtml(html: string): string {
        return html
            .replace(/\s+/g, ' ')  // Collapse whitespace
            .replace(/<!--[\s\S]*?-->/g, '')  // Remove comments
            .substring(0, 8000);  // Limit size
    }

    /**
     * Hash content for cache keys
     */
    private hashContent(content: string): string {
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    /**
     * Get response from cache
     */
    private getFromCache(key: string): string | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        const age = Date.now() - entry.timestamp;
        if (age > this.CACHE_TTL) {
            this.cache.delete(key);
            return null;
        }

        return entry.response;
    }

    /**
     * Save response to cache
     */
    private saveToCache(key: string, response: string, usage: Anthropic.Usage): void {
        this.cache.set(key, {
            response,
            timestamp: Date.now(),
            usage,
        });
    }
}
