# PALAYSCAN Dataset Sourcing Policy

## Purpose

This policy explains how to gather images for the future PALAYSCAN scan precheck dataset in a way
that is practical, documented, and safer for long-term project use.

## Preferred source priority

Use image sources in this order:

1. **Own or team photos**
2. **Wikimedia Commons images with a clear reusable license**
3. **Public datasets or repositories with an explicit license**
4. **Permission-based academic or agriculture image sources only when reuse is clearly allowed**

## Allowed sources

Examples of allowed sources:

- your own rice field or non-rice plant photos
- project-team photos captured specifically for the dataset
- Wikimedia Commons images with clearly stated reusable licenses
- public datasets with explicit license terms allowing reuse
- agriculture or academic image collections only when written reuse permission or clear licensing exists

## Discouraged or forbidden sources

Do not use:

- random Google Images results without checking the actual source and license
- Facebook, Instagram, TikTok, or other social media images without permission
- website images with no reuse rights stated
- copyrighted image pages that do not clearly allow reuse
- private images shared in chats or personal messages without explicit consent

## What proof of reuse or permission should be recorded

For each non-team image, record:

- `source_name`
- `source_url`
- `license_type`
- `license_url`
- `attribution_note` if required
- `permission_note` if permission was obtained manually

Examples:

- `license_type = CC BY-SA 4.0`
- `license_url = https://creativecommons.org/licenses/by-sa/4.0/`
- `permission_note = Email permission received from source owner on 2026-04-18`

## Privacy handling

Before adding an image:

- check whether the image includes identifiable people
- avoid unnecessary personal information
- avoid sensitive content
- if a `non_plant` image includes a person, keep it only if it is truly useful for the label

Set `privacy_checked = yes` only after this check is done.

## Attribution handling

If a source requires attribution:

- record the exact attribution text or attribution note in the manifest
- keep the source URL and license URL

## Manifest tracking for sources and licenses

The manifest should track:

- `source_name`
- `source_url`
- `license_type`
- `license_url`
- `attribution_note`
- `permission_note`

These fields should be filled immediately when the image is saved, not later from memory.
