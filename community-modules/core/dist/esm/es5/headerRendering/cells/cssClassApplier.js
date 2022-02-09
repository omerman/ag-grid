/**
 * @ag-grid-community/core - Advanced Data Grid / Data Table supporting Javascript / Typescript / React / Angular / Vue
 * @version v27.0.0
 * @link http://www.ag-grid.com/
 * @license MIT
 */
import { missing } from "../../utils/generic";
var CssClassApplier = /** @class */ (function () {
    function CssClassApplier() {
    }
    CssClassApplier.getHeaderClassesFromColDef = function (abstractColDef, gridOptionsWrapper, column, columnGroup) {
        if (missing(abstractColDef)) {
            return [];
        }
        return this.getColumnClassesFromCollDef(abstractColDef.headerClass, abstractColDef, gridOptionsWrapper, column, columnGroup);
    };
    CssClassApplier.getToolPanelClassesFromColDef = function (abstractColDef, gridOptionsWrapper, column, columnGroup) {
        if (missing(abstractColDef)) {
            return [];
        }
        return this.getColumnClassesFromCollDef(abstractColDef.toolPanelClass, abstractColDef, gridOptionsWrapper, column, columnGroup);
    };
    CssClassApplier.getClassParams = function (abstractColDef, gridOptionsWrapper, column, columnGroup) {
        return {
            // bad naming, as colDef here can be a group or a column,
            // however most people won't appreciate the difference,
            // so keeping it as colDef to avoid confusion.
            colDef: abstractColDef,
            column: column,
            columnGroup: columnGroup,
            context: gridOptionsWrapper.getContext(),
            api: gridOptionsWrapper.getApi()
        };
    };
    CssClassApplier.getColumnClassesFromCollDef = function (classesOrFunc, abstractColDef, gridOptionsWrapper, column, columnGroup) {
        if (missing(classesOrFunc)) {
            return [];
        }
        var classToUse;
        if (typeof classesOrFunc === 'function') {
            var params = this.getClassParams(abstractColDef, gridOptionsWrapper, column, columnGroup);
            classToUse = classesOrFunc(params);
        }
        else {
            classToUse = classesOrFunc;
        }
        if (typeof classToUse === 'string') {
            return [classToUse];
        }
        if (Array.isArray(classToUse)) {
            return classToUse;
        }
        return [];
    };
    return CssClassApplier;
}());
export { CssClassApplier };