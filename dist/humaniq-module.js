
const $fab42eb3dee39b5b$export$55abd4691b317664 = window.history;
const $fab42eb3dee39b5b$export$ba0fd82af7b4fe6e = $fab42eb3dee39b5b$export$55abd4691b317664.pushState;
const $fab42eb3dee39b5b$export$30c2a0095db95d06 = function() {
    let favicon;
    const nodeList = document.getElementsByTagName("link");
    for(let i = 0; i < nodeList.length; i++){
        const rel = nodeList[i].getAttribute("rel");
        if (rel === "icon" || rel === "shortcut icon") favicon = nodeList[i];
    }
    return favicon && favicon.href;
};
function $fab42eb3dee39b5b$export$62d5ab75f7bffae3(data, callback) {
    const result = data.data;
    const regex = new RegExp(callback.regex);
    if (!result) {
        if (callback.reject) callback.reject(new Error("Cancelled"));
    } else if (regex.test(result)) {
        if (callback.resolve) callback.resolve(result);
    } else if (callback.reject) callback.reject(new Error("Doesn't match"));
}
$fab42eb3dee39b5b$export$55abd4691b317664.pushState = function(state) {
    setTimeout(function() {
        $dc2966de588d0343$export$c4e279a88e6f5a80({
            type: 'history-state-changed',
            navState: {
                url: location.href,
                title: document.title,
                icon: $fab42eb3dee39b5b$export$30c2a0095db95d06(),
                canGoBack: $fab42eb3dee39b5b$export$55abd4691b317664.length
            }
        });
    }, 100);
    return $fab42eb3dee39b5b$export$ba0fd82af7b4fe6e.apply($fab42eb3dee39b5b$export$55abd4691b317664, arguments);
};



const $dc2966de588d0343$export$c4e279a88e6f5a80 = function(data) {
    window.ReactNativeWebView ? window.ReactNativeWebView.postMessage(JSON.stringify(data)) : window.postMessage(JSON.stringify(data));
};
class $dc2966de588d0343$export$3ec1ce42a7e09129 extends Error {
    constructor(...args){
        super(...args);
        this.name = "Unauthorized";
        this.id = 4100;
        this.code = 4100;
        this.message = "The requested method and/or account has not been authorized by the user.";
    }
}
class $dc2966de588d0343$export$3bee5a6718626f58 extends Error {
    constructor(...args){
        super(...args);
        this.name = "UserRejectedRequest";
        this.id = 4001;
        this.code = 4001;
        this.message = "The user rejected the request.";
    }
}
function $dc2966de588d0343$export$6ffaaff3791e4fb3(payload, result) {
    return {
        id: payload.id,
        jsonrpc: "2.0",
        result: result
    };
}
window.ReactNativeWebView.onMessage = function(message) {
    const data = JSON.parse(message);
    const id = data.messageId;
    const callback = $149c1bd638913645$export$b89c5c1b934d8237[id];
    if (data.type === 'getPageInfo') {
        $dc2966de588d0343$export$c4e279a88e6f5a80({
            type: 'history-state-changed',
            navState: {
                url: location.href,
                title: document.title,
                icon: $fab42eb3dee39b5b$export$30c2a0095db95d06(),
                canGoBack: window.history.length
            }
        });
        return;
    }
    if (data.type === 'accountsChanged') window.ethereum.emit("accountsChanged", data.data);
    if (data.type === 'networkChanged') window.ethereum.emit("networkChanged", data.data);
    if (callback) {
        if (data.type === "api-response") {
            if (data.permission === 'qr-code') $fab42eb3dee39b5b$export$62d5ab75f7bffae3(data, callback);
            else if (data.isAllowed) {
                if (data.permission === 'web3') {
                    const selectedAddress = data.data[0];
                    window.humaniqAppcurrentAccountAddress = selectedAddress;
                    // Set deprecated metamask fields
                    window.ethereum.selectedAddress = selectedAddress;
                    window.ethereum.emit("accountsChanged", data.data);
                    $dc2966de588d0343$export$c4e279a88e6f5a80({
                        type: "set-web3",
                        data: data.data
                    });
                }
                callback.resolve(data.data);
            } else {
                $dc2966de588d0343$export$c4e279a88e6f5a80({
                    type: "user-reject-request",
                    data: data
                });
                callback.reject(new $dc2966de588d0343$export$3bee5a6718626f58());
            }
        } else if (data.type === "web3-send-async-callback") {
            if (callback.beta) {
                if (data.error) {
                    if (data.error.code === 4100) callback.reject(new $dc2966de588d0343$export$3ec1ce42a7e09129());
                    else callback.reject(data.error);
                } else callback.resolve(data.result.result);
            } else if (callback.results) {
                callback.results.push(data.error || data.result);
                if (callback.results.length == callback.num) callback.callback(undefined, callback.results);
            } else callback.callback(data.error, data.result);
        }
    }
};
const $dc2966de588d0343$export$bfd39fdfb84f21cc = (payload)=>{
    if (payload.method == "eth_accounts" && typeof window.humaniqAppcurrentAccountAddress !== "undefined") return $dc2966de588d0343$export$6ffaaff3791e4fb3(payload, [
        window.humaniqAppcurrentAccountAddress
    ]);
    else if (payload.method == "eth_coinbase" && typeof window.humaniqAppcurrentAccountAddress !== "undefined") return $dc2966de588d0343$export$6ffaaff3791e4fb3(payload, window.humaniqAppcurrentAccountAddress);
    else if (payload.method == "net_version" || payload.method == "eth_chainId") return $dc2966de588d0343$export$6ffaaff3791e4fb3(payload, window.humaniqAppNetworkId);
    else if (payload.method == "eth_uninstallFilter") return $dc2966de588d0343$export$6ffaaff3791e4fb3(payload, true);
    else return null;
};


