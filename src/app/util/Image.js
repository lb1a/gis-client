/* Copyright (c) 2015-2016 terrestris GmbH & Co. KG
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @class Koala.util.Image
 */
Ext.define('Koala.util.Image', {

    statics: {

        svg2Datauri: function(svgNode) {
            var source = (new XMLSerializer()).serializeToString(svgNode);
            return 'data:image/svg+xml;base64,'+ btoa(unescape(encodeURIComponent(source)));
        },

        dom2Datauri: function(element, type) {
            switch (type) {
                case 'png':
                    return domtoimage.toPng(element);
                case 'svg':
                    return domtoimage.toSvg(element);
                default:
                    return domtoimage.toPng(element);
            }
        }
    }
});