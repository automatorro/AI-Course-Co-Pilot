
import TurndownService from 'turndown';

const markdown = `
# Slide 1: Introduction

Intro text.

---

# Slide 2: Details

<div data-slide-layout="IMAGE_LEFT" style="display:none;"></div>

Some details here.
`;

console.log("Original Markdown:\n", markdown);

if (/<[a-z][\s\S]*>/i.test(markdown)) {
    console.log("Detected HTML tag. Running Turndown...");
    const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
    td.addRule('preserveComments', {
        filter: (node: any) => node.nodeType === 8 && (
            node.nodeValue?.trim().startsWith('slide-layout:') || 
            node.nodeValue?.trim().startsWith('slide-adapted:')
        ),
        replacement: (_content: string, node: any) => {
            return '<!--' + node.nodeValue + '-->';
        }
    });
    const turned = td.turndown(markdown);
    console.log("Turndown Result:\n", turned);
} else {
    console.log("No HTML detected.");
}
