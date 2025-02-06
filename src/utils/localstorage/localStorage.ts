export const setLocalStorage = (key: string, value: any): void => {
    if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
    } else {
        console.warn("localStorage is not available in this environment.");
    }
};