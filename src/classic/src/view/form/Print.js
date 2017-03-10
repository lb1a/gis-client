/*global setTimeout*/
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
 * @class Koala.view.form.Print
 */
Ext.define("Koala.view.form.Print", {
    extend: "BasiGX.view.form.Print",
    xtype: "k-form-print",

    requires: [
        'BasiGX.util.Animate',

        'GeoExt.data.MapfishPrintProvider',
        'GeoExt.data.serializer.ImageWMS',
        'GeoExt.data.serializer.TileWMS',
        'GeoExt.data.serializer.Vector',
        'GeoExt.data.serializer.XYZ',

        'Koala.view.form.IrixFieldSet',
        'Koala.util.Object'
    ],

    maxHeight: null,
    maxWidth: 800,

    config: {
        // can be overriden via appContext.json: urls/irix-servlet
        irixUrl: '/irix-servlet',
        // can be overriden via appContext.json: print-timeout
        timeoutMilliseconds: 60000,
        // can be overriden via appContext.json: urls/print-transparent-img
        transparentImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Transparent.gif',
        transparentColor: 'rgba(0,0,0,0)',
        serverUploadSuccessTitle: '',
        serverUploadSuccess: '',
        serverErrorTitle: '',
        serverError: '',
        disablePopupBlockerTitle: '',
        disablePopupBlocker: '',
        printLegendsFieldSetTitle: '',
        unexpectedResponseTitle: '',
        unexpectedResponse: '',
        printButtonPrefix: '',
        downloadButtonSuffix: '',
        downloadOngoingMiddleText: '',
        warnPrintTimedOutTitle: '',
        warnPrintTimedOutText: ''
    },

    initComponent: function() {
        var me = this;
        me.callParent();

        /**
         * necessary to override the BasiGXs bind.
         */
        me.setBind();

        var appContext = BasiGX.view.component.Map.guess().appContext;
        if (appContext) {
            var configuredIrixServlet = Koala.util.Object.getPathStrOr(
                appContext, 'data/merge/urls/irix-servlet', false
            );
            var configuredPrintTimeout = Koala.util.Object.getPathStrOr(
                appContext, 'data/merge/print-timeout', false
            );
            var configuredTransparentImageUrl = Koala.util.Object.getPathStrOr(
                appContext, 'data/merge/urls/print-transparent-img', false
            );

            if (configuredIrixServlet) {
                me.setIrixUrl(configuredIrixServlet);
            }
            if (configuredPrintTimeout) {
                me.setTimeoutMilliseconds(configuredPrintTimeout);
            }
            if (configuredTransparentImageUrl) {
                me.setTransparentImageUrl(configuredTransparentImageUrl);
            }
        }

        var appCombo = me.down('combo[name=appCombo]');
        appCombo.setFieldLabel('Printapp');
        appCombo.on('select', me.addIrixFieldset, me);

        me.on('beforeattributefieldsadd', me.onBeforeAttributeFieldsAdd);
        me.on('attributefieldsadd', me.onAttributeFieldsAdd);

        me.setFixedCreatePrintBtnText();
    },

    listeners: {
        genericfieldsetadded: function() {
            this.addIrixCheckbox();
            this.addBboxFieldset();
        }
    },

    /**
     * @override Override to return an htmleditor instead of a textfield
     */
    getStringField: function(attributeRec) {
        return {
            xtype: 'textfield',
            name: attributeRec.get('name'),
            fieldLabel: attributeRec.get('name'),
            value: attributeRec.get('default'),
            allowBlank: true,
            listeners: {
                focus: this.onTextFieldFocus,
                scope: this
            }
        };
    },

    /**
     *
     */
    onTextFieldFocus: function(textfield) {
        Ext.create('Ext.window.Window', {
            title: textfield.getFieldLabel() + ' HTML',
            layout: 'fit',
            modal: true,
            autoShow: true,
            correspondingTextfield: textfield,
            items: [{
                xtype: 'htmleditor',
                value: textfield.getValue(),
                enableFont: false, // TODO Remove if fonts are configured to
                                   // match the server fonts,
                enableAlignments: false
            }],
            bbar: ['->',
            {
                xtype: 'button',
                text: 'OK',
                name: 'setValueButton',
                handler: function(button) {
                    var win = button.up('window');
                    var editor = win.down('htmleditor');
                    win.correspondingTextfield.setValue(editor.getValue());
                    win.close();
                }
            }]
        });
    },

    /**
     * Create a fieldset instead of an checkbox because we want to choose which
     * layerlegends we want to print and which not.
     * @override
     */
    getLegendAttributeFields: function() {
        var me = this;
        var legendsFieldset = Ext.create('Ext.form.FieldSet', {
            title: this.getPrintLegendsFieldSetTitle(),
            name: 'legendsFieldset',
            checkboxName: 'legendsFieldsetCheckBox',
            checkboxToggle: true
        });

        var treePanel = Ext.ComponentQuery.
                query('k-panel-routing-legendtree')[0];

        var listenerFunction = function() {
            me.updateLegendsFieldset(legendsFieldset);
        };

        var treeStore = treePanel.getStore();
        treeStore.on('update', listenerFunction);
        treeStore.on('datachange', listenerFunction);
        legendsFieldset.on('destroy', function() {
            treeStore.un('update', listenerFunction);
            treeStore.un('datachange', listenerFunction);
        });

        me.updateLegendsFieldset(legendsFieldset);

        return legendsFieldset;
    },

    /**
     * Filters the layer by properties or params. Used in getLegendObject.
     * This method can/should be overriden in the application.
     *
     * @param ol.layer
     */
    legendLayerFilter: function(layer) {
        var fsSelector = 'fieldset[name="legendsFieldset"]';
        var cbSelector = 'checkbox[name='+layer.get('name')+'_visible]';
        var legendFieldset = Ext.ComponentQuery.query(fsSelector)[0];
        var layerCheckbox = legendFieldset.down(cbSelector);

        if (layerCheckbox && !legendFieldset.getCollapsed() &&
                layer.checked &&
                layer.get('name') &&
                layer.get('name') !== "Hintergrundkarte" &&
                layer.get('opacity') > 0 &&
                layer.get('allowPrint') &&
                layerCheckbox.layer === layer &&
                layerCheckbox.checked) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * Update the content of the legendsFieldset. Remove all. Get visible and
     * printable Layers from Map. Add those to the fieldset.
     */
    updateLegendsFieldset: function(legendsFieldset) {
        var me = this;
        if (!legendsFieldset) {
            return;
        }
        legendsFieldset.removeAll();
        var mapPanel = Ext.ComponentQuery.query('k-component-map')[0];
        var layers = BasiGX.util.Layer.getAllLayers(mapPanel.getMap());

        var items = [];
        Ext.each(layers, function(layer) {
            if (layer.get('visible') && layer.get('allowPrint')) {
                var legendTextHtml = me.prepareLegendTextHtml(layer);

                items.push({
                    xtype: 'checkbox',
                    checked: true,
                    name: layer.get('name') + '_visible',
                    layer: layer,
                    boxLabel: layer.get('name')
                }, {
                    xtype: 'textfield',
                    name: layer.get('name') + '_legendtext',
                    // TODO i18n
                    fieldLabel: 'Legendtext',
                    value: legendTextHtml,
                    allowBlank: true,
                    listeners: {
                        focus: me.onTextFieldFocus,
                        scope: me
                    }
                });
            }
        });

        if (items.length > 0) {
            legendsFieldset.show();
        } else {
            legendsFieldset.hide();
        }

        legendsFieldset.add(items);
    },

    /**
     * Prepares the content of the legendTextHtml field by adding the filter from
     * the RoutingLegendTree text.
     */
    prepareLegendTextHtml: function(layer) {
        var layerName = layer.get('name'); // fallback
        if ('metadata' in layer && 'printTitle' in layer.metadata) {
            layerName = layer.metadata.printTitle;
        }
        var text = layerName;
        var legendSpan = Ext.getDom(layer.get('__suffix_id__'));

        if (legendSpan) {
            var filterText = legendSpan.innerHTML;
            text = layerName + '<br/><font color="#999999">' + filterText + '</font>';
        }

        return text;
    },

    /**
     * Called before a `attributefields`-object is added to the fieldset. This
     * method will hide the legend_template and map_template fields, but also
     * set their respective value according to a convention.
     *
     * @param {BasiGX.view.form.Print} printForm The print form instance.
     * @param {Object} attributefields An `attributefields`-object, which often
     *     are formfields like `textfields`, `combos` etc.
     */
    onBeforeAttributeFieldsAdd: function(printForm, attributeFields) {
        var name = attributeFields.name;
        // For these two fields we need special handling…
        if (name === "legend_template" || name === "map_template") {
            // …hide both…
            attributeFields.hidden = true;
            // …set the value according to actual field and current layout
            var layoutCombo = printForm.down('combo[name="layout"]');
            var currentLayout = layoutCombo.getValue();
            if (name === "legend_template") {
                attributeFields.value = currentLayout + "_legend.jasper";
            } else if (name === "map_template") {
                attributeFields.value = currentLayout + "_map.jasper";
            }
        }
    },

    getCheckBoxBooleanFields: function(attributeRec) {
        return {
            xtype: 'checkbox',
            name: attributeRec.get('name'),
            checked: true,
            fieldLabel: attributeRec.get('name')
        };
    },

    /**
     * Create a checkbox instead of a textfield
     * if type is Boolean.
     * @override
     */
    addAttributeFields: function(attributeRec, fieldset) {
        var me = this;
        var map = me.getMapComponent().getMap();

        var attributeFields;
        switch (attributeRec.get('type')) {
            case "MapAttributeValues":
                attributeFields = me.getMapAttributeFields(attributeRec);
                map.on('moveend', me.renderAllClientInfos, me);
                break;
            case "NorthArrowAttributeValues":
                attributeFields = me.getNorthArrowAttributeFields(attributeRec);
                break;
            case "ScalebarAttributeValues":
                attributeFields = me.getScalebarAttributeFields(attributeRec);
                break;
            case "LegendAttributeValue":
                attributeFields = me.getLegendAttributeFields(attributeRec);
                break;
            case "String":
                attributeFields = me.getStringField(attributeRec);
                break;
            case "Boolean":
                attributeFields = me.getCheckBoxBooleanFields(attributeRec);
                break;
            case "DataSourceAttributeValue":
                Ext.toast('Data Source not yet supported');
                attributeFields = me.getStringField(attributeRec);
                break;
            default:
                break;
        }

        if (attributeFields) {
            var doContinue = me.fireEvent(
                    'beforeattributefieldsadd', me, attributeFields
                );
            // a beforeattributefieldsadd handler may have cancelled the adding
            if (doContinue !== false) {
                var added = fieldset.add(attributeFields);
                me.fireEvent('attributefieldsadd', me, attributeFields, added);
            }
        }
    },

    /**
     * Validate all fields on creation so they are marked as red if invalid.
     *
     * If https://github.com/terrestris/BasiGX/pull/74 is merged all fields are
     * allowed to be Blank. Set mandatory fields here if you need some.
     */
    onAttributeFieldsAdd: function(printForm, attributeFields, addedField) {
        if (Ext.isFunction(addedField.validate)) {
            addedField.validate();
        }
    },

    /**
     * Called in init component, this method removes the standard BasiGX binding
     * of the createPrint and downloadPrint buttons, and configures them to use
     * a static text.
     */
    setFixedCreatePrintBtnText: function() {
        var me = this;
        var vm = me.getViewModel();
        var createPrintBtn = me.down('button[name="createPrint"]');
        var downloadPrintBtn = me.down('button[name="downloadPrint"]');

        // the create button
        createPrintBtn.setText(
            me.getPrintButtonPrefix() + " " + vm.get('printButtonSuffix')
        );
        // the download button
        downloadPrintBtn.setText(
            me.getPrintButtonPrefix() + " " + me.getDownloadButtonSuffix()
        );
    },

    /**
     * Overrides the default createPrint method;
     */
    createPrint: function() {
        var view = this;
        var spec = {};
        var mapComponent = view.getMapComponent();
        var mapView = mapComponent.getMap().getView();
        var viewRes = mapView.getResolution();
        var layoutCombo = view.down('combo[name="layout"]');
        var layout = layoutCombo.getValue();
        var formatCombo = view.down('combo[name="format"]');
        var format = formatCombo.getValue();
        var attributes = {};
        var projection = mapView.getProjection().getCode();
        var rotation = mapView.getRotation();

        layoutCombo.getStore().sort('name', 'ASC');
        formatCombo.getStore().sort('field1', 'ASC');

        var printLayers = [];
        var serializedLayers = [];

        mapComponent.getLayers().forEach(function(layer) {
            if (layer.get('printLayer')) {
                printLayers.push(layer.get('printLayer'));
            } else {
                var isChecked = !!layer.checked;
                var hasName = isChecked && !!layer.get('name');
                var nonOpaque = hasName && (layer.get('opacity') > 0);
                var inTree = nonOpaque && (layer.get(
                    BasiGX.util.Layer.KEY_DISPLAY_IN_LAYERSWITCHER
                ) !== false); // may be undefined for certain layers

                if (isChecked && hasName && nonOpaque && inTree) {
                    if (layer instanceof ol.layer.Vector &&
                        layer.getSource().getFeatures().length < 1) {
                        return false;
                    }
                    printLayers.push(layer);
                } else {
                    return false;
                }
            }
        });

        Ext.each(printLayers, function(layer) {
            var source = layer.getSource();
            var serialized = {};

            var serializer = GeoExt.data.MapfishPrintProvider
                .findSerializerBySource(source);
            if (serializer) {
                serialized = serializer.serialize(layer, source, viewRes);
                serializedLayers.push(serialized);
            }
        }, this);

        var fsSelector = 'fieldset[name=attributes] fieldset[name=map]';
        var fieldsets = view.query(fsSelector);

        Ext.each(fieldsets, function(fs) {
            var name = fs.name;
            // TODO double check when rotated
            var featureBbox = fs.extentFeature.getGeometry().getExtent();
            var dpi = fs.down('[name="dpi"]').getValue();

            attributes[name] = {
                bbox: featureBbox,
                dpi: dpi,
                // TODO Order of Layers in print seems to be reversed.
                layers: serializedLayers.reverse(),
                projection: projection,
                rotation: rotation
            };

        }, this);

        // Get all Fields except the DPI Field
        // TODO This query should be optimized or changed into some
        // different kind of logic
        var additionalFields = view.query(
            'fieldset[name=attributes]>field[name!=dpi]'
        );
        Ext.each(additionalFields, function(field) {
            if (field.getName() === 'scalebar') {
                attributes.scalebar = view.getScaleBarObject();
                // handle the desire to have a scalebar or not by setting
                // colors to transparent, crude but we didn' find a better
                // solution. See https://github.com/terrestris/BasiGX/pull/74#issuecomment-209954558
                if (field.getValue() === false) {
                    attributes.scalebar = view.setScalebarInvisible(
                        attributes.scalebar
                    );
                }
            } else if (field.getName() === 'northArrow') {
                attributes.northArrow = view.getNorthArrowObject();
                // handle the desire to have a northArrow or not by setting
                // colors to transparent, crude but we didn' find a better
                // solution. See https://github.com/terrestris/BasiGX/pull/74#issuecomment-209954558
                if (field.getValue() === false) {
                    attributes.northArrow = view.setNorthArrowInvisible(
                        attributes.northArrow
                    );
                }
            } else {
                attributes[field.getName()] = field.getValue();
            }
        }, this);

        var legendFieldset = view.down('fieldset[name="legendsFieldset"]');
        if (legendFieldset && !legendFieldset.getCollapsed()) {
            attributes.legend = view.getLegendObject();

            // Override layer name in legend with valze from legendTextField
            Ext.each(attributes.legend.classes, function(clazz) {
                var legendTextField = legendFieldset.down(
                        'textfield[name=' + clazz.name + '_legendtext]');
                var layer = BasiGX.util.Layer.getLayerByName(clazz.name);
                var currentLegendUrl = Koala.util.Layer.getCurrentLegendUrl(layer);

                if (currentLegendUrl) {
                    clazz.icons[0] = currentLegendUrl;
                }

                if (legendTextField) {
                    clazz.name = legendTextField.getValue();
                }
            });

        }

        var app = view.down('combo[name=appCombo]').getValue();
        var url = view.getUrl() + app + '/buildreport.' + format;
        spec.attributes = attributes;
        spec.layout = layout;
        spec.outputFilename = layout;

        var irixCheckBox = this.down('[name="irix-fieldset-checkbox"]');
        if (irixCheckBox.getValue()) {
            var irixJson = {};
            var mapfishPrint = [];

            if (view.isValid()) {
                spec.outputFormat = format;
                mapfishPrint[0] = spec;
                irixJson = this.setUpIrixJson(mapfishPrint);
                url = this.getIrixUrl();
                Ext.Ajax.request({
                    url: url,
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    jsonData: irixJson,
                    scope: view,
                    success: view.irixPostSuccessHandler,
                    failure: view.genericPostFailureHandler,
                    timeout: view.getTimeoutMilliseconds()
                });
            }
        } else {
            var startTime = new Date().getTime();
            Ext.Ajax.request({
                url: view.getUrl() + app + '/report.' + format,
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                jsonData: Ext.encode(spec),
                scope: view,
                success: function(response) {
                    var data = Ext.decode(response.responseText);
                    view.setLoading(format + ' ' +
                        view.getDownloadOngoingMiddleText());
                    view.downloadWhenReady(startTime, data);
                },
                failure: view.genericPostFailureHandler,
                timeout: view.getTimeoutMilliseconds()
            });
        }

    },

    /**
     * Returns and modifies the given MapFish Print 3 attribute `scalebar`
     * (http://mapfish.github.io/mapfish-print-doc/attributes.html#!scalebar)
     * to be invisible. This is done by setting various colors to a transparent
     * value.
     *
     * @param {object} scalebar A scalebar object as it is returned from the
     *     BasiGX method getScaleBarObject()
     * @return {object} The scalebar object configured as invisible.
     */
    setScalebarInvisible: function(scalebar) {
        var keys = [
            'backgroundColor',
            'barBgColor',
            'color',
            'fontColor'
        ];
        var newColor = this.getTransparentColor();
        Ext.each(keys, function(key) {
            scalebar[key] = newColor;
        });
        return scalebar;
    },

    /**
     * Returns and modifies the given MapFish Print 3 attribute `northArrow`
     * (http://mapfish.github.io/mapfish-print-doc/attributes.html#!northArrow)
     * to be invisible. This is done by setting various colors to a transparent
     * value and also by setting the `graphic` to a transparent image.
     *
     * @param {object} northArrow A northArrow object as it is returned from the
     *     BasiGX method getNorthArrowObject()
     * @return {object} The northArrow object configured as invisible.
     */
    setNorthArrowInvisible: function(northArrow) {
        var keys = [
            'backgroundColor'
        ];
        var newColor = this.getTransparentColor();
        Ext.each(keys, function(key) {
            northArrow[key] = newColor;
        });
        northArrow.graphic = this.getTransparentImageUrl();
        return northArrow;
    },

    /**
     */
    genericPostFailureHandler: function(response) {
        var msg = this.getServerError();
        msg = Ext.String.format(msg, response.status || 'n.a.');
        Ext.Msg.show({
            title: this.getServerErrorTitle(),
            message: msg,
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.WARNING
        });
    },

    /**
     */
    irixPostSuccessHandler: function(response, options) {
        var me = this;
        var irixJson = options.jsonData;
        var chosenRequestType = irixJson['request-type'];
        var uploadOnly = 'upload';
        var repondTypes = ['respond', 'upload/respond'];
        var expectResponse = Ext.Array.contains(
                repondTypes, chosenRequestType
            );

        if (chosenRequestType === uploadOnly) {
            Ext.Msg.show({
                title: me.getServerUploadSuccessTitle(),
                message: me.getServerUploadSuccess(),
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
        } else if (expectResponse) {
            var content = response.responseText;
            if (content) {
                var w;
                var success = false;
                try {
                    w = window.open(
                        'data:application/octet-stream;charset=utf-8,' +
                        encodeURIComponent(content)
                    );
                    success = true;
                } catch (e) {
                    Ext.log.warn(e);
                    try {
                        w = window.open();
                    } catch (e2) {
                        Ext.log.warn(e2);
                    }
                    if (w && 'focus' in w && 'document' in w) {
                         w.document.write(content);
                         w.document.close();
                         w.focus();
                         success = true;
                    }
                }
                if (!success) {
                    Ext.Msg.show({
                        title: me.getDisablePopupBlockerTitle(),
                        message: me.getDisablePopupBlocker(),
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                }
            } else {
                Ext.Msg.show({
                    title: me.getUnexpectedResponseTitle(),
                    message: me.getUnexpectedResponse(),
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.WARNING
                });
            }
        }
    },

    /**
     */
    downloadWhenReady: function(startTime, data) {
        var me = this;
        var elapsedMs = (new Date().getTime() - startTime);
        var format = me.down('combo[name="format"]')
            .getValue();

        var dspElapsedMs = (elapsedMs/1000).toFixed(3) + ' s';
        var loadMsg = format + ' ' + me.getDownloadOngoingMiddleText() + ': ' +
            dspElapsedMs;
        me.setLoading(loadMsg);

        if (elapsedMs > me.getTimeoutMilliseconds()) {
            Ext.log.warn('Download aborted after ' + dspElapsedMs);
            me.setLoading(false);
            Ext.Msg.show({
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR,
                title: me.getWarnPrintTimedOutTitle(),
                message: me.getWarnPrintTimedOutText()
            });

        } else {
            setTimeout(function() {
                Ext.Ajax.request({
                    url: me.getUrl() + 'status/' + data.ref + '.json',
                    success: function(response) {
                        var statusData = Ext.decode(response.responseText);
                        if (statusData.done) {
                            me.setLoading(false);
                            var dlBtn = me.down('button[name="downloadPrint"]');
                            dlBtn.link = me.getUrl() + 'report/' + data.ref;
                            dlBtn.show();
                            BasiGX.util.Animate.shake(dlBtn);
                            var fields = dlBtn.up('k-form-print').query('field');
                            Ext.each(fields, function(field) {
                                field.on('change', function() {
                                    dlBtn.hide();
                                }, field, {single: true});
                            });
                        } else {
                            me.downloadWhenReady(startTime, data);
                        }
                    },
                    failure: function(response) {
                        Ext.log.warn('server-side failure with status code '
                            + response.status);
                    },
                    timeout: 500
                });
            }, 500);
        }
    },

    updateFeatureBbox: function(bboxTextfield) {
        var me = this;
        var fsSelector = 'fieldset[name=attributes] fieldset[name=map]';
        var fieldsets = me.query(fsSelector);
        var featureBbox = "";

        Ext.each(fieldsets, function(fs) {
            // TODO double check when rotated
            featureBbox = fs.extentFeature.getGeometry().getExtent();
        }, this);

        bboxTextfield.setValue(featureBbox);
    },

    addBboxFieldset: function() {
        var me = this;
        var mapFieldSet = me.down('fieldset[name=map]');
        var map = me.getMapComponent().getMap();
        var bboxTextfield = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.getMapBboxLabel(),
            readOnly: true,
            labelWidth: 40,
            width: 150,
            value: ''
        });

        var listenerFunction = function() {
            me.updateFeatureBbox(bboxTextfield);
        };

        map.on('moveend', listenerFunction);

        bboxTextfield.on('destroy', function() {
            map.un('moveend', listenerFunction);
        });

        var bboxFieldSet = Ext.create('Ext.form.FieldSet', {
            name: 'bbox-fieldset',
            layout: 'hbox',
            border: false,
            margin: '0 0 0 -10',
            items: [
                bboxTextfield,
                {
                //TODO update bbox of irix-upload sos-job
                xtype: 'button',
                text: me.getMapBboxButton(),
                margin: '0 0 0 55',
                handler: function() {
                    Ext.Msg.alert(me.getMapBboxButton(), "<b>"+me.getMapBboxLabel()+":</b> " + bboxTextfield.getValue());
                }
            }]
        });

        me.updateFeatureBbox(bboxTextfield);
        mapFieldSet.add(bboxFieldSet);
    },

    addIrixCheckbox: function() {
        var me = this;
        var genericFieldset = me.down('fieldset[name=generic-fieldset]');
        var irixCheckbox = Ext.create('Ext.form.field.Checkbox', {
            name: 'irix-fieldset-checkbox',
            boxLabel: 'IRIX',
            handler: function(checkbox, checked) {
                var irixFieldset = me.down("k-form-irixfieldset");
                if (checked) {
                    irixFieldset.show();
                } else {
                    irixFieldset.hide();
                }
            }
        });

        genericFieldset.add(irixCheckbox);
    },

    addIrixFieldset: function() {
        var me = this;
        var fs = me.down("k-form-irixfieldset");
        var checkBox = me.down('[name="irix-fieldset-checkbox"]');

        if (!fs) {
            var irixFieldset = Ext.create('Koala.view.form.IrixFieldSet',{
                flex: 2
            });
            me.add(irixFieldset);
        } else {
            checkBox.setValue(false);
        }

    },

    setUpIrixJson: function(mapfishPrint) {
        var me = this;
        var irixJson = {};
        irixJson.irix = me.formItemToJson(me.down("k-form-irixfieldset"));
        // the generic serialisation needs a little bit shuffeling
        irixJson = me.adjustIrixSerialisation(irixJson);
        // always add the printapp to the top-lvel for irix:
        irixJson.printapp = me.down('[name="appCombo"]').getValue();
        irixJson['mapfish-print'] = mapfishPrint;
        return irixJson;
    },

    /**
     * Certain fields must live inside the irix fieldset, as they only make
     * sense for this type of "print"; yet their serialisation cannot live in
     * dedicted irix-object, as it is e.g. expected on the top-level. This
     * method will adjust a JSON (e.g. from formItemToJson), and shuffle certain
     * key / value pairs around: currently only 'request-type'.
     *
     * @param {object} irixJson The JSON for the IRIX service, a representation
     *     of the form.
     * @return {object} The adjusted serialisation.
     */
    adjustIrixSerialisation: function(irixJson) {
        var irix = irixJson.irix;
        // move requestType or request-type out of irix object to top-level
        var correctRequestTypeKey = 'request-type';
        // For backwards compatibility, we iterate over two variants
        var keysReqestType = ['requestType', correctRequestTypeKey];
        if (irix) {
            var reqType;
            Ext.each(keysReqestType, function(keyRequestType) {
                if (keyRequestType in irix) {
                    // if both were present, the dashed version will win.
                    reqType = irix[keyRequestType];
                    // delete the one under key 'irix'
                    delete irixJson.irix[keyRequestType];
                    // set on top-level.
                    irixJson[correctRequestTypeKey] = reqType;
                }
            });
        }
        return irixJson;
    },

    formItemToJson: function(formItem) {
        var me = this;
        var children = formItem.items.items;
        var json = {};

        Ext.each(children, function(child) {
            if (child instanceof Ext.form.FieldSet ||
                child instanceof Ext.form.FieldContainer) {
                json[child.name] = me.formItemToJson(child);
            } else {
                json[child.name] = child.getValue();
            }
        });

        return json;
    }
});
