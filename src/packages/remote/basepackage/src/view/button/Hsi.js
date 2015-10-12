/* Copyright (c) 2015 terrestris GmbH & Co. KG
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
 *      _                             _        _
 *    _| |_ ___  _ _  _ _  ___  ___ _| |_ _ _ <_> ___
 *     | | / ._>| '_>| '_>/ ._><_-<  | | | '_>| |<_-<
 *     |_| \___.|_|  |_|  \___./__/  |_| |_|  |_|/__/
 *
 *   _                                 _
 *  | |_  ___  ___ ___  ___  ___  ___ | |__ ___  ___  ___
 *  | . \<_> |<_-</ ._>| . \<_> |/ | '| / /<_> |/ . |/ ._>
 *  |___/<___|/__/\___.|  _/<___|\_|_.|_\_\<___|\_. |\___.
 *                     |_|                      <___'
 *
 * ZoomIn Button
 *
 * Button used to zoom in
 *
 */
Ext.define("Basepackage.view.button.Hsi", {
    extend: "Ext.button.Button",
    xtype: 'base-button-hsi',

    /**
     *
     */
    viewModel: {
        data: {
            tooltip: 'Informationsabfrage',
            text: null
        }
    },

    bind: {
        text: '{text}',
        tooltip: '{tooltip}'
    },

    glyph: 'xf05a@FontAwesome',

    enableToggle: true,
    pressed: true,

    initComponent: function(){
        this.callParent([arguments]);
        this.setControlStatus(this.pressed);
    },

   toggleHandler: function(button){
       this.setControlStatus(button.pressed);
   },

   setControlStatus: function(status){
       var mapComponent = Ext.ComponentQuery.query('base-component-map')[0];
       mapComponent.setPointerRest(status);
   }

});
