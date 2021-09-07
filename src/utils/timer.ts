export const sleep = (seconds?: number) => new Promise((resolve) => setTimeout(resolve, (seconds || 1) * 1000));
export const delay = (timeout: number, result?: any ) => new Promise(resolve => setTimeout(() => resolve(result), timeout));
