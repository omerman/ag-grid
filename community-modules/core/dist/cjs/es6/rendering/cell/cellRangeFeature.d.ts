// Type definitions for @ag-grid-community/core v27.0.0
// Project: http://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { Beans } from "../beans";
import { CellCtrl, ICellComp } from "./cellCtrl";
export declare class CellRangeFeature {
    private beans;
    private cellComp;
    private cellCtrl;
    private rangeCount;
    private hasChartRange;
    private selectionHandle;
    constructor(beans: Beans, ctrl: CellCtrl);
    setComp(cellComp: ICellComp): void;
    onRangeSelectionChanged(): void;
    private updateRangeBorders;
    private isSingleCell;
    private getHasChartRange;
    updateRangeBordersIfRangeCount(): void;
    private getRangeBorders;
    refreshHandle(): void;
    private shouldHaveSelectionHandle;
    private addSelectionHandle;
    destroy(): void;
}