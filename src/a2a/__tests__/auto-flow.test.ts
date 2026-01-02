
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AutoDetector } from '../auto-detector.js';
import { DocumentLoader } from '../document-loader.js';
import { join } from 'path';
import { writeFileSync, unlinkSync, mkdirSync, existsSync } from 'fs';

// Mock dependencies if needed, but integration testing the logic is better here
// We can use temporary files for DocumentLoader testing

describe('Auto A2A System Verification', () => {

    describe('DocumentLoader', () => {
        const loader = new DocumentLoader();
        const tempDir = join(process.cwd(), 'temp_test_docs');
        const tempFile = join(tempDir, 'TEST_DOC.md');

        beforeEach(() => {
            if (!existsSync(tempDir)) mkdirSync(tempDir);
            writeFileSync(tempFile, '# Test Document\n\nThis is a test content.');
        });

        // Cleanup after all tests
        // afterAll(() => { /* cleanup logic */ });

        it('should parse @file.md references', () => {
            const task = 'Check @TEST_DOC.md for details';
            const refs = loader.parseReferences(task);
            expect(refs).toHaveLength(1);
            expect(refs[0].value).toBe('TEST_DOC.md');
        });

        it('should parse "use file as context" references', () => {
            const task = 'Use TEST_DOC.md as context for this';
            const refs = loader.parseReferences(task);
            expect(refs).toHaveLength(1);
            expect(refs[0].value).toBe('TEST_DOC.md');
        });

        it('should load content from existing files', async () => {
            // Mock baseDir to point to tempDir for this test if needed, or use absolute path
            const loaderWithDir = new DocumentLoader(tempDir);
            const docs = await loaderWithDir.loadFromTask('Analyze @TEST_DOC.md');

            expect(docs).toHaveLength(1);
            expect(docs[0].content).toContain('This is a test content');
            expect(docs[0].metadata.lines).toBeGreaterThan(0);
        });
    });

    describe('AutoDetector', () => {
        const detector = new AutoDetector();

        it('should detect SINGLE AGENT for simple tasks', () => {
            const task = 'Fix the typo in README.md'; // "Fix" might trigger A2A if not careful, but simplicity check should prevail
            // Wait, "fix" involves Archeologist. Let's use simpler.
            const simpleTask = "Write a hello world function";

            // We expect this might be simple enough. 
            // Let's check the logic: "Write" -> Implement -> Architect.
            // One action type = Simple.

            const decision = detector.shouldUseA2A(simpleTask, {});
            expect(decision.useA2A).toBe(false);
        });

        it('should detect A2A for complex tasks (Multiple Actions)', () => {
            const task = 'Research the best graph library and implement a visualizer';
            // Research (Explorer) + Implement (Architect) -> 2 Actions -> A2A

            const decision = detector.shouldUseA2A(task, {});
            expect(decision.useA2A).toBe(true);
            expect(decision.reason).toContain('Multiple action types');
        });

        it('should detect A2A when documents are referenced', () => {
            const task = 'Update the auth based on @TEST_DOC.md';
            // Document detected -> A2A

            const decision = detector.shouldUseA2A(task, {});
            expect(decision.useA2A).toBe(true);
            expect(decision.reason).toContain('Document reference detected');
        });

        it('should respect --a2a flag override', () => {
            const task = 'Simple task';
            const decision = detector.shouldUseA2A(task, { a2a: true });
            expect(decision.useA2A).toBe(true);
            expect(decision.confidence).toBe(1.0);
        });

        it('should respect --persona flag override', () => {
            const task = 'Complex task research and build';
            const decision = detector.shouldUseA2A(task, { persona: 'explorer' });
            expect(decision.useA2A).toBe(false);
            expect(decision.fallbackPersona).toBe('explorer');
        });
    });
});
