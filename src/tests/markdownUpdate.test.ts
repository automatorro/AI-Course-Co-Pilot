
import { describe, it, expect } from 'vitest';
import { updateSlideLayoutInMarkdown } from '../services/markdownUpdater';
import { parseSlidesFromMarkdown } from '../services/slideParser';
import { SlideLayoutId } from '../types/slideState';

describe('Markdown Update Logic', () => {
    it('should correctly add a layout to a slide', () => {
        const originalMarkdown = `
# Slide 1: Introduction

This is the intro.

---

# Slide 2: Details

Some details here.

---

# Slide 3: Conclusion

End.
`;

        const layoutId: SlideLayoutId = 'LAYOUT_IMAGE_LEFT';
        const updatedMarkdown = updateSlideLayoutInMarkdown(originalMarkdown, 1, layoutId, "Details");

        console.log("Updated Markdown:\n", updatedMarkdown);

        expect(updatedMarkdown).toContain('data-slide-layout="imageLeft"');
    });

    it('should correctly parse the added layout', () => {
        const markdown = `
# Slide 1: Introduction

This is the intro.

---

# Slide 2: Details

<div data-slide-layout="imageLeft" style="display:none;"></div>

Some details here.

---

# Slide 3: Conclusion

End.
`;
        const slides = parseSlidesFromMarkdown(markdown);
        const slide2 = slides[1];
        
        expect(slide2.layoutId).toBe('LAYOUT_IMAGE_LEFT');
    });

    it('should update an existing layout', () => {
        const markdown = `
# Slide 1: Introduction

This is the intro.

---

# Slide 2: Details

<div data-slide-layout="imageLeft" style="display:none;"></div>

Some details here.

---

# Slide 3: Conclusion

End.
`;
        const updatedMarkdown = updateSlideLayoutInMarkdown(markdown, 1, 'LAYOUT_TITLE' as SlideLayoutId, "Details");
        
        expect(updatedMarkdown).toContain('data-slide-layout="title"');
        expect(updatedMarkdown).not.toContain('data-slide-layout="imageLeft"');
    });
    
    it('should handle slide numbers with brackets', () => {
        const markdown = `
# Slide [1]: Intro

Text.

# Slide (2): Content

Text.
`;
        const layoutId: SlideLayoutId = 'LAYOUT_IMAGE_LEFT';
        const updatedMarkdown = updateSlideLayoutInMarkdown(markdown, 1, layoutId, "Content");
        
        expect(updatedMarkdown).toContain('data-slide-layout="imageLeft"');
        
        const slides = parseSlidesFromMarkdown(updatedMarkdown);
        expect(slides[1].layoutId).toBe('LAYOUT_IMAGE_LEFT');
    });
});
