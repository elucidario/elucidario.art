---
"@elucidario/app-site": patch
---

refactor Field component to simplify its usage. It also add htmlFor prop to Label as axe dev tools was complaying about the lack of label to inputs, for this we create a new prop id that merge the string field with the field name returning an Id like `field-name`
