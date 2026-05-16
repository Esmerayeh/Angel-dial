# Asset Pipeline

The current MVP uses code-native shapes and CSS/SVG-like diegetic elements for speed. Future asset work should be modular:

1. Download raw assets into `assets_raw`.
2. Verify license for every source.
3. Clean and kitbash in Blender.
4. Reduce polygons and bake textures.
5. Export GLB.
6. Compress with:

```bash
npx gltf-transform optimize input.glb output.glb --compress meshopt --texture-compress webp
```

Useful modules: gears, rings, chains, wings, CRTs, popups, signs, cables, statues, icons, bottles, CDs, doors, halos, glowing eyes.
