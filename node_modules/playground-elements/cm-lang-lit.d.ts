/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { LanguageSupport, LRLanguage } from '@codemirror/language';
export declare const litLanguage: LRLanguage;
export declare const litJsxLanguage: LRLanguage;
export declare const litTypeScriptLanguage: LRLanguage;
export declare const litTsxLanguage: LRLanguage;
/**
 * Language support for Lit, which builds on JavaScript/TypeScript and adds
 * support for HTML, CSS, SVG, and MathML tagged template literals.
 */
export declare const lit: (config?: {
    jsx?: boolean;
    typescript?: boolean;
}) => LanguageSupport;
//# sourceMappingURL=cm-lang-lit.d.ts.map