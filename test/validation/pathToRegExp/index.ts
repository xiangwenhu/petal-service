import { hasPathParams, pathToUrl } from "../../../src/util/path";



function test(url: string, params: Record<string, string> = {}) {
    console.log("hasPathParams:", hasPathParams(url));
    console.log('replaced url:', pathToUrl(url, params));
}

// test('https://aaa/user/{id}/:month', {
//     id: 'id10',
//     month: 'm10'
// });

// test('/{id}/:month', {
//     id: 'id10',
//     month: 'm10'
// });

test('', {
    id: 'id10',
    month: 'm10'
});
