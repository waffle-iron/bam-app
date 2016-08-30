angular.module('starter')
        .factory('Base64ModuloFactory',
                function () {

                    var services = {};

                    services.encode = function (stringToEncode) {

                        if (typeof window !== 'undefined') {
                            if (typeof window.btoa !== 'undefined') {
                                return window.btoa(escape(encodeURIComponent(stringToEncode)))
                            }
                        } else {
                            return new Buffer(stringToEncode).toString('base64')
                        }

                        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
                        var o1
                        var o2
                        var o3
                        var h1
                        var h2
                        var h3
                        var h4
                        var bits
                        var i = 0
                        var ac = 0
                        var enc = ''
                        var tmpArr = []

                        if (!stringToEncode) {
                            return stringToEncode
                        }

                        stringToEncode = unescape(encodeURIComponent(stringToEncode))

                        do {
                            // pack three octets into four hexets
                            o1 = stringToEncode.charCodeAt(i++)
                            o2 = stringToEncode.charCodeAt(i++)
                            o3 = stringToEncode.charCodeAt(i++)

                            bits = o1 << 16 | o2 << 8 | o3

                            h1 = bits >> 18 & 0x3f
                            h2 = bits >> 12 & 0x3f
                            h3 = bits >> 6 & 0x3f
                            h4 = bits & 0x3f

                            // use hexets to index into b64, and append result to encoded string
                            tmpArr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4)
                        } while (i < stringToEncode.length)

                        enc = tmpArr.join('')

                        var r = stringToEncode.length % 3

                        return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3)
                    };

                    services.base64_decode = function (encodedData) {

                        if (typeof window !== 'undefined') {
                            if (typeof window.atob !== 'undefined') {
                                return decodeURIComponent(unescape(window.atob(encodedData)))
                            }
                        } else {
                            return new Buffer(encodedData, 'base64').toString('utf-8')
                        }

                        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
                        var o1
                        var o2
                        var o3
                        var h1
                        var h2
                        var h3
                        var h4
                        var bits
                        var i = 0
                        var ac = 0
                        var dec = ''
                        var tmpArr = []

                        if (!encodedData) {
                            return encodedData
                        }

                        encodedData += ''

                        do {
                            // unpack four hexets into three octets using index points in b64
                            h1 = b64.indexOf(encodedData.charAt(i++))
                            h2 = b64.indexOf(encodedData.charAt(i++))
                            h3 = b64.indexOf(encodedData.charAt(i++))
                            h4 = b64.indexOf(encodedData.charAt(i++))

                            bits = h1 << 18 | h2 << 12 | h3 << 6 | h4

                            o1 = bits >> 16 & 0xff
                            o2 = bits >> 8 & 0xff
                            o3 = bits & 0xff

                            if (h3 === 64) {
                                tmpArr[ac++] = String.fromCharCode(o1)
                            } else if (h4 === 64) {
                                tmpArr[ac++] = String.fromCharCode(o1, o2)
                            } else {
                                tmpArr[ac++] = String.fromCharCode(o1, o2, o3)
                            }
                        } while (i < encodedData.length)

                        dec = tmpArr.join('')

                        return decodeURIComponent(escape(dec.replace(/\0+$/, '')))
                    };

                    return services;
                }
        );
