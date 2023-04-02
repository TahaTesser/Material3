/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import '../../elevation/elevation.js';
import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';
import { LitElement, PropertyValues } from 'lit';
import { getFormValue } from '../../controller/form-controller.js';
import { MdRipple } from '../../ripple/ripple.js';
/**
 * Slider component.
 */
export declare class Slider extends LitElement {
    static shadowRootOptions: ShadowRootInit;
    /**
     * @nocollapse
     */
    static formAssociated: boolean;
    ariaLabel: string;
    /**
     * Whether or not the slider is disabled.
     */
    disabled: boolean;
    /**
     * The slider minimum value
     */
    min: number;
    /**
     * The slider maximum value
     */
    max: number;
    /**
     * The slider value, can be a single number, or an array tuple indicating
     * a start and end value.
     */
    value: number | [number, number];
    /**
     * An optinoal label for the slider's value; if not set, the label is the
     * value itself. This can be a string or string tuple when start and end
     * values are used.
     */
    valueLabel?: string | [string, string] | undefined;
    /**
     * The step between values.
     */
    step: number;
    /**
     * Whether or not to show tick marks.
     */
    withTickMarks: boolean;
    /**
     * Whether or not to show a value label when activated.
     */
    withLabel: boolean;
    /**
     * The HTML name to use in form submission.
     */
    name: string;
    /**
     * The associated form element with which this element's value will submit.
     */
    get form(): HTMLFormElement;
    /**
     * Read only computed value representing the fraction between 0 and 1
     * respresenting the value's position between min and max. This is a
     * single fraction or a tuple if the value specifies start and end values.
     */
    get valueAsFraction(): number | number[];
    protected getMetrics(): {
        step: number;
        range: number;
        lower: number;
        upper: number;
        lowerFraction: number;
        upperFraction: number;
    };
    protected readonly inputA: HTMLInputElement;
    protected readonly handleA: HTMLDivElement;
    protected readonly rippleA: Promise<MdRipple | null>;
    protected readonly inputB: HTMLInputElement;
    protected readonly handleB: HTMLDivElement;
    protected readonly rippleB: Promise<MdRipple | null>;
    protected valueA: number;
    protected valueB: number;
    private focusRingAShowing;
    private focusRingBShowing;
    private focusRingARequested;
    private focusRingBRequested;
    private rippleAShowing;
    private rippleBShowing;
    private handleAHover;
    private handleBHover;
    private handleAPressed;
    private handleBPressed;
    private onTopId;
    private handlesOverlapping;
    private isInteracting;
    constructor();
    focus(): void;
    get valueAsString(): string;
    [getFormValue](): string;
    private allowRange;
    private isFlipped;
    protected willUpdate(changed: PropertyValues): void;
    protected updated(changed: PropertyValues): Promise<void>;
    protected render(): import("lit-html").TemplateResult<1>;
    protected renderTrack(): import("lit-html").TemplateResult<1>;
    protected renderFocusRing(visible: boolean): import("lit-html").TemplateResult<1>;
    protected renderLabel(value: string): import("lit-html").TemplateResult<1>;
    protected renderHandle({ id, lesser, showRipple, focusRequested, showFocus, hover, pressed, label }: {
        id: string;
        lesser: boolean;
        focusRequested: boolean;
        showRipple: boolean;
        showFocus: boolean;
        hover: boolean;
        pressed: boolean;
        label: string;
    }): import("lit-html").TemplateResult<1>;
    protected renderInput({ id, lesser, value, label, getRipple }: {
        id: string;
        lesser: boolean;
        value: number;
        label: string;
        getRipple: () => Promise<MdRipple | null> | null;
    }): import("lit-html").TemplateResult<1>;
    protected renderRipple: (id: string) => import("lit-html").TemplateResult<1>;
    private readonly getRippleA;
    private readonly getRippleB;
    private toggleRippleHover;
    protected isEventOnA({ target }: Event): boolean;
    protected updateFocusVisible(e: Event): void;
    protected handleFocus(e: Event): void;
    protected handleBlur(e: Event): void;
    protected handleDown(e: PointerEvent): void;
    protected handleUp(e: PointerEvent): void;
    /**
     * The move handler tracks handle hovering to facilitate proper ripple
     * behavior on the slider handle. This is needed because user interaction with
     * the native input is leveraged to position the handle. Because the separate
     * displayed handle element has pointer events disabled (to allow interaction
     * with the input) and the input's handle is a pseudo-element, neither can be
     * the ripple's interactive element. Therefore the input is the ripple's
     * interactive element and has a `ripple` directive; however the ripple
     * is gated on the handle being hovered. In addition, because the ripple
     * hover state is being specially handled, it must be triggered independent
     * of the directive. This is done based on the hover state when the
     * slider is updated.
     */
    protected handleMove(e: PointerEvent): void;
    protected handleEnter(e: PointerEvent): void;
    protected handleLeave(): void;
    private updateOnTop;
    protected handleInput(e: InputEvent): void;
    protected handleChange(event: Event): void;
}
