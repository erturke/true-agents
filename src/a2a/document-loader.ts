/**
 * Document Loader
 * Automatically detects, loads, and summarizes documents referenced in tasks
 */

import { readFileSync, existsSync } from 'fs';
import { join, isAbsolute, basename } from 'path';
import type { LoadedDocument, DocumentReference } from '../types/a2a.js';

export class DocumentLoader {
    private baseDir: string;
    private maxFileSize: number = 20 * 1024; // 20KB limit for full content

    constructor(baseDir?: string) {
        this.baseDir = baseDir || process.cwd();
    }

    /**
     * Load documents referenced in task string
     */
    async loadFromTask(task: string): Promise<LoadedDocument[]> {
        const references = this.parseReferences(task);
        const loadedDocs: LoadedDocument[] = [];
        const processedPaths = new Set<string>();

        for (const ref of references) {
            if (processedPaths.has(ref.value)) continue;

            const doc = this.loadDocument(ref);
            if (doc) {
                loadedDocs.push(doc);
                processedPaths.add(ref.value);
            }
        }

        return loadedDocs;
    }

    /**
     * Parse task for document references
     * Supports:
     * - @filename
     * - "use filename as context"
     * - "based on filename"
     * - "reference filename"
     */
    parseReferences(task: string): DocumentReference[] {
        const refs: DocumentReference[] = [];

        // Pattern 1: @filename
        // Matches @file.ext or @/path/to/file.ext
        const atPattern = /@([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)/g;
        let match;

        while ((match = atPattern.exec(task)) !== null) {
            refs.push({
                type: 'path',
                value: match[1],
                startIndex: match.index,
                endIndex: match.index + match[0].length
            });
        }

        // Pattern 2: Natural language references
        // "use X as context", "read X", "check X"
        const naturalPatterns = [
            /use\s+([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)\s+as/gi,
            /based on\s+([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)/gi,
            /reference\s+([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)/gi,
            /read\s+([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)/gi
        ];

        for (const pattern of naturalPatterns) {
            while ((match = pattern.exec(task)) !== null) {
                refs.push({
                    type: 'path',
                    value: match[1],
                    startIndex: match.index,
                    endIndex: match.index + match[0].length,
                    contextHint: match[0]
                });
            }
        }

        return refs;
    }

    /**
     * Load single document
     */
    private loadDocument(ref: DocumentReference): LoadedDocument | null {
        try {
            const fullPath = isAbsolute(ref.value)
                ? ref.value
                : join(this.baseDir, ref.value);

            if (!existsSync(fullPath)) {
                console.warn(`⚠️ Warning: Referenced file not found: ${ref.value}`);
                return null;
            }

            const content = readFileSync(fullPath, 'utf-8');
            const stats = {
                size: content.length,
                lines: content.split('\n').length
            };

            const isLarge = stats.size > this.maxFileSize;
            const processedContent = isLarge ? this.truncateContent(content) : content;
            const summary = this.generateSummary(processedContent, isLarge);

            return {
                reference: ref,
                content: processedContent,
                summary,
                metadata: {
                    path: fullPath,
                    size: stats.size,
                    lines: stats.lines,
                    lastModified: Date.now() // fs.statSync would give real time
                },
                truncated: isLarge
            };
        } catch (error) {
            console.warn(`⚠️ Error loading file ${ref.value}: ${(error as Error).message}`);
            return null;
        }
    }

    /**
     * Truncate large content intelligently
     */
    private truncateContent(content: string): string {
        const lines = content.split('\n');
        const header = lines.slice(0, 50).join('\n');
        const footer = lines.slice(-50).join('\n');

        return `${header}\n\n... [Content Truncated (${lines.length - 100} lines hidden)] ...\n\n${footer}`;
    }

    /**
     * Generate brief summary string
     */
    private generateSummary(content: string, truncated: boolean): string {
        const typeMatch = content.match(/#\s+(.+)/);
        const title = typeMatch ? typeMatch[1] : 'Document';

        return `[${title}] ${truncated ? '(Truncated)' : '(Full Content)'}`;
    }

    /**
     * Format documents for prompt context
     */
    formatForPrompt(docs: LoadedDocument[]): string {
        if (docs.length === 0) return '';

        let output = '\n╔════════════════════════════════════════════════════════════╗\n';
        output += '║                    REFERENCE DOCUMENTS                   ║\n';
        output += '╚════════════════════════════════════════════════════════════╝\n\n';

        for (const doc of docs) {
            output += `📄 File: ${doc.reference.value}\n`;
            output += `   Size: ${doc.metadata.lines} lines\n`;
            output += '   ────────────────────────────────────────────────────────\n';
            output += `${doc.content}\n`;
            output += '   ────────────────────────────────────────────────────────\n\n';
        }

        return output;
    }
}
