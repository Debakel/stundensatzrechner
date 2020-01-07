/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./ListItemBaseRenderer','sap/ui/core/Renderer'],function(L,R){"use strict";var T=R.extend(L);T.renderLIAttributes=function(r,l){r.addClass("sapMTreeItemBase");if(!l.isTopLevel()){r.addClass("sapMTreeItemBaseChildren");}if(l.isLeaf()){r.addClass("sapMTreeItemBaseLeaf");}var i=l._getPadding();if(sap.ui.getCore().getConfiguration().getRTL()){r.addStyle("padding-right",i+"rem");}else{r.addStyle("padding-left",i+"rem");}};T.renderContentFormer=function(r,l){this.renderHighlight(r,l);this.renderExpander(r,l);this.renderMode(r,l,-1);};T.renderExpander=function(r,l){var e=l._getExpanderControl();if(e){r.renderControl(e);}};T.getAriaRole=function(l){return"treeitem";};T.getAccessibilityState=function(l){var a=L.getAccessibilityState.call(this,l);a.level=l.getLevel()+1;if(!l.isLeaf()){a.expanded=l.getExpanded();}return a;};return T;},true);
