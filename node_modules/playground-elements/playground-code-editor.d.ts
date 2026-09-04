/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { LitElement, PropertyValues } from 'lit';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import './internal/overlay.js';
import { Diagnostic } from 'vscode-languageserver-protocol';
import { EditorCompletion, EditorPosition, EditorToken } from './shared/worker-api.js';
/**
 * A basic text editor with syntax highlighting for HTML, CSS, and JavaScript.
 */
export declare class PlaygroundCodeEditor extends LitElement {
    static styles: import("lit").CSSResult[];
    /**
     * A CodeMirror extension or extensions to apply to the editor.
     */
    extensions?: Extension | Extension[];
    protected _editorView?: EditorView;
    get cursorPosition(): EditorPosition;
    get cursorIndex(): number;
    get tokenUnderCursor(): EditorToken;
    private _value?;
    get value(): string | undefined;
    set value(v: string | undefined);
    /**
     * Provide a `documentKey` to create a CodeMirror document instance which
     * isolates history and value changes per `documentKey`.
     *
     * Use to keep edit history separate between files while reusing the same
     * playground-code-editor instance.
     */
    documentKey?: object;
    /**
     * WeakMap associating a `documentKey` with CodeMirror document state.
     * A WeakMap is used so that this component does not become the source of
     * memory leaks.
     */
    private readonly _docCache;
    /**
     * The type of the file being edited, as represented by its usual file
     * extension.
     */
    type: 'js' | 'ts' | 'html' | 'css' | 'json' | 'jsx' | 'tsx' | undefined;
    /**
     * If true, display a left-hand-side gutter with line numbers. Default false
     * (hidden).
     */
    lineNumbers: boolean;
    /**
     * If true, wrap for long lines. Default false
     */
    lineWrapping: boolean;
    /**
     * If true, this editor is not editable.
     */
    readonly: boolean;
    /**
     * If true, will disable code completions in the code-editor.
     */
    noCompletions: boolean;
    /**
     * Diagnostics to display on the current file.
     */
    diagnostics?: Array<Diagnostic>;
    _completions?: EditorCompletion[];
    _completionsOpen: boolean;
    /**
     * How to handle `playground-hide` and `playground-fold` comments.
     *
     * See https://github.com/google/playground-elements#hiding--folding for
     * more details.
     *
     * Options:
     * - on: Hide and fold regions, and hide the special comments.
     * - off: Don't hide or fold regions, but still hide the special comments.
     * - off-visible: Don't hide or fold regions, and show the special comments as
     *   literal text.
     */
    pragmas: 'on' | 'off' | 'off-visible';
    private _tooltipDiagnostic?;
    private _showKeyboardHelp;
    private _focusContainer?;
    private _editorContent?;
    private _extensionElements;
    private _diagnosticDecorations;
    private _diagnosticsMouseoverListenerActive;
    private _lastTransactions;
    private _declarativeExtensions;
    private _hasNotifiedExtensionsReady;
    private readonly _lineNumbersCompartment;
    private readonly _lineWrappingCompartment;
    private readonly _languageCompartment;
    private readonly _readOnlyCompartment;
    private readonly _autocompletionCompartment;
    private readonly _declarativeExtensionsCompartment;
    private readonly _programmaticExtensionsCompartment;
    autocompleteDelay: number;
    private _lastAutocompleteRequest;
    private readonly _diagnosticField;
    createRenderRoot(): ShadowRoot;
    update(changedProperties: PropertyValues): void;
    render(): HTMLElement | import("lit-html").TemplateResult<1> | undefined;
    connectedCallback(): void;
    private _onSlotChange;
    disconnectedCallback(): void;
    private _createEditorState;
    private _notifyExtensionsReady;
    private _onRegisterExtension;
    private _reconfigureDeclarativeExtensions;
    private _getLanguageExtension;
    private _currentFiletypeSupportsCompletion;
    focus(): void;
    private _customCompletionSource;
    private _getAutocompletions;
    private _showCompletions;
    private _onMousedown;
    private _onFocus;
    private _onBlur;
    private _onKeyDown;
    private _applyHideAndFoldRegions;
    private _maskPatternForLang;
    private _showDiagnostics;
    private _onMouseOverWithDiagnostics;
}
declare global {
    interface HTMLElementTagNameMap {
        'playground-code-editor': PlaygroundCodeEditor;
    }
}
//# sourceMappingURL=playground-code-editor.d.ts.map