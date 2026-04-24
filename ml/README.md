# PALAYSCAN ML Workspace

This folder prepares PALAYSCAN for the future **on-device scan precheck model** without changing
the current app behavior.

## Folder structure

```text
ml/
  docs/
    dataset-plan.md
    data-collection-guide.md
    collection-checklist.md
    first-100-plan.md
    labeling-cheat-sheet.md
    reviewer-checklist.md
    sourcing-policy.md
    safe-first-100-sourcing-checklist.md
    allowed-vs-not-allowed-cheat-sheet.md
    training-export-note.md
  datasets/
    README.md
    raw/
    reviewed/
    splits/
    manifests/
      scan_precheck_manifest.template.csv
      scan_precheck_manifest.template.json
      source_log.template.csv
  training/
    README.md
  exports/
    README.md
```

## Purpose of each folder

- `docs/`
  - planning notes, labeling guidance, and export direction
- `datasets/raw/`
  - newly collected images before review and cleanup
- `datasets/reviewed/`
  - cleaned and reviewed images ready for split preparation
- `datasets/splits/`
  - train, validation, and test split manifests or organized copies if needed
- `datasets/manifests/`
  - labeling templates and manifest files
- `training/`
  - future notebooks, scripts, or experiment notes for offline training
- `exports/`
  - future exported model files such as `.tflite`, label maps, and evaluation notes

## Scope reminder

This workspace is for the **precheck gate only**.

It is **not** for disease diagnosis model training. The future model should only answer:

1. does the image likely contain a plant?
2. does it likely look like rice?
3. is the image usable enough for the paid Kindwise live scan?
