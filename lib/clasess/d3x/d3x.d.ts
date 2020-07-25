import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ID3Node, IIconDef, IImageDef } from './../../interfaces';
import { D3NodeBasicParser } from './../@items';
import * as d3 from 'd3';
export interface IAttrs {
    [index: string]: string | number;
}
export declare const applyAttrs: (sel: d3.Selection<any, any, any, any>, attrs: IAttrs) => d3.Selection<any, any, any, any>;
export interface IDef {
    type: string;
    attrs: IAttrs;
    components?: {
        [index: string]: IDef;
    };
}
export declare const addDefs: (container: d3.Selection<any, any, any, any>, defs: {
    [index: string]: IDef;
}) => void;
export declare const calcIconGTransform: (prIcon: IconDefinition, prScale: number) => string;
export declare const calcGFit: (prG: d3.Selection<SVGGElement, any, any, any>, prContainer: d3.Selection<SVGElement, any, any, any>, prRoot: d3.HierarchyPointNode<ID3Node>, prNodeParser: D3NodeBasicParser, prPadding?: number) => {
    scale: number;
    y: number;
    x: number;
};
export declare const addDefaultDefs: (container: d3.Selection<any, any, any, any>, defs: {
    [index: string]: IIconDef | IImageDef;
}, prNodeParser: D3NodeBasicParser) => void;
export declare const addFaIconDefs: (container: d3.Selection<any, any, any, any>, defs: {
    [index: string]: IIconDef;
}) => void;
export declare const setPattern: (prPattern: d3.Selection<any, any, any, any>, prNodeData: Partial<ID3Node>, prNodeParser: D3NodeBasicParser) => void;
export interface IPosition {
    x: number;
    y: number;
}
export interface ISize {
    w: number;
    h: number;
}
export interface IMaxMinX {
    minx: number;
    maxx: number;
}
export interface IRootNode<T> extends d3.HierarchyPointNode<T> {
    childrenWidth?: number;
    minx?: number;
    maxx?: number;
    linkDirection?: 'top' | 'left' | 'right';
}
export declare const lastChidrenLevel: (prRoot: IRootNode<ID3Node>) => boolean;
export declare const buildTree: (prRoot: IRootNode<ID3Node>, nodeSize: ISize) => void;
