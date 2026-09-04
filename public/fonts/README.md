# Wordmark font

The wordmark is set in **Bulgatti**.

    Bulgatti.woff2          ← what the site actually loads (12.8KB)
    bulgatti/Bulgatti.otf   ← the supplied source (16.2KB)
    bulgatti/Readme.txt     ← the foundry's licence terms

`Bulgatti.woff2` is generated from the OTF, not a separate download:

    fonttools ttLib  →  f.flavor = "woff2"  →  f.save("Bulgatti.woff2")

`@font-face` in `src/app/globals.css` points at the woff2 and `--font-mark`
falls back to the Italianno script face, so a missing file degrades silently
rather than breaking the build.

## Licence — read before launch

The supplied file is the **demo** release. Its own `bulgatti/Readme.txt` says:

> This demo font is ONLY for PERSONAL USE. NO COMMERCIAL USE ALLOWED!

This site sells wedding websites, which is commercial use, and the wordmark is
the most public possible place to put a font. A commercial or corporate licence
is needed from https://creatypestudio.co/bulgatti before this ships.

Until then the font is wired but the exposure is real. Removing it is one line:
drop `"Bulgatti"` from `--font-mark` in `globals.css` and the wordmark returns
to Italianno.

## Known gap

The face has no `.` glyph (71 glyphs, no period). It covers all of
`eNimantaran`, but `enimantaran.com` would render without its dot — so do not
set the domain in `font-mark`. The footer copyright uses the body face and is
unaffected.
