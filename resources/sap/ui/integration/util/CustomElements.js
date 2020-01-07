/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log"],function(L){"use strict";var E=window.Element;if(E.prototype.getAttributeNames==undefined){E.prototype.getAttributeNames=function(){var d=this.attributes;var l=d.length;var r=new Array(l);for(var i=0;i<l;i++){r[i]=d[i].name;}return r;};}var e=document.createElement("span"),o,I={registerTag:function registerTag(t,p,d){p=p+"-";var g=p+t;b.apply(this,[g,d]);},coreInstance:null};function a(){if(typeof window.CustomEvent==="function"){return false;}function C(d,p){p=p||{bubbles:false,cancelable:false,detail:undefined};var g=document.createEvent('CustomEvent');g.initCustomEvent(d,p.bubbles,p.cancelable,p.detail);return g;}C.prototype=window.Event.prototype;window.CustomEvent=C;}function f(n,d,g){var h=new window.CustomEvent(d),i=n.getAttribute("on"+d);if(i){e.setAttribute("onclick",i);e.onclick(h);}n.dispatchEvent(h);}function c(){var d={childList:true,subtree:true};function g(m,o){m.forEach(function(h){if(h.type=='childList'){var j=h.addedNodes,r=h.removedNodes,n,x,k,t,i;for(k=0;k<j.length;k++){n=j[k];if(!document.createCustomElement._querySelector){return;}if(n.tagName&&document.createCustomElement.hasOwnProperty(n.tagName.toLowerCase())){if(!n._control){document.createCustomElement[n.tagName.toLowerCase()].connectToNode(n);}n._control._connectedCallback();}if(n.tagName){t=n.querySelectorAll(document.createCustomElement._querySelector);for(i=0;i<t.length;i++){x=t[i];if(x.tagName&&document.createCustomElement.hasOwnProperty(x.tagName.toLowerCase())){if(!x._control){document.createCustomElement[x.tagName.toLowerCase()].connectToNode(x);}x._control._connectedCallback();}}}}for(k=0;k<r.length;k++){n=r[k];if(!document.createCustomElement._querySelector){return;}if(n._control){n._control._disconnectedCallback();}if(n.tagName){t=n.querySelectorAll(document.createCustomElement._querySelector);for(i=0;i<t.length;i++){x=t[i];if(x._control){x._control._disconnectedCallback();}}}}}else if(h.type==="attributes"&&h.target&&h.target._control){h.target._control._changeProperty.call(h.target._control,h.attributeName,h.target.getAttribute(h.attributeName));}});}var o=new window.MutationObserver(g);if(!document.body){L.error("CustomElements.js was loaded before a body element was present in the DOM. Ensure to load CustomElements.js after the document was parsed, i.e. after the windows onload event.");return null;}o.observe(document.body,d);return o;}function b(p,T){if(document.createCustomElement[p]){return document.createCustomElement[p];}var t=T.getMetadata(),d=t.getAllProperties(),g=t.getAllAssociations(),h=t.getAllEvents(),j={};Object.keys(d).map(function(n){j[n.toLowerCase()]=d[n];});Object.keys(g).map(function(n){j[n.toLowerCase()]=g[n];});Object.keys(h).map(function(n){j["on"+n.toLowerCase()]=h[n];});var k=function(q){this._node=q;q._control=this;k.initCloneNode(q);k.defineProperties(q);this._controlImpl=this._controlImpl||new T(q.getAttribute("id"));this._changeProperties(q);q.setAttribute("id",this._controlImpl.getId()+"-area");this._uiArea=I.coreInstance.createUIArea(q);this._uiArea.addContent(this._controlImpl);if(k.isInActiveDocument(q)){this._connectedCallback();}return q;};k.cloneNode=function(){var n=this._cloneNode.call(this);n.removeAttribute("data-sap-ui-area");n.removeAttribute("id");n._controlImpl=this._control._controlImpl.clone();k.connectToNode(n);return n;};k.initCloneNode=function(q){if(!q._cloneNode){q._cloneNode=q.cloneNode;q.cloneNode=k.cloneNode;}};k.isInActiveDocument=function(q){return!!(q.parentNode&&q.ownerDocument===document);};k.defineProperty=function(q,n,r){Object.defineProperty(q,n,{get:function(){return t.getProperty(n).get(q._control._controlImpl);},set:function(v){q._control._changeProperty(n,v);return t.getProperty(n).get(q._control._controlImpl);}});};k.defineProperties=function(q){for(var n in j){if(n.charAt(0)!=="_"){k.defineProperty(q,n,j[n].defaultValue);}}};k.observer=o;k.connectToNode=function(q){new k(q);return k.observer&&k.observer.observe(q,{attributes:true});};k.prototype._connectedCallback=function(){this._connected||((this._connected=true)&&this._controlImpl.invalidate());};k.prototype._disconnectedCallback=function(){this._connected=false;};k.prototype._changeProperties=function(q){var n=q.getAttributeNames();for(var i=0;i<n.length;i++){this._changeProperty(n[i],q.getAttribute(n[i]));}};k.prototype._changeProperty=function(n,r){var u=this._controlImpl,v=j[n];if(n==="id"){return;}if(v&&(v._iKind===0||v._iKind===3)){var w=v.getType();var V=w.parseValue(r);var O=v.get(u);if(w.isValid(V)){v.set(u,V);}else{v.set(u,O);}}else if(v&&v._iKind===5){var x=this;if(this["_"+v.name]){u[v._sDetachMutator](this["_"+v.name]);}this["_"+v.name]=function(s){x.fireCustomEvent(v.name.toLowerCase(),s.mParameters);};u[v._sMutator](this["_"+v.name]);}else if(n==="class"){var C=r.split(" ");this._addedClasses=this._addedClasses||[];this._addedClasses.forEach(function(s){s&&u.removeStyleClass(s);});C.forEach(function(s){s=u.addStyleClass(s);});this._addedClasses=C;}};k.prototype.fireCustomEvent=function(n,r){f(this._node,n,r);};var l=document.createCustomElement;l[p]=k;if(l._querySelector){l._querySelector+=",";}else{Object.defineProperty(l,"_querySelector",{enumerable:false,writable:true});l._querySelector="";}var S=p.replace("-","\\-");l._querySelector+=S;var m=document.querySelectorAll(S);for(var i=0;i<m.length;i++){var q=m[i];l[p].connectToNode(q);}return k;}if(!document.createCustomElement){document.createCustomElement=function(t){var n=document.createElement(t);document.createCustomElement[t].connectToNode(n);return n;};}a();o=c();return I;});
