'use strict';

const vscode = require('vscode');
const htmlEncode = require('js-htmlencode').htmlEncode;
const removeMarkdown = require('remove-markdown');
const striptags = require('striptags');

const validHtmlClass = /^[a-z][a-z0-9_-]*$/i;

function activate(context) {

    const configuration = vscode.workspace.getConfiguration('markdownAutoTOC');

    const options = buildMarkdownItTableOfContentsOptions(configuration);

    return {
        extendMarkdownIt(md) {
            return md.use(require('markdown-it-table-of-contents'), options);
        }
    };
}
exports.activate = activate;

function buildMarkdownItTableOfContentsOptions(configuration) {
    var options = {};

    options["includeLevel"] = buildIncludeLevelOptionFromConfiguration(configuration);
    options["containerClass"] = buildContainerClassOptionFromConfiguration(configuration);
    options["containerHeaderHtml"] = buildContainerHeaderHtmlOptionFromConfiguration(configuration);
    options["markerPattern"] = buildMarkerPatternOptionFromConfiguration(configuration);
    options["format"] = sanitizeHeading;

    return options;
}

function buildIncludeLevelOptionFromConfiguration(configuration) {
    return Array.from({length: configuration.maximumHeadingLevel}, (v, k) => k + 1);
}

function buildContainerClassOptionFromConfiguration(configuration) {
    return validHtmlClass.test(configuration.containerClass) ? configuration.containerClass : "toc-container";
}

function buildContainerHeaderHtmlOptionFromConfiguration(configuration) {
    var option = undefined;
    if (configuration.header) {
        var headerClass = validHtmlClass.test(configuration.headerClass) ? configuration.headerClass : "toc-container-header";
        option = `<div class="${headerClass}">${htmlEncode(configuration.headerContent)}</div>`;
    }
    return option;
}

function buildMarkerPatternOptionFromConfiguration(configuration) {
    var token = configuration.enableAzureDevOpsWikiCompatibility ? "(toc|_toc_)" : "toc";
    return new RegExp(`^\\[\\[${token}\\]\\]`, "im");
}

function sanitizeHeading(heading) {
    return removeMarkdown(striptags(heading));
}