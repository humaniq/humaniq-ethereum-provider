import { getFavicon, qrCodeResponse } from "./utils";
import { callbacks } from "./index";

export const bridgeSend = function (data: any) {
    window.ReactNativeWebView ? window.ReactNativeWebView.postMessage(JSON.stringify(data)) : window.postMessage(JSON.stringify(data))
}

export class Unauthorized extends Error {
    name = "Unauthorized"
    id = 4100
    code = 4100
    message = "The requested method and/or account has not been authorized by the user."
}

export class UserRejectedRequest extends Error {
    name = "UserRejectedRequest"
    id = 4001
    code = 4001
    message = "The user rejected the request."
}

export function web3Response(payload: any, result: any) {
    return {
        id: payload.id,
        jsonrpc: "2.0",
        result: result
    }
}

export interface DATA {
    messageId: number
    type: string,
    isAllowed?: boolean,
    data: any,
    permission?: string,
    error: any,
    result: any
}

window.ReactNativeWebView.onMessage = function (message: any) {

    const data: DATA = JSON.parse(message)
    const id = data.messageId
    const callback = callbacks[id]

    if (data.type === 'getPageInfo') {
        bridgeSend({
            type: 'history-state-changed',
            navState: {
                url: location.href,
                title: document.title,
                icon: getFavicon(),
                canGoBack: window.history.length
            }
        })
        return
    }

    if (data.type === 'accountsChanged') {
        window.ethereum.emit("accountsChanged", data.data)
    }
    if (data.type === 'networkChanged') {
        window.ethereum.networkVersion = data.data
        window.ethereum.chainId = "0x" + Number(data.data).toString(16)
        window.ethereum.networkId = data.data
        window.ethereum.emit("networkChanged", data.data)
    }

    if (data.type === 'chainChanged') {
        window.ethereum.networkVersion = data.data
        window.ethereum.chainId = "0x" + Number(data.data).toString(16)
        window.ethereum.networkId = data.data
        window.ethereum.emit("chainChanged", data.data)
    }

    if (callback) {
        if (data.type === "api-response") {
            if (data.permission === 'qr-code') {
                qrCodeResponse(data, callback)
            } else if (data.isAllowed) {
                if (data.permission === 'web3') {
                    const selectedAddress = data.data[0]
                    window.humaniqAppcurrentAccountAddress = selectedAddress
                    // Set deprecated metamask fields
                    window.ethereum.selectedAddress = selectedAddress
                    window.ethereum.emit("accountsChanged", data.data)
                    bridgeSend({ type: "set-web3", data: data.data })
                }
                callback.resolve(data.data)
            } else {
                bridgeSend({ type: "user-reject-request", data })
                callback.reject(new UserRejectedRequest())
            }
        } else if (data.type === "web3-send-async-callback") {
            if (callback.beta) {
                if (data.error) {
                    if (data.error.code === 4100)
                        callback.reject(new Unauthorized())
                    else
                        callback.reject(data.error)
                } else {
                    callback.resolve(data.result.result)
                }
            } else if (callback.results) {
                callback.results.push(data.error || data.result)
                if (callback.results.length == callback.num)
                    callback.callback(undefined, callback.results)
            } else {
                callback.callback(data.error, data.result)
            }
        }
    }
}

export const getSyncResponse = (payload: any) => {
    if (payload.method == "eth_accounts" && (typeof window.humaniqAppcurrentAccountAddress !== "undefined")) {
        return web3Response(payload, [ window.humaniqAppcurrentAccountAddress ])
    } else if (payload.method == "eth_coinbase" && (typeof window.humaniqAppcurrentAccountAddress !== "undefined")) {
        return web3Response(payload, window.humaniqAppcurrentAccountAddress)
    } else if (payload.method == "net_version" || payload.method == "eth_chainId") {
        return web3Response(payload, window.humaniqAppNetworkId)
    } else if (payload.method == "eth_uninstallFilter") {
        return web3Response(payload, true)
    } else {
        return null
    }
}

