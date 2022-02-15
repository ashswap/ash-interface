export type ValueOf<T> = T[keyof T];
export type PropName<T> = keyof T;
export type Unarray<T> = T extends Array<infer U> ? U : T;
