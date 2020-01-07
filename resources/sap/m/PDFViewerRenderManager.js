/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/library","sap/m/Dialog","sap/m/Button","sap/m/MessagePage","sap/m/OverflowToolbar","sap/m/OverflowToolbarButton","sap/m/Title","sap/m/ToolbarSpacer","sap/m/OverflowToolbarLayoutData"],function(l,D,B,M,O,a,T,b,c){"use strict";var d=l.OverflowToolbarPriority;var e=l.ButtonType;var p={extendPdfViewer:function(P){P.prototype._initPopupControl=function(){var t=this;var o={contentHeight:"100%",contentWidth:"100%",horizontalScrolling:false,verticalScrolling:false,showHeader:true,buttons:[],afterClose:t._onAfterPopupClose.bind(t)},s=t.getId()+"-popup",f=s+"-popupCloseButton",C="getPopupCloseButton",g="getPopup";this._objectsRegister[C]=function(){var h=new B(f,{text:'',press:function(){t._objectsRegister.getPopup().close();}});t._objectsRegister[C]=function(){return h;};return h;};this._objectsRegister[g]=function(i){if(i===true){return null;}var h=new D(s,o);h.addStyleClass("sapUiPopupWithPadding");t._objectsRegister[g]=function(){return h;};return h;};};P.prototype._preparePopup=function(o){var f=this.getPopupButtons().slice(),C=this._objectsRegister.getPopupCloseButton(),g=this._objectsRegister.getPopupDownloadButtonControl();C.setText(this._getLibraryResourceBundle().getText("PDF_VIEWER_POPUP_CLOSE_BUTTON"));if(this.getShowDownloadButton()){f.push(g);}f.push(C);o.removeAllButtons();f.forEach(function(h){o.addButton(h);});o.setShowHeader(true);if(!!this.getPopupHeaderTitle()){o.setTitle(this.getPopupHeaderTitle());}if(!!this.getTitle()){o.setTitle(this.getTitle());}};P.prototype._initPlaceholderMessagePageControl=function(){var t=this,s="getPlaceholderMessagePageControl";this._objectsRegister[s]=function(){var m=new M({showHeader:false,text:t._getMessagePageErrorMessage(),description:""});t._objectsRegister[s]=function(){m.setText(t._getMessagePageErrorMessage());return m;};return m;};};P.prototype._initOverflowToolbarControl=function(){var t=this,o=this.getId()+"-overflowToolbar",s=o+"-title",f="getOverflowToolbarControl";this._objectsRegister[f]=function(i){if(i===true){return null;}var g=new O(o,{}),h=new T(s,{text:t.getTitle()}),j=t._objectsRegister.getToolbarDownloadButtonControl();function k(){if(t._isDisplayDownloadButton()){g.addContent(j);}else{g.removeContent(j);}j.setEnabled(t._bRenderPdfContent);h.setText(t.getTitle());}g.addStyleClass("sapUiTinyMarginBottom");g.addContent(h);g.addContent(new b());k();j.setLayoutData(new c({priority:d.NeverOverflow}));t._objectsRegister[f]=function(i){if(!i){k();}return g;};return g;};};P.prototype._initToolbarDownloadButtonControl=function(){var t=this,s=this.getId()+"-toolbarDownloadButton",f="getToolbarDownloadButtonControl";this._objectsRegister[f]=function(i){if(i){return null;}var o=new a(s,{type:e.Transparent,icon:"sap-icon://download"});o.attachPress(t.downloadPDF.bind(t));o.setEnabled(t._bRenderPdfContent);t._objectsRegister[f]=function(){o.setEnabled(t._bRenderPdfContent);return o;};return o;};};P.prototype._initPopupDownloadButtonControl=function(){var t=this,s=this.getId()+"-popupDownloadButton",f="getPopupDownloadButtonControl";this._objectsRegister[f]=function(){var o=new B(s,{text:t._getLibraryResourceBundle().getText("PDF_VIEWER_DOWNLOAD_TEXT"),type:e.Emphasized});o.attachPress(t.downloadPDF.bind(t));o.setEnabled(t._bRenderPdfContent);t._objectsRegister[f]=function(){o.setEnabled(t._bRenderPdfContent);return o;};return o;};};}};return p;},true);
