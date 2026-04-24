# PALAYSCAN First 100-Image Collection Plan

## First milestone

Start with a balanced first batch of **100 images**:

- `20` `rice_clear`
- `20` `rice_unclear`
- `20` `plant_not_rice`
- `20` `non_plant`
- `20` `unusable_image`

## Why this is a good first step

This is small enough to review manually and large enough to expose early labeling problems before
collecting a much bigger dataset.

## Practical target examples

### `rice_clear` (20)

Try to include:

- close rice leaf photos
- rice stem photos
- rice field photos where rice is clearly the main subject

### `rice_unclear` (20)

Try to include:

- slightly blurry rice
- too-far rice field shots
- dim rice photos
- partly blocked rice photos

### `plant_not_rice` (20)

Try to include:

- corn
- wheat
- ornamental leaves
- garden plants
- weeds that do not look like rice

### `non_plant` (20)

Try to include:

- person or face
- hands
- clothing
- furniture
- tools or machinery
- paper or bag images

### `unusable_image` (20)

Try to include:

- very dark photos
- strong motion blur
- blocked lens
- extremely out-of-focus images

## Suggested collection order

1. collect `rice_clear` and `rice_unclear` first while in rice fields
2. collect `plant_not_rice` next from nearby non-rice plants
3. collect `non_plant` examples in normal surroundings
4. collect `unusable_image` intentionally by creating poor-quality shots

## Quality goal for the first 100

Before moving beyond 100:

- every image should be in the manifest
- every image should have one label only
- every image should have `privacy_checked`
- every image should have a `near_duplicate_group`
- at least one reviewer should check the full batch

## After the first 100

Once the first 100 are reviewed:

1. inspect label mistakes
2. remove duplicates or weak samples
3. adjust label instructions if needed
4. continue toward the larger pilot target
