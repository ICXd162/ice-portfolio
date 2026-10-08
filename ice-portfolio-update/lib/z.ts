// Z-index scale. Only these layers use z-index on the page.
export const Z = {
  nav: 40, // sticky navigation (z-40)
  grain: 60, // fixed noise overlay in globals.css (z 60)
} as const;
