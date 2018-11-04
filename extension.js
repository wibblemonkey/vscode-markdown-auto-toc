'use strict';

const vscode = require('vscode');

function activate(context) {
    return {
        extendMarkdownIt(md) {
            return md.use(require('markdown-it-table-of-contents'));
        }
    };
}
exports.activate = activate;
