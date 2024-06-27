# `Nav`

## References

1. [Example Disclosure Navigation Menu](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/#mythical-page-content)

## Requirements checklist

### Keyboard support

1.  [x] `shift` + `tab` | `tab` Move keyboard focus among top-level buttons, and if a dropdown is open, into and through links in the dropdown.
2.  [ ] `space` | `enter`
    1.  [x] If focus is on a disclosure button, activates the button, which toggles the visibility of the dropdown.
    2.  [ ] If focus is on a link:
        1. [ ] If any link has `aria-current` set, removes it.
        2. [ ] Sets `aria-current="page"` on the focused link
        3. [ ] Activates the focused link.
3.  [ ] `escape` If a dropdown is open, closes it and sets focus on the button that controls that dropdown.
4.  [ ] `down arrow` | `right-arrow`
    1. [ ] If focus is on a button and its dropdown is collapsed, and it is not the last button, moves focus to the next button.
    2. [ ] if focus is on a button and its dropdown is expanded, moves focus to the first link in the dropdown.
    3. [ ] If focus is on a link, and it is not the last link, moves focus to the next link.
5.  [ ] `up arrow` | `left arrow`
    1. [ ] If focus is on a button, and it is not the first button, moves focus to the previous button.
    2. [ ] If focus is on a link, and it is not the first link, moves focus to the previous link.
6.  [ ] `home`
    1. [ ] If focus is on a button, and it is not the first button, moves focus to the first button.
    2. [ ] If focus is on a link, and it is not the first link, moves focus to the first link.
7.  [ ] `end`
    1. [ ] If focus is on a button, and it is not the last button, moves focus to the last button.
    2. [ ] If focus is on a link, and it is not the last link, moves focus to the last link.

### Role, Property, State, and Tabindex Attributes

1.  [x] `aria-controls="IDREF"` |button| The disclosure button controls visibility of the container identified by the IDREF value.
2.  [x] `aria-expanded="false"` |button|
    1. [x] Indicates that the container controlled by the disclosure button is hidden.
    2. [x] CSS attribute selectors (e.g. `[aria-expanded="false"]`) are used to synchronize the visual states with the value of the aria-expanded attribute.
3.  [x] `aria-expanded="true"` |button|
    1. [x] Indicates that the container controlled by the disclosure button is visible.
    2. [x] CSS attribute selectors (e.g. [aria-expanded="true"]) are used to synchronize the visual states with the value of the aria-expanded attribute.
4.  [ ] `aria-current="page"` |a| Indicates that the page referenced by the link is currently displayed.
