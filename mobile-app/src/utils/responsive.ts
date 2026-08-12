import { Dimensions } from "react-native";

/**
 * ---------------------------------------------------------------
 * RESPONSIVE SCALING HELPERS
 * ---------------------------------------------------------------
 * Base size the layout was originally designed on (Vivo Y73 ≈ 393 x 851 dp).
 * All scale functions compare the CURRENT device's width/height
 * against these guideline numbers, so fixed pixel values in styles
 * scale proportionally on any screen instead of breaking.
 * ---------------------------------------------------------------
 */

const GUIDELINE_BASE_WIDTH = 393;
const GUIDELINE_BASE_HEIGHT = 851;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Scale horizontally (widths, left/right offsets)
export const scaleW = (size: number) => (SCREEN_WIDTH / GUIDELINE_BASE_WIDTH) * size;

// Scale vertically (heights, top/bottom offsets)
export const scaleH = (size: number) => (SCREEN_HEIGHT / GUIDELINE_BASE_HEIGHT) * size;

// Moderate scale for font sizes so text doesn't grow/shrink too
// aggressively on very small/very large screens.
export const scaleF = (size: number, factor = 0.5) =>
  size + (scaleW(size) - size) * factor;

// Moderate vertical scale for containers that WRAP fixed-size content
// (e.g. a card whose inner text/button spacing isn't itself scaled).
// Using full scaleH() on the container while the content inside barely
// shrinks causes the content to overflow the container on small screens.
// This keeps the container from shrinking as fast as raw scaleH does.
export const scaleHF = (size: number, factor = 0.5) =>
  size + (scaleH(size) - size) * factor;