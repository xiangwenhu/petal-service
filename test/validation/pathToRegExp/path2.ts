

const url = `https://example:9980/user/{id}/{month}`;


function convertUrl(url: string) {
    return url.replace(/{(\w+)}/g, ':$1');
}


console.log(convertUrl(url));