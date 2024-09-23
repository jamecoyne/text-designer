import { Color, rawValues } from "./types";


export function rawToColor(raw_values: rawValues):Color {
    const color_vals = raw_values.map(v => parseFloat(v));
    // TODO: add error handling here to check array length
    return ({
        r: color_vals[0],
        g: color_vals[1],
        b: color_vals[2],
    })
}

export function rawToString(raw_values: rawValues): string {
    return raw_values.join(" ");
}