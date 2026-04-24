# PALAYSCAN Reviewer Checklist

Before marking `reviewed = yes`, check all of the following:

## Label check

- Is the assigned label correct?
- Does the image clearly belong to only one label?
- If uncertain, did the collector add a useful note?

## File check

- Is the file name clean and readable?
- Does the file path in the manifest match the actual file?
- Is the format usable, such as JPG or PNG?

## Privacy and source check

- Is `privacy_checked` completed correctly?
- Is the image source acceptable?
- Does the image avoid unnecessary personal or sensitive content?

## Duplicate check

- Is this an exact duplicate of another image?
- Is it a near-duplicate that needs the same `near_duplicate_group`?
- If it is too repetitive, should it be removed from the dataset?

## Quality check

- Is the label still correct after looking carefully at image quality?
- If the image is too poor to trust, should it be `unusable_image` instead?

## Manifest check

- Are all key fields filled in?
- Is `reviewer` filled in?
- Is `reviewed` changed only after all checks are done?

## Final reviewer rule

Only mark `reviewed = yes` when:

- the label is acceptable
- privacy/source is acceptable
- duplicate risk is handled
- manifest fields are complete
