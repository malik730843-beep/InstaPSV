'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { StarterKit } from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Underline } from '@tiptap/extension-underline';
import { CharacterCount } from '@tiptap/extension-character-count';
import { createClient } from '@supabase/supabase-js';
import { compressImage } from '@/lib/imageUtils';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface RichEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    minHeight?: string;
}

// Toolbar button component
function ToolBtn({
    onClick,
    active,
    title,
    children,
    disabled,
}: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            disabled={disabled}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: 'none',
                background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: active ? '#6366f1' : '#4b5563',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.4 : 1,
                fontSize: '13px',
                fontWeight: '700',
                transition: 'all 0.15s',
                flexShrink: 0,
            }}
            onMouseEnter={(e) => {
                if (!disabled && !active) (e.currentTarget as HTMLButtonElement).style.background = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
                if (!disabled && !active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <div style={{ width: '1px', height: '24px', background: '#e5e7eb', margin: '0 6px', flexShrink: 0 }} />;
}

// SVG icons
const icons = {
    bold: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>,
    italic: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>,
    underline: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>,
    strike: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="12" x2="20" y2="12"/><path d="M17.5 7.5c-1.5-1.5-4-2-6.5-1.5S7 8 7 10c0 2 1.5 3 5 3.5"/><path d="M6.5 16.5c1.5 1.5 4 2 6.5 1.5s4-2 4-4"/></svg>,
    code: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    link: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
    unlink: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/><line x1="2" y1="2" x2="22" y2="22"/></svg>,
    ul: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>,
    ol: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>,
    quote: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/></svg>,
    image: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    table: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>,
    alignLeft: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg>,
    alignCenter: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="6" x2="3" y2="6"/><line x1="17" y1="12" x2="7" y2="12"/><line x1="21" y1="18" x2="3" y2="18"/></svg>,
    alignRight: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="7" y2="18"/></svg>,
    hr: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/></svg>,
    undo: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>,
    redo: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"/></svg>,
    clear: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 10l-2-6H9l-.5 1.5"/><path d="M5 13l4 7h6l.5-.9"/><line x1="2" y1="2" x2="22" y2="22"/></svg>,
    highlight: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M15.232 5.232l3.536 3.536-7.072 7.072-3.536-3.536 7.072-7.072zM2.5 18.5l2-6 4 4-6 2z"/></svg>,
};

export default function RichEditor({ content, onChange, placeholder = 'Start writing your article...', minHeight = '500px' }: RichEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3, 4] },
                codeBlock: { HTMLAttributes: { class: 'code-block' } },
            }),
            Underline,
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'editor-link', target: '_blank', rel: 'noopener noreferrer' },
            }),
            Image.configure({ HTMLAttributes: { class: 'editor-img' } }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder }),
            CharacterCount,
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'tiptap-editor-body',
                style: `min-height: ${minHeight}; outline: none;`,
            },
        },
        immediatelyRender: false,
    });

    const handleLocalUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editor) return;

        setUploading(true);
        try {
            const compressedFile = await compressImage(file, 100);
            const formData = new FormData();
            formData.append('file', compressedFile);

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert('Session expired');
                return;
            }

            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${session.access_token}` },
                body: formData,
            });

            if (res.ok) {
                const { url } = await res.json();
                editor.chain().focus().setImage({ src: url }).run();
            } else {
                alert('Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [editor]);

    // Sync external content changes
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            const { from, to } = editor.state.selection;
            editor.commands.setContent(content || '', { emitUpdate: false });
            try { editor.commands.setTextSelection({ from, to }); } catch {}
        }
    }, [content]);

    const setLink = useCallback(() => {
        if (!editor) return;
        const prev = editor.getAttributes('link').href || '';
        const url = window.prompt('Enter URL:', prev);
        if (url === null) return;
        if (url === '') { editor.chain().focus().unsetLink().run(); return; }
        editor.chain().focus().setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() => {
        if (!editor) return;
        const url = window.prompt('Image URL:');
        if (url) editor.chain().focus().setImage({ src: url }).run();
    }, [editor]);

    const insertTable = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }, [editor]);

    if (!editor) return null;

    const wordCount = editor.storage.characterCount?.words() ?? 0;
    const charCount = editor.storage.characterCount?.characters() ?? 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
            {/* Bubble Menu — appears on text selection */}
            <BubbleMenu editor={editor}>
                <div style={{
                    display: 'flex', gap: '4px', background: '#1f2937', padding: '6px 8px',
                    borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                }}>
                    {[
                        { cmd: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), icon: icons.bold, title: 'Bold' },
                        { cmd: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), icon: icons.italic, title: 'Italic' },
                        { cmd: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline'), icon: icons.underline, title: 'Underline' },
                        { cmd: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike'), icon: icons.strike, title: 'Strike' },
                        { cmd: setLink, active: editor.isActive('link'), icon: icons.link, title: 'Link' },
                    ].map(({ cmd, active, icon, title }) => (
                        <button key={title} type="button" title={title} onClick={cmd} style={{
                            background: active ? 'rgba(99,102,241,0.4)' : 'transparent',
                            border: 'none', color: '#fff', width: '28px', height: '28px',
                            borderRadius: '5px', cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                        }}>{icon}</button>
                    ))}
                </div>
            </BubbleMenu>

            {/* Sticky Toolbar */}
            <div style={{
                display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2px',
                padding: '10px 16px', background: '#fff', borderBottom: '1px solid #e5e7eb',
                position: 'sticky', top: 0, zIndex: 40,
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
                {/* Undo / Redo */}
                <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo" disabled={!editor.can().undo()}>{icons.undo}</ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo" disabled={!editor.can().redo()}>{icons.redo}</ToolBtn>

                <Divider />

                {/* Heading select */}
                <select
                    value={
                        editor.isActive('heading', { level: 1 }) ? 'h1' :
                        editor.isActive('heading', { level: 2 }) ? 'h2' :
                        editor.isActive('heading', { level: 3 }) ? 'h3' :
                        editor.isActive('heading', { level: 4 }) ? 'h4' :
                        'p'
                    }
                    onChange={(e) => {
                        const v = e.target.value;
                        if (v === 'p') editor.chain().focus().setParagraph().run();
                        else editor.chain().focus().toggleHeading({ level: parseInt(v[1]) as 1|2|3|4 }).run();
                    }}
                    style={{
                        height: '32px', padding: '0 8px', border: '1px solid #e5e7eb',
                        borderRadius: '6px', fontSize: '13px', color: '#374151',
                        background: '#fff', cursor: 'pointer', outline: 'none', fontWeight: '500',
                    }}
                >
                    <option value="p">Paragraph</option>
                    <option value="h1">H1</option>
                    <option value="h2">H2</option>
                    <option value="h3">H3</option>
                    <option value="h4">H4</option>
                </select>

                <Divider />

                {/* Text formatting */}
                <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (Ctrl+B)">{icons.bold}</ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (Ctrl+I)">{icons.italic}</ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline (Ctrl+U)">{icons.underline}</ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">{icons.strike}</ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code">{icons.code}</ToolBtn>

                <Divider />

                {/* Color */}
                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    <div title="Text Color" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>A</span>
                        <input
                            type="color"
                            title="Text Color"
                            defaultValue="#111827"
                            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                            style={{ width: '20px', height: '20px', padding: 0, border: 'none', cursor: 'pointer', borderRadius: '3px' }}
                        />
                    </div>
                    <ToolBtn onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()} active={editor.isActive('highlight')} title="Highlight">{icons.highlight}</ToolBtn>
                </div>

                <Divider />

                {/* Alignment */}
                <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left">{icons.alignLeft}</ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center">{icons.alignCenter}</ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right">{icons.alignRight}</ToolBtn>

                <Divider />

                {/* Lists */}
                <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">{icons.ul}</ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">{icons.ol}</ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">{icons.quote}</ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">{icons.code}</ToolBtn>

                <Divider />

                {/* Insert Image */}
                <div style={{ position: 'relative', display: 'flex', gap: '2px' }}>
                    <ToolBtn onClick={addImage} title="Insert Image from URL">{icons.image}</ToolBtn>
                    <ToolBtn onClick={() => fileInputRef.current?.click()} title="Upload Image from Local" active={uploading}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </ToolBtn>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleLocalUpload}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                </div>
                <ToolBtn onClick={insertTable} title="Insert Table">{icons.table}</ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">{icons.hr}</ToolBtn>

                <Divider />

                <ToolBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting">{icons.clear}</ToolBtn>

                {/* Word count */}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', fontSize: '12px', color: '#9ca3af', fontWeight: '500', whiteSpace: 'nowrap' }}>
                    <span>{wordCount} words</span>
                    <span>~{readingTime} min</span>
                    <span>{charCount} chars</span>
                </div>
            </div>

            {/* Table controls — shown when cursor is inside a table */}
            {editor.isActive('table') && (
                <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '8px 16px',
                    background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px',
                }}>
                    {[
                        { label: '+ Row Above', cmd: () => editor.chain().focus().addRowBefore().run() },
                        { label: '+ Row Below', cmd: () => editor.chain().focus().addRowAfter().run() },
                        { label: '− Row', cmd: () => editor.chain().focus().deleteRow().run() },
                        { label: '+ Col Before', cmd: () => editor.chain().focus().addColumnBefore().run() },
                        { label: '+ Col After', cmd: () => editor.chain().focus().addColumnAfter().run() },
                        { label: '− Col', cmd: () => editor.chain().focus().deleteColumn().run() },
                        { label: 'Toggle Header Row', cmd: () => editor.chain().focus().toggleHeaderRow().run() },
                        { label: '🗑 Delete Table', cmd: () => editor.chain().focus().deleteTable().run() },
                    ].map(({ label, cmd }) => (
                        <button key={label} type="button" onClick={cmd} style={{
                            padding: '4px 10px', border: '1px solid #e5e7eb', borderRadius: '5px',
                            background: '#fff', fontSize: '12px', cursor: 'pointer', color: '#374151',
                            fontWeight: '500', whiteSpace: 'nowrap',
                        }}>{label}</button>
                    ))}
                </div>
            )}

            {/* Editor Body */}
            <EditorContent editor={editor} />

            {/* Styles scoped to this editor */}
            <style>{`
                .tiptap-editor-body {
                    padding: 32px 40px;
                    font-family: 'Inter', -apple-system, sans-serif;
                    font-size: 17px;
                    line-height: 1.8;
                    color: #374151;
                    min-height: ${minHeight};
                    box-sizing: border-box;
                }

                .tiptap-editor-body:focus { outline: none; }

                /* Placeholder */
                .tiptap-editor-body p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                    height: 0;
                    float: left;
                }

                /* Headings */
                .tiptap-editor-body h1 { font-size: 32px; font-weight: 800; color: #111; line-height: 1.2; margin: 40px 0 16px; letter-spacing: -0.5px; }
                .tiptap-editor-body h2 { font-size: 26px; font-weight: 700; color: #111; margin: 36px 0 14px; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; }
                .tiptap-editor-body h3 { font-size: 21px; font-weight: 700; color: #111; margin: 28px 0 12px; }
                .tiptap-editor-body h4 { font-size: 18px; font-weight: 600; color: #111; margin: 24px 0 10px; }

                /* Paragraphs */
                .tiptap-editor-body p { margin-bottom: 1.25rem; color: #374151; }

                /* Strong / em */
                .tiptap-editor-body strong { font-weight: 700; color: #111; }
                .tiptap-editor-body em { font-style: italic; }
                .tiptap-editor-body u { text-decoration: underline; }
                .tiptap-editor-body s { text-decoration: line-through; }
                .tiptap-editor-body code { font-family: 'Fira Code', monospace; font-size: 0.875em; background: #f3f4f6; color: #e11d48; padding: 2px 6px; border-radius: 4px; border: 1px solid #e5e7eb; }

                /* Lists */
                .tiptap-editor-body ul { list-style: disc; padding-left: 1.75rem; margin-bottom: 1.25rem; }
                .tiptap-editor-body ol { list-style: decimal; padding-left: 1.75rem; margin-bottom: 1.25rem; }
                .tiptap-editor-body li { margin-bottom: 0.5rem; color: #374151; }
                .tiptap-editor-body li p { margin: 0; }

                /* Blockquote */
                .tiptap-editor-body blockquote { border-left: 3px solid #e5e7eb; background: #fafafa; padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; color: #555; }
                .tiptap-editor-body blockquote p { margin: 0; }

                /* Code Block */
                .tiptap-editor-body pre { background: #1e1e2e; color: #e2e8f0; padding: 1.25rem 1.5rem; border-radius: 10px; overflow-x: auto; margin: 1.5rem 0; font-size: 14px; line-height: 1.7; }
                .tiptap-editor-body pre code { background: none; border: none; padding: 0; color: inherit; }

                /* HR */
                .tiptap-editor-body hr { border: none; height: 2px; background: linear-gradient(90deg, transparent, #e5e7eb, transparent); margin: 2.5rem 0; }

                /* Images */
                .tiptap-editor-body img { max-width: 100%; height: auto; border-radius: 10px; margin: 1.5rem auto; display: block; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
                .tiptap-editor-body img.ProseMirror-selectednode { outline: 3px solid #6366f1; }

                /* Links */
                .tiptap-editor-body a { color: #6366f1; text-decoration: underline; text-underline-offset: 3px; }
                .tiptap-editor-body a:hover { color: #4f46e5; }

                /* Tables */
                .tiptap-editor-body table { width: 100%; border-collapse: collapse; margin: 2rem 0; font-size: 15px; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
                .tiptap-editor-body thead th,
                .tiptap-editor-body th { background: linear-gradient(135deg, #6366f1, #818cf8); color: #fff !important; font-weight: 700; padding: 13px 18px; text-align: left; border: 1px solid rgba(255,255,255,0.1); font-size: 14px; letter-spacing: 0.3px; }
                .tiptap-editor-body td { padding: 11px 18px; border: 1px solid #e5e7eb; color: #374151; vertical-align: top; line-height: 1.6; }
                .tiptap-editor-body tr:nth-child(even) td { background: #faf9ff; }
                .tiptap-editor-body tr:hover td { background: rgba(99,102,241,0.04); }
                .tiptap-editor-body .selectedCell { background: rgba(99,102,241,0.1) !important; }

                /* Resize handle */
                .tiptap-editor-body .column-resize-handle { position: absolute; right: -2px; top: 0; bottom: 0; width: 4px; background: #6366f1; cursor: col-resize; }
                .tiptap-editor-body .tableWrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }

                @media (max-width: 768px) {
                    .tiptap-editor-body { padding: 20px 16px; font-size: 16px; }
                    .tiptap-editor-body table { display: block; overflow-x: auto; white-space: nowrap; }
                }
            `}</style>
        </div>
    );
}
