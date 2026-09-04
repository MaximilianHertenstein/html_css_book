/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var PlaygroundCodeEditor_1;
import { __decorate } from "tslib";
import { LitElement, css, html, nothing, render } from 'lit';
import { customElement, property, query, state, queryAssignedElements, } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { EditorState, StateEffect, StateField, Compartment, Transaction, Annotation, } from '@codemirror/state';
import { EditorView, lineNumbers as cmLineNumbers, keymap, Decoration, WidgetType, highlightSpecialChars, drawSelection, dropCursor, } from '@codemirror/view';
import { lit } from './cm-lang-lit.js';
import { html as cmHtml } from '@codemirror/lang-html';
import { css as cmCss } from '@codemirror/lang-css';
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap, } from '@codemirror/autocomplete';
import { syntaxHighlighting } from '@codemirror/language';
import { history, defaultKeymap, historyKeymap, indentWithTab, } from '@codemirror/commands';
import { bracketMatching, foldGutter, foldKeymap, indentOnInput, } from '@codemirror/language';
import { classHighlighter } from '@lezer/highlight';
import './internal/overlay.js';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { lintKeymap } from '@codemirror/lint';
import { playgroundTheme } from './playground-styles.js';
import { CodemirrorExtensionRegisteredEvent, PlaygroundEditorReadyEvent, } from './codemirror-extension-mixin.js';
const unreachable = (n) => n;
// Annotation to mark programmatic changes (not user edits)
const programmaticChangeAnnotation = Annotation.define();
/**
 * A basic text editor with syntax highlighting for HTML, CSS, and JavaScript.
 */
