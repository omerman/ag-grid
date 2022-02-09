/**
 * @ag-grid-community/core - Advanced Data Grid / Data Table supporting Javascript / Typescript / React / Angular / Vue
 * @version v27.0.0
 * @link http://www.ag-grid.com/
 * @license MIT
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agInputTextField_1 = require("./agInputTextField");
const dom_1 = require("../utils/dom");
class AgInputNumberField extends agInputTextField_1.AgInputTextField {
    constructor(config) {
        super(config, 'ag-number-field', 'number');
    }
    postConstruct() {
        super.postConstruct();
        this.addManagedListener(this.eInput, 'blur', () => {
            const floatedValue = parseFloat(this.eInput.value);
            const value = isNaN(floatedValue) ? '' : this.normalizeValue(floatedValue.toString());
            if (this.value !== value) {
                this.setValue(value);
            }
        });
    }
    normalizeValue(value) {
        if (value === '') {
            return '';
        }
        if (this.precision) {
            value = this.adjustPrecision(value);
        }
        const val = parseFloat(value);
        if (this.min != null && val < this.min) {
            value = this.min.toString();
        }
        else if (this.max != null && val > this.max) {
            value = this.max.toString();
        }
        return value;
    }
    adjustPrecision(value) {
        if (this.precision) {
            const floatString = parseFloat(value).toFixed(this.precision);
            value = parseFloat(floatString).toString();
        }
        return value;
    }
    setMin(min) {
        if (this.min === min) {
            return this;
        }
        this.min = min;
        dom_1.addOrRemoveAttribute(this.eInput, 'min', min);
        return this;
    }
    setMax(max) {
        if (this.max === max) {
            return this;
        }
        this.max = max;
        dom_1.addOrRemoveAttribute(this.eInput, 'max', max);
        return this;
    }
    setPrecision(precision) {
        this.precision = precision;
        return this;
    }
    setStep(step) {
        if (this.step === step) {
            return this;
        }
        this.step = step;
        dom_1.addOrRemoveAttribute(this.eInput, 'step', step);
        return this;
    }
    setValue(value, silent) {
        value = this.adjustPrecision(value);
        const normalizedValue = this.normalizeValue(value);
        if (value != normalizedValue) {
            return this;
        }
        return super.setValue(value, silent);
    }
}
exports.AgInputNumberField = AgInputNumberField;

//# sourceMappingURL=agInputNumberField.js.map