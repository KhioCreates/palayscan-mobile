# PALAYSCAN Data Collection Guide

## Purpose

This guide explains how to collect and review images for the future PALAYSCAN precheck model.

The model is only meant to route images before live scan. It should not be trained as a disease
diagnosis model.

## Where images can come from

Recommended sources:

- photos captured by the project team using their own devices
- rice field photos captured with permission from farmers or institutions
- project-owned demonstration photos
- images created specifically for the dataset with clear consent

Use extra caution with:

- internet images with unclear license
- images containing identifiable people
- images from private conversations or private social media

## Copyright and privacy guidance

Do:

- prefer original images captured by the project team
- record where each image came from
- verify permission before including any non-team image
- avoid keeping faces or personal information if not needed

Do not:

- scrape copyrighted image collections without permission
- reuse private personal photos without consent
- keep images that expose sensitive information unnecessarily

## What makes an image acceptable

Accept images that help the model learn one of the five labels clearly:

- `rice_clear`
- `rice_unclear`
- `plant_not_rice`
- `non_plant`
- `unusable_image`

Good collection practice:

- vary lighting
- vary camera distance
- vary backgrounds
- vary rice growth stages
- include both easy and hard examples

## What metadata to track

Track at least:

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

Optional but helpful:

- `capture_date`
- `device`
- `location_general`
- `near_duplicate_group`

## File and folder naming

Recommended file naming:

`label_source_shortid.jpg`

Examples:

- `rice_clear_team_0001.jpg`
- `plant_not_rice_field_0042.jpg`
- `non_plant_team_0105.jpg`

Recommended working folders:

- `ml/datasets/raw/`
- `ml/datasets/reviewed/`
- `ml/datasets/splits/`

## Train / validation / test split

Recommended first split:

- train: 80%
- validation: 10%
- test: 10%

Keep each split label-balanced as much as possible.

## Avoiding leakage from near-duplicate images

Do not split near-duplicate images across train and test.

Examples of leakage risk:

- burst photos from the same capture moment
- same subject with tiny angle changes
- same rice leaf captured several times in a row
- near-identical cropped copies

Best practice:

- group near-duplicates using a `near_duplicate_group` value
- keep the whole group in only one split

## Review workflow

Suggested workflow:

1. collect raw images
2. remove clearly unusable or privacy-problem images
3. assign labels
4. mark reviewer and review status
5. group near-duplicates
6. create balanced train/validation/test splits

## Practical collection reminder

The model should learn routing decisions, not agronomic diagnosis. A smaller but cleaner dataset is
better than a large mixed dataset with weak labels.
