export interface IPaginationModel<T = any>{
    rows: T[];
    count: number;
    limit: number;
}

export interface IOrder<T = any> {
    field: T;
    type: 'desc' | 'asc';
}

export interface ISearch<T extends string = any>{
    value: string;
    field: T;
}

type TGenericOperatorMark = 'isEmpty' | 'isNotEmpty' | 'isAnyOf'
export type TIntegerOperatorMark = '>' | '<' | '=' | '!=' | '>=' | '<=' | TGenericOperatorMark;
export type TStringOperatorMark = 'contains' | 'equals' | 'startsWith' | 'endWith' | TGenericOperatorMark;
export type IOperatorMark = TIntegerOperatorMark | TStringOperatorMark;

export interface IFilter<T = any> {
    field: T;
    operator: IOperatorMark;
    value?: string | number | Array<string>;
}
