import { WINDOWS } from "./Constants"

export function getViewsDir() {
    console.log(process.platform)
    let routeSplited
    if (process.platform == WINDOWS) {
        routeSplited = __dirname.split("\\")
        console.log(routeSplited)
        routeSplited[routeSplited.length - 1] = "views/"
        return routeSplited.join("\\")
    }
    routeSplited = __dirname.split("/")
    console.log(routeSplited)
    routeSplited[routeSplited.length - 1] = "views/"
    return routeSplited.join("/")
}
