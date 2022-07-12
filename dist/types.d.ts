declare global {
    interface Window {
        ReactNativeWebView: {
            postMessage(msg: string): void;
            onMessage(msg: string): void;
        };
        ethereum: any;
        humaniqAppcurrentAccountAddress: string;
        humaniqAppNetworkId: number;
        humaniqAppDebug: boolean;
    }
}
export let callbackId: number;
export let callbacks: {
    [key: number]: any;
};
export function sendAPIrequest(permission: string, pars?: any): Promise<unknown>;
export class HumaniqAPI {
    getContactCode: () => Promise<unknown>;
}
export class EthereumProvider {
    isHumaniq: boolean;
    isMetamask: boolean;
    humaniq: HumaniqAPI;
    isConnected: () => boolean;
    networkVersion: number;
    chainId: string;
    networkId: number;
    enable(): Promise<unknown>;
    scanQRCode(regex: string): Promise<unknown>;
    sendAsync: (payload: any, callback: any) => Error | Promise<unknown> | undefined;
    sendSync: (payload: any) => {
        id: any;
        jsonrpc: string;
        result: any;
    };
    request: (requestArguments: any) => Error | {
        id: any;
        jsonrpc: string;
        result: any;
    } | Promise<unknown> | undefined;
    send: (method: any, params?: never[]) => Error | {
        id: any;
        jsonrpc: string;
        result: any;
    } | Promise<unknown> | undefined;
    _events: any;
    on: (name: any, listener: any) => void;
    removeListener: (name: any, listenerToRemove: any) => void;
    removeAllListeners: () => void;
    emit: (name: any, data: any) => void;
}

//# sourceMappingURL=types.d.ts.map
