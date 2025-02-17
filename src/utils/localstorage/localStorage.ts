export const setLocalStorage = (key: string, value: any): void => {
    if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
    } else {
        console.warn("localStorage is not available in this environment.");
    }
};

export const getLocalStorage = (key: string): any => {
    if (typeof window !== "undefined") {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } else {
        console.warn("localStorage is not available in this environment.");
        return null;
    }
};

export const removeLocalStorage = (key: string): void => {
    if (typeof window !== "undefined") {
        localStorage.removeItem(key);
    } else {
        console.warn("localStorage is not available in this environment.");
    }
};
