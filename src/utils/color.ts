import { Color } from "../types";

export const COLORS_STORAGE_KEY = "prayer-formatter";

// shorthand
const _KEY = COLORS_STORAGE_KEY;

export function getLocalStorageColors() {
  const colorsString = localStorage.getItem(_KEY);
  if (!colorsString) return ["#000000"] as Color[];

  if (colorsString) {
    try {
      const localStorageColors = JSON.parse(colorsString);
      return (localStorageColors ?? ["#000000"]) as Color[];
    } catch (error) {
      console.error(error);
      // TODO: throw an error here?

      /**
       * SyntaxError would be from JSON.parse(...); this would mean that the
       * saved localstorage value is invalid and should be cleared out
       */
      if (error instanceof SyntaxError) {
        setLocalStorageColors(["#000000"]);
        return ["#000000"] as Color[];
      }
    }
  }
}

export function setLocalStorageColors(color: Color[]) {
  try {
    const _data = JSON.stringify(color);
    localStorage.setItem(_KEY, _data);
  } catch (error) {
    /**
     * SyntaxError would be from JSON.parse(...); this would mean that the
     * saved localstorage value is invalid and should be cleared out
     */
    if (error instanceof SyntaxError) {
      // TODO: throw an error here?
    }

    // TODO: throw an error here?
    console.error(error);
  }
}

export function addLocalStorageColor(color: Color) {
  try {
    const _existingColors = getLocalStorageColors() ?? [];
    const _colors = [..._existingColors, color];
    setLocalStorageColors(_colors);
  } catch (error) {
    console.error(error);
  }
}

export function removeLocalStorageColor(color: Color) {
  try {
    const _existingColors = getLocalStorageColors() ?? [];
    const _colors = _existingColors.filter((i) => i !== color);
    setLocalStorageColors(_colors);
  } catch (error) {
    console.error(error);
  }
}
