import { XMLSerializer } from 'xmldom';
import { DOMParser } from 'xmldom';

export const prepareNumbering = function (files) {
    var serializer = new XMLSerializer();

    files.forEach(function (zip, index) {
        var xmlBin = zip.file('word/numbering.xml');
        if (!xmlBin) {
            return;
        }
        var xmlString = xmlBin.asText();
        var xml = new DOMParser().parseFromString(xmlString, 'text/xml');

        var startIndex = xmlString.indexOf('<w:numbering ');

        xmlString = xmlString.replace(xmlString.slice(startIndex), serializer.serializeToString(xml.documentElement));

        zip.file('word/numbering.xml', xmlString);
    });
};

export const mergeNumbering = function (files, _numbering) {
    // this._builder = this._style;

    // console.log("MERGE__STYLES");

    files.forEach(function (zip) {
        var xmlBin = zip.file('word/numbering.xml');
        if (!xmlBin) {
            return;
        }
        var xml = xmlBin.asText();

        xml = xml.substring(xml.indexOf('<w:abstractNum '), xml.indexOf('</w:numbering'));

        _numbering.push(xml);
    });
};

export const generateNumbering = function (zip, _numbering) {
    var xmlBin = zip.file('word/numbering.xml');
    if (!xmlBin) {
        return;
    }
    var xml = xmlBin.asText();
    var startIndex = xml.indexOf('<w:abstractNum ');
    var endIndex = xml.indexOf('</w:numbering>');

    // console.log(xml.substring(startIndex, endIndex))

    xml = xml.replace(xml.slice(startIndex, endIndex), _numbering.join(''));

    // console.log(xml.substring(xml.indexOf("</w:docDefaults>")+16, xml.indexOf("</w:styles>")))
    // console.log(this._style.join(''))
    // console.log(xml)

    zip.file('word/numbering.xml', xml);
};
