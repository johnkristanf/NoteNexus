import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function normalizeMarkdown(md: string): string {
    return (
        md
            // Fix heading spacing (e.g. ###Title → ### Title)
            .replace(/(#+)([^\s#])/g, '$1 $2')
            
            // Fix bold/italic formatting issues
            .replace(/\*\*([^*]+)\*\*/g, '**$1**')
            .replace(/\*([^*]+)\*/g, '*$1*')
            
            // Fix line breaks before headings
            .replace(/([^\n])(?=\n?#{1,6}\s)/g, '$1\n')
            
            // Fix numbered lists
            .replace(/([^\n])(\d+\.\s)/g, '$1\n$2')
            
            // Fix bullet lists (handle -, *, +)
            .replace(/([^\n])([*+-]\s)/g, '$1\n$2')
            
            // Fix horizontal rules
            .replace(/([^\n])(?=\n?---)/g, '$1\n')
            
            // Fix table formatting
            .replace(/\|([^|]+)\|/g, (match, content) => {
                return `| ${content.trim()} |`
            })
            
            // Fix code blocks
            .replace(/```(\w+)?\n/g, '\n```$1\n')
            .replace(/\n```\n/g, '\n```\n\n')
            
            // Clean up excessive line breaks but preserve intentional spacing
            .replace(/\n{3,}/g, '\n\n')
            .trim()
    )
}

// Enhanced function with better hierarchical list handling
export function enhancedNormalizeMarkdown(md: string): string {
    return (
        md
            // Step 1: Clean up malformed markdown patterns
            .replace(/\*\*([^*]+)--\s*\*\*/g, '**$1**\n\n') // Fix broken bold headers
            .replace(/\*\*([^*]+)\*\*--/g, '**$1**\n\n')
            .replace(/--\s*\*/g, '\n-') // Fix broken list items
            
            // Step 2: Fix heading formats
            .replace(/(#+)([^\s#])/g, '$1 $2') // Add space after #
            .replace(/([^\n])(#{1,6}\s)/g, '$1\n\n$2') // Add line breaks before headings
            
            // Step 3: Fix hierarchical list formatting
            .replace(/([^\n])(\d+\.\s)/g, '$1\n$2') // Numbered lists
            .replace(/([^\n])([*+-]\s)/g, '$1\n$2') // Bullet lists
            .replace(/^\s*-\s*\*\s*/gm, '- ') // Clean up mixed list markers
            
            // Step 4: Fix bold/italic text
            .replace(/\*\*\s*([^*]+?)\s*\*\*/g, '**$1**') // Clean bold formatting
            .replace(/\*\s*([^*]+?)\s*\*/g, '*$1*') // Clean italic formatting
            
            // Step 5: Fix table formatting
            .replace(/\|\s*([^|]+?)\s*\|/g, '| $1 |') // Clean table cells
            .replace(/\|\s*---+\s*\|/g, '| --- |') // Fix table separators
            
            // Step 6: Fix code blocks
            .replace(/```(\w+)?\s*\n/g, '\n```$1\n')
            .replace(/\n```\s*\n/g, '\n```\n\n')
            
            // Step 7: Apply hierarchical list fixes
            .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines first
            .replace(/([.!?])\s*\n([A-Z])/g, '$1\n\n$2') // Add spacing after sentences
            .trim()
    )
}

// NEW: Smart bullet point detection that avoids markdown formatting conflicts
function isActualBulletPoint(line: string, context: { prevLine?: string; nextLine?: string }): boolean {
    const trimmedLine = line.trim()
    
    // Must start with bullet marker followed by space
    if (!trimmedLine.match(/^[*+-]\s/)) return false
    
    // Check if it's part of bold/italic markdown formatting
    const bulletMatch = trimmedLine.match(/^([*+-])\s*(.*)$/)
    if (!bulletMatch) return false
    
    const [, marker, content] = bulletMatch
    
    // If using * as marker, check if it's actually bold/italic markdown
    if (marker === '*') {
        // Check if the content looks like it's part of markdown formatting
        // e.g., "* *italic*" or "* **bold**" or incomplete bold markers
        if (content.match(/^\*.*\*$/) || content.match(/^\*\*.*\*\*$/)) {
            return false // This is likely markdown formatting, not a bullet
        }
        
        // Check if this looks like incomplete bold markdown
        if (content.match(/^\*+$/) || content.match(/^\*+\w/)) {
            return false // This looks like incomplete bold markdown
        }
    }
    
    // Additional context checks
    const { prevLine, nextLine } = context
    
    // If previous line ends with incomplete bold/italic, this might be continuation
    if (prevLine && prevLine.trim().match(/\*+$/)) {
        return false
    }
    
    // If this line is very short and looks like formatting, probably not a bullet
    if (content.length < 3 && content.match(/^\*+/)) {
        return false
    }
    
    return true
}

// NEW: Advanced hierarchical list processor with smart bullet detection
export function processHierarchicalLists(md: string): string {
    const lines = md.split('\n')
    const processedLines: string[] = []
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const trimmedLine = line.trim()
        
        // Check if current line is a numbered list item
        const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/)
        if (numberedMatch) {
            const [, number, content] = numberedMatch
            
            // Ensure proper spacing before numbered items (except first or after another list item)
            const prevLine = i > 0 ? lines[i - 1].trim() : ''
            const isFirstItem = number === '1'
            const prevIsListItem = prevLine.match(/^(\d+\.|[*+-])\s/) || prevLine === ''
            
            if (!prevIsListItem && !isFirstItem) {
                processedLines.push('') // Add blank line before numbered list
            }
            
            processedLines.push(`${number}. ${content}`)
            
            // Process nested bullet points for this numbered item
            let j = i + 1
            while (j < lines.length) {
                const nextLine = lines[j].trim()
                
                // Use smart bullet detection
                const context = {
                    prevLine: i > 0 ? lines[i - 1] : undefined,
                    nextLine: j + 1 < lines.length ? lines[j + 1] : undefined
                }
                
                if (isActualBulletPoint(nextLine, context)) {
                    const bulletMatch = nextLine.match(/^[*+-]\s+(.+)$/)
                    if (bulletMatch) {
                        const [, bulletContent] = bulletMatch
                        processedLines.push(`   - ${bulletContent}`) // 3 spaces for proper nesting
                        j++
                    } else {
                        break
                    }
                } else if (nextLine === '') {
                    // Empty line - might be spacing, check next non-empty line
                    let k = j + 1
                    while (k < lines.length && lines[k].trim() === '') k++
                    
                    if (k < lines.length) {
                        const nextNonEmptyLine = lines[k].trim()
                        const nextContext = {
                            prevLine: lines[k - 1],
                            nextLine: k + 1 < lines.length ? lines[k + 1] : undefined
                        }
                        if (isActualBulletPoint(nextNonEmptyLine, nextContext)) {
                            // Skip empty lines before bullets in same list
                            j = k - 1
                        } else {
                            break // End of nested items
                        }
                    } else {
                        break // End of file
                    }
                    j++
                } else {
                    break // End of nested items
                }
            }
            
            i = j - 1 // Update main loop index
        }
        // Handle standalone bullet points (not nested under numbered items)
        else {
            const context = {
                prevLine: i > 0 ? lines[i - 1] : undefined,
                nextLine: i + 1 < lines.length ? lines[i + 1] : undefined
            }
            
            if (isActualBulletPoint(trimmedLine, context)) {
                const bulletMatch = trimmedLine.match(/^[*+-]\s+(.+)$/)
                if (bulletMatch) {
                    const [, content] = bulletMatch
                    processedLines.push(`- ${content}`)
                }
            } else {
                // Handle regular content (including markdown formatting)
                processedLines.push(line)
            }
        }
    }
    
    return processedLines.join('\n')
}

// NEW: Fix list concatenation issues
export function fixListConcatenation(md: string): string {
    return md
        // Ensure numbered lists don't get concatenated
        .replace(/([.!?])\s*(\d+\.\s)/g, '$1\n\n$2')
        
        // Fix cases where text runs into numbered lists
        .replace(/([a-zA-Z])(\d+\.\s)/g, '$1\n\n$2')
        
        // Fix bullet points concatenation
        .replace(/([.!?])\s*([*+-]\s)/g, '$1\n\n$2')
        .replace(/([a-zA-Z])([*+-]\s)/g, '$1\n\n$2')
        
        // Ensure proper spacing after lists before new content
        .replace(/(\n\s*(?:\d+\.|[*+-])\s.+)(\n)([A-Z])/g, '$1\n\n$3')
        
        // Clean up excessive newlines
        .replace(/\n{3,}/g, '\n\n')
}

// NEW: Stream-aware markdown processing that handles chunked input
export function processStreamingMarkdown(content: string, isComplete: boolean = false): string {
    // First, handle common streaming artifacts
    let processed = content
        // Fix broken bold markdown from streaming
        .replace(/\*\*([^*]*)\*\*-/g, '**$1**')
        .replace(/-\s*\*\*/g, '**')
        .replace(/\*\*\s*-\s*/g, '**')
        
        // Fix broken italic markdown
        .replace(/\*([^*]*)\*-/g, '*$1*')
        .replace(/-\s*\*/g, '*')
        
        // Clean up malformed bullet points that are actually markdown
        .replace(/^-\s*\*\*([^*]+)\*\*$/gm, '**$1**')
        .replace(/^-\s*\*([^*]+)\*$/gm, '*$1*')
    
    // Only apply full hierarchical processing if content is complete or looks stable
    if (isComplete || content.length > 100) {
        // Check if we actually have real lists vs just markdown formatting
        const hasRealBullets = /^[*+-]\s+[a-zA-Z]/.test(processed)
        const hasNumberedLists = /^\d+\.\s+/.test(processed)
        
        if (hasRealBullets || hasNumberedLists) {
            processed = processHierarchicalLists(processed)
        }
    }
    
    // Always clean up basic markdown issues
    processed = enhancedNormalizeMarkdown(processed)
    
    return processed
}

// NEW: Enhanced flush function that's aware of markdown formatting
export function flushMarkdownBuffer(buffer: string): { flushed: string; remaining: string } {
    // Don't flush if too small
    if (buffer.length < 50) {
        return { flushed: '', remaining: buffer }
    }

    // Check if buffer ends with incomplete markdown formatting
    const endsWithIncompleteMarkdown = buffer.match(/\*+$/) || buffer.match(/-\s*\*+$/)
    if (endsWithIncompleteMarkdown && buffer.length < 200) {
        // Wait for more content if it looks like incomplete markdown
        return { flushed: '', remaining: buffer }
    }

    // 1. Complete numbered list items with their nested bullets
    const numberedListMatch = buffer.match(/(\d+\.\s.+?(?:\n\s*-\s.+?)*)/s)
    if (numberedListMatch && numberedListMatch[0].length >= 50) {
        return {
            flushed: numberedListMatch[0],
            remaining: buffer.slice(numberedListMatch[0].length),
        }
    }

    // 2. Complete markdown blocks (headings, lists, tables) - but be careful with formatting
    const markdownBlockMatch = buffer.match(/(.+?(?:\n#{1,6}\s|^\d+\.\s|^[*+-]\s[a-zA-Z]|^\|.+\|$))/ms)
    if (markdownBlockMatch && markdownBlockMatch[0].length >= 50) {
        return {
            flushed: markdownBlockMatch[0],
            remaining: buffer.slice(markdownBlockMatch[0].length),
        }
    }

    // 3. Complete paragraphs (double newline)
    const paragraphMatch = buffer.match(/(.+?\n\n)/s)
    if (paragraphMatch && paragraphMatch[0].length >= 50) {
        return {
            flushed: paragraphMatch[0],
            remaining: buffer.slice(paragraphMatch[0].length),
        }
    }

    // 4. Complete sentences with proper punctuation
    const sentenceMatch = buffer.match(/(.{50,}[.!?])\s+/)
    if (sentenceMatch) {
        const endIndex = sentenceMatch.index! + sentenceMatch[0].length
        return {
            flushed: buffer.slice(0, endIndex),
            remaining: buffer.slice(endIndex),
        }
    }

    // 5. Complete bold/italic markdown blocks
    const boldMatch = buffer.match(/(.+?\*\*[^*]+\*\*)/s)
    if (boldMatch && boldMatch[0].length >= 50) {
        return {
            flushed: boldMatch[0],
            remaining: buffer.slice(boldMatch[0].length),
        }
    }

    // 6. Complete lines for markdown structure
    const lines = buffer.split('\n')
    if (lines.length > 1) {
        for (let i = 1; i < lines.length; i++) {
            const upToLine = lines.slice(0, i).join('\n') + '\n'
            if (upToLine.length >= 50) {
                return {
                    flushed: upToLine,
                    remaining: lines.slice(i).join('\n'),
                }
            }
        }
    }

    // 7. Emergency flush for very long buffers
    if (buffer.length > 400) {
        // Try word boundary first
        const spaceIndex = buffer.lastIndexOf(' ', 300)
        if (spaceIndex > 50) {
            return {
                flushed: buffer.slice(0, spaceIndex + 1),
                remaining: buffer.slice(spaceIndex + 1),
            }
        }

        // Emergency: flush at punctuation
        const punctuationChars = ['.', '!', '?', ',', ';', ':', '-']
        for (let i = 300; i > 50; i--) {
            if (punctuationChars.includes(buffer[i])) {
                return {
                    flushed: buffer.slice(0, i + 1),
                    remaining: buffer.slice(i + 1),
                }
            }
        }
    }

    // Keep buffering
    return { flushed: '', remaining: buffer }
}

// UPDATED: Enhanced post-processing with list fixes
export function postProcessMarkdown(markdown: string): string {
    return markdown
        // Fix common streaming artifacts
        .replace(/\*\*\s*\*\*/g, '') // Remove empty bold tags
        .replace(/\*\s*\*/g, '') // Remove empty italic tags
        .replace(/#{1,6}\s*$/gm, '') // Remove empty headings
        
        // Ensure proper spacing around headings
        .replace(/^(#{1,6}\s.+)$/gm, '\n$1\n')
        
        // Fix list continuity and hierarchy
        .replace(/^(\d+\.)\s*$/gm, '') // Remove empty numbered list items
        .replace(/^([*+-])\s*$/gm, '') // Remove empty bullet list items
        
        // Fix nested list indentation
        .replace(/^\s*-\s/gm, '   - ') // Ensure consistent 3-space indentation for nested bullets
        
        // Clean up final spacing
        .replace(/\n{3,}/g, '\n\n')
        .trim()
}

// NEW: Main processing function that combines all enhancements
export function processMarkdownWithHierarchicalLists(markdown: string): string {
    return postProcessMarkdown(
        fixListConcatenation(
            processHierarchicalLists(
                enhancedNormalizeMarkdown(markdown)
            )
        )
    )
}

// NEW: Utility for checking if content needs list processing
export function needsListProcessing(content: string): boolean {
    const hasNumberedList = /\d+\.\s/.test(content)
    const hasBulletList = /[*+-]\s/.test(content)
    const hasListConcatenation = /[a-zA-Z]\d+\.\s/.test(content)
    
    return hasNumberedList || hasBulletList || hasListConcatenation
}