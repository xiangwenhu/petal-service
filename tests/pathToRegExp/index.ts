import { hasPathParams, pathToUrl } from "../../src/util/path";

const pathValue = "https://aacosmma:9980/user/:id/:month";

console.log(hasPathParams(pathValue));

console.log(pathToUrl("https://aaa/user/:id/:month", {id: 10, month: 11}));

