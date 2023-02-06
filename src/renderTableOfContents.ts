import { Heading, Headings, HeadingWithChapterNumber } from './types';
import { fixHeadingDepthFactory } from './fixHeadingDepthFactory';

function fixHeadingDepth(headings: Headings): Headings {
  const fixHeadingDepth = fixHeadingDepthFactory();
  headings.forEach((heading) => fixHeadingDepth(heading));
  return headings;
}

function renderTreeStructureHeadings(headings: Headings): string {
  const tokens: Array<string> = [];

  function addTocItem(heading: Heading) {
    const chapterNumber = (heading as HeadingWithChapterNumber).chapterNumber;
    tokens.push(`<li>${chapterNumber} ${heading.text}</li>`);
  }

  function openLevel() {
    tokens.push(`<ul>`);
  }

  function closeLevel(count: number) {
    Array(count)
      .fill(0)
      .forEach(() => {
        tokens.push(`</ul>`);
      });
  }

  headings.reduce((prev, next) => {
    const diff = next.depth - prev.depth;
    if (diff === 0) {
      addTocItem(next);
    } else if (diff > 0) {
      openLevel();
      addTocItem(next);
    } else {
      closeLevel(-diff);
      addTocItem(next);
    }
    return next;
  }, { text: '', depth: 0 });

  closeLevel(headings[headings.length - 1].depth);

  return tokens.join('');
}

export function renderTableOfContent(headings: Headings) {
  return renderTreeStructureHeadings(fixHeadingDepth(headings));
}
