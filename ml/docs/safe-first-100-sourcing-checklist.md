# Safe First 100 Image Sourcing Checklist

## Before downloading or saving an online image

Check:

- what website the image actually comes from
- whether the image has a clear reuse license
- whether attribution is required
- whether the image contains identifiable people or sensitive content
- whether the image is likely a duplicate of another image you already have

If the license or permission is unclear:

- do not use the image

## After deciding the image is acceptable

1. save the file into `ml/datasets/raw/`
2. name it using:
   - `label_source_shortid.jpg`
3. immediately add a row in the manifest
4. immediately log:
   - `source_name`
   - `source_url`
   - `license_type`
   - `license_url`
   - `attribution_note`
   - `permission_note`
5. set `privacy_checked = yes` only after reviewing privacy concerns
6. keep `reviewed = no` until a reviewer confirms the row and label

## Avoiding near-duplicates

When you find several images from the same page or same capture series:

- do not save all of them by default
- keep only the strongest and most varied examples
- assign the same `near_duplicate_group` if they are too similar

## Safe first 100 reminder

For the first 100 images, prefer:

- mostly own/team photos first
- Wikimedia Commons only when the reuse license is clear
- explicitly licensed public datasets only

Avoid:

- random image search results
- social media images
- pages with no license statement
