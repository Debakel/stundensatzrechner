/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./ListItemBaseRenderer','sap/ui/core/Renderer','sap/ui/core/library','sap/ui/Device'],function(L,R,c,D){"use strict";var T=c.TextDirection;var O=R.extend(L);O.renderAttributeStatus=function(r,l,a,s){if(!a&&!s||(a&&a._isEmpty()&&s&&s._isEmpty())){return;}r.write("<div");r.addClass("sapMObjLAttrRow");r.writeClasses();r.write(">");if(a&&!a._isEmpty()){r.write("<div");r.addClass("sapMObjLAttrDiv");if(s&&(!s._isEmpty())){if(s instanceof Array){r.addClass("sapMObjAttrWithMarker");}}r.writeClasses();if(!s||s._isEmpty()){r.addStyle("width","100%");r.writeStyles();}r.write(">");r.renderControl(a);r.write("</div>");}if(s&&!s._isEmpty()){r.write("<div");r.addClass("sapMObjLStatusDiv");if(s instanceof Array&&s.length>0){r.addClass("sapMObjStatusMarker");}r.writeClasses();if(!a||a._isEmpty()){r.addStyle("width","100%");r.writeStyles();}r.write(">");if(s instanceof Array){while(s.length>0){r.renderControl(s.shift());}}else{r.renderControl(s);}r.write("</div>");}r.write("</div>");};O.renderLIAttributes=function(r,l){r.addClass("sapMObjLItem");r.addClass("sapMObjLListModeDiv");};O.renderLIContent=function(r,l){var o=l.getAggregation("_objectNumber"),t=l.getTitleTextDirection(),i=l.getIntroTextDirection();if(l.getIntro()){r.write("<div");r.addClass("sapMObjLIntro");r.writeClasses();r.writeAttribute("id",l.getId()+"-intro");r.write(">");r.write("<span");if(i!==T.Inherit){r.writeAttribute("dir",i.toLowerCase());}r.write(">");r.writeEscaped(l.getIntro());r.write("</span>");r.write("</div>");}r.write("<div");r.addClass("sapMObjLTopRow");r.writeClasses();r.write(">");if(!!l.getIcon()){r.write("<div");r.addClass("sapMObjLIconDiv");r.writeClasses();r.write(">");r.renderControl(l._getImageControl());r.write("</div>");}r.write("<div");r.addClass("sapMObjLNumberDiv");r.writeClasses();r.write(">");if(o&&o.getNumber()){o.setTextDirection(l.getNumberTextDirection());r.renderControl(o);}r.write("</div>");r.write("<div");r.addStyle("display","-webkit-box");r.addStyle("overflow","hidden");r.writeStyles();r.write(">");var a=l._getTitleText();if(a){a.setTextDirection(t);a.setText(l.getTitle());a.addStyleClass("sapMObjLTitle");r.renderControl(a);}r.write("</div>");r.write("</div>");r.write("<div style=\"clear: both;\"></div>");if(l._hasBottomContent()){r.write("<div");r.addClass("sapMObjLBottomRow");r.writeClasses();r.write(">");var A=l._getVisibleAttributes();var s=[];var m=l._getVisibleMarkers();m._isEmpty=function(){return!(m.length);};if(!m._isEmpty()){s.push(m);}s.push(l.getFirstStatus());s.push(l.getSecondStatus());while(A.length>0){this.renderAttributeStatus(r,l,A.shift(),s.shift());}while(s.length>0){this.renderAttributeStatus(r,l,null,s.shift());}r.write("</div>");}};O.getAriaLabelledBy=function(l){var a=[],f=l.getFirstStatus(),s=l.getSecondStatus();if(l.getIntro()){a.push(l.getId()+"-intro");}if(l.getTitle()){a.push(l.getId()+"-titleText");}if(l.getNumber()){a.push(l.getId()+"-ObjectNumber");}if(l.getAttributes()){l.getAttributes().forEach(function(b){if(!b._isEmpty()){a.push(b.getId());}});}if(f&&!f._isEmpty()){a.push(f.getId());}if(s&&!s._isEmpty()){a.push(s.getId());}if(l.getMarkers()){l.getMarkers().forEach(function(m){a.push(m.getId()+"-text");});}return a.join(" ");};return O;},true);
