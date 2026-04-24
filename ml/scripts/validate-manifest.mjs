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

const allowedLabels = new Set([
  'rice_clear',
  'rice_unclear',
  'plant_not_rice',
  'non_plant',
  'unusable_image',
]);

const requiredFields = [
  'image_path',
  'label',
  'source',
  'source_type',
  'source_name',
  'source_url',
  'license_type',
  'license_url',
  'attribution_note',
  'permission_note',
  'notes',
  'reviewed',
  'reviewer',
  'privacy_checked',
  'split',
  'near_duplicate_group',
];

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
  const issues = [];
  const labelCounts = Object.fromEntries([...allowedLabels].map((label) => [label, 0]));
  const reviewedCounts = { reviewed: 0, notReviewed: 0 };
  const fileNameMap = new Map();

  if (rows.length === 0) {
    console.log(`Manifest is empty: ${manifestPath}`);
    process.exit(0);
  }

  for (const row of rows) {
    for (const field of requiredFields) {
      if (!(field in row)) {
        issues.push(`Row ${row.__rowNumber}: missing required column "${field}".`);
      }
    }

    const imagePath = String(row.image_path ?? '').trim();
    const label = String(row.label ?? '').trim();
    const reviewed = normalizeBooleanLike(row.reviewed);
    const privacyChecked = normalizeBooleanLike(row.privacy_checked);

    for (const field of requiredFields) {
      const value = row[field];
      if (value === undefined || value === null) {
        continue;
      }

      if (
        field !== 'reviewer' &&
        field !== 'split' &&
        field !== 'source_url' &&
        field !== 'license_type' &&
        field !== 'license_url' &&
        field !== 'attribution_note' &&
        field !== 'permission_note' &&
        String(value).trim() === ''
      ) {
        issues.push(`Row ${row.__rowNumber}: "${field}" is empty.`);
      }
    }

    if (!allowedLabels.has(label)) {
      issues.push(`Row ${row.__rowNumber}: invalid label "${label}".`);
    } else {
      labelCounts[label] += 1;
    }

    if (reviewed === 'yes' || reviewed === 'true') {
      reviewedCounts.reviewed += 1;
      if (!String(row.reviewer ?? '').trim()) {
        issues.push(`Row ${row.__rowNumber}: reviewed row is missing reviewer name.`);
      }
    } else {
      reviewedCounts.notReviewed += 1;
    }

    if (!['yes', 'true', 'no', 'false'].includes(privacyChecked)) {
      issues.push(
        `Row ${row.__rowNumber}: privacy_checked should be yes/no or true/false, got "${row.privacy_checked}".`,
      );
    }

    if (imagePath) {
      const absoluteImagePath = path.resolve(projectRoot, 'ml', imagePath.replace(/^datasets[\\/]/, 'datasets/'));
      if (!fs.existsSync(absoluteImagePath)) {
        issues.push(`Row ${row.__rowNumber}: file not found "${imagePath}".`);
      }

      const fileName = path.basename(imagePath).toLowerCase();
      const existingRows = fileNameMap.get(fileName) ?? [];
      existingRows.push(row.__rowNumber);
      fileNameMap.set(fileName, existingRows);
    }
  }

  for (const [fileName, rowNumbers] of fileNameMap.entries()) {
    if (rowNumbers.length > 1) {
      issues.push(
        `Duplicate file name "${fileName}" appears in rows ${rowNumbers.join(', ')}.`,
      );
    }
  }

  console.log(`Manifest checked: ${manifestPath}`);
  console.log(`Rows: ${rows.length}`);
  console.log('');
  console.log('Label counts:');
  for (const [label, count] of Object.entries(labelCounts)) {
    console.log(`- ${label}: ${count}`);
  }
  console.log('');
  console.log('Review summary:');
  console.log(`- reviewed: ${reviewedCounts.reviewed}`);
  console.log(`- not reviewed: ${reviewedCounts.notReviewed}`);
  console.log('');

  if (issues.length > 0) {
    console.log('Problems found:');
    for (const issue of issues) {
      console.log(`- ${issue}`);
    }
    process.exit(1);
  }

  console.log('No manifest problems found.');
}

main();
