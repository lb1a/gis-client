
var __cov_sz_xcJ8jl8xv_6vXWdag2A = (Function('return this'))();
if (!__cov_sz_xcJ8jl8xv_6vXWdag2A.__coverage__) { __cov_sz_xcJ8jl8xv_6vXWdag2A.__coverage__ = {}; }
__cov_sz_xcJ8jl8xv_6vXWdag2A = __cov_sz_xcJ8jl8xv_6vXWdag2A.__coverage__;
if (!(__cov_sz_xcJ8jl8xv_6vXWdag2A['/home/volland/workspace/package_geoext_extjs6/packages/local/geoext3/src/data/model/Layer.js'])) {
   __cov_sz_xcJ8jl8xv_6vXWdag2A['/home/volland/workspace/package_geoext_extjs6/packages/local/geoext3/src/data/model/Layer.js'] = {"path":"/home/volland/workspace/package_geoext_extjs6/packages/local/geoext3/src/data/model/Layer.js","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0},"b":{"1":[0,0],"2":[0,0],"3":[0,0],"4":[0,0],"5":[0,0],"6":[0,0],"7":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0},"fnMap":{"1":{"name":"(anonymous_1)","line":33,"loc":{"start":{"line":33,"column":25},"end":{"line":33,"column":41}}},"2":{"name":"(anonymous_2)","line":41,"loc":{"start":{"line":41,"column":21},"end":{"line":41,"column":41}}},"3":{"name":"(anonymous_3)","line":52,"loc":{"start":{"line":52,"column":21},"end":{"line":52,"column":41}}},"4":{"name":"(anonymous_4)","line":63,"loc":{"start":{"line":63,"column":21},"end":{"line":63,"column":41}}},"5":{"name":"(anonymous_5)","line":75,"loc":{"start":{"line":75,"column":21},"end":{"line":75,"column":40}}},"6":{"name":"(anonymous_6)","line":87,"loc":{"start":{"line":87,"column":21},"end":{"line":87,"column":40}}},"7":{"name":"(anonymous_7)","line":110,"loc":{"start":{"line":110,"column":16},"end":{"line":110,"column":27}}}},"statementMap":{"1":{"start":{"line":21,"column":0},"end":{"line":115,"column":3}},"2":{"start":{"line":34,"column":12},"end":{"line":34,"column":79}},"3":{"start":{"line":42,"column":16},"end":{"line":42,"column":48}},"4":{"start":{"line":44,"column":16},"end":{"line":46,"column":17}},"5":{"start":{"line":45,"column":20},"end":{"line":45,"column":61}},"6":{"start":{"line":53,"column":16},"end":{"line":57,"column":17}},"7":{"start":{"line":54,"column":20},"end":{"line":54,"column":44}},"8":{"start":{"line":56,"column":20},"end":{"line":56,"column":29}},"9":{"start":{"line":64,"column":16},"end":{"line":64,"column":26}},"10":{"start":{"line":66,"column":16},"end":{"line":69,"column":17}},"11":{"start":{"line":67,"column":20},"end":{"line":67,"column":48}},"12":{"start":{"line":68,"column":20},"end":{"line":68,"column":48}},"13":{"start":{"line":76,"column":16},"end":{"line":76,"column":26}},"14":{"start":{"line":78,"column":16},"end":{"line":81,"column":17}},"15":{"start":{"line":79,"column":20},"end":{"line":79,"column":48}},"16":{"start":{"line":80,"column":20},"end":{"line":80,"column":54}},"17":{"start":{"line":88,"column":16},"end":{"line":88,"column":26}},"18":{"start":{"line":90,"column":16},"end":{"line":93,"column":17}},"19":{"start":{"line":91,"column":20},"end":{"line":91,"column":48}},"20":{"start":{"line":92,"column":20},"end":{"line":92,"column":54}},"21":{"start":{"line":111,"column":8},"end":{"line":113,"column":9}},"22":{"start":{"line":112,"column":12},"end":{"line":112,"column":29}}},"branchMap":{"1":{"line":44,"type":"if","locations":[{"start":{"line":44,"column":16},"end":{"line":44,"column":16}},{"start":{"line":44,"column":16},"end":{"line":44,"column":16}}]},"2":{"line":53,"type":"if","locations":[{"start":{"line":53,"column":16},"end":{"line":53,"column":16}},{"start":{"line":53,"column":16},"end":{"line":53,"column":16}}]},"3":{"line":53,"type":"binary-expr","locations":[{"start":{"line":53,"column":20},"end":{"line":53,"column":22}},{"start":{"line":53,"column":26},"end":{"line":53,"column":52}}]},"4":{"line":66,"type":"if","locations":[{"start":{"line":66,"column":16},"end":{"line":66,"column":16}},{"start":{"line":66,"column":16},"end":{"line":66,"column":16}}]},"5":{"line":78,"type":"if","locations":[{"start":{"line":78,"column":16},"end":{"line":78,"column":16}},{"start":{"line":78,"column":16},"end":{"line":78,"column":16}}]},"6":{"line":90,"type":"if","locations":[{"start":{"line":90,"column":16},"end":{"line":90,"column":16}},{"start":{"line":90,"column":16},"end":{"line":90,"column":16}}]},"7":{"line":111,"type":"if","locations":[{"start":{"line":111,"column":8},"end":{"line":111,"column":8}},{"start":{"line":111,"column":8},"end":{"line":111,"column":8}}]}}};
}
__cov_sz_xcJ8jl8xv_6vXWdag2A = __cov_sz_xcJ8jl8xv_6vXWdag2A['/home/volland/workspace/package_geoext_extjs6/packages/local/geoext3/src/data/model/Layer.js'];
__cov_sz_xcJ8jl8xv_6vXWdag2A.s['1']++;Ext.define('GeoExt.data.model.Layer',{extend:'GeoExt.data.model.Base',statics:{createFromLayer:function(layer){__cov_sz_xcJ8jl8xv_6vXWdag2A.f['1']++;__cov_sz_xcJ8jl8xv_6vXWdag2A.s['2']++;return this.getProxy().getReader().readRecords([layer]).records[0];}},fields:[{name:'isLayerGroup',type:'boolean',convert:function(v,record){__cov_sz_xcJ8jl8xv_6vXWdag2A.f['2']++;__cov_sz_xcJ8jl8xv_6vXWdag2A.s['3']++;var layer=record.getOlLayer();__cov_sz_xcJ8jl8xv_6vXWdag2A.s['4']++;if(layer){__cov_sz_xcJ8jl8xv_6vXWdag2A.b['1'][0]++;__cov_sz_xcJ8jl8xv_6vXWdag2A.s['5']++;return layer instanceof ol.layer.Group;}else{__cov_sz_xcJ8jl8xv_6vXWdag2A.b['1'][1]++;}}},{name:'text',type:'string',convert:function(v,record){__cov_sz_xcJ8jl8xv_6vXWdag2A.f['3']++;__cov_sz_xcJ8jl8xv_6vXWdag2A.s['6']++;if((__cov_sz_xcJ8jl8xv_6vXWdag2A.b['3'][0]++,!v)&&(__cov_sz_xcJ8jl8xv_6vXWdag2A.b['3'][1]++,record.get('isLayerGroup'))){__cov_sz_xcJ8jl8xv_6vXWdag2A.b['2'][0]++;__cov_sz_xcJ8jl8xv_6vXWdag2A.s['7']++;return'ol.layer.Group';}else{__cov_sz_xcJ8jl8xv_6vXWdag2A.b['2'][1]++;__cov_sz_xcJ8jl8xv_6vXWdag2A.s['8']++;return v;}}},{name:'opacity',type:'number',convert:function(v,record){__cov_sz_xcJ8jl8xv_6vXWdag2A.f['4']++;__cov_sz_xcJ8jl8xv_6vXWdag2A.s['9']++;var layer;__cov_sz_xcJ8jl8xv_6vXWdag2A.s['10']++;if(record.data instanceof ol.layer.Base){__cov_sz_xcJ8jl8xv_6vXWdag2A.b['4'][0]++;__cov_sz_xcJ8jl8xv_6vXWdag2A.s['11']++;layer=record.getOlLayer();__cov_sz_xcJ8jl8xv_6vXWdag2A.s['12']++;return layer.get('opacity');}else{__cov_sz_xcJ8jl8xv_6vXWdag2A.b['4'][1]++;}}},{name:'minResolution',type:'number',convert:function(v,record){__cov_sz_xcJ8jl8xv_6vXWdag2A.f['5']++;__cov_sz_xcJ8jl8xv_6vXWdag2A.s['13']++;var layer;__cov_sz_xcJ8jl8xv_6vXWdag2A.s['14']++;if(record.data instanceof ol.layer.Base){__cov_sz_xcJ8jl8xv_6vXWdag2A.b['5'][0]++;__cov_sz_xcJ8jl8xv_6vXWdag2A.s['15']++;layer=record.getOlLayer();__cov_sz_xcJ8jl8xv_6vXWdag2A.s['16']++;return layer.get('minResolution');}else{__cov_sz_xcJ8jl8xv_6vXWdag2A.b['5'][1]++;}}},{name:'maxResolution',type:'number',convert:function(v,record){__cov_sz_xcJ8jl8xv_6vXWdag2A.f['6']++;__cov_sz_xcJ8jl8xv_6vXWdag2A.s['17']++;var layer;__cov_sz_xcJ8jl8xv_6vXWdag2A.s['18']++;if(record.data instanceof ol.layer.Base){__cov_sz_xcJ8jl8xv_6vXWdag2A.b['6'][0]++;__cov_sz_xcJ8jl8xv_6vXWdag2A.s['19']++;layer=record.getOlLayer();__cov_sz_xcJ8jl8xv_6vXWdag2A.s['20']++;return layer.get('maxResolution');}else{__cov_sz_xcJ8jl8xv_6vXWdag2A.b['6'][1]++;}}}],proxy:{type:'memory',reader:{type:'json'}},getOlLayer:function(){__cov_sz_xcJ8jl8xv_6vXWdag2A.f['7']++;__cov_sz_xcJ8jl8xv_6vXWdag2A.s['21']++;if(this.data instanceof ol.layer.Base){__cov_sz_xcJ8jl8xv_6vXWdag2A.b['7'][0]++;__cov_sz_xcJ8jl8xv_6vXWdag2A.s['22']++;return this.data;}else{__cov_sz_xcJ8jl8xv_6vXWdag2A.b['7'][1]++;}}});