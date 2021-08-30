import { Dialog } from 'puppeteer';

export const getChromeExecutablePath = () => {
    switch (process.platform) {
        case "win32":
            // return 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
            return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
        case "darwin":
            return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
        case "linux":
            return '/usr/bin/chromium-browser';
        default:
            return undefined
            // throw new Error(`Unsupported Platform: ${process.platform}`);
    }
}

export type DialogEvent = {
    type: "alert" | "confirm" | "prompt" | "beforeunload";
    message: string;
    accept?: string;
    dismiss?: boolean;
    result?: boolean | string | null | undefined
}

export const answerDialog = async (dialog: DialogEvent, target: Dialog) => {
    let result: DialogEvent['result'];
    if( dialog?.accept !== undefined ) {
        await target.accept(dialog.accept);
        switch (dialog.type) {
            case 'confirm':
                result = true;
                break;
            case 'prompt':
                result = await target.defaultValue();
                break;
            default:
                result = undefined;
        }
    } else {
        await target.dismiss();
        switch (dialog.type) {
            case 'confirm':
                result = false;
                break
            case 'prompt':
                result = null
                break;
            default:
                result = undefined;
        }
    }

    return result;
}
