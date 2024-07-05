import md5 from "js-md5";

/**
 * MD5
 * @param {object}
 * @returns {string}
 */
export function sortString(obj) {
    // sort a-z
    const sortData = Object.keys(obj)
        .sort()
        .reduce((pre, cur) => {
            pre[cur] = obj[cur];
            return pre;
        }, {});
    const result = Object.keys(sortData)
        .reduce((pre, cur) => {
            pre.push(`${cur}=${sortData[cur]}`);
            return pre;
        }, [])
        .join("");
    return result;
}

/**
 * MD5 + SHA512
 */
export function MD5SHA512(obj) {
    const resultString = sortString(obj) + `key=${import.meta.env.VITE_MD5_KEY}`;
    // md5 Chinese encoding problem
    const enResultString = encodeURIComponent(resultString, "utf-8").replace(/'/g, "%27").replace('*', '%2A');
    const MD5string = md5(enResultString);
    return MD5string;
}

/**
 * querystring to obj
 * @param {string}
 * @return {obj}
 */
export function str2Obj(string) {
    if (!string) {
        return {};
    }
    let obj = {};
    let arr = string.split("&");
    arr.forEach((v) => {
        obj[v.split("=")[0]] = v.split("=")[1];
    });
    return obj;
}