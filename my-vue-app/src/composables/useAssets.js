// src/composables/useAssets.js
export function useAssets() {
    const getImageUrl = (name) =>
        new URL(`../assets/images/${name}.png`, import.meta.url).href;
    return { getImageUrl };
}
