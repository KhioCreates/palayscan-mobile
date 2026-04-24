# Batch 002 Candidate Review

## Recommended accepted subset

Recommended subset size: **20 total**

- `10` `rice_clear`
- `10` `plant_not_rice`

See:

- `ml/datasets/manifests/batch_002_recommended_subset_manifest.csv`
- `ml/datasets/manifests/batch_002_recommended_subset_source_log.csv`

## Accepted candidate rows

### Rice clear

- `rice_clear_commons_0021`
- `rice_clear_commons_0022`
- `rice_clear_commons_0024`
- `rice_clear_commons_0025`
- `rice_clear_commons_0027`
- `rice_clear_commons_0028`
- `rice_clear_commons_0031`
- `rice_clear_commons_0038`
- `rice_clear_commons_0039`
- `rice_clear_commons_0044`

### Plant not rice

- `plant_not_rice_commons_0046`
- `plant_not_rice_commons_0047`
- `plant_not_rice_commons_0048`
- `plant_not_rice_commons_0049`
- `plant_not_rice_commons_0050`
- `plant_not_rice_commons_0052`
- `plant_not_rice_commons_0053`
- `plant_not_rice_commons_0056`
- `plant_not_rice_commons_0060`
- `plant_not_rice_commons_0065`

## Rejected candidate rows and reasons

### Rice clear rejected

- `rice_clear_commons_0023`
  - title suggests a more generic species-style image and is less clearly field-photo-like than the stronger accepted rows
- `rice_clear_commons_0026`
  - close-up title is weaker for realistic precheck variety than stronger field-photo rows already kept
- `rice_clear_commons_0029`
  - too generic and likely near-duplicate in role compared with stronger rice field rows already kept
- `rice_clear_commons_0030`
  - more scientific/title-style naming and less clearly useful than stronger accepted field images
- `rice_clear_commons_0032`
  - `panoramio` source trail makes it less clean than stronger accepted Commons rows
- `rice_clear_commons_0033`
  - `research fields` sounds less like normal user camera input and more institutional/research context
- `rice_clear_commons_0034`
  - taxonomic-style title and weaker user-camera realism than the accepted field-photo set
- `rice_clear_commons_0035`
  - single plant title may be usable, but the current accepted set already covers more realistic end-user field photos
- `rice_clear_commons_0036`
  - too close in role to stronger accepted paddy-field rows
- `rice_clear_commons_0037`
  - generic near-duplicate style title compared with stronger accepted rice field images
- `rice_clear_commons_0040`
  - generic file name and weaker selection priority than accepted rows
- `rice_clear_commons_0041`
  - Flickr-import style title and lower priority than accepted rows
- `rice_clear_commons_0042`
  - cut-harvest scene is less aligned to typical scan-use input than growing rice images
- `rice_clear_commons_0043`
  - likely near-duplicate in role to `rice_clear_commons_0044`
- `rice_clear_commons_0045`
  - scientific or collection-style naming makes it less realistic for end-user camera-photo routing

### Plant not rice rejected

- `plant_not_rice_commons_0051`
  - plantation context is weaker than the stronger single-plant and field-photo examples already kept
- `plant_not_rice_commons_0054`
  - Flickr-import style title gives a less clean source profile than stronger accepted rows
- `plant_not_rice_commons_0055`
  - title is broad and overlaps too much with stronger accepted indoor-plant examples
- `plant_not_rice_commons_0057`
  - acceptable plant image, but not needed in the first smaller subset
- `plant_not_rice_commons_0058`
  - overlaps with stronger basil example already kept
- `plant_not_rice_commons_0059`
  - overlaps with stronger basil example already kept
- `plant_not_rice_commons_0061`
  - overlaps with other basil entries already kept
- `plant_not_rice_commons_0062`
  - overlaps with other basil entries already kept
- `plant_not_rice_commons_0063`
  - acceptable, but bean entry was lower priority than maize, wheat, sugar cane, basil, and indoor-plant examples
- `plant_not_rice_commons_0064`
  - overlaps with stronger maize/corn examples already kept
- `plant_not_rice_commons_0066`
  - overlaps with stronger corn example already kept
- `plant_not_rice_commons_0067`
  - leaf-only view is less representative than the stronger accepted plant-photo set
- `plant_not_rice_commons_0068`
  - acceptable, but wheat was already covered by two stronger accepted entries
- `plant_not_rice_commons_0069`
  - leaf-only close view is weaker than stronger accepted whole-plant examples
- `plant_not_rice_commons_0070`
  - acceptable, but bean image was lower priority than the more distinctive retained categories

## Important note before `reviewed = yes`

Even accepted rows are still **not reviewed**.

Before changing any accepted row to `reviewed = yes`, manually confirm:

- exact file page is still the same
- exact license on that file page
- exact attribution wording if needed
- final privacy check
- that the downloaded image matches the intended row
