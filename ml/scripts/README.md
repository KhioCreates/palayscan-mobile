# ML Utility Scripts

These scripts are for **local dataset preparation only**. They do not change the PALAYSCAN app.

## Available scripts

### 1. Validate the manifest

Command:

```powershell
node ml/scripts/validate-manifest.mjs
```

Optional custom manifest path:

```powershell
node ml/scripts/validate-manifest.mjs ml/datasets/manifests/your_manifest.csv
```

What it checks:

- every row has the required fields
- every file path exists
- labels are valid
- duplicate file names are reported
- label counts are summarized
- reviewed vs not-reviewed counts are summarized

Output:

- manifest path checked
- row count
- label count summary
- reviewed summary
- a list of problems if found

### 2. Check split readiness

Command:

```powershell
node ml/scripts/suggest-split-readiness.mjs
```

Optional custom manifest path:

```powershell
node ml/scripts/suggest-split-readiness.mjs ml/datasets/manifests/your_manifest.csv
```

What it checks:

- which rows are eligible for later split planning
- which rows are blocked because they are not reviewed or not privacy-checked
- near-duplicate group counts among eligible rows
- label balance among eligible rows

Output:

- eligible vs blocked row counts
- eligible label counts
- near-duplicate group summary
- blocked row reasons

Important:

- this script does **not** assign train/validation/test automatically
- it is only a cautious readiness report for later split planning
