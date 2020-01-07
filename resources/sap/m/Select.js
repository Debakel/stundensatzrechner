/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Dialog','./Popover','./SelectList','./library','sap/ui/core/Control','sap/ui/core/EnabledPropagator','sap/ui/core/Icon','sap/ui/core/IconPool','./Button','./Bar','./Title','./delegate/ValueStateMessage','sap/ui/core/message/MessageMixin','sap/ui/core/library','sap/ui/core/Item','sap/ui/Device','sap/ui/core/InvisibleText','./SelectRenderer',"sap/ui/dom/containsOrEquals","sap/ui/events/KeyCodes",'./Text','sap/ui/layout/SimpleFixFlex'],function(D,P,S,l,C,E,I,a,B,b,T,V,M,c,d,e,f,g,h,K,j,k){"use strict";var m=l.SelectListKeyboardNavigationMode;var n=l.PlacementType;var o=c.ValueState;var p=c.TextDirection;var q=c.TextAlign;var r=l.SelectType;var s=C.extend("sap.m.Select",{metadata:{interfaces:["sap.ui.core.IFormContent","sap.m.IOverflowToolbarContent","sap.f.IShellBar"],library:"sap.m",properties:{name:{type:"string",group:"Misc",defaultValue:""},enabled:{type:"boolean",group:"Behavior",defaultValue:true},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"auto"},maxWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%"},selectedKey:{type:"string",group:"Data",defaultValue:""},selectedItemId:{type:"string",group:"Misc",defaultValue:""},icon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:""},type:{type:"sap.m.SelectType",group:"Appearance",defaultValue:r.Default},autoAdjustWidth:{type:"boolean",group:"Appearance",defaultValue:false},textAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:q.Initial},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:p.Inherit},valueState:{type:"sap.ui.core.ValueState",group:"Appearance",defaultValue:o.None},valueStateText:{type:"string",group:"Misc",defaultValue:""},showSecondaryValues:{type:"boolean",group:"Misc",defaultValue:false},forceSelection:{type:"boolean",group:"Behavior",defaultValue:true}},defaultAggregation:"items",aggregations:{items:{type:"sap.ui.core.Item",multiple:true,singularName:"item",bindable:"bindable",forwarding:{getter:"getList",aggregation:"items"}},picker:{type:"sap.ui.core.PopupInterface",multiple:false,visibility:"hidden"},_valueIcon:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"},_pickerHeader:{type:"sap.m.Bar",multiple:false,visibility:"hidden"},_pickerValueStateContent:{type:"sap.m.Text",multiple:false,visibility:"hidden"}},associations:{selectedItem:{type:"sap.ui.core.Item",multiple:false},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{change:{parameters:{selectedItem:{type:"sap.ui.core.Item"}}}},designtime:"sap/m/designtime/Select.designtime"}});a.insertFontFaceStyle();E.apply(s.prototype,[true]);M.call(s.prototype);function H(i){if(i){this.setSelection(i);this.setValue(i.getText());this.scrollToItem(i);}}s.prototype._handleFocusout=function(i){this._bFocusoutDueRendering=this.bRenderingPhase;if(this._bFocusoutDueRendering){this._bProcessChange=false;return;}if(this._bProcessChange){if(!this.isOpen()||i.target===this.getAggregation("picker")){this._checkSelectionChange();}else{this._revertSelection();}this._bProcessChange=false;}else{this._bProcessChange=true;}};s.prototype._checkSelectionChange=function(){var i=this.getSelectedItem();if(this._oSelectionOnFocus!==i){this.fireChange({selectedItem:i});}};s.prototype._revertSelection=function(){var i=this.getSelectedItem();if(this._oSelectionOnFocus!==i){this.setSelection(this._oSelectionOnFocus);this.setValue(this._getSelectedItemText());}};s.prototype._getSelectedItemText=function(i){i=i||this.getSelectedItem();if(!i){i=this.getDefaultSelectedItem();}if(i){return i.getText();}return"";};s.prototype.getOverflowToolbarConfig=function(){var i=["enabled","selectedKey"];if(!this.getAutoAdjustWidth()||this._bIsInOverflow){i.push("selectedItemId");}var t={canOverflow:true,autoCloseEvents:["change"],invalidationEvents:["_itemTextChange"],propsUnrelatedToSize:i};t.onBeforeEnterOverflow=function(u){var v=u.getParent();if(!v.isA("sap.m.OverflowToolbar")){return;}u._prevSelectType=u.getType();u._bIsInOverflow=true;if(u.getType()!==r.Default){u.setProperty("type",r.Default,true);}};t.onAfterExitOverflow=function(u){var v=u.getParent();if(!v.isA("sap.m.OverflowToolbar")){return;}u._bIsInOverflow=false;if(u.getType()!==u._prevSelectType){u.setProperty("type",u._prevSelectType,true);}};return t;};s.prototype.getList=function(){if(this.bIsDestroyed){return null;}return this._oList;};s.prototype.findFirstEnabledItem=function(i){var L=this.getList();return L?L.findFirstEnabledItem(i):null;};s.prototype.findLastEnabledItem=function(i){var L=this.getList();return L?L.findLastEnabledItem(i):null;};s.prototype.setSelectedIndex=function(i,_){var t;_=_||this.getItems();i=(i>_.length-1)?_.length-1:Math.max(0,i);t=_[i];if(t){this.setSelection(t);}};s.prototype.scrollToItem=function(i){var t=this.getPicker().getDomRef(),u=i&&i.getDomRef();if(!t||!u){return;}var v=t.querySelector('.sapUiSimpleFixFlexFlexContent'),w=t.querySelector('.sapMSltPickerValueState'),x=w?w.clientHeight:0,y=v.scrollTop,z=u.offsetTop-x,A=v.clientHeight,F=u.offsetHeight;if(y>z){v.scrollTop=z;}else if((z+F)>(y+A)){v.scrollTop=Math.ceil(z+F-A);}};s.prototype.setValue=function(v){var i=this.getDomRef(),t=i&&i.querySelector(".sapMSelectListItemText");if(t){t.textContent=v;}this._getValueIcon();};s.prototype._getValueIcon=function(){if(this.bIsDestroyed){return null;}var v=this.getAggregation("_valueIcon"),i=this.getSelectedItem(),t=!!(i&&i.getIcon&&i.getIcon()),u=t?i.getIcon():"sap-icon://pull-down";if(!v){v=new I(this.getId()+"-labelIcon",{src:u,visible:false});this.setAggregation("_valueIcon",v,true);}if(v.getVisible()!==t){v.setVisible(t);v.toggleStyleClass("sapMSelectListItemIcon",t);}if(t&&i.getIcon()!==v.getSrc()){v.setSrc(u);}return v;};s.prototype._isShadowListRequired=function(){if(this.getAutoAdjustWidth()){return false;}else if(this.getWidth()==="auto"){return true;}return false;};s.prototype._handleAriaActiveDescendant=function(i){var t=this.getDomRef(),u=i&&i.getDomRef(),A="aria-activedescendant";if(!t){return;}if(u&&this.isOpen()){t.setAttribute(A,i.getId());}else{t.removeAttribute(A);}};s.prototype.updateItems=function(R){S.prototype.updateItems.apply(this,arguments);this._oSelectionOnFocus=this.getSelectedItem();};s.prototype.refreshItems=function(){S.prototype.refreshItems.apply(this,arguments);};s.prototype.onBeforeOpen=function(i){var t=this["_onBeforeOpen"+this.getPickerType()],u=this.getRenderer().CSS_CLASS;this.addStyleClass(u+"Pressed");this.addStyleClass(u+"Expanded");this.closeValueStateMessage();this.addContent();t&&t.call(this);};s.prototype.onAfterOpen=function(i){var t=this.getFocusDomRef(),u=null,$=this.$("label");if(!t){return;}u=this.getSelectedItem();t.setAttribute("aria-expanded","true");$.attr("aria-live",null);t.setAttribute("aria-controls",this.getList().getId());if(u){t.setAttribute("aria-activedescendant",u.getId());this.scrollToItem(u);}};s.prototype.onBeforeClose=function(i){var t=this.getFocusDomRef(),u=this.getRenderer().CSS_CLASS;if(t){t.removeAttribute("aria-controls");t.removeAttribute("aria-activedescendant");if(this.shouldValueStateMessageBeOpened()&&(document.activeElement===t)){this.openValueStateMessage();}}this.removeStyleClass(u+"Expanded");};s.prototype.onAfterClose=function(i){var t=this.getFocusDomRef(),u=this.getRenderer().CSS_CLASS,v=u+"Pressed",$=this.$("label");if(t){t.setAttribute("aria-expanded","false");t.removeAttribute("aria-activedescendant");$.attr("aria-live","polite");}this.removeStyleClass(v);};s.prototype.getPicker=function(){if(this.bIsDestroyed){return null;}return this.createPicker(this.getPickerType());};s.prototype.setPickerType=function(i){this._sPickerType=i;};s.prototype.getPickerType=function(){return this._sPickerType;};s.prototype._getPickerValueStateContent=function(){if(!this.getAggregation("_pickerValueStateContent")){this.setAggregation("_pickerValueStateContent",new j({wrapping:true,text:this._getTextForPickerValueStateContent()}));}return this.getAggregation("_pickerValueStateContent");};s.prototype._updatePickerValueStateContentText=function(){var i=this.getPicker().getContent()[0].getFixContent(),t;if(i){t=this._getTextForPickerValueStateContent();i.setText(t);}};s.prototype._getTextForPickerValueStateContent=function(){var v=this.getValueStateText(),t;if(v){t=v;}else{t=this._getDefaultTextForPickerValueStateContent();}return t;};s.prototype._getDefaultTextForPickerValueStateContent=function(){var v=this.getValueState(),R,t;if(v===o.None){t="";}else{R=sap.ui.getCore().getLibraryResourceBundle("sap.ui.core");t=R.getText("VALUE_STATE_"+v.toUpperCase());}return t;};s.prototype._updatePickerValueStateContentStyles=function(){var v=this.getValueState(),i=o,t=this.getRenderer().CSS_CLASS,u=t+"Picker",w=u+v+"State",x=u+"WithSubHeader",y=this.getPicker(),z=y.getContent()[0].getFixContent();if(z){this._removeValueStateClassesForPickerValueStateContent(y);z.addStyleClass(w);if(v!==i.None){y.addStyleClass(x);}else{y.removeStyleClass(x);}}};s.prototype._removeValueStateClassesForPickerValueStateContent=function(i){var v=o,t=this.getRenderer().CSS_CLASS,u=t+"Picker",w=i.getContent()[0].getFixContent();Object.keys(v).forEach(function(x){var O=u+x+"State";w.removeStyleClass(O);});};s.prototype._createPopover=function(){var t=this;var i=new P({showArrow:false,showHeader:false,placement:n.VerticalPreferredBottom,offsetX:0,offsetY:0,initialFocus:this,bounce:false,ariaLabelledBy:[this.getPickerValueStateContentId(),this._getPickerHiddenLabelId()]});i.addEventDelegate({ontouchstart:function(u){var v=this.getDomRef("cont");if((u.target===v)||(u.srcControl instanceof d)){t._bProcessChange=false;}}},i);this._decoratePopover(i);return i;};s.prototype._decoratePopover=function(i){var t=this;i.open=function(){return this.openBy(t);};};s.prototype._onBeforeRenderingPopover=function(){var i=this.getPicker(),w=this.$().outerWidth()+"px";if(i){i.setContentMinWidth(w);}};s.prototype._createDialog=function(){var t=this;return new D({stretch:true,ariaLabelledBy:[this.getPickerValueStateContentId(),this._getPickerHiddenLabelId()],customHeader:this._getPickerHeader(),beforeOpen:function(){t.updatePickerHeaderTitle();}});};s.prototype._getPickerTitle=function(){var i=this.getPicker(),t=i&&i.getCustomHeader();if(t){return t.getContentMiddle()[0];}return null;};s.prototype._getPickerHeader=function(){var i=a.getIconURI("decline"),R;if(!this.getAggregation("_pickerHeader")){R=sap.ui.getCore().getLibraryResourceBundle("sap.m");this.setAggregation("_pickerHeader",new b({contentMiddle:new T({text:R.getText("SELECT_PICKER_TITLE_TEXT")}),contentRight:new B({icon:i,press:this.close.bind(this)})}));}return this.getAggregation("_pickerHeader");};s.prototype._getPickerHiddenLabelId=function(){return f.getStaticId("sap.m","INPUT_AVALIABLE_VALUES");};s.prototype.getPickerValueStateContentId=function(){return this.getId()+"-valueStateText";};s.prototype.updatePickerHeaderTitle=function(){var i=this.getPicker();if(!i){return;}var L=this.getLabels();if(L.length){var t=L[0],u=this._getPickerTitle();if(t&&(typeof t.getText==="function")){u&&u.setText(t.getText());}}};s.prototype._onBeforeOpenDialog=function(){};s.prototype.init=function(){this.setPickerType(e.system.phone?"Dialog":"Popover");this.createPicker(this.getPickerType());this._oSelectionOnFocus=null;this.bRenderingPhase=false;this._bFocusoutDueRendering=false;this._bProcessChange=false;this.sTypedChars="";this.iTypingTimeoutID=-1;this._oValueStateMessage=new V(this);};s.prototype.onBeforeRendering=function(){this.bRenderingPhase=true;if(e.browser.firefox&&(this.getFocusDomRef()===document.activeElement)){this._handleFocusout();}this.synchronizeSelection({forceSelection:this.getForceSelection()});this._updatePickerValueStateContentText();this._updatePickerValueStateContentStyles();};s.prototype.onAfterRendering=function(){this.bRenderingPhase=false;};s.prototype.exit=function(){var v=this.getValueStateMessage(),i=this._getValueIcon();this._oSelectionOnFocus=null;if(v){this.closeValueStateMessage();v.destroy();}if(i){i.destroy();}this._oValueStateMessage=null;};s.prototype.ontouchstart=function(i){i.setMarked();if(this.getEnabled()&&this.isOpenArea(i.target)){this.addStyleClass(this.getRenderer().CSS_CLASS+"Pressed");}};s.prototype.ontouchend=function(i){i.setMarked();if(this.getEnabled()&&!this.isOpen()&&this.isOpenArea(i.target)){this.removeStyleClass(this.getRenderer().CSS_CLASS+"Pressed");}};s.prototype.ontap=function(i){var t=this.getRenderer().CSS_CLASS;i.setMarked();if(!this.getEnabled()){return;}if(this.isOpenArea(i.target)){if(this.isOpen()){this.close();this.removeStyleClass(t+"Pressed");return;}if(e.system.phone){this.focus();}this.open();}if(this.isOpen()){this.addStyleClass(t+"Pressed");}};s.prototype.onSelectionChange=function(i){var t=i.getParameter("selectedItem");this.close();this.setSelection(t);this.fireChange({selectedItem:t});this.setValue(this._getSelectedItemText());};s.prototype.onkeypress=function(i){if(!this.getEnabled()){return;}i.setMarked();var t=String.fromCharCode(i.which),u=this.getSelectedItem(),v=t,w=null;this.sTypedChars+=t;var x=typeof this.sTypedChars==="string"&&this.sTypedChars!==""&&u&&u.getText().toLowerCase().startsWith(this.sTypedChars.toLowerCase());if(x||((this.sTypedChars.length===1)||((this.sTypedChars.length>1)&&(this.sTypedChars.charAt(0)!==this.sTypedChars.charAt(1))))){v=this.sTypedChars;}w=this.searchNextItemByText(v);clearTimeout(this.iTypingTimeoutID);this.iTypingTimeoutID=setTimeout(function(){this.sTypedChars="";this.iTypingTimeoutID=-1;}.bind(this),1000);H.call(this,w);};s.prototype.onsapshow=function(i){if(!this.getEnabled()){return;}i.setMarked();if(i.which===K.F4){i.preventDefault();}this.toggleOpenState();};s.prototype.onsaphide=s.prototype.onsapshow;s.prototype.onsapescape=function(i){if(!this.getEnabled()){return;}if(this.isOpen()){i.setMarked();this.close();this._revertSelection();}};s.prototype.onsapenter=function(i){if(!this.getEnabled()){return;}i.setMarked();this.close();this._checkSelectionChange();};s.prototype.onsapspace=function(i){i.preventDefault();};s.prototype.onkeyup=function(i){if(!this.getEnabled()){return;}if(i.which===K.SPACE&&!i.shiftKey){i.setMarked();i.preventDefault();if(this.isOpen()){this._checkSelectionChange();}this.toggleOpenState();}};s.prototype.onsapdown=function(i){if(!this.getEnabled()){return;}i.setMarked();i.preventDefault();var N,t=this.getSelectableItems();N=t[t.indexOf(this.getSelectedItem())+1];H.call(this,N);};s.prototype.onsapup=function(i){if(!this.getEnabled()){return;}i.setMarked();i.preventDefault();var t,u=this.getSelectableItems();t=u[u.indexOf(this.getSelectedItem())-1];H.call(this,t);};s.prototype.onsaphome=function(i){if(!this.getEnabled()){return;}i.setMarked();i.preventDefault();var F=this.getSelectableItems()[0];H.call(this,F);};s.prototype.onsapend=function(i){if(!this.getEnabled()){return;}i.setMarked();i.preventDefault();var L=this.findLastEnabledItem(this.getSelectableItems());H.call(this,L);};s.prototype.onsappagedown=function(i){if(!this.getEnabled()){return;}i.setMarked();i.preventDefault();var t=this.getSelectableItems(),u=this.getSelectedItem();this.setSelectedIndex(t.indexOf(u)+10,t);u=this.getSelectedItem();if(u){this.setValue(u.getText());}this.scrollToItem(u);};s.prototype.onsappageup=function(i){if(!this.getEnabled()){return;}i.setMarked();i.preventDefault();var t=this.getSelectableItems(),u=this.getSelectedItem();this.setSelectedIndex(t.indexOf(u)-10,t);u=this.getSelectedItem();if(u){this.setValue(u.getText());}this.scrollToItem(u);};s.prototype.onsaptabnext=function(i){if(!this.getEnabled()){return;}if(this.isOpen()){this.close();this._checkSelectionChange();}};s.prototype.onsaptabprevious=s.prototype.onsaptabnext;s.prototype.onfocusin=function(i){if(!this._bFocusoutDueRendering&&!this._bProcessChange){this._oSelectionOnFocus=this.getSelectedItem();}this._bProcessChange=true;setTimeout(function(){if(!this.isOpen()&&this.shouldValueStateMessageBeOpened()&&(document.activeElement===this.getFocusDomRef())){this.openValueStateMessage();}}.bind(this),100);if(i.target!==this.getFocusDomRef()){this.focus();}};s.prototype.onfocusout=function(i){this._handleFocusout(i);if(this.bRenderingPhase){return;}this.closeValueStateMessage();};s.prototype.onsapfocusleave=function(i){var t=this.getAggregation("picker");if(!i.relatedControlId||!t){return;}var u=sap.ui.getCore().byId(i.relatedControlId),F=u&&u.getFocusDomRef();if(e.system.desktop&&h(t.getFocusDomRef(),F)){this.focus();}};s.prototype.setSelection=function(i){var L=this.getList(),t;if(L){L.setSelection(i);}this.setAssociation("selectedItem",i,true);this.setProperty("selectedItemId",(i instanceof d)?i.getId():i,true);if(typeof i==="string"){i=sap.ui.getCore().byId(i);}t=i?i.getKey():"";this.setProperty("selectedKey",t,true);this._handleAriaActiveDescendant(i);};s.prototype.isSelectionSynchronized=function(){return S.prototype.isSelectionSynchronized.apply(this,arguments);};s.prototype.synchronizeSelection=function(){S.prototype.synchronizeSelection.apply(this,arguments);};s.prototype.addContent=function(i){};s.prototype.createPicker=function(i){var t=this.getAggregation("picker"),u=this.getRenderer().CSS_CLASS,v=u+"PickerValueState";if(t){return t;}t=this["_create"+i]();this.setAggregation("picker",t,true);t.setHorizontalScrolling(false).addStyleClass(u+"Picker").addStyleClass(u+"Picker-CTX").attachBeforeOpen(this.onBeforeOpen,this).attachAfterOpen(this.onAfterOpen,this).attachBeforeClose(this.onBeforeClose,this).attachAfterClose(this.onAfterClose,this).addEventDelegate({onBeforeRendering:this.onBeforeRenderingPicker,onAfterRendering:this.onAfterRenderingPicker},this).addContent(new k({id:this.getPickerValueStateContentId(),fixContent:this._getPickerValueStateContent().addStyleClass(v),flexContent:this.createList()}));return t;};s.prototype.searchNextItemByText=function(t){var u=this.getItems(),v=this.getSelectedIndex(),w=u.splice(v+1,u.length-v),x=u.splice(0,u.length-1);u=w.concat(x);for(var i=0,y;i<u.length;i++){y=u[i];var z=typeof t==="string"&&t!=="";if(y.getEnabled()&&!(y instanceof sap.ui.core.SeparatorItem)&&y.getText().toLowerCase().startsWith(t.toLowerCase())&&z){return y;}}return null;};s.prototype.createList=function(){var L=m,i=e.system.phone?L.Delimited:L.None;this._oList=new S({width:"100%",keyboardNavigationMode:i}).addStyleClass(this.getRenderer().CSS_CLASS+"List-CTX").addEventDelegate({ontap:function(t){this._checkSelectionChange();this.close();}},this).attachSelectionChange(this.onSelectionChange,this);return this._oList;};s.prototype.hasContent=function(){return this.getItems().length>0;};s.prototype.onBeforeRenderingPicker=function(){var O=this["_onBeforeRendering"+this.getPickerType()];O&&O.call(this);};s.prototype.onAfterRenderingPicker=function(){var O=this["_onAfterRendering"+this.getPickerType()];O&&O.call(this);};s.prototype.open=function(){var i=this.getPicker();if(i){i.open();}return this;};s.prototype.toggleOpenState=function(){if(this.isOpen()){this.close();}else{this.open();}return this;};s.prototype.getVisibleItems=function(){var L=this.getList();return L?L.getVisibleItems():[];};s.prototype.isItemSelected=function(i){return i&&(i.getId()===this.getAssociation("selectedItem"));};s.prototype.getSelectedIndex=function(){var i=this.getSelectedItem();return i?this.indexOfItem(this.getSelectedItem()):-1;};s.prototype.getDefaultSelectedItem=function(i){return this.getForceSelection()?this.findFirstEnabledItem():null;};s.prototype.getSelectableItems=function(){var L=this.getList();return L?L.getSelectableItems():[];};s.prototype.getOpenArea=function(){return this.getDomRef();};s.prototype.isOpenArea=function(i){var O=this.getOpenArea();return O&&O.contains(i);};s.prototype.findItem=function(i,v){var L=this.getList();return L?L.findItem(i,v):null;};s.prototype.clearSelection=function(){this.setSelection(null);};s.prototype.onItemChange=function(i){var t=this.getAssociation("selectedItem"),u=i.getParameter("id"),v=i.getParameter("name"),N=i.getParameter("newValue"),O,w,F,x;if(v==="key"&&!this.isBound("selectedKey")){w=this.getSelectedKey();F=this.getItemByKey(N);if(N===w&&t!==u&&F&&u===F.getId()){this.setSelection(F);return;}O=i.getParameter("oldValue");if(t===u&&w===O&&!this.getItemByKey(O)){this.setSelectedKey(N);return;}x=this.getItemByKey(w);if(t===u&&N!==w&&x){this.setSelection(x);return;}}if(v==="text"&&t===u){this.fireEvent("_itemTextChange");this.setValue(N);}};s.prototype.fireChange=function(i){this._oSelectionOnFocus=i.selectedItem;return this.fireEvent("change",i);};s.prototype.addAggregation=function(A,O,i){if(A==="items"&&!i&&!this.isInvalidateSuppressed()){this.invalidate(O);}return C.prototype.addAggregation.apply(this,arguments);};s.prototype.destroyAggregation=function(A,i){if(A==="items"&&!i&&!this.isInvalidateSuppressed()){this.invalidate();}return C.prototype.destroyAggregation.apply(this,arguments);};s.prototype.setAssociation=function(A,i,t){var L=this.getList();if(L&&(A==="selectedItem")){S.prototype.setAssociation.apply(L,arguments);}return C.prototype.setAssociation.apply(this,arguments);};s.prototype.setProperty=function(i,v,t){var L=this.getList();if((i==="selectedKey")||(i==="selectedItemId")){L&&S.prototype.setProperty.apply(L,arguments);}return C.prototype.setProperty.apply(this,arguments);};s.prototype.removeAllAssociation=function(A,i){var L=this.getList();if(L&&(A==="selectedItem")){S.prototype.removeAllAssociation.apply(L,arguments);}return C.prototype.removeAllAssociation.apply(this,arguments);};s.prototype.clone=function(){var i=C.prototype.clone.apply(this,arguments),t=this.getSelectedItem(),u=this.getSelectedKey();if(!this.isBound("selectedKey")&&!i.isSelectionSynchronized()){if(t&&(u==="")){i.setSelectedIndex(this.indexOfItem(t));}else{i.setSelectedKey(u);}}return i;};s.prototype.updateValueStateClasses=function(v,O){var t=this.$(),L=this.$("label"),A=this.$("arrow"),i=o,u=this.getRenderer().CSS_CLASS;if(O!==i.None){t.removeClass(u+"State");t.removeClass(u+O);L.removeClass(u+"LabelState");L.removeClass(u+"Label"+O);A.removeClass(u+"ArrowState");}if(v!==i.None){t.addClass(u+"State");t.addClass(u+v);L.addClass(u+"LabelState");L.addClass(u+"Label"+v);A.addClass(u+"ArrowState");}};s.prototype.updateAriaLabelledBy=function(v,O){var $=this.$(),A=$.attr("aria-labelledby"),i=A?A.split(" "):[],N;if(O!==o.None&&O!==o.Error){i.pop();}if(v!==o.None&&v!==o.Error){i.push(f.getStaticId("sap.ui.core","VALUE_STATE_"+v.toUpperCase()));}N=i.join(" ");$.attr("aria-labelledby",N);};s.prototype.getLabels=function(){var L=this.getAriaLabelledBy().map(function(t){return sap.ui.getCore().byId(t);});var i=sap.ui.require("sap/ui/core/LabelEnablement");if(i){L=L.concat(i.getReferencingLabels(this).map(function(t){return sap.ui.getCore().byId(t);}));}return L;};s.prototype.getDomRefForValueStateMessage=function(){return this.getDomRef();};s.prototype.getValueStateMessageId=function(){return this.getId()+"-message";};s.prototype.getValueStateMessage=function(){return this._oValueStateMessage;};s.prototype.openValueStateMessage=function(){var v=this.getValueStateMessage();if(v){v.open();}};s.prototype.closeValueStateMessage=function(){var v=this.getValueStateMessage();if(v){v.close();}};s.prototype.shouldValueStateMessageBeOpened=function(){return(this.getValueState()!==o.None)&&this.getEnabled();};s.prototype.setShowSecondaryValues=function(A){var i=!this._isShadowListRequired();this.setProperty("showSecondaryValues",A,i);var L=this.getList();if(L){L.setShowSecondaryValues(A);}return this;};s.prototype.addItem=function(i){this.addAggregation("items",i);if(i){i.attachEvent("_change",this.onItemChange,this);}return this;};s.prototype.insertItem=function(i,t){this.insertAggregation("items",i,t);if(i){i.attachEvent("_change",this.onItemChange,this);}return this;};s.prototype.findAggregatedObjects=function(){var L=this.getList();if(L){return S.prototype.findAggregatedObjects.apply(L,arguments);}return[];};s.prototype.getItems=function(){var L=this.getList();return L?L.getItems():[];};s.prototype.setSelectedItem=function(i){if(typeof i==="string"){this.setAssociation("selectedItem",i,true);i=sap.ui.getCore().byId(i);}if(!(i instanceof d)&&i!==null){return this;}if(!i){i=this.getDefaultSelectedItem();}this.setSelection(i);this.setValue(this._getSelectedItemText(i));this._oSelectionOnFocus=i;return this;};s.prototype.setSelectedItemId=function(i){i=this.validateProperty("selectedItemId",i);if(!i){i=this.getDefaultSelectedItem();}this.setSelection(i);this.setValue(this._getSelectedItemText());this._oSelectionOnFocus=sap.ui.getCore().byId(i);return this;};s.prototype.setSelectedKey=function(i){i=this.validateProperty("selectedKey",i);var t=(i==="");if(!this.getForceSelection()&&t){this.setSelection(null);this.setValue("");return this;}var u=this.getItemByKey(i);if(u||t){if(!u&&t){u=this.getDefaultSelectedItem();}this.setSelection(u);this.setValue(this._getSelectedItemText(u));this._oSelectionOnFocus=u;return this;}return this.setProperty("selectedKey",i);};s.prototype.setValueState=function(v){var O=this.getValueState();this.setProperty("valueState",v,true);v=this.getValueState();if(v===O){return this;}var i=this.getDomRefForValueState();if(!i){return this;}var t=o;if(v===t.Error){i.setAttribute("aria-invalid",true);}else{i.removeAttribute("aria-invalid");}if(!this.isOpen()&&this.shouldValueStateMessageBeOpened()&&document.activeElement===i){this.openValueStateMessage();}else{this.closeValueStateMessage();}this.updateValueStateClasses(v,O);this.updateAriaLabelledBy(v,O);this._updatePickerValueStateContentText();this._updatePickerValueStateContentStyles();return this;};s.prototype.setValueStateText=function(v){var i=this.getDomRefForValueState();this.setProperty("valueStateText",v,true);if(!i){return this;}this._updatePickerValueStateContentText();this._updatePickerValueStateContentStyles();};s.prototype.getItemAt=function(i){return this.getItems()[+i]||null;};s.prototype.getSelectedItem=function(){var v=this.getAssociation("selectedItem");return(v===null)?null:sap.ui.getCore().byId(v)||null;};s.prototype.getFirstItem=function(){return this.getItems()[0]||null;};s.prototype.getLastItem=function(){var i=this.getItems();return i[i.length-1]||null;};s.prototype.getEnabledItems=function(i){var L=this.getList();return L?L.getEnabledItems(i):[];};s.prototype.getItemByKey=function(i){var L=this.getList();return L?L.getItemByKey(i):null;};s.prototype.removeItem=function(i){var t;i=this.removeAggregation("items",i);if(this.getItems().length===0){this.clearSelection();}else if(this.isItemSelected(i)){t=this.findFirstEnabledItem();if(t){this.setSelection(t);}}this.setValue(this._getSelectedItemText());if(i){i.detachEvent("_change",this.onItemChange,this);}return i;};s.prototype.removeAllItems=function(){var t=this.removeAllAggregation("items");this.setValue("");if(this._isShadowListRequired()){this.$().find(".sapMSelectListItemBase").remove();}for(var i=0;i<t.length;i++){t[i].detachEvent("_change",this.onItemChange,this);}return t;};s.prototype.destroyItems=function(){this.destroyAggregation("items");this.setValue("");if(this._isShadowListRequired()){this.$().find(".sapMSelectListItemBase").remove();}return this;};s.prototype.isOpen=function(){var i=this.getAggregation("picker");return!!(i&&i.isOpen());};s.prototype.close=function(){var i=this.getAggregation("picker");if(i){i.close();}return this;};s.prototype.getDomRefForValueState=function(){return this.getDomRef();};s.prototype.getAccessibilityInfo=function(){var i={role:this.getRenderer().getAriaRole(this),focusable:this.getEnabled(),enabled:this.getEnabled()};if(this.getType()==="IconOnly"){var t=this.getTooltip_AsString();if(!t){var u=a.getIconInfo(this.getIcon());t=u&&u.text?u.text:"";}i.type=sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_BUTTON");i.description=t;}else if(this.getType()==="Default"){i.type=sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_COMBO");i.description=this._getSelectedItemText();}return i;};s.prototype.getIdForLabel=function(){return this.getId()+"-hiddenInput";};return s;});
