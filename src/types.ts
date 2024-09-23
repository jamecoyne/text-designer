export interface Color {
    r: number,
    g: number,
    b: number,
}

export type jsonValue = rawValues | Color | string

export type jsonStructure = Record<string, jsonValue>

export type rawValues = string[]