'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';

interface RichEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    minHeight?: string;
}

const RichEditor = forwardRef<HTMLDivElement, RichEditorProps>(({ content, onChange, placeholder = 'Start writing...', minHeight = '500px' }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const [showToolbar, setShowToolbar] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [selectionRange, setSelectionRange] = useState<Range | null>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => internalRef.current as HTMLDivElement);

    useEffect(() => {
        if (internalRef.current && content !== internalRef.current.innerHTML) {
            if (Math.abs(internalRef.current.innerHTML.length - content.length) > 5) {
                internalRef.current.innerHTML = content;
            }
            if (internalRef.current.innerHTML === '' && content) {
                internalRef.current.innerHTML = content;
            }
        }
    }, [content]);

    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();
            if (!selection || selection.isCollapsed || !internalRef.current?.contains(selection.anchorNode)) {
                setShowToolbar(false);
                return;
            }

            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            let top = rect.top - 50;
            let left = rect.left + (rect.width / 2) - 150;

            if (left < 10) left = 10;
            if (top < 0) top = rect.bottom + 10;

            setToolbarPosition({ top, left });
            setShowToolbar(true);
            setSelectionRange(range);
        };

        document.addEventListener('selectionchange', handleSelection);
        return () => document.removeEventListener('selectionchange', handleSelection);
    }, []);

    const execCommand = (command: string, value: string | undefined = undefined) => {
        if (selectionRange) {
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(selectionRange);
        }

        document.execCommand(command, false, value);
        syncContent();

        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
            setSelectionRange(selection.getRangeAt(0));
        }
    };

    const syncContent = () => {
        if (internalRef.current) {
            onChange(internalRef.current.innerHTML);
        }
    };

    // Helper: Check if font-weight indicates bold
    const isBoldWeight = (style: string): boolean => {
        const match = style.match(/font-weight\s*:\s*(\d+|bold|bolder)/i);
        if (!match) return false;
        const val = match[1].toLowerCase();
        if (val === 'bold' || val === 'bolder') return true;
        const num = parseInt(val, 10);
        return !isNaN(num) && num >= 600;
    };

    // Helper: Check if font-weight is normal
    const isNormalWeight = (style: string): boolean => {
        const match = style.match(/font-weight\s*:\s*(\d+|normal|lighter)/i);
        if (!match) return false;
        const val = match[1].toLowerCase();
        if (val === 'normal' || val === 'lighter') return true;
        const num = parseInt(val, 10);
        return !isNaN(num) && num < 600;
    };

    const sanitizeHTML = (html: string): string => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // PASS 1: Unwrap <b> or <strong> tags with font-weight: normal (ChatGPT/Google Docs pattern)
        // These are wrappers that LOOK like bold but are actually containers for content
        doc.querySelectorAll('b, strong').forEach(el => {
            const style = el.getAttribute('style') || '';
            if (isNormalWeight(style)) {
                const parent = el.parentNode;
                if (parent) {
                    while (el.firstChild) parent.insertBefore(el.firstChild, el);
                    parent.removeChild(el);
                }
            }
        });

        // PASS 2: Convert <span style="font-weight: 700"> to <strong>
        doc.querySelectorAll('span').forEach(el => {
            const style = el.getAttribute('style') || '';
            if (isBoldWeight(style)) {
                const strong = document.createElement('strong');
                strong.innerHTML = el.innerHTML;
                el.replaceWith(strong);
            }
        });

        // PASS 3: Unwrap <span style="font-weight: 400"> (normal weight spans - just text containers)
        doc.querySelectorAll('span').forEach(el => {
            const style = el.getAttribute('style') || '';
            if (isNormalWeight(style) || !isBoldWeight(style)) {
                // Unwrap this span
                const parent = el.parentNode;
                if (parent) {
                    while (el.firstChild) parent.insertBefore(el.firstChild, el);
                    parent.removeChild(el);
                }
            }
        });

        // PASS 4: Unwrap any remaining <b>/<strong> that wrap block elements
        doc.querySelectorAll('b, strong').forEach(el => {
            if (el.querySelector('p, div, h1, h2, h3, h4, h5, h6, ul, ol, li, blockquote')) {
                const parent = el.parentNode;
                if (parent) {
                    while (el.firstChild) parent.insertBefore(el.firstChild, el);
                    parent.removeChild(el);
                }
            }
        });

        // PASS 5: Unwrap <p><strong>ENTIRE CONTENT</strong></p> pattern
        doc.querySelectorAll('p').forEach(p => {
            const children = Array.from(p.childNodes);
            // If ALL children are just one strong/b tag
            if (children.length === 1 && (children[0].nodeName === 'STRONG' || children[0].nodeName === 'B')) {
                const bold = children[0] as HTMLElement;
                while (bold.firstChild) p.insertBefore(bold.firstChild, bold);
                p.removeChild(bold);
            }
        });

        // PASS 6: Remove inline font-weight from block elements
        doc.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, li').forEach(el => {
            if (el instanceof HTMLElement) {
                el.style.removeProperty('font-weight');
            }
        });

        // PASS 7: Strip all remaining style/class attributes for clean output
        doc.querySelectorAll('*').forEach(el => {
            if (el instanceof HTMLElement) {
                const tagName = el.tagName.toLowerCase();
                // Preserve href for links, src/alt for images
                if (tagName === 'a') {
                    const href = el.getAttribute('href');
                    Array.from(el.attributes).forEach(attr => el.removeAttribute(attr.name));
                    if (href) el.setAttribute('href', href);
                    el.setAttribute('target', '_blank');
                } else if (tagName === 'img') {
                    const src = el.getAttribute('src');
                    const alt = el.getAttribute('alt');
                    Array.from(el.attributes).forEach(attr => el.removeAttribute(attr.name));
                    if (src) el.setAttribute('src', src);
                    if (alt) el.setAttribute('alt', alt);
                } else {
                    // Strip all attributes
                    Array.from(el.attributes).forEach(attr => el.removeAttribute(attr.name));
                }
            }
        });

        return doc.body.innerHTML;
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        const html = e.clipboardData.getData('text/html');

        if (html) {
            const cleanHtml = sanitizeHTML(html);
            document.execCommand('insertHTML', false, cleanHtml);
        } else if (text) {
            const htmlText = text
                .split('\n\n')
                .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
                .join('');
            document.execCommand('insertHTML', false, htmlText);
        }
        syncContent();
    };

    const insertLink = () => {
        if (linkUrl) {
            execCommand('createLink', linkUrl);
            setShowLinkModal(false);
            setLinkUrl('');
            setShowToolbar(false);
        }
    };

    return (
        <div className="rich-editor-container">
            {showToolbar && createPortal(
                <div
                    ref={toolbarRef}
                    className="floating-toolbar"
                    style={{
                        position: 'fixed',
                        top: `${toolbarPosition.top}px`,
                        left: `${toolbarPosition.left}px`,
                        zIndex: 9999,
                        background: '#1a1a1a',
                        borderRadius: '8px',
                        padding: '8px',
                        display: 'flex',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        animation: 'fadeIn 0.2s ease',
                        transform: 'translateX(-50%)'
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    <button onClick={() => execCommand('bold')} className="toolbar-btn"><b>B</b></button>
                    <button onClick={() => execCommand('italic')} className="toolbar-btn"><i>I</i></button>
                    <button onClick={() => execCommand('underline')} className="toolbar-btn"><u>U</u></button>
                    <div className="separator" />
                    <button onClick={() => execCommand('formatBlock', 'h2')} className="toolbar-btn">H2</button>
                    <button onClick={() => execCommand('formatBlock', 'h3')} className="toolbar-btn">H3</button>
                    <div className="separator" />
                    <button onClick={() => {
                        setShowLinkModal(true);
                        const selection = window.getSelection();
                        if (selection && selection.rangeCount > 0) {
                            setSelectionRange(selection.getRangeAt(0));
                        }
                    }} className="toolbar-btn">🔗</button>
                    <button onClick={() => execCommand('removeFormat')} className="toolbar-btn">✕</button>
                </div>,
                document.body
            )}

            {showLinkModal && createPortal(
                <div className="link-modal-overlay">
                    <div className="link-modal">
                        <h3>Insert Link</h3>
                        <input
                            type="url"
                            placeholder="https://example.com"
                            value={linkUrl}
                            onChange={e => setLinkUrl(e.target.value)}
                            autoFocus
                        />
                        <div className="modal-actions">
                            <button onClick={() => setShowLinkModal(false)}>Cancel</button>
                            <button onClick={insertLink} className="primary">Insert</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <div
                ref={internalRef}
                className="editor-content"
                contentEditable
                onInput={syncContent}
                onPaste={handlePaste}
                onBlur={syncContent}
                style={{ minHeight }}
                data-placeholder={placeholder}
            />

            <style jsx global>{`
                .rich-editor-container {
                    position: relative;
                    width: 100%;
                }
                .editor-content {
                    width: 100%;
                    outline: none;
                    font-size: 18px;
                    line-height: 1.7;
                    color: #666;
                    padding: 24px 0;
                    background: transparent;
                    font-weight: 400;
                }
                .editor-content:empty:before {
                    content: attr(data-placeholder);
                    color: #999;
                    pointer-events: none;
                }
                .editor-content p {
                    line-height: 1.7;
                    margin-bottom: 1em;
                    font-weight: 400 !important;
                    color: #666;
                    background: transparent;
                }
                .editor-content li {
                    line-height: 1.7;
                    margin-bottom: 0.5em;
                    font-weight: 400 !important;
                    color: #666;
                    background: transparent;
                }
                .editor-content p strong,
                .editor-content p b,
                .editor-content li strong,
                .editor-content li b {
                    font-weight: 700 !important;
                    color: #000;
                }
                .editor-content strong,
                .editor-content b {
                    font-weight: 700 !important;
                    color: #000;
                }
                .editor-content h1 {
                    font-weight: 700;
                    color: #000;
                    line-height: 1.3;
                    margin-top: 32px;
                    margin-bottom: 16px;
                }
                .editor-content h2 {
                    font-weight: 600;
                    color: #000;
                    line-height: 1.35;
                    margin-top: 28px;
                    margin-bottom: 14px;
                }
                .editor-content h3 {
                    font-weight: 600;
                    color: #000;
                    line-height: 1.4;
                    margin-top: 24px;
                    margin-bottom: 12px;
                }
                .editor-content h4 {
                    font-weight: 500;
                    color: #000;
                    line-height: 1.5;
                    margin-top: 20px;
                    margin-bottom: 10px;
                }
                .editor-content h5 {
                    font-weight: 500;
                    color: #000;
                    line-height: 1.5;
                    margin-top: 16px;
                    margin-bottom: 8px;
                }
                .editor-content h6 {
                    font-weight: 500;
                    color: #000;
                    line-height: 1.5;
                    margin-top: 14px;
                    margin-bottom: 6px;
                }
                .floating-toolbar button {
                    background: transparent;
                    border: none;
                    color: #fff;
                    width: 32px;
                    height: 32px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }
                .floating-toolbar button:hover {
                    background: rgba(255,255,255,0.1);
                }
                .floating-toolbar .separator {
                    width: 1px;
                    height: 20px;
                    background: rgba(255,255,255,0.2);
                    align-self: center;
                    margin: 0 4px;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(10px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
                .link-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                }
                .link-modal {
                    background: #fff;
                    padding: 24px;
                    border-radius: 12px;
                    width: 400px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                }
                .link-modal h3 { margin: 0 0 16px; font-size: 18px; }
                .link-modal input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    margin-bottom: 16px;
                    outline: none;
                }
                .link-modal input:focus { border-color: #000; }
                .modal-actions { display: flex; justify-content: flex-end; gap: 12px; }
                .modal-actions button {
                    padding: 8px 16px;
                    background: #f0f0f0;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    display: inline-block;
                }
                .modal-actions button.primary {
                    background: #000;
                    color: #fff;
                }
            `}</style>
        </div>
    );
});

RichEditor.displayName = 'RichEditor';

export default RichEditor;
