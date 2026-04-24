# Dataset Workspace

Use this folder for image collection and manifest management for the future PALAYSCAN precheck
classifier.

Recommended workflow:

- place newly gathered images in `raw/`
- move reviewed and approved images into `reviewed/`
- define split manifests in `splits/`
- keep label manifests in `manifests/`

The dataset should support these labels only:

- `rice_clear`
- `rice_unclear`
- `plant_not_rice`
- `non_plant`
- `unusable_image`
