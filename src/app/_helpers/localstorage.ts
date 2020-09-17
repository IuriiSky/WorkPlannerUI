export function get(value: string) {
    if (typeof localStorage !== 'undefined' && localStorage.getItem(value)) {
        return JSON.parse(localStorage.getItem(value) || "");
    }
}
export function set(value: string, data: any) {
    if (data === null || data === undefined || data === '') {
        remove(value);
    }
    else if (typeof localStorage !== 'undefined') {
        return localStorage.setItem(value, JSON.stringify(data));
    }
}

export function remove(value: string) {
    if (typeof localStorage !== 'undefined') {
        delete localStorage[value];
    }
}
