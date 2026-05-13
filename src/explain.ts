import type { ExplainSection } from './types.js';

export function explainSections(): ExplainSection[] {
  return [
    {
      title: 'What PathPrune does',
      body: 'PathPrune scans one explicit directory, honors simple .gitignore rules, and reports cleanup candidates without editing or deleting anything.'
    },
    {
      title: 'Finding types',
      body: 'duplicate-path highlights repeated doc/artifact names, dead-file flags obvious backup cruft, ignored-candidate points at generated files that may need ignore rules, and large-file asks for a storage sanity check.'
    },
    {
      title: 'Exit codes',
      body: '0 means clean enough, 1 means warning-level findings exceeded policy, and 2 means the input or command was invalid.'
    },
    {
      title: 'Safety model',
      body: 'Reports are dry-run previews. Every recommendation says to review manually; safeToRemove remains false in v1.'
    }
  ];
}

export function formatExplain(): string {
  const lines = ['PathPrune explained', '===================', ''];
  for (const section of explainSections()) {
    lines.push(section.title);
    lines.push('-'.repeat(section.title.length));
    lines.push(section.body);
    lines.push('');
  }
  return `${lines.join('\n').trimEnd()}\n`;
}
