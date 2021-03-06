/*───────────────────────────────────────────────────────────────────────────*\
 │  Copyright (C) 2015 eBay Software Foundation                                │
 │                                                                             │
 │hh ,'""`.                                                                    │
 │  / _  _ \  Licensed under the Apache License, Version 2.0 (the "License");  │
 │  |(@)(@)|  you may not use this file except in compliance with the License. │
 │  )  __  (  You may obtain a copy of the License at                          │
 │ /,'))((`.\                                                                  │
 │(( ((  )) ))    http://www.apache.org/licenses/LICENSE-2.0                   │
 │ `\ `)(' /'                                                                  │
 │                                                                             │
 │   Unless required by applicable law or agreed to in writing, software       │
 │   distributed under the License is distributed on an "AS IS" BASIS,         │
 │   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  │
 │   See the License for the specific language governing permissions and       │
 │   limitations under the License.                                            │
 \*───────────────────────────────────────────────────────────────────────────*/
'use strict';

var path = require('path');
var iferr = require('iferr');
var spundle = require('spundle');
var moduleBuilder = function (appRoot, m, cb) {
    spundle(path.resolve(appRoot, 'locales'), m[2], m[1], iferr(cb, function (out) {
        cb(null, 'define("_languagepack", function () { return ' + JSON.stringify(out) + '; });');
    }));
};
module.exports = function (options) {

    options.precompile = function (options, cb) {
        options.skipRead = true;
        cb(null, options);
    };
    return function (data, args, callback) {
        var locale = /(.*)-(.*)/.exec(args.context.filePath.substr(1,5));
        if (!locale || locale.length !== 3) {
            return callback(new Error('The locale part xx-XX was not found in the filePath'));
        }
        moduleBuilder(args.i18n.contentPath, locale, function (err, out) {
           if (err !== null) {
               return callback(err);
           }
            callback(null, out);
        });

    };


};