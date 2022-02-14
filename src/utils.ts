import { bridgeSend } from "./messages";

export const history = window.history
export const pushState = history.pushState

export const getFavicon = function () {
  let favicon
  const nodeList = document.getElementsByTagName("link")
  for (let i = 0; i < nodeList.length; i++) {
    const rel = nodeList[i].getAttribute("rel")
    if (rel === "icon" || rel === "shortcut icon") {
      favicon = nodeList[i]
    }
  }
  return favicon && favicon.href
}

export function qrCodeResponse (data: any, callback: any) {
  const result = data.data
  const regex = new RegExp(callback.regex)
  if (!result) {
    if (callback.reject) {
      callback.reject(new Error("Cancelled"))
    }
  } else if (regex.test(result)) {
    if (callback.resolve) {
      callback.resolve(result)
    }
  } else {
    if (callback.reject) {
      callback.reject(new Error("Doesn't match"))
    }
  }
}

history.pushState = function (state) {
  setTimeout(function () {
    bridgeSend({
      type: 'history-state-changed',
      navState: { url: location.href, title: document.title, icon: getFavicon(), canGoBack: history.length }
    })
  }, 100)
  return pushState.apply(history, arguments as any)
}