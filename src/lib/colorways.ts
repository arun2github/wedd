import type { TemplatePalette } from "@/lib/templates";

/**
 * Colourways — the same design, repainted.
 *
 * A design is an architecture, a layout and a set of faces; a colourway is only
 * its palette. Separating them is what lets seventeen designs offer fifty-one
 * choices without fifty-one things to maintain, and it is why switching
 * colourway costs a couple nothing: not a word of their content moves.
 *
 * Generated and then verified, not eyeballed. All 408 foreground/background
 * pairs across these fifty-one palettes were measured against 4.5:1, and any
 * value that fell short was walked toward black on a light ground or toward
 * white on a dark one until it passed. `gilt-ink` is checked here and `gilt`
 * is not, deliberately: the first carries text, the second only draws rules.
 */
export interface Colorway {
  id: string;
  name: string;
  palette: TemplatePalette;
}

/** Keyed by design id. The first entry is that design's default. */
export const COLORWAYS: Record<string, Colorway[]> = {
  "royal-ivory": [
    { id: "signature", name: "Signature", palette: {"surface":"#fbf6ee","surface-sunk":"#f3ebdd","ink":"#2b2520","ink-soft":"#6b6158","brand":"#5c0e1d","brand-deep":"#3d0812","gilt":"#b08d57","gilt-soft":"#d9c39a","gilt-ink":"#886d43","rite-1":"#82600f","rite-2":"#40562c","rite-3":"#4a2545","stage":"#cbc4ba","stage-deep":"#9d9385","rule":"#e3d5bd","raised":"#fffdf9"} },
    { id: "ivory", name: "Ivory", palette: {"surface":"#fbf8f3","surface-sunk":"#f2ece2","ink":"#241e1b","ink-soft":"#635a52","brand":"#5c0e1d","brand-deep":"#3d0812","gilt":"#b08d57","gilt-soft":"#d9c39a","gilt-ink":"#886d43","rite-1":"#82600f","rite-2":"#40562c","rite-3":"#4a2545","stage":"#f2ece2","stage-deep":"#cdc4b6","rule":"#e6dccb","raised":"#ffffff"} },
    { id: "midnight", name: "Midnight", palette: {"surface":"#141019","surface-sunk":"#0e0b12","ink":"#efe8dd","ink-soft":"#a79e93","brand":"#b08d57","brand-deep":"#d9c39a","gilt":"#b08d57","gilt-soft":"#d9c39a","gilt-ink":"#927952","rite-1":"#957833","rite-2":"#6f8060","rite-3":"#8b7488","stage":"#0e0b12","stage-deep":"#08060c","rule":"#2c2536","raised":"#1c1725"} },
  ],
  "genda-raat": [
    { id: "signature", name: "Signature", palette: {"surface":"#16192f","surface-sunk":"#1e2340","ink":"#f2e8d5","ink-soft":"#b9ae96","brand":"#e87a17","brand-deep":"#c2570a","gilt":"#d4af54","gilt-soft":"#ebd79c","gilt-ink":"#d4af54","rite-1":"#e0a81c","rite-2":"#8fbc6b","rite-3":"#e2a0bc","stage":"#1e2340","stage-deep":"#0e1122","rule":"#3a4166","raised":"#232849"} },
    { id: "ivory", name: "Ivory", palette: {"surface":"#fbf8f3","surface-sunk":"#f2ece2","ink":"#241e1b","ink-soft":"#635a52","brand":"#ae5c10","brand-deep":"#ba540a","gilt":"#d4af54","gilt-soft":"#ebd79c","gilt-ink":"#877036","rite-1":"#84640f","rite-2":"#587342","rite-3":"#845f6e","stage":"#f2ece2","stage-deep":"#cdc4b6","rule":"#e6dccb","raised":"#ffffff"} },
    { id: "midnight", name: "Midnight", palette: {"surface":"#141019","surface-sunk":"#0e0b12","ink":"#efe8dd","ink-soft":"#a79e93","brand":"#d4af54","brand-deep":"#ebd79c","gilt":"#d4af54","gilt-soft":"#ebd79c","gilt-ink":"#d4af54","rite-1":"#e0a81c","rite-2":"#8fbc6b","rite-3":"#e2a0bc","stage":"#0e0b12","stage-deep":"#08060c","rule":"#2c2536","raised":"#1c1725"} },
  ],
  "kanjeevaram": [
    { id: "signature", name: "Signature", palette: {"surface":"#fbf8f2","surface-sunk":"#f2ece0","ink":"#241e1b","ink-soft":"#635a52","brand":"#9e1b32","brand-deep":"#6e0f21","gilt":"#b08d3f","gilt-soft":"#e0cb94","gilt-ink":"#886d30","rite-1":"#8a6407","rite-2":"#16624f","rite-3":"#7a2e52","stage":"#d6cdbe","stage-deep":"#a79c88","rule":"#e6dac4","raised":"#fffdf8"} },
    { id: "ivory", name: "Ivory", palette: {"surface":"#fbf8f3","surface-sunk":"#f2ece2","ink":"#241e1b","ink-soft":"#635a52","brand":"#9e1b32","brand-deep":"#6e0f21","gilt":"#b08d3f","gilt-soft":"#e0cb94","gilt-ink":"#886d30","rite-1":"#8a6407","rite-2":"#16624f","rite-3":"#7a2e52","stage":"#f2ece2","stage-deep":"#cdc4b6","rule":"#e6dccb","raised":"#ffffff"} },
    { id: "midnight", name: "Midnight", palette: {"surface":"#141019","surface-sunk":"#0e0b12","ink":"#efe8dd","ink-soft":"#a79e93","brand":"#b08d3f","brand-deep":"#e0cb94","gilt":"#b08d3f","gilt-soft":"#e0cb94","gilt-ink":"#927940","rite-1":"#977624","rite-2":"#498475","rite-3":"#a36e87","stage":"#0e0b12","stage-deep":"#08060c","rule":"#2c2536","raised":"#1c1725"} },
  ],
  "order-of-service": [
    { id: "signature", name: "Signature", palette: {"surface":"#fafaf7","surface-sunk":"#efefe9","ink":"#14161a","ink-soft":"#5a5f66","brand":"#1f3a93","brand-deep":"#142657","gilt":"#9c7a3c","gilt-soft":"#cdb88a","gilt-ink":"#8d6e36","rite-1":"#7a5c18","rite-2":"#2d6a4f","rite-3":"#a33b52","stage":"#d5d5ce","stage-deep":"#a3a39b","rule":"#deded6","raised":"#ffffff"} },
    { id: "ivory", name: "Ivory", palette: {"surface":"#fbf8f3","surface-sunk":"#f2ece2","ink":"#241e1b","ink-soft":"#635a52","brand":"#1f3a93","brand-deep":"#142657","gilt":"#9c7a3c","gilt-soft":"#cdb88a","gilt-ink":"#876a34","rite-1":"#7a5c18","rite-2":"#2d6a4f","rite-3":"#a33b52","stage":"#f2ece2","stage-deep":"#cdc4b6","rule":"#e6dccb","raised":"#ffffff"} },
    { id: "midnight", name: "Midnight", palette: {"surface":"#141019","surface-sunk":"#0e0b12","ink":"#efe8dd","ink-soft":"#a79e93","brand":"#9c7a3c","brand-deep":"#cdb88a","gilt":"#9c7a3c","gilt-soft":"#cdb88a","gilt-ink":"#967a46","rite-1":"#937b43","rite-2":"#53856f","rite-3":"#b46072","stage":"#0e0b12","stage-deep":"#08060c","rule":"#2c2536","raised":"#1c1725"} },
  ],
  "nikah-nama": [
    { id: "signature", name: "Signature", palette: {"surface":"#f7f4ec","surface-sunk":"#ede7d9","ink":"#1b1a16","ink-soft":"#5e5850","brand":"#0e5e4a","brand-deep":"#073b2e","gilt":"#a8873e","gilt-soft":"#dcc894","gilt-ink":"#826930","rite-1":"#7a6212","rite-2":"#2c6152","rite-3":"#6b3a5c","stage":"#cfc8b6","stage-deep":"#9c9482","rule":"#ded4bc","raised":"#fffdf6"} },
    { id: "ivory", name: "Ivory", palette: {"surface":"#fbf8f3","surface-sunk":"#f2ece2","ink":"#241e1b","ink-soft":"#635a52","brand":"#0e5e4a","brand-deep":"#073b2e","gilt":"#a8873e","gilt-soft":"#dcc894","gilt-ink":"#826930","rite-1":"#7a6212","rite-2":"#2c6152","rite-3":"#6b3a5c","stage":"#f2ece2","stage-deep":"#cdc4b6","rule":"#e6dccb","raised":"#ffffff"} },
    { id: "midnight", name: "Midnight", palette: {"surface":"#141019","surface-sunk":"#0e0b12","ink":"#efe8dd","ink-soft":"#a79e93","brand":"#a8873e","brand-deep":"#dcc894","gilt":"#a8873e","gilt-soft":"#dcc894","gilt-ink":"#917b48","rite-1":"#8e7a35","rite-2":"#598378","rite-3":"#94718a","stage":"#0e0b12","stage-deep":"#08060c","rule":"#2c2536","raised":"#1c1725"} },
  ],
  "patrika": [
    { id: "signature", name: "Signature", palette: {"surface":"#fff6f0","surface-sunk":"#fbe7dc","ink":"#2a1a16","ink-soft":"#6b544c","brand":"#b3141e","brand-deep":"#7a0a12","gilt":"#996f08","gilt-soft":"#e8ce86","gilt-ink":"#916908","rite-1":"#8a6207","rite-2":"#4a6030","rite-3":"#8c2050","stage":"#e0cbbe","stage-deep":"#b09a8c","rule":"#f0d5c4","raised":"#fffbf8"} },
    { id: "ivory", name: "Ivory", palette: {"surface":"#fbf8f3","surface-sunk":"#f2ece2","ink":"#241e1b","ink-soft":"#635a52","brand":"#b3141e","brand-deep":"#7a0a12","gilt":"#996f08","gilt-soft":"#e8ce86","gilt-ink":"#916908","rite-1":"#8a6207","rite-2":"#4a6030","rite-3":"#8c2050","stage":"#f2ece2","stage-deep":"#cdc4b6","rule":"#e6dccb","raised":"#ffffff"} },
    { id: "midnight", name: "Midnight", palette: {"surface":"#141019","surface-sunk":"#0e0b12","ink":"#efe8dd","ink-soft":"#a79e93","brand":"#a17b1b","brand-deep":"#e8ce86","gilt":"#996f08","gilt-soft":"#e8ce86","gilt-ink":"#9d7b24","rite-1":"#977424","rite-2":"#71825d","rite-3":"#af6585","stage":"#0e0b12","stage-deep":"#08060c","rule":"#2c2536","raised":"#1c1725"} },
  ],
  "jali": [
    { id: "signature", name: "Signature", palette: {"surface":"#0e3b2e","surface-sunk":"#0a2c22","ink":"#f1eada","ink-soft":"#a9b8ac","brand":"#c6a15b","brand-deep":"#a2803f","gilt":"#e0c88a","gilt-soft":"#f0e2be","gilt-ink":"#e0c88a","rite-1":"#d7b85c","rite-2":"#7fb89a","rite-3":"#c99bb0","stage":"#0a2c22","stage-deep":"#05170f","rule":"#1f5443","raised":"#14493a"} },
    { id: "ivory", name: "Ivory", palette: {"surface":"#fbf8f3","surface-sunk":"#f2ece2","ink":"#241e1b","ink-soft":"#635a52","brand":"#846c3c","brand-deep":"#8a6c36","gilt":"#e0c88a","gilt-soft":"#f0e2be","gilt-ink":"#7f704e","rite-1":"#7a6834","rite-2":"#4e705f","rite-3":"#7b606c","stage":"#f2ece2","stage-deep":"#cdc4b6","rule":"#e6dccb","raised":"#ffffff"} },
    { id: "midnight", name: "Midnight", palette: {"surface":"#141019","surface-sunk":"#0e0b12","ink":"#efe8dd","ink-soft":"#a79e93","brand":"#e0c88a","brand-deep":"#f0e2be","gilt":"#e0c88a","gilt-soft":"#f0e2be","gilt-ink":"#e0c88a","rite-1":"#d7b85c","rite-2":"#7fb89a","rite-3":"#c99bb0","stage":"#0e0b12","stage-deep":"#08060c","rule":"#2c2536","raised":"#1c1725"} },
  ],
  "muggu": [
    { id: "signature", name: "Signature", palette: {"surface":"#fcfbf7","surface-sunk":"#f1ede2","ink":"#1c1e1c","ink-soft":"#575d57","brand":"#16624f","brand-deep":"#0d4234","gilt":"#a8842c","gilt-soft":"#e8d5a0","gilt-ink":"#896b24","rite-1":"#8a6407","rite-2":"#9e1b32","rite-3":"#6a4a8c","stage":"#dad3c5","stage-deep":"#a8a091","rule":"#e7dfcc","raised":"#fffffc"} },
    { id: "ivory", name: "Ivory", palette: {"surface":"#fbf8f3","surface-sunk":"#f2ece2","ink":"#241e1b","ink-soft":"#635a52","brand":"#16624f","brand-deep":"#0d4234","gilt":"#a8842c","gilt-soft":"#e8d5a0","gilt-ink":"#896b24","rite-1":"#8a6407","rite-2":"#9e1b32","rite-3":"#6a4a8c","stage":"#f2ece2","stage-deep":"#cdc4b6","rule":"#e6dccb","raised":"#ffffff"} },
    { id: "midnight", name: "Midnight", palette: {"surface":"#141019","surface-sunk":"#0e0b12","ink":"#efe8dd","ink-soft":"#a79e93","brand":"#a8842c","brand-deep":"#e8d5a0","gilt":"#a8842c","gilt-soft":"#e8d5a0","gilt-ink":"#977c3d","rite-1":"#977624","rite-2":"#bc6171","rite-3":"#8a71a5","stage":"#0e0b12","stage-deep":"#08060c","rule":"#2c2536","raised":"#1c1725"} },
  ],
  "jharokha": [
    { id: "signature", name: "Signature", palette: {"surface":"#f6efe3","surface-sunk":"#ebdfcb","ink":"#2b231a","ink-soft":"#6a5c4a","brand":"#a33b1f","brand-deep":"#6e2412","gilt":"#a67c3d","gilt-soft":"#dfc79a","gilt-ink":"#886531","rite-1":"#6f5210","rite-2":"#4e6238","rite-3":"#7c3a54","stage":"#d9cbb4","stage-deep":"#a89478","rule":"#dfceb2","raised":"#fffbf3"} },
    { id: "ivory", name: "Ivory", palette: {"surface":"#fbf8f3","surface-sunk":"#f2ece2","ink":"#241e1b","ink-soft":"#635a52","brand":"#a33b1f","brand-deep":"#6e2412","gilt":"#a67c3d","gilt-soft":"#dfc79a","gilt-ink":"#886531","rite-1":"#6f5210","rite-2":"#4e6238","rite-3":"#7c3a54","stage":"#f2ece2","stage-deep":"#cdc4b6","rule":"#e6dccb","raised":"#ffffff"} },
    { id: "midnight", name: "Midnight", palette: {"surface":"#141019","surface-sunk":"#0e0b12","ink":"#efe8dd","ink-soft":"#a79e93","brand":"#a67c3d","brand-deep":"#dfc79a","gilt":"#a67c3d","gilt-soft":"#dfc79a","gilt-ink":"#967749","rite-1":"#8f7844","rite-2":"#6f7f5d","rite-3":"#a07184","stage":"#0e0b12","stage-deep":"#08060c","rule":"#2c2536","raised":"#1c1725"} },
  ],
  "sepia": [
    { id: "signature", name: "Signature", palette: {"surface":"#f4f0ea","surface-sunk":"#e7e1d8","ink":"#241e18","ink-soft":"#6b6055","brand":"#6b4a2f","brand-deep":"#432c1a","gilt":"#8f7245","gilt-soft":"#cbb48d","gilt-ink":"#81673f","rite-1":"#7a5c1e","rite-2":"#4f5b3e","rite-3":"#6e4152","stage":"#d4cbbe","stage-deep":"#a2978a","rule":"#dcd2c4","raised":"#fcfaf6"} },
    { id: "ivory", name: "Ivory", palette: {"surface":"#fbf8f3","surface-sunk":"#f2ece2","ink":"#241e1b","ink-soft":"#635a52","brand":"#6b4a2f","brand-deep":"#432c1a","gilt":"#8f7245","gilt-soft":"#cbb48d","gilt-ink":"#81673f","rite-1":"#7a5c1e","rite-2":"#4f5b3e","rite-3":"#6e4152","stage":"#f2ece2","stage-deep":"#cdc4b6","rule":"#e6dccb","raised":"#ffffff"} },
    { id: "midnight", name: "Midnight", palette: {"surface":"#141019","surface-sunk":"#0e0b12","ink":"#efe8dd","ink-soft":"#a79e93","brand":"#93784c","brand-deep":"#cbb48d","gilt":"#8f7245","gilt-soft":"#cbb48d","gilt-ink":"#907955","rite-1":"#937b48","rite-2":"#757f68","rite-3":"#93707d","stage":"#0e0b12","stage-deep":"#08060c","rule":"#2c2536","raised":"#1c1725"} },
  ],
  "malabar": [
    { id: "signature", name: "Signature", palette: {"surface":"#f3f6f0","surface-sunk":"#e4ebe0","ink":"#1a211c","ink-soft":"#556056","brand":"#1b4d3e","brand-deep":"#0f3227","gilt":"#8f7133","gilt-soft":"#d8c393","gilt-ink":"#886b30","rite-1":"#7e6414","rite-2":"#2f6b4f","rite-3":"#74405e","stage":"#cbd4c6","stage-deep":"#97a392","rule":"#d3dcce","raised":"#fbfdfa"} },
    { id: "ivory", name: "Ivory", palette: {"surface":"#fbf8f3","surface-sunk":"#f2ece2","ink":"#241e1b","ink-soft":"#635a52","brand":"#1b4d3e","brand-deep":"#0f3227","gilt":"#8f7133","gilt-soft":"#d8c393","gilt-ink":"#886b30","rite-1":"#7e6414","rite-2":"#2f6b4f","rite-3":"#74405e","stage":"#f2ece2","stage-deep":"#cdc4b6","rule":"#e6dccb","raised":"#ffffff"} },
    { id: "midnight", name: "Midnight", palette: {"surface":"#141019","surface-sunk":"#0e0b12","ink":"#efe8dd","ink-soft":"#a79e93","brand":"#977c43","brand-deep":"#d8c393","gilt":"#8f7133","gilt-soft":"#d8c393","gilt-ink":"#967c48","rite-1":"#927b37","rite-2":"#55866f","rite-3":"#976f85","stage":"#0e0b12","stage-deep":"#08060c","rule":"#2c2536","raised":"#1c1725"} },
  ],
  "banarasi": [
    { id: "signature", name: "Signature", palette: {"surface":"#2a1230","surface-sunk":"#1e0b24","ink":"#f0e4e8","ink-soft":"#b7a2bc","brand":"#d9a441","brand-deep":"#b07f2a","gilt":"#e8c878","gilt-soft":"#f3e3b6","gilt-ink":"#e8c878","rite-1":"#dfae3c","rite-2":"#8fb88f","rite-3":"#e09bb4","stage":"#1e0b24","stage-deep":"#120616","rule":"#47264f","raised":"#3a1b42"} },
    { id: "ivory", name: "Ivory", palette: {"surface":"#fbf8f3","surface-sunk":"#f2ece2","ink":"#241e1b","ink-soft":"#635a52","brand":"#906c2c","brand-deep":"#906822","gilt":"#e8c878","gilt-soft":"#f3e3b6","gilt-ink":"#837044","rite-1":"#836723","rite-2":"#587058","rite-3":"#89606e","stage":"#f2ece2","stage-deep":"#cdc4b6","rule":"#e6dccb","raised":"#ffffff"} },
    { id: "midnight", name: "Midnight", palette: {"surface":"#141019","surface-sunk":"#0e0b12","ink":"#efe8dd","ink-soft":"#a79e93","brand":"#e8c878","brand-deep":"#f3e3b6","gilt":"#e8c878","gilt-soft":"#f3e3b6","gilt-ink":"#e8c878","rite-1":"#dfae3c","rite-2":"#8fb88f","rite-3":"#e09bb4","stage":"#0e0b12","stage-deep":"#08060c","rule":"#2c2536","raised":"#1c1725"} },
  ],
  "royal-celebration": [
    { id: "signature", name: "Signature", palette: {"surface":"#fdf7f0","surface-sunk":"#f6e9dc","ink":"#2a1512","ink-soft":"#6b4c42","brand":"#9b1b30","brand-deep":"#6b0f20","gilt":"#9a6f09","gilt-soft":"#e6ce8f","gilt-ink":"#926909","rite-1":"#8a5a0a","rite-2":"#42542a","rite-3":"#7b2a45","stage":"#e2cdbb","stage-deep":"#b39887","rule":"#efd9c2","raised":"#fffdfa"} },
    { id: "ivory", name: "Ivory", palette: {"surface":"#fbf8f3","surface-sunk":"#f2ece2","ink":"#241e1b","ink-soft":"#635a52","brand":"#9b1b30","brand-deep":"#6b0f20","gilt":"#9a6f09","gilt-soft":"#e6ce8f","gilt-ink":"#926909","rite-1":"#8a5a0a","rite-2":"#42542a","rite-3":"#7b2a45","stage":"#f2ece2","stage-deep":"#cdc4b6","rule":"#e6dccb","raised":"#ffffff"} },
    { id: "midnight", name: "Midnight", palette: {"surface":"#141019","surface-sunk":"#0e0b12","ink":"#efe8dd","ink-soft":"#a79e93","brand":"#a27b1c","brand-deep":"#e6ce8f","gilt":"#9a6f09","gilt-soft":"#e6ce8f","gilt-ink":"#9e7b25","rite-1":"#9b732f","rite-2":"#717f60","rite-3":"#a36c7e","stage":"#0e0b12","stage-deep":"#08060c","rule":"#2c2536","raised":"#1c1725"} },
  ],
  "atelier-noir": [
    { id: "signature", name: "Signature", palette: {"surface":"#121212","surface-sunk":"#1a1a1a","ink":"#efebe3","ink-soft":"#a8a298","brand":"#efebe3","brand-deep":"#c9c3b8","gilt":"#968d80","gilt-soft":"#bab2a5","gilt-ink":"#968d80","rite-1":"#c9b98f","rite-2":"#9bae9b","rite-3":"#c79ba5","stage":"#1a1a1a","stage-deep":"#0a0a0a","rule":"#2c2c2c","raised":"#1e1e1e"} },
    { id: "ivory", name: "Ivory", palette: {"surface":"#fbf8f3","surface-sunk":"#f2ece2","ink":"#241e1b","ink-soft":"#635a52","brand":"#73706c","brand-deep":"#716e68","gilt":"#968d80","gilt-soft":"#bab2a5","gilt-ink":"#756e64","rite-1":"#716851","rite-2":"#606b60","rite-3":"#7f6469","stage":"#f2ece2","stage-deep":"#cdc4b6","rule":"#e6dccb","raised":"#ffffff"} },
    { id: "midnight", name: "Midnight", palette: {"surface":"#141019","surface-sunk":"#0e0b12","ink":"#efe8dd","ink-soft":"#a79e93","brand":"#968d80","brand-deep":"#bab2a5","gilt":"#968d80","gilt-soft":"#bab2a5","gilt-ink":"#968d80","rite-1":"#c9b98f","rite-2":"#9bae9b","rite-3":"#c79ba5","stage":"#0e0b12","stage-deep":"#08060c","rule":"#2c2536","raised":"#1c1725"} },
  ],
  "midnight-velvet": [
    { id: "signature", name: "Signature", palette: {"surface":"#15101f","surface-sunk":"#1b1326","ink":"#ede6f2","ink-soft":"#a99bb3","brand":"#c8a24b","brand-deep":"#a8853a","gilt":"#c8a24b","gilt-soft":"#e6d3a0","gilt-ink":"#d8b76a","rite-1":"#d8b76a","rite-2":"#a3b3a0","rite-3":"#c08bab","stage":"#1b1326","stage-deep":"#0c0812","rule":"#2e2340","raised":"#241a33"} },
    { id: "ivory", name: "Ivory", palette: {"surface":"#fbf8f3","surface-sunk":"#f2ece2","ink":"#241e1b","ink-soft":"#635a52","brand":"#846c32","brand-deep":"#896c30","gilt":"#c8a24b","gilt-soft":"#e6d3a0","gilt-ink":"#847041","rite-1":"#7a683c","rite-2":"#646d63","rite-3":"#846076","stage":"#f2ece2","stage-deep":"#cdc4b6","rule":"#e6dccb","raised":"#ffffff"} },
    { id: "midnight", name: "Midnight", palette: {"surface":"#141019","surface-sunk":"#0e0b12","ink":"#efe8dd","ink-soft":"#a79e93","brand":"#c8a24b","brand-deep":"#e6d3a0","gilt":"#c8a24b","gilt-soft":"#e6d3a0","gilt-ink":"#d8b76a","rite-1":"#d8b76a","rite-2":"#a3b3a0","rite-3":"#c08bab","stage":"#0e0b12","stage-deep":"#08060c","rule":"#2c2536","raised":"#1c1725"} },
  ],
  "ivory-atelier": [
    { id: "signature", name: "Signature", palette: {"surface":"#f8f5ef","surface-sunk":"#efeae1","ink":"#23201b","ink-soft":"#665f55","brand":"#4a443a","brand-deep":"#2f2a23","gilt":"#948871","gilt-soft":"#d3cbb9","gilt-ink":"#796f5c","rite-1":"#6f6039","rite-2":"#4d5741","rite-3":"#654d57","stage":"#ded8cc","stage-deep":"#ada697","rule":"#e3dcce","raised":"#ffffff"} },
    { id: "ivory", name: "Ivory", palette: {"surface":"#fbf8f3","surface-sunk":"#f2ece2","ink":"#241e1b","ink-soft":"#635a52","brand":"#4a443a","brand-deep":"#2f2a23","gilt":"#948871","gilt-soft":"#d3cbb9","gilt-ink":"#796f5c","rite-1":"#6f6039","rite-2":"#4d5741","rite-3":"#654d57","stage":"#f2ece2","stage-deep":"#cdc4b6","rule":"#e6dccb","raised":"#ffffff"} },
    { id: "midnight", name: "Midnight", palette: {"surface":"#141019","surface-sunk":"#0e0b12","ink":"#efe8dd","ink-soft":"#a79e93","brand":"#948871","brand-deep":"#d3cbb9","gilt":"#948871","gilt-soft":"#d3cbb9","gilt-ink":"#88806f","rite-1":"#8a7d5e","rite-2":"#7a8070","rite-3":"#8b7a80","stage":"#0e0b12","stage-deep":"#08060c","rule":"#2c2536","raised":"#1c1725"} },
  ],
  "saffron-house": [
    { id: "signature", name: "Signature", palette: {"surface":"#fffaf0","surface-sunk":"#fbefd8","ink":"#241e14","ink-soft":"#665941","brand":"#a55c0a","brand-deep":"#7e4708","gilt":"#9a7b36","gilt-soft":"#e0c88a","gilt-ink":"#8b6f30","rite-1":"#7f5a06","rite-2":"#4c5f2a","rite-3":"#8a3a2a","stage":"#e8d5b4","stage-deep":"#b9a484","rule":"#f2dfc0","raised":"#fffdf7"} },
    { id: "ivory", name: "Ivory", palette: {"surface":"#fbf8f3","surface-sunk":"#f2ece2","ink":"#241e1b","ink-soft":"#635a52","brand":"#a55c0a","brand-deep":"#7e4708","gilt":"#9a7b36","gilt-soft":"#e0c88a","gilt-ink":"#856b2e","rite-1":"#7f5a06","rite-2":"#4c5f2a","rite-3":"#8a3a2a","stage":"#f2ece2","stage-deep":"#cdc4b6","rule":"#e6dccb","raised":"#ffffff"} },
    { id: "midnight", name: "Midnight", palette: {"surface":"#141019","surface-sunk":"#0e0b12","ink":"#efe8dd","ink-soft":"#a79e93","brand":"#9a7b36","brand-deep":"#e0c88a","gilt":"#9a7b36","gilt-soft":"#e0c88a","gilt-ink":"#947b40","rite-1":"#977934","rite-2":"#738159","rite-3":"#a76b60","stage":"#0e0b12","stage-deep":"#08060c","rule":"#2c2536","raised":"#1c1725"} },
  ],
  "cinematic-reel": [
    { id: "signature", name: "Signature", palette: {"surface":"#1a1a1a","surface-sunk":"#2c2c2c","ink":"#fafaf8","ink-soft":"#a8a49e","brand":"#c4856a","brand-deep":"#a56b52","gilt":"#d9a441","gilt-soft":"#ebc97f","gilt-ink":"#d9a441","rite-1":"#d9a441","rite-2":"#a3b8a3","rite-3":"#d4788c","stage":"#2c2c2c","stage-deep":"#0f0f0f","rule":"#343434","raised":"#242424"} },
    { id: "ivory", name: "Ivory", palette: {"surface":"#fbf8f3","surface-sunk":"#f2ece2","ink":"#241e1b","ink-soft":"#635a52","brand":"#936450","brand-deep":"#98634c","gilt":"#d9a441","gilt-soft":"#ebc97f","gilt-ink":"#906c2c","rite-1":"#846428","rite-2":"#606c60","rite-3":"#995665","stage":"#f2ece2","stage-deep":"#cdc4b6","rule":"#e6dccb","raised":"#ffffff"} },
    { id: "midnight", name: "Midnight", palette: {"surface":"#141019","surface-sunk":"#0e0b12","ink":"#efe8dd","ink-soft":"#a79e93","brand":"#d9a441","brand-deep":"#ebc97f","gilt":"#d9a441","gilt-soft":"#ebc97f","gilt-ink":"#d9a441","rite-1":"#d9a441","rite-2":"#a3b8a3","rite-3":"#d4788c","stage":"#0e0b12","stage-deep":"#08060c","rule":"#2c2536","raised":"#1c1725"} },
  ],
  "earthy-haven": [
    { id: "signature", name: "Signature", palette: {"surface":"#f5f1e8","surface-sunk":"#ede8db","ink":"#3d2b1f","ink-soft":"#6b5648","brand":"#5c4433","brand-deep":"#3d2b1f","gilt":"#c4a882","gilt-soft":"#ded0b8","gilt-ink":"#7f6744","rite-1":"#856327","rite-2":"#55613f","rite-3":"#8a5548","stage":"#ded5c4","stage-deep":"#a89680","rule":"#ded5c4","raised":"#ffffff"} },
    { id: "ivory", name: "Ivory", palette: {"surface":"#fbf8f3","surface-sunk":"#f2ece2","ink":"#241e1b","ink-soft":"#635a52","brand":"#5c4433","brand-deep":"#3d2b1f","gilt":"#c4a882","gilt-soft":"#ded0b8","gilt-ink":"#7f6744","rite-1":"#856327","rite-2":"#55613f","rite-3":"#8a5548","stage":"#f2ece2","stage-deep":"#cdc4b6","rule":"#e6dccb","raised":"#ffffff"} },
    { id: "midnight", name: "Midnight", palette: {"surface":"#141019","surface-sunk":"#0e0b12","ink":"#efe8dd","ink-soft":"#a79e93","brand":"#c4a882","brand-deep":"#ded0b8","gilt":"#c4a882","gilt-soft":"#ded0b8","gilt-ink":"#937e60","rite-1":"#937540","rite-2":"#757e63","rite-3":"#9b6f63","stage":"#0e0b12","stage-deep":"#08060c","rule":"#2c2536","raised":"#1c1725"} },
  ],

};

/** A design's colourways, or an empty list if none are defined. */
export function colorwaysOf(designId: string): Colorway[] {
  return COLORWAYS[designId] ?? [];
}