let PlaygroundCodeEditor = PlaygroundCodeEditor_1 = class PlaygroundCodeEditor extends LitElement {
    constructor() {
        super(...arguments);
        /**
         * WeakMap associating a `documentKey` with CodeMirror document state.
         * A WeakMap is used so that this component does not become the source of
         * memory leaks.
         */
        // eslint-disable-next-line @typescript-eslint/ban-types
        this._docCache = new WeakMap();
        /**
         * If true, display a left-hand-side gutter with line numbers. Default false
         * (hidden).
         */
        this.lineNumbers = false;
        /**
         * If true, wrap for long lines. Default false
         */
        this.lineWrapping = false;
        /**
         * If true, this editor is not editable.
         */
        this.readonly = false;
        /**
         * If true, will disable code completions in the code-editor.
         */
        this.noCompletions = false;
        this._completionsOpen = false;
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
        this.pragmas = 'on';
        this._showKeyboardHelp = false;
        this._diagnosticDecorations = Decoration.none;
        this._diagnosticsMouseoverListenerActive = false;
        this._lastTransactions = [];
        this._declarativeExtensions = new Set();
        this._hasNotifiedExtensionsReady = false;
        // Compartments for dynamic configuration
        this._lineNumbersCompartment = new Compartment();
        this._lineWrappingCompartment = new Compartment();
        this._languageCompartment = new Compartment();
        this._readOnlyCompartment = new Compartment();
        this._autocompletionCompartment = new Compartment();
        this._declarativeExtensionsCompartment = new Compartment();
        this._programmaticExtensionsCompartment = new Compartment();
        this.autocompleteDelay = 1250;
        this._lastAutocompleteRequest = 0;
        // Create StateField for storing diagnostics decorations
        this._diagnosticField = StateField.define({
            create: () => Decoration.none,
            update: () => {
                return this._diagnosticDecorations;
            },
            provide: (f) => EditorView.decorations.from(f),
        });
        this._customCompletionSource = async (context) => {
            var _a, _b, _c, _d;
            if (this.noCompletions) {
                return null;
            }
            // Only show completions when explicitly requested or when there's
            // a token to complete
            const wordBefore = context.matchBefore(/\w*/);
            if ((!wordBefore || wordBefore.from === wordBefore.to) &&
                !context.explicit) {
                return null;
            }
            const wasTextEvent = this._lastTransactions.some((transaction) => transaction.annotation(Transaction.userEvent) === 'input.type');
            const now = Date.now();
            const wasRecent = now - this._lastAutocompleteRequest <= this.autocompleteDelay;
            if (now > this._lastAutocompleteRequest) {
                this._lastAutocompleteRequest = now;
            }
            const isRefinement = !context.explicit &&
                wasTextEvent &&
                (((_a = wordBefore === null || wordBefore === void 0 ? void 0 : wordBefore.text) === null || _a === void 0 ? void 0 : _a.startsWith('.')) ||
                    (wasRecent && ((_c = (_b = wordBefore === null || wordBefore === void 0 ? void 0 : wordBefore.text) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) > 1));
            let resolve;
            const completionsPromise = new Promise((res) => {
                resolve = res;
            });
            this.dispatchEvent(new CustomEvent('request-completions', {
                detail: {
                    isRefinement,
                    fileContent: this.value,
                    tokenUnderCursor: this.tokenUnderCursor.string,
                    cursorIndex: this.cursorIndex,
                    provideCompletions: (completions) => {
                        resolve(completions);
                    },
                },
            }));
            const completions = await completionsPromise;
            if (context.aborted) {
                return null;
            }
            if (!completions || completions.length <= 0) {
                return null;
            }
            const optionsPromises = completions.map(async (comp, i) => {
                return {
                    label: comp.displayText || comp.text,
                    detail: comp.details !== undefined ? (await comp.details).text : undefined,
                    apply: comp.text,
                    boost: i === 0 ? 99 : undefined, // Boost first suggestion
                };
            });
            const options = await Promise.all(optionsPromises);
            return {
                from: (_d = wordBefore === null || wordBefore === void 0 ? void 0 : wordBefore.from) !== null && _d !== void 0 ? _d : 0,
                options,
            };
        };
        // Using property assignment syntax so that it's already bound to `this` for
        // add/removeEventListener.
        this._onMouseOverWithDiagnostics = (event) => {
            var _a, _b, _c;
            if (!((_a = this.diagnostics) === null || _a === void 0 ? void 0 : _a.length)) {
                return;
            }
            // Find the diagnostic by extracting the diagnostic index from the class name
            const idxMatch = (_b = event.target.className) === null || _b === void 0 ? void 0 : _b.match(/diagnostic-(\d+)/);
            if (idxMatch === null) {
                this._tooltipDiagnostic = undefined;
                return;
            }
            const idx = Number(idxMatch[1]);
            const diagnostic = this.diagnostics[idx];
            if (diagnostic === ((_c = this._tooltipDiagnostic) === null || _c === void 0 ? void 0 : _c.diagnostic)) {
                // Already showing the tooltip for this diagnostic.
                return;
            }
            // Position the tooltip relative to the squiggly code span. To maximize
            // available space, place it above/below and left/right depending on which
            // quadrant the span is in.
            let position = '';
            const hostRect = this.getBoundingClientRect();
            const spanRect = event.target.getBoundingClientRect();
            const hostCenterY = hostRect.y + hostRect.height / 2;
            if (spanRect.y < hostCenterY) {
                // Note the rects are viewport relative, so the extra subtractions here
                // are to convert to host-relative.
                position += `top:${spanRect.y + spanRect.height - hostRect.y}px;`;
            }
            else {
                position += `bottom:${hostRect.bottom - spanRect.y}px;`;
            }
            const hostCenterX = hostRect.x + hostRect.width / 2;
            if (spanRect.left < hostCenterX) {
                position += `left:${Math.max(0, spanRect.x - hostRect.x)}px`;
            }
            else {
                position += `right:${Math.max(0, hostRect.right - spanRect.right)}px`;
            }
            this._tooltipDiagnostic = { diagnostic, position };
        };
    }
    get cursorPosition() {
        if (!this._editorView) {
            return { ch: 0, line: 0 };
        }
        const pos = this._editorView.state.selection.main.head;
        const line = this._editorView.state.doc.lineAt(pos);
        return {
            ch: pos - line.from,
            line: line.number - 1,
        };
    }
    get cursorIndex() {
        if (!this._editorView)
            return 0;
        return this._editorView.state.selection.main.head;
    }
    get tokenUnderCursor() {
        if (!this._editorView)
            return { start: 0, end: 0, string: '' };
        const pos = this._editorView.state.selection.main.head;
        const line = this._editorView.state.doc.lineAt(pos);
        const wordRange = this._editorView.state.wordAt(pos);
        if (wordRange) {
            const start = wordRange.from - line.from;
            const end = wordRange.to - line.from;
            return {
                start,
                end,
                string: line.text.slice(start, end),
            };
        }
        return {
            start: 0,
            end: 0,
            string: '',
        };
    }
    get value() {
        return this._value;
    }
    set value(v) {
        const oldValue = this._value;
        this._value = v;
        this.requestUpdate('value', oldValue);
    }
    createRenderRoot() {
        var _a;
        const root = this.attachShadow({ mode: 'open' });
        (_a = this._editorView) === null || _a === void 0 ? void 0 : _a.setRoot(root);
        root.adoptedStyleSheets = [
            ...PlaygroundCodeEditor_1.styles.map((s) => s.styleSheet),
            ...root.adoptedStyleSheets,
        ];
        return root;
    }
    update(changedProperties) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const changedTyped = changedProperties;
        const view = this._editorView;
        // Collect all CodeMirror state effects (configuration changes) to dispatch them together
        // in a single transaction at the end of the update cycle.
        const effects = [];
        for (const prop of changedTyped.keys()) {
            switch (prop) {
                case 'extensions':
                    effects.push(this._programmaticExtensionsCompartment.reconfigure([(_a = this.extensions) !== null && _a !== void 0 ? _a : []].flat()));
                    break;
                case 'documentKey': {
                    const docKey = (_b = this.documentKey) !== null && _b !== void 0 ? _b : {};
                    let docState = this._docCache.get(docKey);
                    const lastKey = changedProperties.get('documentKey');
                    let needsHideAndFold = false;
                    // If a documentKey was previously active, cache its EditorState.
                    // This preserves the content and history when the user switches away
                    // from it and switches back later.
                    if (lastKey && this._editorView) {
                        const lastState = this._editorView.state;
                        this._docCache.set(lastKey, lastState);
                        // Value differs, so that means we need to update the view to
                        // reflect the new state's value.
                        if (lastState.doc.toString() !== this.value) {
                            view === null || view === void 0 ? void 0 : view.dispatch({
                                changes: [
                                    {
                                        from: 0,
                                        to: lastState.doc.length,
                                        insert: (_c = this.value) !== null && _c !== void 0 ? _c : '',
                                    },
                                ],
                                annotations: programmaticChangeAnnotation.of(true),
                            });
                        }
                    }
                    if (!docState) {
                        // No cached EditorState exists for the new documentKey because it's
                        // likely being loaded for the first time.
                        docState = this._createEditorState((_d = this.value) !== null && _d !== void 0 ? _d : '');
                        this._docCache.set(docKey, docState);
                        needsHideAndFold = true;
                    }
                    else if (docState.doc.toString() !== this.value) {
                        // A cached EditorState exists, but its content differs from the
                        // value property. We need to sync the cached state with the new
                        // value to preserve cmd+z history.
                        const tempView = new EditorView({ state: docState });
                        tempView.dispatch({
                            changes: [
                                {
                                    from: 0,
                                    to: docState.doc.length,
                                    insert: (_e = this.value) !== null && _e !== void 0 ? _e : '',
                                },
                            ],
                            annotations: programmaticChangeAnnotation.of(true),
                        });
                        docState = tempView.state;
                        this._docCache.set(docKey, docState);
                        tempView.destroy();
                    }
                    // Replace the entire view with the new editor state. Unlike CM5, CM6
                    // is modular, and the history stays on the state object rather than
                    // the editor / view.
                    (_f = this._editorView) === null || _f === void 0 ? void 0 : _f.setState(docState);
                    // If a brand new document state was created, hiding and folding
                    // regions must be reapplied to this new state.
                    if (needsHideAndFold) {
                        void this._applyHideAndFoldRegions();
                    }
                    break;
                }
                case 'value':
                    if (changedTyped.has('documentKey')) {
                        // Handled in the `documentKey` case.
                        break;
                    }
                    if (this.value !== (view === null || view === void 0 ? void 0 : view.state.doc.toString())) {
                        // The 'value' property was changed externally and it differs from
                        // the editor's current document content, so we need to update the
                        // view model to match.
                        view === null || view === void 0 ? void 0 : view.dispatch({
                            // Mark as an input userEvent so that the user can undo / redo
                            // this change
                            userEvent: 'input',
                            changes: [
                                {
                                    from: 0,
                                    to: view.state.doc.length,
                                    insert: (_g = this.value) !== null && _g !== void 0 ? _g : '',
                                },
                            ],
                            annotations: programmaticChangeAnnotation.of(true),
                        });
                    }
                    break;
                case 'lineNumbers':
                    effects.push(this._lineNumbersCompartment.reconfigure(this.lineNumbers ? cmLineNumbers() : []));
                    break;
                case 'lineWrapping':
                    effects.push(this._lineWrappingCompartment.reconfigure(this.lineWrapping ? EditorView.lineWrapping : []));
                    break;
                case 'type': {
                    const lang = this._getLanguageExtension();
                    effects.push(this._languageCompartment.reconfigure(lang || []));
                    break;
                }
                case 'readonly':
                    effects.push(this._readOnlyCompartment.reconfigure(this.readonly ? EditorState.readOnly.of(true) : []));
                    break;
                case 'pragmas':
                    void this._applyHideAndFoldRegions();
                    break;
                case 'diagnostics':
                    this._showDiagnostics();
                    break;
                case 'cursorIndex': {
                    const index = (_h = this.cursorIndex) !== null && _h !== void 0 ? _h : 0;
                    if (view && index >= 0 && index <= view.state.doc.length) {
                        view.dispatch({
                            selection: { anchor: index, head: index },
                        });
                    }
                    break;
                }
                case 'cursorPosition': {
                    const pos = (_j = this.cursorPosition) !== null && _j !== void 0 ? _j : { ch: 0, line: 0 };
                    // Convert line/ch position to absolute position
                    const line = Math.max(0, Math.min(pos.line, view.state.doc.lines - 1));
                    const lineObj = view.state.doc.line(line + 1);
                    const ch = Math.max(0, Math.min(pos.ch, lineObj.length));
                    const index = lineObj.from + ch;
                    view === null || view === void 0 ? void 0 : view.dispatch({
                        selection: { anchor: index, head: index },
                    });
                    break;
                }
                case 'noCompletions':
                    effects.push(this._autocompletionCompartment.reconfigure(this.noCompletions ? [] : [this._getAutocompletions()]));
                    break;
                case '_completions':
                    this._showCompletions();
                    break;
                case 'tokenUnderCursor':
                case 'autocompleteDelay':
                case '_completionsOpen':
                    // Ignored properties that do not require direct editor state updates
                    // or are handled by other mechanisms (e.g., getters, internal state changes).
                    break;
                default:
                    unreachable(prop);
            }
        }
        // If any configuration changes (effects like line numbers, wrapping, language mode) were queued
        // during the property update loop, dispatch them to the CodeMirror editor now.
        // This applies all pending configuration updates in a single, batched operation,
        // which is generally more performant and ensures consistency.
        if (effects.length > 0) {
            view === null || view === void 0 ? void 0 : view.dispatch({ effects });
        }
        super.update(changedProperties);
    }
    render() {
        var _a, _b, _c, _d;
        if (this.readonly) {
            return (_a = this._editorView) === null || _a === void 0 ? void 0 : _a.dom;
        }
        return html `
      <div
        id="focusContainer"
        tabindex="0"
        @mousedown=${this._onMousedown}
        @focus=${this._onFocus}
        @blur=${this._onBlur}
        @keydown=${this._onKeyDown}
      >
        <slot
          name="extensions"
          @register-codemirror-extension=${this._onRegisterExtension}
          @slotchange=${this._onSlotChange}
        ></slot>
        ${this._showKeyboardHelp
            ? html `<playground-internal-overlay>
              <p id="keyboardHelp" part="dialog">
                Press <strong>Enter</strong> to start editing<br />
                Press <strong>Escape</strong> to exit editor
              </p>
            </playground-internal-overlay>`
            : nothing}
        ${(_b = this._editorView) === null || _b === void 0 ? void 0 : _b.dom}
        <div
          id="tooltip"
          ?hidden=${!this._tooltipDiagnostic}
          style=${ifDefined((_c = this._tooltipDiagnostic) === null || _c === void 0 ? void 0 : _c.position)}
        >
          <div part="diagnostic-tooltip">
            ${(_d = this._tooltipDiagnostic) === null || _d === void 0 ? void 0 : _d.diagnostic.message}
          </div>
        </div>
      </div>
    `;
    }
    connectedCallback() {
        var _a, _b;
        if (!this._editorView) {
            this._editorView = new EditorView({
                state: this._createEditorState((_a = this.value) !== null && _a !== void 0 ? _a : ''),
                root: (_b = this.shadowRoot) !== null && _b !== void 0 ? _b : undefined,
            });
        }
        super.connectedCallback();
    }
    _onSlotChange() {
        if (this._hasNotifiedExtensionsReady) {
            return;
        }
        this._hasNotifiedExtensionsReady = true;
        this._notifyExtensionsReady();
    }
    disconnectedCallback() {
        var _a;
        (_a = this._editorView) === null || _a === void 0 ? void 0 : _a.destroy();
        this._editorView = undefined;
        super.disconnectedCallback();
    }
    _createEditorState(content) {
        var _a;
        const baseExtensions = [
            syntaxHighlighting(classHighlighter, { fallback: true }),
            highlightSpecialChars(),
            history(),
            drawSelection(),
            dropCursor(),
            EditorState.allowMultipleSelections.of(true),
            indentOnInput(),
            bracketMatching(),
            closeBrackets(),
            highlightSelectionMatches(),
            keymap.of([
                ...closeBracketsKeymap,
                ...defaultKeymap,
                ...searchKeymap,
                ...historyKeymap,
                ...foldKeymap,
                ...completionKeymap,
                ...lintKeymap,
                indentWithTab,
            ]),
            this._diagnosticField,
            this._readOnlyCompartment.of(this.readonly ? EditorState.readOnly.of(true) : []),
            this._lineNumbersCompartment.of(this.lineNumbers ? [cmLineNumbers(), foldGutter()] : []),
            this._lineWrappingCompartment.of(this.lineWrapping ? EditorView.lineWrapping : []),
            this._languageCompartment.of((() => {
                return this._getLanguageExtension() || [];
            })()),
            this._autocompletionCompartment.of(this.noCompletions ? [] : [this._getAutocompletions()]),
            this._declarativeExtensionsCompartment.of([
                ...this._declarativeExtensions,
            ]),
            this._programmaticExtensionsCompartment.of([(_a = this.extensions) !== null && _a !== void 0 ? _a : []].flat()),
            playgroundTheme,
        ];
        // Listen for changes
        baseExtensions.push(EditorView.updateListener.of((update) => {
            if (update.docChanged) {
                this._lastTransactions = [...update.transactions];
                this._value = update.state.doc.toString();
                const isUndoRedo = update.transactions.some((tr) => tr.annotation(Transaction.userEvent) === 'undo' ||
                    tr.annotation(Transaction.userEvent) === 'redo');
                // Check if ALL transactions are programmatic (not user edits).
                // We fire the change event if ANY transaction is a user edit, even if
                // there are also programmatic transactions in the same update.
                const allProgrammatic = update.transactions.every((tr) => tr.annotation(programmaticChangeAnnotation) === true);
                // External changes are usually things like the editor switching which
                // file it is displaying.
                if (allProgrammatic) {
                    // Apply hide/fold regions when value changes from outside
                    void this._applyHideAndFoldRegions();
                    this._showDiagnostics();
                }
                else {
                    if (isUndoRedo) {
                        // Always reapply hide/fold regions after undo/redo
                        void this._applyHideAndFoldRegions();
                    }
                    // Only fire change event for user-initiated edits
                    this.dispatchEvent(new Event('change'));
                }
            }
        }));
        return EditorState.create({
            doc: content,
            extensions: baseExtensions,
        });
    }
    _notifyExtensionsReady() {
        for (const el of this._extensionElements) {
            el.dispatchEvent(new PlaygroundEditorReadyEvent());
        }
    }
    _onRegisterExtension(e) {
        e.stopPropagation();
        const newExtensions = e.getExtensions();
        const newExtArr = Array.isArray(newExtensions)
            ? [...newExtensions]
            : [newExtensions];
        for (const ext of newExtArr) {
            this._declarativeExtensions.add(ext);
        }
        const unregister = () => {
            for (const ext of newExtArr) {
                this._declarativeExtensions.delete(ext);
            }
            this._reconfigureDeclarativeExtensions();
        };
        e.composedPath()[0].dispatchEvent(new CodemirrorExtensionRegisteredEvent(unregister));
        this._reconfigureDeclarativeExtensions();
    }
    _reconfigureDeclarativeExtensions() {
        var _a;
        (_a = this._editorView) === null || _a === void 0 ? void 0 : _a.dispatch({
            effects: this._declarativeExtensionsCompartment.reconfigure([
                ...this._declarativeExtensions,
            ]),
        });
    }
    _getLanguageExtension() {
        switch (this.type) {
            case 'js':
                return lit();
            case 'jsx':
                return lit({ jsx: true });
            case 'ts':
                return lit({ typescript: true });
            case 'tsx':
                return lit({ typescript: true, jsx: true });
            case 'html':
                return cmHtml();
            case 'css':
                return cmCss();
            case 'json':
                return lit();
            default:
                return null;
        }
    }
    _currentFiletypeSupportsCompletion() {
        // Currently we are only supporting code completion for these. Change
        // this in a case that we start to support configuring completions for
        // other languages too.
        return ['ts', 'js', 'tsx', 'jsx'].includes(this.type);
    }
    focus() {
        var _a;
        (_a = this._editorContent) === null || _a === void 0 ? void 0 : _a.focus();
    }
    _getAutocompletions() {
        return autocompletion({
            // Only show completions when we explicitly support the language.
            // Otherwise, default to whatever Codemirror does for it by default.
            override: this._currentFiletypeSupportsCompletion()
                ? [this._customCompletionSource]
                : undefined,
        });
    }
    _showCompletions() {
        if (!this._editorView ||
            !this._completions ||
            this._completions.length <= 0)
            return;
    }
    _onMousedown() {
        var _a;
        // Directly focus editable region.
        (_a = this._editorContent) === null || _a === void 0 ? void 0 : _a.focus();
    }
    _onFocus() {
        // Outer container was focused, either by tabbing from outside, or by
        // pressing Escape.
        this._showKeyboardHelp = true;
    }
    _onBlur() {
        // Outer container was unfocused, either by tabbing away from it, or by
        // pressing Enter.
        this._showKeyboardHelp = false;
    }
    _onKeyDown(event) {
        var _a, _b;
        if (event.key === 'Enter' && event.target === this._focusContainer) {
            (_a = this._editorContent) === null || _a === void 0 ? void 0 : _a.focus();
            // Prevent typing a newline from this same event.
            event.preventDefault();
        }
        else if (event.key === 'Escape') {
            // If the user has completions selection UI opened up, Escape's default action
            // is to close the completion UI instead of escaping the code editor instance.
            // Therefore we only focus on the focusContainer in situations where the completions
            // UI is not open.
            if (!this._completionsOpen) {
                // Note there is no API for "select the next naturally focusable element",
                // so instead we just re-focus the outer container, from which point the
                // user can tab to move focus entirely elsewhere.
                (_b = this._focusContainer) === null || _b === void 0 ? void 0 : _b.focus();
            }
        }
    }
    async _applyHideAndFoldRegions() {
        var _a;
        if (!this._editorView) {
            return;
        }
        if (this.pragmas === 'off-visible') {
            return;
        }
        const pattern = this._maskPatternForLang();
        if (pattern === undefined) {
            return;
        }
        // CM6 decorations can be used for the '...' of hide/fold regions because
        // they are designed to modify the appearance of what is rendered in the
        // editor, so we also use it to simply hide the hide comments as well.
        const decorations = [];
        const text = this._editorView.state.doc.toString();
        // Annotations in CM6 are used for attaching metadata, in this case the
        // fold ID, to dispatched actions.
        const unfoldAnnotation = Annotation.define();
        for (const match of text.matchAll(pattern)) {
            const [, opener, kind, content, closer] = match;
            const openerStart = (_a = match.index) !== null && _a !== void 0 ? _a : 0;
            const foldId = openerStart; // Use the start position as the UID for the fold
            const openerEnd = openerStart + opener.length;
            // Hide opening comment
            decorations.push(Decoration.replace({}).range(openerStart, openerEnd));
            const contentStart = openerEnd;
            let contentEnd;
            if (content && closer) {
                contentEnd = contentStart + content.length;
                const closerStart = contentEnd;
                const closerEnd = contentEnd + closer.length;
                // Hide closing comment
                decorations.push(Decoration.replace({}).range(closerStart, closerEnd));
            }
            else {
                // No matching end comment. Include the entire rest of the file.
                contentEnd = text.length;
            }
            const view = this._editorView;
            if (this.pragmas === 'on') {
                if (kind === 'fold') {
                    // Add fold widget and extract the content after the fold for display
                    const lines = (content === null || content === void 0 ? void 0 : content.split('\n')) || [];
                    const lastLine = lines.length > 0 ? lines[lines.length - 1].trim() : '';
                    // Make sure we're showing the actual content, not just ellipses
                    const displayText = `…${lastLine}`;
                    // Create a widget that shows the folded "..." content
                    const widget = new (class extends WidgetType {
                        toDOM() {
                            const wrapper = document.createElement('div');
                            const span = html `<span
                class="cm-foldMarker"
                @click=${() => view.dispatch({
                                annotations: unfoldAnnotation.of(foldId),
                            })}
                >${displayText}</span
              >`;
                            render(span, wrapper);
                            return wrapper.children[0];
                        }
                    })();
                    decorations.push(Decoration.replace({
                        widget: widget,
                        kind: 'fold',
                        foldId,
                    }).range(contentStart, contentEnd));
                }
                else if (kind === 'hide') {
                    // Hide content
                    decorations.push(Decoration.replace({ kind: 'hide' }).range(contentStart, contentEnd));
                }
            }
        }
        // Add the extension to the editor
        const hideAndFoldField = StateField.define({
            create: () => Decoration.set(decorations, true),
            update: (decoration, transaction) => {
                // Check if the the user wants to unfold because they clicked the '...'
                const foldIdToRemove = transaction.annotation(unfoldAnnotation);
                if (foldIdToRemove !== undefined) {
                    // Only remove the specific fold decoration with matching ID
                    const newDecorations = [];
                    decoration.between(0, Infinity, (from, to, value) => {
                        if (!(value.spec.kind === 'fold' &&
                            value.spec.foldId === foldIdToRemove)) {
                            newDecorations.push(value.range(from, to));
                        }
                    });
                    return Decoration.set(newDecorations);
                }
                return decoration.map(transaction.changes);
            },
            provide: (field) => EditorView.decorations.from(field),
        });
        this._editorView.dispatch({
            effects: StateEffect.appendConfig.of(hideAndFoldField),
        });
    }
    _maskPatternForLang() {
        switch (this.type) {
            case 'js':
            case 'ts':
            case 'css':
            case 'jsx':
            case 'tsx':
                // We consume all leading whitespace and one trailing newline for each
                // start/end comment. This lets us put start/end comments on their own
                // line and indent them like the surrounding without affecting the
                // selected region.
                return /( *\/\* *playground-(?<kind>hide|fold) *\*\/\n?)(?:(.*?)( *\/\* *playground-\k<kind>-end *\*\/\n?))?/gs;
            case 'html':
                return /( *<!-- *playground-(?<kind>hide|fold) *-->\n?)(?:(.*?)( *<!-- *playground-\k<kind>-end *-->\n?))?/gs;
            default:
                return undefined;
        }
    }
    _showDiagnostics() {
        var _a, _b, _c;
        if (!this._editorView) {
            return;
        }
        this._tooltipDiagnostic = undefined;
        if (!((_a = this.diagnostics) === null || _a === void 0 ? void 0 : _a.length)) {
            if (this._diagnosticsMouseoverListenerActive) {
                (_b = this._editorView) === null || _b === void 0 ? void 0 : _b.dom.removeEventListener('mouseover', this._onMouseOverWithDiagnostics);
                this._diagnosticsMouseoverListenerActive = false;
            }
            // Clear diagnostic decorations
            this._diagnosticDecorations = Decoration.none;
            this._editorView.dispatch({
                effects: StateEffect.appendConfig.of([this._diagnosticField]),
            });
            return;
        }
        if (!this._diagnosticsMouseoverListenerActive) {
            (_c = this._editorView) === null || _c === void 0 ? void 0 : _c.dom.addEventListener('mouseover', this._onMouseOverWithDiagnostics);
            this._diagnosticsMouseoverListenerActive = true;
        }
        // Create decorations for each diagnostic
        const decorations = [];
        for (let i = 0; i < this.diagnostics.length; i++) {
            const diagnostic = this.diagnostics[i];
            // Create a decoration that adds a CSS class to the range
            const decoration = Decoration.mark({
                class: `diagnostic diagnostic-${i}`,
            });
            // Convert line/character positions to absolute positions
            const startLine = this._editorView.state.doc.line(diagnostic.range.start.line + 1);
            const endLine = this._editorView.state.doc.line(diagnostic.range.end.line + 1);
            const startPos = startLine.from + diagnostic.range.start.character;
            let endPos = endLine.from + diagnostic.range.end.character;
            // CM6 will throw if decorations don't have a valid range
            if (endPos - startPos <= 0) {
                endPos = startPos + 1;
            }
            decorations.push(decoration.range(startPos, endPos));
        }
        // Set the diagnostic decorations
        this._diagnosticDecorations = Decoration.set(decorations, true);
        // Apply the decorations to the editor
        this._editorView.dispatch({
            effects: StateEffect.appendConfig.of([this._diagnosticField]),
        });
    }
};
PlaygroundCodeEditor.styles = [
    css `
      :host {
        display: block;
      }

      :host,
      #focusContainer {
        border-end-start-radius: inherit;
      }

      #focusContainer {
        height: 100%;
        position: relative;
      }
      #focusContainer:focus {
        outline: none;
      }

      .cm-editor {
        height: 100% !important;
        border-radius: inherit;
      }

      .cm-foldMarker {
        font-family: sans-serif;
      }
      .cm-foldMarker:hover {
        cursor: pointer;
        /* Pretty much any color from the theme is good enough. */
        color: var(--playground-code-keyword-color, #770088);
      }

      #keyboardHelp {
        font-size: 18px;
        font-family: sans-serif;
        padding: 10px 20px;
      }

      .diagnostic {
        position: relative;
      }

      .diagnostic::before {
        /* It would be nice to use "text-decoration: red wavy underline" here,
           but unfortunately it renders nothing at all for single characters.
           See https://bugs.chromium.org/p/chromium/issues/detail?id=668042. */
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sJDw4cOCW1/KIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAHElEQVQI12NggIL/DAz/GdA5/xkY/qPKMDAwAADLZwf5rvm+LQAAAABJRU5ErkJggg==');
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
      }

      #tooltip {
        position: absolute;
        padding: 7px;
        z-index: 4;
        font-family: var(--playground-code-font-family, monospace);
      }

      #tooltip > div {
        background: var(--playground-code-background, #fff);
        color: var(--playground-code-default-color, #000);
        /* Kind of hacky... line number color tends to work out as a good
           default border, because it's usually visible on top of the
           background, but slightly muted. */
        border: 1px solid var(--playground-code-linenumber-color, #ccc);
        padding: 5px;
      }

      [contenteditable='true'] {
        outline: none;
      }

      slot[name='extensions'] {
        display: none;
      }
    `,
];
__decorate([
    property({ attribute: false })
], PlaygroundCodeEditor.prototype, "extensions", void 0);
__decorate([
    property()
], PlaygroundCodeEditor.prototype, "value", null);
__decorate([
    property({ attribute: false })
    // eslint-disable-next-line @typescript-eslint/ban-types
], PlaygroundCodeEditor.prototype, "documentKey", void 0);
__decorate([
    property()
], PlaygroundCodeEditor.prototype, "type", void 0);
__decorate([
    property({ type: Boolean, attribute: 'line-numbers', reflect: true })
], PlaygroundCodeEditor.prototype, "lineNumbers", void 0);
__decorate([
    property({ type: Boolean, attribute: 'line-wrapping', reflect: true })
], PlaygroundCodeEditor.prototype, "lineWrapping", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], PlaygroundCodeEditor.prototype, "readonly", void 0);
__decorate([
    property({ type: Boolean, attribute: 'no-completions' })
], PlaygroundCodeEditor.prototype, "noCompletions", void 0);
__decorate([
    property({ attribute: false })
], PlaygroundCodeEditor.prototype, "diagnostics", void 0);
__decorate([
    state()
], PlaygroundCodeEditor.prototype, "_completions", void 0);
__decorate([
    state()
], PlaygroundCodeEditor.prototype, "_completionsOpen", void 0);
__decorate([
    property()
], PlaygroundCodeEditor.prototype, "pragmas", void 0);
__decorate([
    state()
], PlaygroundCodeEditor.prototype, "_tooltipDiagnostic", void 0);
__decorate([
    state()
], PlaygroundCodeEditor.prototype, "_showKeyboardHelp", void 0);
__decorate([
    query('#focusContainer')
], PlaygroundCodeEditor.prototype, "_focusContainer", void 0);
__decorate([
    query('.cm-content')
], PlaygroundCodeEditor.prototype, "_editorContent", void 0);
__decorate([
    queryAssignedElements({ slot: 'extensions', flatten: true })
], PlaygroundCodeEditor.prototype, "_extensionElements", void 0);
PlaygroundCodeEditor = PlaygroundCodeEditor_1 = __decorate([
    customElement('playground-code-editor')
], PlaygroundCodeEditor);
export { PlaygroundCodeEditor };