let $149c1bd638913645$export$b2200e4c6a46d0b6 = 0;
let $149c1bd638913645$export$b89c5c1b934d8237 = {
};
function $149c1bd638913645$export$33845a8bc26fa336(permission, pars) {
    const messageId = $149c1bd638913645$export$b2200e4c6a46d0b6++;
    const params = pars || {
    };
    $dc2966de588d0343$export$c4e279a88e6f5a80({
        type: 'api-request',
        permission: permission,
        messageId: messageId,
        params: params
    });
    return new Promise(function(resolve, reject) {
        params['resolve'] = resolve;
        params['reject'] = reject;
        $149c1bd638913645$export$b89c5c1b934d8237[messageId] = params;
    });
}
class $149c1bd638913645$export$fb92d2d856d3013a {
    constructor(){
        this.getContactCode = ()=>{
            return $149c1bd638913645$export$33845a8bc26fa336('contact-code');
        };
    }
}
class $149c1bd638913645$export$cdfbbad9b2980226 {
    enable() {
        return $149c1bd638913645$export$33845a8bc26fa336('web3', {
            url: location.href
        });
    }
    scanQRCode(regex) {
        return $149c1bd638913645$export$33845a8bc26fa336('qr-code', {
            regex: regex
        });
    }
    constructor(){
        this.isHumaniq = true;
        this.isMetamask = true;
        this.humaniq = new $149c1bd638913645$export$fb92d2d856d3013a();
        this.isConnected = ()=>true
        ;
        this.networkVersion = window.humaniqAppNetworkId;
        this.chainId = "0x" + Number(window.humaniqAppNetworkId).toString(16);
        this.networkId = window.humaniqAppNetworkId;
        this.sendAsync = (payload, callback)=>{
            if (window.humaniqAppDebug) console.log("sendAsync (legacy)" + JSON.stringify(payload));
            if (!payload) return new Error('Request is not valid.');
            if (payload.method == 'eth_requestAccounts') return $149c1bd638913645$export$33845a8bc26fa336('web3', {
                url: location.href
            });
            var syncResponse = $dc2966de588d0343$export$bfd39fdfb84f21cc(payload);
            if (syncResponse && callback) callback(null, syncResponse);
            else {
                var messageId = $149c1bd638913645$export$b2200e4c6a46d0b6++;
                if (Array.isArray(payload)) {
                    $149c1bd638913645$export$b89c5c1b934d8237[messageId] = {
                        num: payload.length,
                        results: [],
                        callback: callback
                    };
                    for(var i in payload)$dc2966de588d0343$export$c4e279a88e6f5a80({
                        type: 'web3-send-async-read-only',
                        messageId: messageId,
                        payload: payload[i]
                    });
                } else {
                    $149c1bd638913645$export$b89c5c1b934d8237[messageId] = {
                        callback: callback
                    };
                    $dc2966de588d0343$export$c4e279a88e6f5a80({
                        type: 'web3-send-async-read-only',
                        messageId: messageId,
                        payload: payload
                    });
                }
            }
        };
        this.sendSync = (payload)=>{
            if (window.humaniqAppDebug) console.log("sendSync (legacy)" + JSON.stringify(payload));
            if (payload.method == "eth_uninstallFilter") this.sendAsync(payload, function(res, err) {
            });
            const syncResponse = $dc2966de588d0343$export$bfd39fdfb84f21cc(payload);
            if (syncResponse) return syncResponse;
            else return $dc2966de588d0343$export$6ffaaff3791e4fb3(payload, null);
        };
        this.request = (requestArguments)=>{
            try {
                if (!requestArguments) return new Error('Request is not valid.');
                const method = requestArguments.method;
                if (!method) return new Error('Request is not valid.');
                // Support for legacy send method
                if (typeof method !== 'string') return this.sendSync(method);
                if (method === 'eth_requestAccounts') return $149c1bd638913645$export$33845a8bc26fa336('web3', {
                    url: location.href
                });
                const syncResponse = $dc2966de588d0343$export$bfd39fdfb84f21cc({
                    method: method
                });
                if (syncResponse) return new Promise(function(resolve, reject) {
                    resolve(syncResponse.result);
                });
                const messageId = $149c1bd638913645$export$b2200e4c6a46d0b6++;
                const payload = {
                    id: messageId,
                    jsonrpc: "2.0",
                    method: method,
                    params: requestArguments.params
                };
                $dc2966de588d0343$export$c4e279a88e6f5a80({
                    type: 'web3-send-async-read-only',
                    messageId: messageId,
                    payload: payload,
                    meta: {
                        url: location.href
                    }
                });
                return new Promise(function(resolve, reject) {
                    $149c1bd638913645$export$b89c5c1b934d8237[messageId] = {
                        beta: true,
                        resolve: resolve,
                        reject: reject
                    };
                });
            } catch (e) {
                $dc2966de588d0343$export$c4e279a88e6f5a80({
                    error: e
                });
            }
        };
        this.send = (method, params = [])=>{
            if (window.humaniqAppDebug) console.log("send (legacy): " + method);
            return this.request({
                method: method,
                params: params
            });
        };
        this._events = {
        };
        this.on = (name, listener)=>{
            if (!this._events[name]) this._events[name] = [];
            this._events[name].push(listener);
        };
        this.removeListener = (name, listenerToRemove)=>{
            if (!this._events[name]) return;
            const filterListeners = (listener)=>listener !== listenerToRemove
            ;
            this._events[name] = this._events[name].filter(filterListeners);
        };
        this.removeAllListeners = ()=>{
            this._events = [];
        };
        this.emit = (name, data)=>{
            if (!this._events[name]) return;
            this._events[name].forEach((cb)=>cb(data)
            );
        };
    }
}
window.ethereum = new $149c1bd638913645$export$cdfbbad9b2980226();


export {$149c1bd638913645$export$b2200e4c6a46d0b6 as callbackId, $149c1bd638913645$export$b89c5c1b934d8237 as callbacks, $149c1bd638913645$export$33845a8bc26fa336 as sendAPIrequest, $149c1bd638913645$export$fb92d2d856d3013a as HumaniqAPI, $149c1bd638913645$export$cdfbbad9b2980226 as EthereumProvider};
//# sourceMappingURL=humaniq-module.js.map
