/**
 * TRUE Multi-Agent System - Main Export Index V10
 *
 * 🏗️ STRUCTURE:
 * - src/core/       - Core system components
 * - src/orchestrator/ - Task orchestration
 * - src/conversation/ - Agent communication
 * - src/factory/     - Persona creation
 * - src/patterns/    - Execution patterns
 * - src/domain/      - Domain-specific agents
 * - src/tests/       - Test files
 *
 * NOTE: Due to file reorganization, some imports may need updating.
 * For standalone CLI usage, use cli.ts directly.
 */

// ==========================================
// CLI ENTRY POINT
// ==========================================

/**
 * TRUE CLI - Standalone command interface
 *
 * Usage:
 *   npx tsx cli.ts "task description"
 *   npx tsx cli.ts start
 *   npx tsx cli.ts status
 */
export class TrueCLI {
  async run(args: string[]): Promise<void> {
    const [command, ...rest] = args;

    switch (command) {
      case 'cli':
        console.log('Use cli.ts directly for CLI operations');
        break;
      case 'start':
        await this.startSystem();
        break;
      case 'status':
        await this.showStatus();
        break;
      default:
        this.showHelp();
    }
  }

  private async startSystem(): Promise<void> {
    console.log('🔄 Starting TRUE Agent System...');
    // System startup logic
  }

  private async showStatus(): Promise<void> {
    console.log('📊 TRUE Agent System Status:');
    console.log('   - Personas: 9 (4 CORE + 5 SPECIALIST)');
    console.log('   - Status: Ready');
    console.log('   - CLI: npx tsx cli.ts --help');
  }

  private showHelp(): void {
    console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                    TRUE Multi-Agent System V10                        ║
╚══════════════════════════════════════════════════════════════════════╝

Usage:
  npx tsx cli.ts "task description"     Execute a task
  npx tsx cli.ts --persona architect "fix"  Use specific persona
  npx tsx cli.ts --parallel "t1" "t2"   Run in parallel

Personas:
  CORE:      SENTINEL, REFEREE, RECORDER, AUDITOR
  SPECIALIST: ARCHITECT, EXPLORER, ANALYST, TEST, ARCHAEOLOGIST

📚 Documentation: master.md
    `);
  }
}

// Export metadata
export const VERSION = '10.0';
export const PERSONAS = {
  CORE: ['SENTINEL', 'REFEREE', 'RECORDER', 'AUDITOR'],
  SPECIALIST: ['ARCHITECT', 'EXPLORER', 'ANALYST', 'TEST', 'ARCHAEOLOGIST']
} as const;
