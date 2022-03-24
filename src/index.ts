import { bridgeSend, getSyncResponse, web3Response } from "./messages";

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage(msg: string): void;
      onMessage(msg: string): void
    };
    ethereum: any,
    humaniqAppcurrentAccountAddress: string
    humaniqAppNetworkId: number
    humaniqAppDebug: boolean
  }
}

export let callbackId = 0
export let callbacks: { [key: number]: any } = {}

export function sendAPIrequest(permission: string, pars?: any) {
  const messageId = callbackId++
  const params = pars || {}

  bridgeSend({
    type: 'api-request',
    permission: permission,
    messageId: messageId,
    params: params
  })

  return new Promise(function (resolve, reject: any) {
    params['resolve'] = resolve
    params['reject'] = reject
    callbacks[messageId] = params
  })
}

export class HumaniqAPI {
  getContactCode = () => {
    return sendAPIrequest('contact-code')
  }
}

export class EthereumProvider {
  isHumaniq = true
  isMetamask = true
  humaniq = new HumaniqAPI()
  isConnected = () => true

  networkVersion = window.humaniqAppNetworkId
  chainId = "0x" + Number(window.humaniqAppNetworkId).toString(16)
  networkId = window.humaniqAppNetworkId


  enable() {
    return sendAPIrequest('web3', { url: location.href })
  }

  scanQRCode(regex: string) {
    return sendAPIrequest('qr-code', { regex: regex })
  }

  sendAsync = (payload: any, callback: any) => {
    if (window.humaniqAppDebug) {
      console.log("sendAsync (legacy)" + JSON.stringify(payload))
    }
    if (!payload) {
      return new Error('Request is not valid.')
    }
    if (payload.method == 'eth_requestAccounts') {
      return sendAPIrequest('web3', { url: location.href })
    }
    var syncResponse = getSyncResponse(payload)
    if (syncResponse && callback) {
      callback(null, syncResponse)
    } else {
      var messageId = callbackId++

      if (Array.isArray(payload)) {
        callbacks[messageId] = {
          num: payload.length,
          results: [],
          callback: callback
        }
        for (var i in payload) {
          bridgeSend({
            type: 'web3-send-async-read-only',
            messageId: messageId,
            payload: payload[i]
          })
        }
      } else {
        callbacks[messageId] = { callback: callback }
        bridgeSend({
          type: 'web3-send-async-read-only',
          messageId: messageId,
          payload: payload
        })
      }
    }
  }

  sendSync = (payload: any) => {
    if (window.humaniqAppDebug) {
      console.log("sendSync (legacy)" + JSON.stringify(payload))
    }
    if (payload.method == "eth_uninstallFilter") {
      this.sendAsync(payload, function (res: any, err: any) {
      })
    }
    const syncResponse = getSyncResponse(payload)
    if (syncResponse) {
      return syncResponse
    } else {
      return web3Response(payload, null)
    }
  }

  request = (requestArguments: any) => {
    try {
      if (!requestArguments) {
        return new Error('Request is not valid.')
      }
      const method = requestArguments.method

      if (!method) {
        return new Error('Request is not valid.')
      }

      // Support for legacy send method
      if (typeof method !== 'string') {
        return this.sendSync(method)
      }

      if (method === 'eth_requestAccounts') {
        return sendAPIrequest('web3', { url: location.href })
      }

      const syncResponse = getSyncResponse({ method: method })
      if (syncResponse) {
        return new Promise(function (resolve, reject) {
          resolve(syncResponse.result)
        })
      }

      const messageId = callbackId++
      const payload = {
        id: messageId,
        jsonrpc: "2.0",
        method: method,
        params: requestArguments.params
      }

      bridgeSend({
        type: 'web3-send-async-read-only',
        messageId: messageId,
        payload: payload,
        meta: {
          url: location.href
        }
      })

      return new Promise(function (resolve, reject) {
        callbacks[messageId] = {
          beta: true,
          resolve: resolve,
          reject: reject
        }
      })
    } catch (e) {
      bridgeSend({ error: e })
    }
  }

  send = (method: any, params = []) => {
    if (window.humaniqAppDebug) {
      console.log("send (legacy): " + method)
    }
    return this.request({ method: method, params: params })
  }
  _events: any = {}
  on = (name: any, listener: any) => {
    if (!this._events[name]) {
      this._events[name] = []
    }
    this._events[name].push(listener)
  }

  removeListener = (name: any, listenerToRemove: any) => {
    if (!this._events[name]) {
      return
    }

    const filterListeners = (listener: any) => listener !== listenerToRemove
    this._events[name] = this._events[name].filter(filterListeners)
  }
  emit = (name: any, data: any) => {
    if (!this._events[name]) {
      return
    }
    this._events[name].forEach((cb: any) => cb(data))
  }
}

window.ethereum = new EthereumProvider()





