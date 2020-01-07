/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','sap/ui/core/Control','sap/ui/Device','sap/ui/core/ResizeHandler','sap/ui/core/library','sap/ui/core/HTML','sap/m/ScrollContainer','sap/ui/core/theming/Parameters','sap/ui/dom/units/Rem','./CarouselRenderer','./CarouselLayout',"sap/ui/events/KeyCodes","sap/base/Log","sap/ui/events/F6Navigation","sap/ui/thirdparty/jquery",'sap/ui/thirdparty/mobify-carousel','sap/ui/core/IconPool'],function(l,C,D,R,c,H,S,P,a,b,d,K,L,F,q){"use strict";var B=c.BusyIndicatorSize;var I=l.ImageHelper;var f=l.CarouselArrowsPlacement;var g=l.PlacementType;var h=C.extend("sap.m.Carousel",{metadata:{library:"sap.m",designtime:"sap/m/designtime/Carousel.designtime",properties:{height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},loop:{type:"boolean",group:"Misc",defaultValue:false},showPageIndicator:{type:"boolean",group:"Appearance",defaultValue:true},pageIndicatorPlacement:{type:"sap.m.PlacementType",group:"Appearance",defaultValue:g.Bottom},showBusyIndicator:{type:"boolean",group:"Appearance",defaultValue:true,deprecated:true},arrowsPlacement:{type:"sap.m.CarouselArrowsPlacement",group:"Appearance",defaultValue:f.Content}},defaultAggregation:"pages",aggregations:{pages:{type:"sap.ui.core.Control",multiple:true,singularName:"page"},customLayout:{type:"sap.m.CarouselLayout",multiple:false}},associations:{activePage:{type:"sap.ui.core.Control",multiple:false}},events:{loadPage:{deprecated:true,parameters:{pageId:{type:"string"}}},unloadPage:{deprecated:true,parameters:{pageId:{type:"string"}}},pageChanged:{parameters:{oldActivePageId:{type:"string"},newActivePageId:{type:"string"},activePages:{type:"array"}}},beforePageChanged:{parameters:{activePages:{type:"array"}}}}}});h._INNER_SELECTOR=".sapMCrslInner";h._PAGE_INDICATOR_SELECTOR=".sapMCrslBulleted";h._PAGE_INDICATOR_ARROWS_SELECTOR=".sapMCrslIndicatorArrow";h._CONTROLS=".sapMCrslControls";h._ITEM_SELECTOR=".sapMCrslItem";h._LEFTMOST_CLASS="sapMCrslLeftmost";h._RIGHTMOST_CLASS="sapMCrslRightmost";h._LATERAL_CLASSES="sapMCrslLeftmost sapMCrslRightmost";h._MODIFIERNUMBERFORKEYBOARDHANDLING=10;h._BULLETS_TO_NUMBERS_THRESHOLD=9;h._PREVIOUS_CLASS_ARROW="sapMCrslPrev";h._NEXT_CLASS_ARROW="sapMCrslNext";h.prototype.init=function(){this._aScrollContainers=[];this._fnAdjustAfterResize=q.proxy(function(){var $=this.$().find(h._INNER_SELECTOR);this._oMobifyCarousel.resize($);this._setWidthOfPages(this._getNumberOfItemsToShow());},this);this._aOrderOfFocusedElements=[];this._aAllActivePages=[];this._aAllActivePagesIndexes=[];this._onBeforePageChangedRef=this._onBeforePageChanged.bind(this);this._onAfterPageChangedRef=this._onAfterPageChanged.bind(this);this.data("sap-ui-fastnavgroup","true",true);};h.prototype.exit=function(){if(this._oMobifyCarousel){this._oMobifyCarousel.destroy();delete this._oMobifyCarousel;}if(this._oArrowLeft){this._oArrowLeft.destroy();delete this._oArrowLeft;}if(this._oArrowRight){this._oArrowRight.destroy();delete this._oArrowRight;}if(this._sResizeListenerId){R.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}this.$().off('afterSlide');this._cleanUpScrollContainer();this._fnAdjustAfterResize=null;this._aScrollContainers=null;this._$InnerDiv=null;this._aOrderOfFocusedElements=null;this._aAllActivePages=null;this._aAllActivePagesIndexes=null;};h.prototype._cleanUpScrollContainer=function(){var s;while(this._aScrollContainers&&this._aScrollContainers.length>0){s=this._aScrollContainers.pop();s.destroyContent();if(s&&typeof s.destroy==='function'){s.destroy();}}};h.prototype.ontouchstart=function(e){if(this._oMobifyCarousel){this._oMobifyCarousel.touchstart(e);}};h.prototype.ontouchmove=function(e){if(this._oMobifyCarousel){this._oMobifyCarousel.touchmove(e);}};h.prototype.ontouchend=function(e){if(this._oMobifyCarousel){this._oMobifyCarousel.touchend(e);}};h.prototype.onBeforeRendering=function(){var A=this.getActivePage();if(!A&&this.getPages().length>0){this.setAssociation("activePage",this.getPages()[0].getId(),true);}if(this._sResizeListenerId){R.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}return this;};h.prototype._getNumberOfItemsToShow=function(){var p=this.getPages().length,o=this.getCustomLayout(),n=1;if(o&&o.isA("sap.m.CarouselLayout")){n=Math.max(o.getVisiblePagesCount(),1);}if(n>1&&p<n){return p;}return n;};h.prototype.onAfterRendering=function(){var n=this._getNumberOfItemsToShow();if(this._oMobifyCarousel){this._oMobifyCarousel.unbind();}this.$().carousel(undefined,{numberOfItemsToShow:n});this._oMobifyCarousel=this.getDomRef()._carousel;this._oMobifyCarousel.setLoop(this.getLoop());this._oMobifyCarousel.setRTL(sap.ui.getCore().getConfiguration().getRTL());if(n>1){this._setWidthOfPages(n);}var A=this.getActivePage();if(A){this._updateActivePages(A);var i=this._getPageNumber(A);if(isNaN(i)||i==0){if(this.getPages().length>0){this.setAssociation("activePage",this.getPages()[0].getId(),true);this._adjustHUDVisibility(1);}}else{var o=sap.ui.getCore();if(o.isThemeApplied()){this._moveToPage(i+1);}else{o.attachThemeChanged(this._handleThemeLoad,this);}if(this.getParent()&&this.getParent().isA("sap.zen.commons.layout.PositionContainer")){if(this._isCarouselUsedWithCommonsLayout===undefined){setTimeout(this["invalidate"].bind(this),0);this._isCarouselUsedWithCommonsLayout=true;}}}}this.$().on('beforeSlide',this._onBeforePageChangedRef);this.$().on('afterSlide',this._onAfterPageChangedRef);this._$InnerDiv=this.$().find(h._INNER_SELECTOR)[0];this._sResizeListenerId=R.register(this._$InnerDiv,this._fnAdjustAfterResize);this.$().find('.sapMCrslItemTableCell').focus(function(e){e.preventDefault();q(e.target).parents('.sapMCrsl').focus();return false;});var s='sap.m.IconTabBar';var p=this.getParent();while(p){if(p.getMetadata().getName()==s){var t=this;p.attachExpand(function(e){var E=e.getParameter('expand');if(E&&i>0){t._moveToPage(i+1);}});break;}p=p.getParent();}};h.prototype._onBeforePageChanged=function(e,p,n){if(e.target!==this.getDomRef()){return;}var N=this.getPages()[n-1].getId();this._updateActivePages(N);this.fireBeforePageChanged({activePages:this._aAllActivePagesIndexes});};h.prototype._onAfterPageChanged=function(e,p,n){if(e.target!==this.getDomRef()){return;}if(n>0){this._changePage(n);}};h.prototype._setWidthOfPages=function(n){var i=this._calculatePagesWidth(n);this.$().find(".sapMCrslItem").each(function(e,p){p.style.width=i+"%";});};h.prototype._calculatePagesWidth=function(n){var w=this.$().width(),m=a.toPx(P.get("_sap_m_Carousel_PagesMarginRight")),i=(w-(m*(n-1)))/n,e=(i/w)*100;return e;};h.prototype._handleThemeLoad=function(){var o,A=this.getActivePage();if(A){var i=this._getPageNumber(A);if(i>0){this._moveToPage(i+1);}}o=sap.ui.getCore();o.detachThemeChanged(this._handleThemeLoad,this);};h.prototype._moveToPage=function(i){this._oMobifyCarousel.changeAnimation('sapMCrslNoTransition');this._oMobifyCarousel.move(i);this._changePage(i);};h.prototype._changePage=function(n){this._adjustHUDVisibility(n);var o=this.getActivePage();var N=this.getPages()[n-1].getId();this.setAssociation("activePage",N,true);var t=this._getPageIndicatorText(n);L.debug("sap.m.Carousel: firing pageChanged event: old page: "+o+", new page: "+N);if(!D.system.desktop){q(document.activeElement).blur();}this.firePageChanged({oldActivePageId:o,newActivePageId:N,activePages:this._aAllActivePagesIndexes});this.$('slide-number').text(t);};h.prototype._getPageIndicatorText=function(n){return sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("CAROUSEL_PAGE_INDICATOR_TEXT",[n,this.getPages().length-this._getNumberOfItemsToShow()+1]);};h.prototype._adjustHUDVisibility=function(n){var N=this._getNumberOfItemsToShow();if(D.system.desktop&&!this.getLoop()&&this.getPages().length>1){var $=this.$('hud');$.removeClass(h._LATERAL_CLASSES);if(n===1){$.addClass(h._LEFTMOST_CLASS);this._focusCarouselContainer($,h._PREVIOUS_CLASS_ARROW);}if((n+N-1)===this.getPages().length){$.addClass(h._RIGHTMOST_CLASS);this._focusCarouselContainer($,h._NEXT_CLASS_ARROW);}}};h.prototype._focusCarouselContainer=function($,A){if($.find('.'+A)[0]===document.activeElement){this.focus();}};h.prototype.setActivePage=function(p){var s=null;if(typeof(p)=='string'){s=p;}else if(p instanceof C){s=p.getId();}if(s){if(s===this.getActivePage()){return this;}var i=this._getPageNumber(s);if(!isNaN(i)){if(this._oMobifyCarousel){this._oMobifyCarousel.move(i+1);}}}this.setAssociation("activePage",s,true);return this;};h.prototype.setHeight=function(o){this.setProperty("height",o,true);this.$().css("height",o);return this;};h.prototype.setWidth=function(w){this.setProperty("width",w,true);this.$().css("width",w);return this;};h.prototype.setLoop=function(e){this.setProperty("loop",e,true);if(this._oMobifyCarousel){this._oMobifyCarousel.setLoop(e);}return this;};h.prototype._getNavigationArrow=function(n){var p={src:"sap-icon://slim-arrow-"+n,useIconTooltip:false};if(n==="left"){if(!this._oArrowLeft){this._oArrowLeft=I.getImageControl(this.getId()+"-arrowScrollLeft",this._oArrowLeft,this,p);}return this._oArrowLeft;}else if(n==="right"){if(!this._oArrowRight){this._oArrowRight=I.getImageControl(this.getId()+"-arrowScrollRight",this._oArrowRight,this,p);}return this._oArrowRight;}};h.prototype._createScrollContainer=function(p){var i;var s=D.system.desktop&&this.getArrowsPlacement()===f.PageIndicator;if(s){i="sapMCrslImg";}else{i="sapMCrslImgNoArrows";}var j=p.isA("sap.m.Image")?"sapMCrslItemTableCell "+i:"sapMCrslItemTableCell",o=new H({content:"<div class='sapMCrslItemTable'>"+"<div class='"+j+"'></div>"+"</div>",afterRendering:function(e){var r=sap.ui.getCore().createRenderManager();p.addStyleClass("sapMCrsPage");r.render(p,this.getDomRef().firstChild);r.destroy();p=null;}});var k=new S({horizontal:false,vertical:false,content:[o],width:'100%',height:'100%'});k.setParent(this,null,true);this._aScrollContainers.push(k);return k;};h.prototype.previous=function(){if(this._oMobifyCarousel){this._oMobifyCarousel.prev();}else{L.warning("Unable to execute sap.m.Carousel.previous: carousel must be rendered first.");}return this;};h.prototype.next=function(){if(this._oMobifyCarousel){this._oMobifyCarousel.next();}else{L.warning("Unable to execute sap.m.Carousel.next: carousel must be rendered first.");}return this;};h.prototype._getPageNumber=function(p){var i,r;for(i=0;i<this.getPages().length;i++){if(this.getPages()[i].getId()==p){r=i;break;}}return r;};h.prototype.onsaptabprevious=function(e){this._bDirection=false;this._fnOnTabPress(e);};h.prototype.onsaptabnext=function(e){this._bDirection=true;this._fnOnTabPress(e);};h.prototype.onfocusin=function(e){this.saveLastFocusReference(e);this._bDirection=undefined;};h.prototype.onsapskipforward=function(e){e.preventDefault();this._handleGroupNavigation(e,false);};h.prototype.onsapskipback=function(e){e.preventDefault();this._handleGroupNavigation(e,true);};h.prototype.onkeydown=function(e){if(e.keyCode==K.F7){this._handleF7Key(e);return;}if(e.target!=this.getDomRef()){return;}switch(e.keyCode){case 189:case K.NUMPAD_MINUS:this._fnSkipToIndex(e,-1);break;case K.PLUS:case K.NUMPAD_PLUS:this._fnSkipToIndex(e,1);break;}};h.prototype.onsapescape=function(e){var i;if(e.target===this.$()[0]&&this._lastActivePageNumber){i=this._lastActivePageNumber+1;this._oMobifyCarousel.move(i);this._changePage(i);}};h.prototype.onsapright=function(e){this._fnSkipToIndex(e,1);};h.prototype.onsapup=function(e){this._fnSkipToIndex(e,-1);};h.prototype.onsapleft=function(e){this._fnSkipToIndex(e,-1);};h.prototype.onsapdown=function(e){this._fnSkipToIndex(e,1);};h.prototype.onsaphome=function(e){this._fnSkipToIndex(e,0);};h.prototype.onsapend=function(e){this._fnSkipToIndex(e,this.getPages().length);};h.prototype.onsaprightmodifiers=function(e){if(e.ctrlKey){this._fnSkipToIndex(e,h._MODIFIERNUMBERFORKEYBOARDHANDLING);}};h.prototype.onsapupmodifiers=function(e){if(e.ctrlKey){this._fnSkipToIndex(e,h._MODIFIERNUMBERFORKEYBOARDHANDLING);}};h.prototype.onsappageup=function(e){this._fnSkipToIndex(e,h._MODIFIERNUMBERFORKEYBOARDHANDLING);};h.prototype.onsapleftmodifiers=function(e){if(e.ctrlKey){this._fnSkipToIndex(e,-h._MODIFIERNUMBERFORKEYBOARDHANDLING);}};h.prototype.onsapdownmodifiers=function(e){if(e.ctrlKey){this._fnSkipToIndex(e,-h._MODIFIERNUMBERFORKEYBOARDHANDLING);}};h.prototype.onsappagedown=function(e){this._fnSkipToIndex(e,-h._MODIFIERNUMBERFORKEYBOARDHANDLING);};h.prototype._fnOnTabPress=function(e){if(e.target===this.$()[0]){this._lastActivePageNumber=this._getPageNumber(this.getActivePage());}};h.prototype._handleGroupNavigation=function(e,s){var E=q.Event("keydown");e.preventDefault();this.$().focus();E.target=e.target;E.keyCode=K.F6;E.shiftKey=s;F.handleF6GroupNavigation(E);};h.prototype.saveLastFocusReference=function(e){var o=q(e.target).closest(".sapMCrsPage").control(0),s;if(this._bDirection===undefined){return;}if(this._lastFocusablePageElement===undefined){this._lastFocusablePageElement={};}if(o){s=o.getId();this._lastFocusablePageElement[s]=e.target;this._updateFocusedPagesOrder(s);}};h.prototype._getActivePageLastFocusedElement=function(){if(this._lastFocusablePageElement){return this._lastFocusablePageElement[this._getLastFocusedActivePage()];}};h.prototype._updateFocusedPagesOrder=function(s){var i=this._aOrderOfFocusedElements.indexOf(s);if(i>-1){this._aOrderOfFocusedElements.splice(0,0,this._aOrderOfFocusedElements.splice(i,1)[0]);}else{this._aOrderOfFocusedElements.unshift(s);}};h.prototype._updateActivePages=function(n){var N=this._getPageNumber(n),e=this._getNumberOfItemsToShow(),j=N+e,A=this.getPages();if(j>A.length){j=A.length-e;}this._aAllActivePages=[];this._aAllActivePagesIndexes=[];for(var i=N;i<j;i++){this._aAllActivePages.push(A[i].getId());this._aAllActivePagesIndexes.push(i);}};h.prototype._getLastFocusedActivePage=function(){for(var i=0;i<this._aOrderOfFocusedElements.length;i++){var p=this._aOrderOfFocusedElements[i];if(this._aAllActivePages.indexOf(p)>-1){return p;}}return this.getActivePage();};h.prototype._fnSkipToIndex=function(e,n){var i=n;if(e.target!==this.getDomRef()){return;}e.preventDefault();if(n!==0){i=this._getPageNumber(this.getActivePage())+1+n;}this._oMobifyCarousel.move(i);};h.prototype._handleF7Key=function(e){var A;e.preventDefault();A=this._getActivePageLastFocusedElement();if(e.target===this.$()[0]&&A){A.focus();}else{this.$().focus();}};h.prototype.setShowBusyIndicator=function(){L.warning("sap.m.Carousel: Deprecated function 'setShowBusyIndicator' called. Does nothing.");return this;};h.prototype.getShowBusyIndicator=function(){L.warning("sap.m.Carousel: Deprecated function 'getShowBusyIndicator' called. Does nothing.");return false;};h.prototype.setBusyIndicatorSize=function(s){if(!(s in B)){s=B.Medium;}return C.prototype.setBusyIndicatorSize.call(this,s);};return h;});
