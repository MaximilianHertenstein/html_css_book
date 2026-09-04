/**
 * Fired by a declarative CodeMirror extension element to announce its extension.
 *
 * Bubbles and is composed.
 */
export class RegisterCodemirrorExtensionEvent extends Event {
    constructor(getExtensions) {
        super(RegisterCodemirrorExtensionEvent.eventName, {
            bubbles: true,
            composed: true,
        });
        this.getExtensions = getExtensions;
    }
}
RegisterCodemirrorExtensionEvent.eventName = 'register-codemirror-extension';
/**
 * Fired by a playground editor in response to a
 * `RegisterCodemirrorExtensionEvent`.
 *
 * Does not bubble.
 */
export class CodemirrorExtensionRegisteredEvent extends Event {
    constructor(unregister) {
        super(CodemirrorExtensionRegisteredEvent.eventName, {
            bubbles: false,
            composed: false,
        });
        this.unregister = unregister;
    }
}
CodemirrorExtensionRegisteredEvent.eventName = 'codemirror-extension-registered';
/**
 * Fired by a playground editor on its extension elements when it is ready to
 * receive extensions. This is used to handle the race condition where an
 * extension is defined and connected before the editor is.
 *
 * Does not bubble.
 */
export class PlaygroundEditorReadyEvent extends Event {
    constructor() {
        super(PlaygroundEditorReadyEvent.eventName, {
            bubbles: false,
            composed: false,
        });
    }
}
PlaygroundEditorReadyEvent.eventName = 'playground-editor-ready';
/**
 * A mixin for creating a declarative CodeMirror extension.
 *
 * A declarative CodeMirror extension is a custom element that provides a
 * CodeMirror extension to any parent playground element that contains a
 * CodeMirror editor.
 *
 * This mixin handles the event-based communication with the editor, so that a
 * consuming class only needs to implement the `getExtensions()` method.
 */
export const codemirrorExtensionMixin = (superClass) => {
    return class CodemirrorExtensionElement extends superClass {
        constructor() {
            super(...arguments);
            this.isRegistered = false;
        }
        /**
         * This method must be implemented by the consuming class.
         * @returns A CodeMirror `Extension` or array of `Extension`s.
         */
        getExtensions() {
            throw new Error('getExtensions() must be implemented');
        }
        connectedCallback() {
            var _a;
            (_a = super.connectedCallback) === null || _a === void 0 ? void 0 : _a.call(this);
            this.addEventListener(CodemirrorExtensionRegisteredEvent.eventName, (e) => {
                const event = e;
                this.isRegistered = true;
                this._unregister = event.unregister;
                event.stopPropagation();
            });
            this.addEventListener(PlaygroundEditorReadyEvent.eventName, () => {
                if (!this.isRegistered) {
                    this.dispatchEvent(new RegisterCodemirrorExtensionEvent(() => this.getExtensions()));
                }
            });
            this.dispatchEvent(new RegisterCodemirrorExtensionEvent(() => this.getExtensions()));
        }
        disconnectedCallback() {
            var _a, _b;
            (_a = super.disconnectedCallback) === null || _a === void 0 ? void 0 : _a.call(this);
            (_b = this._unregister) === null || _b === void 0 ? void 0 : _b.call(this);
            this.isRegistered = false;
        }
    };
};
