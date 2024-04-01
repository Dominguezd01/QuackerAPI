export function getViewsDir() {
    let routeSplited = __dirname.split("/")
    routeSplited[routeSplited.length - 1] = "views/"
    return routeSplited.join("/")
}
