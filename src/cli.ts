import { Command, InvalidArgumentError } from 'commander';
import { exitCodeForReport, scan } from './scanner.js';
import { formatJson, formatText } from './format.js';
import { formatExplain } from './explain.js';
import { initProject } from './init.js';
import { loadProjectConfig } from './config-loader.js';
import type { OutputFormat } from './types.js';

interface CheckOptions {
  readonly format: OutputFormat;
  readonly maxFindings?: number;
}

export async function runCli(argv: readonly string[] = process.argv): Promise<void> {
  const program = new Command();
  program
    .name('pathprune')
    .description('Ignore-aware dead-file and duplicate-path scout with safe cleanup previews.')
    .version('0.1.0')
    .showHelpAfterError();

  program
    .command('check')
    .alias('run')
    .description('Scan a workspace and print a dry-run cleanup preview.')
    .argument('<root>', 'Directory to scan')
    .option('-f, --format <format>', 'Output format: text or json', parseFormat, 'text')
    .option('--max-findings <count>', 'Allowed warning findings before exit 1', parseNonNegativeInteger)
    .action(async (root: string, options: CheckOptions) => {
      const projectConfig = await loadProjectConfig(root);
      const config = {
        ...projectConfig,
        ...(options.maxFindings === undefined ? {} : { maxFindings: options.maxFindings })
      };
      const report = await scan({ root, config });
      process.stdout.write(options.format === 'json' ? formatJson(report) : formatText(report));
      process.exitCode = exitCodeForReport(report, config.maxFindings ?? 0);
    });

  program
    .command('init')
    .description('Write a starter .pathprunerc.json without touching project files.')
    .argument('<root>', 'Directory where config should be created')
    .action(async (root: string) => {
      process.stdout.write(await initProject(root));
    });

  program
    .command('explain')
    .description('Explain PathPrune finding types, exit codes, and safety guarantees.')
    .action(() => {
      process.stdout.write(formatExplain());
    });

  await program.parseAsync([...argv], { from: 'node' });
}

function parseFormat(value: string): OutputFormat {
  if (value === 'text' || value === 'json') return value;
  throw new InvalidArgumentError('format must be text or json');
}

function parseNonNegativeInteger(value: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new InvalidArgumentError('expected a non-negative integer');
  }
  return parsed;
}
