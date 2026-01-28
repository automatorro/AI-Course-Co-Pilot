
import { parseSlidesFromMarkdown } from './src/services/slideParser';
import { updateSlideLayoutInMarkdown } from './src/services/markdownUpdater';
import { SlideLayoutId } from './src/types/slideState';
import { SLIDE_LAYOUT_TOKENS, LAYOUT_TOKEN_MAPPING } from './src/constants/slideLayouts';
import { SlideArchetype } from './src/types';
import { mapTokenToArchetype } from './src/services/exportService';

console.log("Debug Start");

const markdown = `
# Slide 1: Introduction

Intro text.

---

# Slide 2: Details

<!-- slide-layout: IMAGE_LEFT -->

Some details here.
`;

const slides = parseSlidesFromMarkdown(markdown);
console.log("Parsed Slides Count:", slides.length);

slides.forEach((s, i) => {
    console.log(`Slide ${i}: Title="${s.content.title}", Layout="${s.layoutId}"`);
});

console.log("Debug End");
