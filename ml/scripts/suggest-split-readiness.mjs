import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const defaultManifestPath = path.join(
  projectRoot,
  'ml',
  'datasets',
  'manifests',
  'scan_precheck_manifest.template.csv',
);

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function parseCsv(content) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean);

  if (lines.length === 0) {
    return [];
  }

  const headers = parseCsvLine(lines[0]).map((header) => header.trim());

  return lines.slice(1).map((line, rowIndex) => {
    const values = parseCsvLine(line);
    const record = Object.fromEntries(
      headers.map((header, columnIndex) => [header, values[columnIndex] ?? '']),
    );

    return {
      ...record,
      __rowNumber: rowIndex + 2,
    };
  });
}

function parseManifestFile(manifestPath) {
  const raw = fs.readFileSync(manifestPath, 'utf8');

  if (manifestPath.toLowerCase().endsWith('.json')) {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error('Manifest JSON must be an array of objects.');
    }

    return parsed.map((record, index) => ({
      ...record,
      __rowNumber: index + 1,
    }));
  }

  return parseCsv(raw);
}

function normalizeBooleanLike(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

function main() {
  const manifestPath = path.resolve(process.argv[2] ?? defaultManifestPath);

  if (!fs.existsSync(manifestPath)) {
    console.error(`Manifest file not found: ${manifestPath}`);
    process.exit(1);
  }

  const rows = parseManifestFile(manifestPath);
  const eligibleRows = [];
  const blockedRows = [];
  const groupedRows = new Map();
  const labelEligibleCounts = new Map();

  for (const row of rows) {
    const reviewed = normalizeBooleanLike(row.reviewed);
    const privacyChecked = normalizeBooleanLike(row.privacy_checked);
    const group = String(row.near_duplicate_group ?? '').trim() || 'missing_group';
    const label = String(row.label ?? '').trim() || 'missing_label';

    const reasons = [];

    if (!['yes', 'true'].includes(reviewed)) {
      reasons.push('not reviewed');
    }

    if (!['yes', 'true'].includes(privacyChecked)) {
      reasons.push('privacy not checked');
    }

    if (!String(row.image_path ?? '').trim()) {
      reasons.push('missing image path');
    }

    if (!String(row.label ?? '').trim()) {
      reasons.push('missing label');
    }

    if (reasons.length === 0) {
      eligibleRows.push(row);
      groupedRows.set(group, (groupedRows.get(group) ?? 0) + 1);
      labelEligibleCounts.set(label, (labelEligibleCounts.get(label) ?? 0) + 1);
    } else {
      blockedRows.push({
        rowNumber: row.__rowNumber,
        reasons,
      });
    }
  }

  console.log(`Split readiness check: ${manifestPath}`);
  console.log(`- total rows: ${rows.length}`);
  console.log(`- eligible rows: ${eligibleRows.length}`);
  console.log(`- blocked rows: ${blockedRows.length}`);
  console.log('');

  console.log('Eligible label counts:');
  for (const [label, count] of [...labelEligibleCounts.entries()].sort()) {
    console.log(`- ${label}: ${count}`);
  }
  console.log('');

  console.log('Near-duplicate groups among eligible rows:');
  for (const [group, count] of [...groupedRows.entries()].sort()) {
    console.log(`- ${group}: ${count}`);
  }
  console.log('');

  if (blockedRows.length > 0) {
    console.log('Rows blocked from safe split preparation:');
    for (const blocked of blockedRows) {
      console.log(`- row ${blocked.rowNumber}: ${blocked.reasons.join(', ')}`);
    }
  } else {
    console.log('All rows are eligible for later split planning.');
  }

  console.log('');
  console.log('This script does not assign train/validation/test automatically.');
  console.log('It only shows whether the manifest is ready for cautious split planning.');
}

main();
