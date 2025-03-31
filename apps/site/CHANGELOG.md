# @elucidario/app-site

## 0.8.3

### Patch Changes

- f324fa0: update error page
- d104fa2: update image +config

## 0.8.2

### Patch Changes

- 157297f: update base path to /
- 615047b: add github og:image

## 0.8.1

### Patch Changes

- d400e24: update base path of vite config as we changed the domain to be organization wide on github and not on specific repo, for that we must configure a redirect in domain register to the main site be at root

## 0.8.0

### Minor Changes

- e815380: introduces section component
- 8511070: responsive typography
- 511e301: add text typography component
- 36cf11f: add section to developer informations

### Patch Changes

- eaa6929: improve newsletter layout

## 0.7.4

### Patch Changes

- da131b7: add image url to main metadata
- ba132f0: change newsletter route

## 0.7.3

### Patch Changes

- 2c78b41: update lcdr-banner path and add henrique-godinho.webp

## 0.7.2

### Patch Changes

- f8c888b: patch version to trigger workflow

## 0.7.1

### Patch Changes

- cf39d63: make image type more flexible
- 25610f7: set fixed height to logo
- 3bcf688: change image relative path to full url
- d9f49d5: refactor Field component to simplify its usage. It also add htmlFor prop to Label as axe dev tools was complaying about the lack of label to inputs, for this we create a new prop id that merge the string field with the field name returning an Id like `field-name`

## 0.7.0

### Minor Changes

- f08fdb7: logo uses image component and has default url
- e2f62d8: image component lazy load by default and improve type to ensure required props are passed

### Patch Changes

- b1d94cc: cta on footer scrool to cta section with default behaviour

## 0.6.0

### Minor Changes

- 95802ff: add google analyitcs integration

### Patch Changes

- 9a2b0d9: change ctaRef to ctaID to improve accessibility when user click cta in features, as we scroll to call to action section we maintain the default behaviour setting focus to the cta section and add to history as we trigger a navigation event
- c88a1ab: refactor field
- e902bf3: add spring to spheres movement and remove scroll callback
- 6866b0f: change png extension to webp in +config
- 06e0c8e: simplify useViewPortSize hook

## 0.5.4

### Patch Changes

- 84cab9f: patch site to trigger workflow

## 0.5.3

### Patch Changes

- e720ec0: patch site to trigger workflow

## 0.5.2

### Patch Changes

- 040d365: bump patch site to trigger workflow

## 0.5.1

### Patch Changes

- 7da01dc: bump patch version to trigger workflow

## 0.5.0

### Minor Changes

- 27c0c9a: This PR introduces a series of features to improve SEO

  - Better types and head boolean for JsonLD component
  - Meta component that renders `<meta>` tag in header or local
  - Better schemas to describe pages and Things around website
  - Webp image as a banner to the site for open-graph and schema.org

## 0.4.4

### Patch Changes

- 5f8f21c: add VITE_LEAD_URL to dploy-site.yaml workflow

## 0.4.3

### Patch Changes

- 35baa99: change the newsletter add lead call to firebase cloud function @elucidario/lead

## 0.4.2

### Patch Changes

- e81c00a: change assets name

## 0.4.1

### Patch Changes

- e3c28f7: add base path to vite.config to try to avoid 404 page deployed assets

## 0.4.0

### Minor Changes

- 79f506b: prerender site on build

## 0.3.0

### Minor Changes

- 5599bf3: add ajv-errors deps to site as it build script is failing on ci

## 0.2.0

### Minor Changes

- 4876be5: migrate from hgodinho/elucidario
