import JSZip from 'jszip';
import { DOMParser } from 'xmldom';
import { XMLSerializer } from 'xmldom';

import { prepareStyles, mergeStyles, generateStyles } from './merge-styles';
import { prepareMediaFiles, copyMediaFiles } from './merge-media';
import {
    mergeContentTypes,
    mergeRelations,
    generateContentTypes,
    generateRelations,
} from './merge-relations-and-content-type';
import { prepareNumbering, mergeNumbering, generateNumbering } from './merge-bullets-numberings';

function DocxMerger(options, files) {
    this._body = [];
    this._header = [];
    this._footer = [];
    this._Basestyle = options.style || 'source';
    this._style = [];
    this._numbering = [];
    this._pageBreak = typeof options.pageBreak !== 'undefined' ? !!options.pageBreak : true;
    this._files = [];
    var self = this;
    (files || []).forEach(function (file) {
        self._files.push(new JSZip(file));
    });
    this._contentTypes = [];

    this._media = {};
    this._rel = {};

    this._builder = this._body;

    this.insertPageBreak = function () {
        var pb =
            '<w:p> \
					<w:r> \
						<w:br w:type="page"/> \
					</w:r> \
				  </w:p>';

        this._builder.push(pb);
    };

    this.insertRaw = function (xml) {
        this._builder.push(xml);
    };

    this.mergeBody = function (files) {
        var self = this;
        this._builder = this._body;

        mergeContentTypes(files, this._contentTypes);
        prepareMediaFiles(files, this._media);
        mergeRelations(files, this._rel);

        prepareNumbering(files);
        mergeNumbering(files, this._numbering);

        prepareStyles(files, this._style);
        mergeStyles(files, this._style);

        files.forEach(function (zip, index) {
            //var zip = new JSZip(file);
            var xml = zip.file('word/document.xml').asText();
            xml = xml.substring(xml.indexOf('<w:body>') + 8);
            xml = xml.substring(0, xml.indexOf('</w:body>'));
            // xml = xml.substring(0, xml.lastIndexOf("<w:sectPr"));

            self.insertRaw(xml);
            if (self._pageBreak && index < files.length - 1) self.insertPageBreak();
        });
    };

    this.save = function (type, callback) {
        var zip = this._files[0];

        var xml = zip.file('word/document.xml').asText();
        var startIndex = xml.indexOf('<w:body>') + 8;
        var endIndex = xml.lastIndexOf('</w:body>');

        xml = xml.replace(xml.slice(startIndex, endIndex), this._body.join(''));

        generateContentTypes(zip, this._contentTypes);
        copyMediaFiles(zip, this._media, this._files);
        generateRelations(zip, this._rel);
        generateNumbering(zip, this._numbering);
        generateStyles(zip, this._style);

        zip.file('word/document.xml', xml);

        callback(
            zip.generate({
                type: type,
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 4,
                },
            }),
        );
    };

    if (this._files.length > 0) {
        this.mergeBody(this._files);
    }
}

export default DocxMerger;
