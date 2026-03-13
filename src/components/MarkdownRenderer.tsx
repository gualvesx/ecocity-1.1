import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const processMarkdown = (text: string): JSX.Element[] => {
    const elements: JSX.Element[] = [];
    let currentIndex = 0;
    let elementKey = 0;

    // Regex patterns for different markdown elements - corrigidos para melhor captura
    const patterns = [
      { regex: /\*\*(.*?)\*\*/g, tag: 'strong' }, // Bold - usar strong em vez de b
      { regex: /\*(.*?)\*/g, tag: 'em' }, // Italic - usar em em vez de i
      { regex: /`(.*?)`/g, tag: 'code' }, // Code
      { regex: /__(.*?)__/g, tag: 'u' }, // Underline
      { regex: /~~(.*?)~~/g, tag: 's' }, // Strikethrough
      { regex: /###\s+(.*?)(?=\n|$)/g, tag: 'h3' }, // H3
      { regex: /##\s+(.*?)(?=\n|$)/g, tag: 'h2' }, // H2
      { regex: /#\s+(.*?)(?=\n|$)/g, tag: 'h1' }, // H1
    ];

    // Find all matches with their positions
    const matches: Array<{
      start: number;
      end: number;
      content: string;
      tag: string;
      fullMatch: string;
    }> = [];

    patterns.forEach(({ regex, tag }) => {
      let match;
      const tempRegex = new RegExp(regex.source, regex.flags);
      
      while ((match = tempRegex.exec(text)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          content: match[1],
          tag,
          fullMatch: match[0]
        });
      }
    });

    // Sort matches by start position to avoid overlapping
    matches.sort((a, b) => a.start - b.start);

    // Remove overlapping matches (keep the first one)
    const filteredMatches = [];
    for (let i = 0; i < matches.length; i++) {
      const current = matches[i];
      const hasOverlap = filteredMatches.some(existing => 
        (current.start >= existing.start && current.start < existing.end) ||
        (current.end > existing.start && current.end <= existing.end)
      );
      
      if (!hasOverlap) {
        filteredMatches.push(current);
      }
    }

    // Process text with matches
    filteredMatches.forEach((match) => {
      // Add text before the match
      if (currentIndex < match.start) {
        const beforeText = text.slice(currentIndex, match.start);
        if (beforeText) {
          elements.push(
            <span key={elementKey++}>{beforeText}</span>
          );
        }
      }

      // Add the formatted element
      const TagName = match.tag as keyof JSX.IntrinsicElements;
      const className = getTagClassName(match.tag);
      
      elements.push(
        <TagName 
          key={elementKey++}
          className={className}
        >
          {match.content}
        </TagName>
      );

      currentIndex = match.end;
    });

    // Add remaining text
    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex);
      if (remainingText) {
        elements.push(
          <span key={elementKey++}>{remainingText}</span>
        );
      }
    }

    return elements.length > 0 ? elements : [<span key={0}>{text}</span>];
  };

  const getTagClassName = (tag: string): string => {
    switch (tag) {
      case 'strong':
        return 'font-bold';
      case 'em':
        return 'italic';
      case 'code':
        return 'bg-gray-100 px-1 rounded text-sm font-mono';
      case 'u':
        return 'underline';
      case 's':
        return 'line-through';
      case 'h1':
        return 'text-lg font-bold mt-2 mb-1';
      case 'h2':
        return 'text-base font-bold mt-2 mb-1';
      case 'h3':
        return 'text-sm font-bold mt-1 mb-1';
      default:
        return '';
    }
  };

  const processLineBreaks = (text: string): string[] => {
    return text.split('\n').filter(line => line.trim() !== '');
  };

  const lines = processLineBreaks(content);

  return (
    <div className={`whitespace-pre-wrap ${className}`}>
      {lines.map((line, index) => (
        <div key={index} className={index > 0 ? 'mt-2' : ''}>
          {processMarkdown(line)}
        </div>
      ))}
    </div>
  );
};
