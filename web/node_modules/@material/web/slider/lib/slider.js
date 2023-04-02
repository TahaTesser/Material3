/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate, __metadata } from "tslib";
import '../../elevation/elevation.js';
import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';
import { html, LitElement, nothing } from 'lit';
import { property, query, queryAsync, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import { dispatchActivationClick, isActivationClick, redispatchEvent } from '../../controller/events.js';
import { FormController, getFormValue } from '../../controller/form-controller.js';
import { stringConverter } from '../../controller/string-converter.js';
import { ariaProperty } from '../../decorators/aria-property.js';
import { pointerPress, shouldShowStrongFocus } from '../../focus/strong-focus.js';
import { ripple } from '../../ripple/directive.js';
// This is required for decorators.
// tslint:disable:no-new-decorators
// Disable warning for classMap with destructuring
// tslint:disable:quoted-properties-on-dictionary
function inBounds({ x, y }, element) {
    if (!element) {
        return false;
    }
    const { top, left, bottom, right } = element.getBoundingClientRect();
    return x >= left && x <= right && y >= top && y <= bottom;
}
// parse values like: foo or foo,bar
function tupleConverter(attr) {
    const [, v, e] = attr?.match(/\s*\[?\s*([^,]+)(?:(?:\s*$)|(?:\s*,\s*(.*)\s*))/) ?? [];
    return e !== undefined ? [v, e] : v;
}
function toNumber(value) {
    return Number(value) || 0;
}
function tupleAsString(value) {
    return Array.isArray(value) ? value.join() : String(value ?? '');
}
function valueConverter(attr) {
    const value = tupleConverter(attr);
    return Array.isArray(value) ? value.map(i => toNumber(i)) : toNumber(value);
}
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
function isOverlapping(elA, elB) {
    if (!(elA && elB)) {
        return false;
    }
    const a = elA.getBoundingClientRect();
    const b = elB.getBoundingClientRect();
    return !(a.top > b.bottom || a.right < b.left || a.bottom < b.top ||
        a.left > b.right);
}
/**
 * Slider component.
 */
export class Slider extends LitElement {
    /**
     * The associated form element with which this element's value will submit.
     */
    get form() {
        return this.closest('form');
    }
    /**
     * Read only computed value representing the fraction between 0 and 1
     * respresenting the value's position between min and max. This is a
     * single fraction or a tuple if the value specifies start and end values.
     */
    get valueAsFraction() {
        const { lowerFraction, upperFraction } = this.getMetrics();
        return this.allowRange ? [lowerFraction, upperFraction] : upperFraction;
    }
    getMetrics() {
        const step = Math.max(this.step, 1);
        const range = Math.max(this.max - this.min, step);
        const lower = Math.min(this.valueA, this.valueB);
        const upper = Math.max(this.valueA, this.valueB);
        const lowerFraction = (lower - this.min) / range;
        const upperFraction = (upper - this.min) / range;
        return {
            step,
            range,
            lower,
            upper,
            lowerFraction,
            upperFraction,
        };
    }
    constructor() {
        super();
        /**
         * Whether or not the slider is disabled.
         */
        this.disabled = false;
        /**
         * The slider minimum value
         */
        this.min = 0;
        /**
         * The slider maximum value
         */
        this.max = 10;
        /**
         * The slider value, can be a single number, or an array tuple indicating
         * a start and end value.
         */
        this.value = 0;
        /**
         * The step between values.
         */
        this.step = 1;
        /**
         * Whether or not to show tick marks.
         */
        this.withTickMarks = false;
        /**
         * Whether or not to show a value label when activated.
         */
        this.withLabel = false;
        /**
         * The HTML name to use in form submission.
         */
        this.name = '';
        this.valueA = 0;
        this.valueB = 0;
        this.focusRingAShowing = false;
        this.focusRingBShowing = false;
        // allows for lazy rendering of the focus ring by latchin to true when the
        // focus ring should be rendered.
        this.focusRingARequested = false;
        this.focusRingBRequested = false;
        this.rippleAShowing = false;
        this.rippleBShowing = false;
        // handle hover/pressed states are set manually since the handle
        // does not receive pointer events so that the native inputs are
        // interaction targets.
        this.handleAHover = false;
        this.handleBHover = false;
        this.handleAPressed = false;
        this.handleBPressed = false;
        this.onTopId = 'b';
        this.handlesOverlapping = false;
        this.isInteracting = false;
        // If range should be allowed (detected via value format).
        this.allowRange = false;
        this.renderRipple = (id) => html `<md-ripple class=${id} ?disabled=${this.disabled} unbounded></md-ripple>`;
        this.getRippleA = () => {
            if (!this.handleAHover) {
                return null;
            }
            this.rippleAShowing = true;
            return this.rippleA;
        };
        this.getRippleB = () => {
            if (!this.handleBHover) {
                return null;
            }
            this.rippleBShowing = true;
            return this.rippleB;
        };
        this.addController(new FormController(this));
        this.addEventListener('click', (event) => {
            if (!isActivationClick(event)) {
                return;
            }
            this.focus();
            dispatchActivationClick(this.inputB);
        });
    }
    focus() {
        this.inputB?.focus();
    }
    get valueAsString() {
        return tupleAsString(this.value);
    }
    // value coerced to a string
    [getFormValue]() {
        return this.valueAsString;
    }
    // indicates input values are crossed over each other from initial rendering.
    isFlipped() {
        return this.valueA > this.valueB;
    }
    willUpdate(changed) {
        if (changed.has('value') || changed.has('min') || changed.has('max') ||
            changed.has('step')) {
            this.allowRange = Array.isArray(this.value);
            const step = Math.max(this.step, 1);
            let lower = this.allowRange ? this.value[0] : this.min;
            lower = clamp(lower - (lower % step), this.min, this.max);
            let upper = this.allowRange ? this.value[1] :
                this.value;
            upper = clamp(upper - (upper % step), this.min, this.max);
            const isFlipped = this.isFlipped() && this.allowRange;
            this.valueA = isFlipped ? upper : lower;
            this.valueB = isFlipped ? lower : upper;
        }
        // manually handle ripple hover state since the handle is pointer events
        // none.
        if (changed.get('handleAHover') !== undefined) {
            this.rippleAShowing = true;
            this.toggleRippleHover(this.rippleA, this.handleAHover);
        }
        else if (changed.get('handleBHover') !== undefined) {
            this.rippleBShowing = true;
            this.toggleRippleHover(this.rippleB, this.handleBHover);
        }
        // facilitates lazy rendering of the focus ring.
        this.focusRingARequested || (this.focusRingARequested = this.focusRingAShowing);
        this.focusRingBRequested || (this.focusRingBRequested = this.focusRingBShowing);
    }
    async updated(changed) {
        if (changed.has('value') || changed.has('valueA') ||
            changed.has('valueB')) {
            await this.updateComplete;
            this.handlesOverlapping = isOverlapping(this.handleA, this.handleB);
        }
    }
    render() {
        const { step, range, lowerFraction, upperFraction } = this.getMetrics();
        const isFlipped = this.isFlipped();
        const containerStyles = {
            // for clipping inputs and active track.
            '--lowerFraction': String(lowerFraction),
            '--upperFraction': String(upperFraction),
            // for generating tick marks
            '--tickCount': String(range / step)
        };
        const containerClasses = {
            interacting: this.isInteracting,
            ranged: this.allowRange
        };
        // optional label values to show in place of the value.
        const labelA = String(this.valueLabel?.[isFlipped ? 1 : 0] ?? this.valueA);
        const labelB = String((this.allowRange ? this.valueLabel?.[isFlipped ? 0 : 1] :
            this.valueLabel) ??
            this.valueB);
        const inputAProps = {
            id: 'a',
            lesser: !isFlipped,
            value: this.valueA,
            label: labelA,
            getRipple: this.getRippleA
        };
        const inputBProps = {
            id: 'b',
            lesser: isFlipped,
            value: this.valueB,
            label: labelB,
            getRipple: this.getRippleB
        };
        const handleAProps = {
            id: 'a',
            lesser: !isFlipped,
            showRipple: this.rippleAShowing,
            focusRequested: this.focusRingARequested,
            showFocus: this.focusRingAShowing,
            hover: this.handleAHover,
            pressed: this.handleAPressed,
            label: labelA
        };
        const handleBProps = {
            id: 'b',
            lesser: isFlipped,
            showRipple: this.rippleBShowing,
            focusRequested: this.focusRingBRequested,
            showFocus: this.focusRingBShowing,
            hover: this.handleBHover,
            pressed: this.handleBPressed,
            label: labelB
        };
        const handleContainerClasses = {
            hover: this.handleAHover || this.handleBHover
        };
        return html `
    <div
      class="container ${classMap(containerClasses)}"
      style=${styleMap(containerStyles)}
    >
      ${when(this.allowRange, () => this.renderInput(inputAProps))}
      ${this.renderInput(inputBProps)}
      ${this.renderTrack()}
      <div class="handleContainerPadded">
        <div class="handleContainerBlock">
          <div class="handleContainer ${classMap(handleContainerClasses)}">
            ${when(this.allowRange, () => this.renderHandle(handleAProps))}
            ${this.renderHandle(handleBProps)}
          </div>
        </div>
      </div>
    </div>`;
    }
    renderTrack() {
        const trackClasses = { 'tickMarks': this.withTickMarks };
        return html `
    <slot name="track">
      <div class="track ${classMap(trackClasses)}"></div>
    </slot>`;
    }
    renderFocusRing(visible) {
        return html `<md-focus-ring .visible=${visible}></md-focus-ring>`;
    }
    renderLabel(value) {
        return html `<div class="label">
        <span class="labelContent" part="label">${value}</span>
      </div>`;
    }
    renderHandle({ id, lesser, showRipple, focusRequested, showFocus, hover, pressed, label }) {
        const onTop = !this.disabled && id === this.onTopId;
        const isOverlapping = !this.disabled && this.handlesOverlapping;
        return html `<div class="handle ${classMap({
            [id]: true,
            lesser,
            hover,
            pressed,
            onTop,
            isOverlapping
        })}">
      <slot name="handle${this.allowRange ? (lesser ? 'Lesser' : 'Greater') : ''}">
        <div class="handleNub"><md-elevation shadow></md-elevation></div>
        ${when(this.withLabel, () => this.renderLabel(label))}

      </slot>
      ${when(showRipple, () => this.renderRipple(id))}
      ${when(focusRequested, () => this.renderFocusRing(showFocus))}
    </div>`;
    }
    renderInput({ id, lesser, value, label, getRipple }) {
        // when ranged, ensure announcement includes value info.
        const ariaLabelDescriptor = this.allowRange ? ` - ${lesser ? `start` : `end`} handle` : '';
        return html `<input type="range"
      class="${classMap({
            lesser,
            [id]: true
        })}"
      @focus=${this.handleFocus}
      @blur=${this.handleBlur}
      @pointerdown=${this.handleDown}
      @pointerup=${this.handleUp}
      @pointerenter=${this.handleEnter}
      @pointermove=${this.handleMove}
      @pointerleave=${this.handleLeave}
      @input=${this.handleInput}
      @change=${this.handleChange}
      .disabled=${this.disabled}
      .min=${String(this.min)}
      .max=${String(this.max)}
      .step=${String(this.step)}
      .value=${String(value)}
      .tabIndex=${lesser ? 1 : 0}
      aria-label=${`${this.ariaLabel}${ariaLabelDescriptor}` || nothing}
      aria-valuetext=${label}
      ${ripple(getRipple)}>`;
    }
    async toggleRippleHover(ripple, hovering) {
        const rippleEl = await ripple;
        if (!rippleEl) {
            return;
        }
        // TODO(b/269799771): improve slider ripple connection
        if (hovering) {
            rippleEl.handlePointerenter(new PointerEvent('pointerenter', { isPrimary: true, pointerId: 1 }));
        }
        else {
            rippleEl.handlePointerleave(new PointerEvent('pointerleave', { isPrimary: true, pointerId: 1 }));
        }
    }
    isEventOnA({ target }) {
        return target === this.inputA;
    }
    updateFocusVisible(e) {
        const isA = this.isEventOnA(e);
        const showFocus = shouldShowStrongFocus();
        this.focusRingAShowing = showFocus && isA;
        this.focusRingBShowing = showFocus && !isA;
    }
    handleFocus(e) {
        this.updateFocusVisible(e);
        this.updateOnTop(e);
    }
    handleBlur(e) {
        this.focusRingAShowing = false;
        this.focusRingBShowing = false;
    }
    handleDown(e) {
        pointerPress();
        this.isInteracting = true;
        const isA = this.isEventOnA(e);
        const isPrimaryButton = Boolean(e.buttons & 1);
        // Since handle moves to pointer on down and there may not be a move,
        // it needs to be considered hovered..
        this.handleAHover = !this.disabled && isA && Boolean(this.handleA);
        this.handleAPressed = isPrimaryButton && this.handleAHover;
        this.handleBHover = !this.disabled && !isA && Boolean(this.handleB);
        this.handleBPressed = isPrimaryButton && this.handleBHover;
        this.updateFocusVisible(e);
    }
    handleUp(e) {
        this.handleAPressed = this.handleBPressed = false;
        // used to remove animations after interactions...
        this.renderRoot.addEventListener('transitionend', () => {
            this.isInteracting = false;
        }, { once: true });
    }
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
    handleMove(e) {
        this.handleAHover = !this.disabled && inBounds(e, this.handleA);
        this.handleBHover = !this.disabled && inBounds(e, this.handleB);
    }
    handleEnter(e) {
        this.handleMove(e);
    }
    handleLeave() {
        this.handleAHover = false;
        this.handleBHover = false;
    }
    updateOnTop(e) {
        this.onTopId = e.target.classList.contains('a') ? 'a' : 'b';
    }
    handleInput(e) {
        if (this.inputA) {
            this.valueA = this.inputA.valueAsNumber ?? 0;
        }
        this.valueB = this.inputB.valueAsNumber;
        this.updateOnTop(e);
        //  update value only on interaction
        const lower = Math.min(this.valueA, this.valueB);
        const upper = Math.max(this.valueA, this.valueB);
        this.value = this.allowRange ? [lower, upper] : this.valueB;
    }
    handleChange(event) {
        redispatchEvent(this, event);
    }
}
Slider.shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };
/**
 * @nocollapse
 */
Slider.formAssociated = true;
__decorate([
    ariaProperty // tslint:disable-line:no-new-decorators
    ,
    property({ type: String, attribute: 'data-aria-label', noAccessor: true }),
    __metadata("design:type", String)
], Slider.prototype, "ariaLabel", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], Slider.prototype, "disabled", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], Slider.prototype, "min", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], Slider.prototype, "max", void 0);
__decorate([
    property({ converter: valueConverter }),
    __metadata("design:type", Object)
], Slider.prototype, "value", void 0);
__decorate([
    property({ type: String, converter: tupleConverter }),
    __metadata("design:type", Object)
], Slider.prototype, "valueLabel", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], Slider.prototype, "step", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], Slider.prototype, "withTickMarks", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], Slider.prototype, "withLabel", void 0);
__decorate([
    property({ type: String, reflect: true, converter: stringConverter }),
    __metadata("design:type", Object)
], Slider.prototype, "name", void 0);
__decorate([
    query('input.a'),
    __metadata("design:type", HTMLInputElement)
], Slider.prototype, "inputA", void 0);
__decorate([
    query('.handle.a'),
    __metadata("design:type", HTMLDivElement)
], Slider.prototype, "handleA", void 0);
__decorate([
    queryAsync('md-ripple.a'),
    __metadata("design:type", Promise)
], Slider.prototype, "rippleA", void 0);
__decorate([
    query('input.b'),
    __metadata("design:type", HTMLInputElement)
], Slider.prototype, "inputB", void 0);
__decorate([
    query('.handle.b'),
    __metadata("design:type", HTMLDivElement)
], Slider.prototype, "handleB", void 0);
__decorate([
    queryAsync('md-ripple.b'),
    __metadata("design:type", Promise)
], Slider.prototype, "rippleB", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], Slider.prototype, "valueA", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], Slider.prototype, "valueB", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], Slider.prototype, "focusRingAShowing", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], Slider.prototype, "focusRingBShowing", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], Slider.prototype, "rippleAShowing", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], Slider.prototype, "rippleBShowing", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], Slider.prototype, "handleAHover", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], Slider.prototype, "handleBHover", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], Slider.prototype, "handleAPressed", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], Slider.prototype, "handleBPressed", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], Slider.prototype, "onTopId", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], Slider.prototype, "handlesOverlapping", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], Slider.prototype, "isInteracting", void 0);
//# sourceMappingURL=slider.js.map