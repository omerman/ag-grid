import { Path } from "../scene/shape/path";
import { Group } from "../scene/group";
import { FontStyle, FontWeight } from "../scene/shape/text";
import { ChartAxisDirection } from "./chartAxis";
import { PointerEvents } from "../scene/node";
import { Scale } from "../scale/scale";
import { createId } from "../util/id";
import { Series } from "./series/series";

export class AnnotationLabel {
    text?: string = undefined;
    fontStyle?: FontStyle;
    fontWeight?: FontWeight;
    fontSize: number;
    fontFamily: string;
    /**
     * The padding between the label and the line.
     */
    padding: number;
    /**
     * The color of the labels.
     * Use `undefined` rather than `rgba(0, 0, 0, 0)` to make labels invisible.
     */
    color?: string;
    position: 'start' | 'middle' | 'end';
}
export class AnnotationStyle {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    lineDash?: [];
}
interface AnnotationPathData {
    readonly points: {
        readonly x: number;
        readonly y: number;
    }[];
}
export class Annotation {

    protected static readonly ANNOTATION_LAYER_ZINDEX = Series.SERIES_LAYER_ZINDEX + 20;

    static className = "Annotation";
    readonly id = createId(this);

    kind?: "line" | "range" = undefined;
    range?: [any, any] = undefined;
    value?: any = undefined;
    fill?: string = undefined;
    fillOpacity?: number = undefined;
    stroke?: string = undefined;
    strokeWidth?: number = undefined;
    strokeOpacity?: number = undefined;
    lineDash?: [] = undefined;
    label?: AnnotationLabel = new AnnotationLabel();

    xScale?: Scale<any, number> = undefined;
    yScale?: Scale<any, number> = undefined;
    direction?: ChartAxisDirection = undefined;

    readonly group = new Group({ name: `${this.id}`, layer: true, zIndex: Annotation.ANNOTATION_LAYER_ZINDEX });
    private annotationLine: Path = new Path();
    private annotationRange: Path = new Path();
    private pathData?: AnnotationPathData = undefined;

    constructor() {
        const { group, annotationLine, annotationRange } = this;

        group.append([annotationRange, annotationLine]);

        annotationLine.fill = undefined;
        annotationLine.pointerEvents = PointerEvents.None;

        annotationRange.pointerEvents = PointerEvents.None;
    }

    update(visible: boolean) {
        if (!this.kind) { return; }

        this.group.visible = visible;

        if (!visible) { return; }

        this.createNodeData();
        this.updatePaths();
    }

    private updatePaths() {
        this.updateLinePath();
        this.updateLineNode();

        if (this.kind === 'range') {
            this.updateRangePath();
            this.updateRangeNode();
        }
    }

    private createNodeData() {
        const { xScale, yScale, direction, range, value } = this;

        if (!xScale || !yScale) { return; }

        const halfXBandWidth = (xScale.bandwidth || 0) / 2;
        const halfYBandWidth = (yScale.bandwidth || 0) / 2;

        let xStart, xEnd, yStart, yEnd;
        this.pathData = { points: [] };

        if (direction === ChartAxisDirection.X) {
            [xStart, xEnd] = range || [value, undefined];
            [xStart, xEnd] = [xScale.convert(xStart) + halfXBandWidth, xScale.convert(xEnd) + halfXBandWidth];
            [yStart, yEnd] = yScale.range;

            this.pathData.points.push(
                {
                    x: xStart,
                    y: yStart
                },
                {
                    x: xStart,
                    y: yEnd
                },
                {
                    x: xEnd,
                    y: yEnd
                },
                {
                    x: xEnd,
                    y: yStart
                }
            );

        } else {
            [xStart, xEnd] = xScale.range;
            [yStart, yEnd] = range || [value, undefined];
            [yStart, yEnd] = [yScale.convert(yStart) + halfYBandWidth, yScale.convert(yEnd) + halfYBandWidth];

            this.pathData.points.push(
                {
                    x: xStart,
                    y: yStart
                },
                {
                    x: xEnd,
                    y: yStart
                },
                {
                    x: xEnd,
                    y: yEnd
                },
                {
                    x: xStart,
                    y: yEnd
                }
            );
        }
    }

    private updateLinePath() {
        const { annotationLine, pathData = { points: [] } } = this;
        const pathMethods: ('moveTo' | 'lineTo')[] = ['moveTo', 'lineTo', 'moveTo', 'lineTo'];
        const points = pathData.points;
        const { path } = annotationLine;

        path.clear();
        pathMethods.forEach((method, i) => {
            const { x, y } = points[i];
            path[method](x, y);
        })
        path.closePath();
    }

    private updateLineNode() {
        const { annotationLine, stroke, strokeWidth, lineDash } = this;
        annotationLine.stroke = stroke;
        annotationLine.strokeWidth = strokeWidth ?? 1;
        annotationLine.opacity = this.strokeOpacity ?? 1;
        annotationLine.lineDash = lineDash;
    }

    private updateRangeNode() {
        const { annotationRange, fill, lineDash, fillOpacity } = this;
        annotationRange.fill = fill;
        annotationRange.opacity = fillOpacity ?? 1;
        annotationRange.lineDash = lineDash;
    }

    private updateRangePath() {
        const { annotationRange, pathData = { points: [] } } = this;
        const points = pathData.points;
        const { path } = annotationRange;

        path.clear();
        points.forEach((point, i) => {
            const { x, y } = point;
            path[i > 0 ? 'lineTo' : 'moveTo'](x, y);
        });
        path.closePath();
    }
}