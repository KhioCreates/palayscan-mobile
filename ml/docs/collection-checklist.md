# PALAYSCAN Dataset Collection Checklist

## Step-by-step checklist

### 1. Create the working folders first

Use these folders:

- `ml/datasets/raw/`
- `ml/datasets/reviewed/`
- `ml/datasets/splits/`
- `ml/datasets/manifests/`

Recommended first action:

- place all newly gathered images in `ml/datasets/raw/`
- do not move anything to `reviewed/` until labels and checks are done

### 2. Name each image clearly

Recommended naming format:

`label_source_shortid.jpg`

Examples:

- `rice_clear_team_0001.jpg`
- `rice_unclear_field_0002.jpg`
- `plant_not_rice_team_0003.jpg`
- `non_plant_team_0004.jpg`
- `unusable_image_team_0005.jpg`

Tips:

- keep names lowercase
- use underscores, not spaces
- use a running number per collection batch

### 3. Add each image to the manifest

Use:

- `ml/datasets/manifests/scan_precheck_manifest.template.csv`
or
- `ml/datasets/manifests/scan_precheck_manifest.template.json`

For every image, fill in:

- `image_path`
- `label`
- `source`
- `source_type`
- `source_name`
- `source_url`
- `license_type`
- `license_url`
- `attribution_note`
- `permission_note`
- `notes`
- `reviewed`
- `reviewer`
- `privacy_checked`
- `split`
- `near_duplicate_group`

### 4. Set `privacy_checked`

Use:

- `yes` or `true` only when privacy/copyright is acceptable

Before marking privacy checked:

- confirm the image is original, permitted, or otherwise safe to use
- confirm the source and reuse/license details were logged
- confirm there is no unnecessary personal or sensitive content
- confirm faces or personal details are not the main subject unless truly needed for `non_plant`

### 5. Set `reviewed`

Keep `reviewed = no` until a reviewer checks:

- the label is correct
- the file name is correct
- privacy is acceptable
- the image is not an obvious duplicate
- notes are clear enough to explain hard cases

Only then mark:

- `reviewed = yes`
- add reviewer name or initials in `reviewer`

### 6. Avoid duplicate images

Do not keep:

- exact copies
- resized copies of the same image
- heavy crops of the same photo unless there is a strong reason

If several images come from one burst or one nearly identical subject:

- keep only the strongest few
- record them under the same `near_duplicate_group`

### 7. Use `near_duplicate_group` correctly

Use one shared group value for images that are visually too similar.

Examples:

- same rice leaf photographed 5 times in a row
- same person photo with tiny angle changes
- several almost identical blurry shots from one capture moment

Example values:

- `group_001`
- `group_002`
- `group_003`

Important:

- all images in one `near_duplicate_group` must stay in the same split later

### 8. Split later, not at first capture

Do not assign `train`, `validation`, or `test` immediately during first capture unless you are
already sure of the grouping.

Safer approach:

1. collect and label first
2. review and group near-duplicates
3. assign splits after cleanup

Recommended split later:

- train: 80%
- validation: 10%
- test: 10%

### 9. Keep label counts balanced

Try not to collect only `rice_clear` first.

As early as possible, build a balanced batch across:

- `rice_clear`
- `rice_unclear`
- `plant_not_rice`
- `non_plant`
- `unusable_image`

### 10. Move only reviewed images to `reviewed/`

When an image is:

- labeled
- privacy checked
- reviewed
- grouped for duplication risk

then it can be moved from:

- `ml/datasets/raw/`

to:

- `ml/datasets/reviewed/`
