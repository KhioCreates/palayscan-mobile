# PALAYSCAN First 20 Online-Assisted Batch

## Goal

Start a very small first batch of **20 images** for the future scan precheck dataset.

Keep this first batch simple:

- `5` `rice_clear` from Wikimedia Commons rice sources
- `5` `plant_not_rice` from Wikimedia Commons non-rice plant sources
- `5` `non_plant` from own/team phone photos
- `5` `unusable_image` from own/team phone photos

## Batch structure

### Rice clear from Wikimedia Commons

Use these source pools:

- [Rice](https://commons.wikimedia.org/wiki/Rice)
- [Category:Rice](https://commons.wikimedia.org/wiki/Category:Rice)
- [File:Paddy fields at Kadavoor.jpg](https://commons.wikimedia.org/wiki/File:Paddy_fields_at_Kadavoor.jpg)
- [File:Kataribhog - Paddy - DSC00617.jpg](https://commons.wikimedia.org/wiki/File:Kataribhog_-_%E0%A6%95%E0%A6%BE%E0%A6%9F%E0%A6%BE%E0%A6%B0%E0%A6%BF%E0%A6%AD%E0%A7%8B%E0%A6%97_-_Paddy_-_DSC00617.jpg)

### Plant not rice from Wikimedia Commons

Use these source pools:

- [Category:Maize](https://commons.wikimedia.org/wiki/Category:Maize)
- [Zea mays](https://commons.wikimedia.org/wiki/Zea_mays)
- [Category:Sugar cane plantations](https://commons.wikimedia.org/wiki/Category:Sugar_cane_plantations)
- [File:Sugar cane.jpg](https://commons.wikimedia.org/wiki/File:Sugar_cane.jpg)
- [Houseplant](https://commons.wikimedia.org/wiki/Houseplant)

### Non-plant from own/team photos

Examples:

- person photo
- hand photo
- table or chair photo
- tool or bag photo
- wall or floor photo

### Unusable image from own/team photos

Examples:

- very dark image
- motion blur
- blocked lens
- too-far image with no useful detail
- very out-of-focus image

## Important note for Commons rows

For Commons images, do **not** stop at the category page.

Before marking a Commons image as usable in the dataset, open the **exact file page** for the image
you chose and copy these into the manifest:

- `source_url`
- `license_type`
- `license_url`
- `attribution_note`

That is why the starter manifest below includes both:

- some rows already tied to exact Commons file pages
- some rows that start from a source pool and must be finalized with a real file page before review
