/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./InputBase','./ComboBoxTextField','./ComboBoxBase','./List','./library','sap/ui/Device','sap/ui/core/Item','./StandardListItem','./ComboBoxRenderer',"sap/ui/dom/containsOrEquals","sap/ui/events/KeyCodes","./Toolbar","sap/base/assert","sap/base/security/encodeXML","sap/ui/core/Core"],function(I,C,a,L,l,D,b,S,c,d,K,T,e,f,g){"use strict";var h=l.ListType;var j=l.ListMode;var k=a.extend("sap.m.ComboBox",{metadata:{library:"sap.m",designtime:"sap/m/designtime/ComboBox.designtime",properties:{selectedKey:{type:"string",group:"Data",defaultValue:""},selectedItemId:{type:"string",group:"Misc",defaultValue:""},filterSecondaryValues:{type:"boolean",group:"Misc",defaultValue:false}},associations:{selectedItem:{type:"sap.ui.core.Item",multiple:false}},events:{change:{parameters:{value:{type:"string"},itemPressed:{type:"boolean"}}},selectionChange:{parameters:{selectedItem:{type:"sap.ui.core.Item"}}}},dnd:{draggable:false,droppable:true}}});function H(o,i){if(!i){return;}var n=o.getFocusDomRef(),p=o._getSelectionRange().start,t=n.value.substring(0,n.selectionStart),q=o._shouldResetSelectionStart(i),r=o.getSelectedItem(),G=i.isA("sap.ui.core.SeparatorItem"),u;o.setSelection(i);if(i!==r&&!G){o.updateDomValue(i.getText());o.fireSelectionChange({selectedItem:i});i=o.getSelectedItem();if(q){p=0;}o.selectText(p,n.value.length);o._bIsLastFocusedItemHeader=false;}if(G){o.setSelectedItem(null);o.fireSelectionChange({selectedItem:null});o.updateDomValue(t);o._bIsLastFocusedItemHeader=true;o._handleAriaActiveDescendant(i);o._getGroupHeaderInvisibleText().setText(o._oRb.getText("LIST_ITEM_GROUP_HEADER")+" "+i.getText());}u=this.getListItem(i);o.handleListItemsVisualFocus(u);if(o.isOpen()){o.$().removeClass("sapMFocus");o._getList().addStyleClass("sapMListFocus");}else{o.$().addClass("sapMFocus");}o.scrollToItem(i);}k.prototype.scrollToItem=function(i){var p=this.getPicker(),P=p.getDomRef("cont"),o=this.getListItem(i),n=i&&o&&o.getDomRef();if(!p||!P||!n){return;}var q=P.scrollTop,r=n.offsetTop,t=P.clientHeight,u=n.offsetHeight;if(q>r){P.scrollTop=r;}else if((r+u)>(q+t)){P.scrollTop=Math.ceil(r+u-t);}};function s(i,E){if(document.activeElement===this.getFocusDomRef()){this.selectText(i,E);}}function m(i){var o=this.getSelectedItem(),n=this.getListItem(o),p=o&&n&&n.getDomRef(),q=p&&p.offsetTop,r=p&&p.offsetHeight,P=this.getPicker(),t=P.getDomRef("cont"),u=t.clientHeight;if(o&&((q+r)>(u))){if(!i){this._getList().$().css("visibility","hidden");}else{t.scrollTop=q-r/2;this._getList().$().css("visibility","visible");}}}k.prototype._handleAriaActiveDescendant=function(i){var o=this.getFocusDomRef(),n=this.getListItem(i),A="aria-activedescendant";if(o){if(i&&n&&n.getDomRef()&&this.isOpen()){o.setAttribute(A,n.getId());}else{o.removeAttribute(A);}}};k.prototype._getSelectedItemText=function(i){i=i||this.getSelectedItem();if(!i){i=this.getDefaultSelectedItem();}if(i){return i.getText();}return"";};k.prototype._setItemVisibility=function(i,v){var o=i&&this.getListItem(i).$(),n="sapMSelectListItemBaseInvisible";if(v){i.bVisible=true;o.length&&o.removeClass(n);}else{i.bVisible=false;o.length&&o.addClass(n);}};k.prototype.setSelectedIndex=function(i,_){var o;_=_||this.getItems();i=(i>_.length-1)?_.length-1:Math.max(0,i);o=_[i];if(o){this.setSelection(o);}};k.prototype.configureDropdown=function(o){o.setShowHeader(true);o.setInitialFocus(this);};k.prototype.configureDialog=function(o){var t=this,i=this.createPickerTextField(),p=this.getPickerInvisibleTextId();this.setTextFieldHandler(i);o._oPopupInput=i;o.setStretch(true).setCustomHeader(this.createPickerHeader()).setSubHeader(new T({content:i})).addButton(this.createPickerCloseButton()).attachBeforeOpen(function(){t.updatePickerHeaderTitle();}).attachAfterClose(function(){t.focus();l.closeKeyboard();});if(p){o.addAriaLabelledBy(p);}};k.prototype.createPickerTextField=function(){var t=this,i,o=new C({width:"100%",showValueStateMessage:false,showButton:false}).addEventDelegate({onsapenter:function(){i=o.getValue();this.updateDomValue(i);this.onChange();if(i){t.updateDomValue(i);t.onChange();t.close();}}},this);return o;};k.prototype.revertSelection=function(){var p,P=this.getPickerTextField();this.setSelectedItem(this._oSelectedItemBeforeOpen);this.setValue(this._sValueBeforeOpen);if(this.getSelectedItem()===null){p=this._sValueBeforeOpen;}else{p=this._oSelectedItemBeforeOpen.getText();}P&&P.setValue(p);};k.prototype.filterItems=function(o){var i=this.getItems(),F=[],n=[],p=o.properties.indexOf("additionalText")>-1,q=this.fnFilter||a.DEFAULT_TEXT_FILTER,G=[],r=false;this._oFirstItemTextMatched=null;i.forEach(function(t){if(t.isA("sap.ui.core.SeparatorItem")){if(!t.getText()){this.getListItem(t).setVisible(false);return;}G.push({separator:t,show:false});r=true;this.getListItem(t).setVisible(false);return;}var M=q.call(this,o.value,t,"getText");var u=q.call(this,o.value,t,"getAdditionalText");if((M||u)&&r){G[G.length-1].show=true;r=false;}if(M){n.push(t);F.push(t);}else if(u&&p){F.push(t);}}.bind(this));i.forEach(function(t){if(t.isA("sap.ui.core.SeparatorItem")){return;}var u=F.indexOf(t)>-1;var v=n.indexOf(t)>-1;if(!this._oFirstItemTextMatched&&v){this._oFirstItemTextMatched=t;}this.getListItem(t).setVisible(u);},this);G.forEach(function(t){if(t.show){this.getListItem(t.separator).setVisible(true);}}.bind(this));return F;};k.prototype._filterStartsWithItems=function(i,M){var n=i.toLowerCase();var o=this.getItems(),F=o.filter(function(p){return p[M]&&p[M]().toLowerCase().startsWith(n);});return F;};k.prototype._getFilters=function(){return this.getFilterSecondaryValues()?["text","additionalText"]:["text"];};k.prototype.getNextFocusableItem=function(i){var A=this.getSelectableItems(),n=this.getNonSeparatorSelectableItems(A),F=this.$().hasClass("sapMFocus"),o=this.getSelectedItem()||this._getItemByListItem(this._oLastFocusedListItem),N;if(F&&this.isOpen()){N=A[0];}else if(F){N=n[n.indexOf(o)+(i?1:-1)];}else{N=A[A.indexOf(o)+(i?1:-1)];}return N;};k.prototype.getNonSeparatorSelectableItems=function(i){return i.filter(function(o){return!o.isA("sap.ui.core.SeparatorItem");});};k.prototype._itemsTextStartsWithTypedValue=function(i,t){if(!i||typeof t!="string"||t==""){return false;}return i.getText().toLowerCase().startsWith(t.toLowerCase());};k.prototype._shouldResetSelectionStart=function(i){var o=this.getFocusDomRef(),n=this._getSelectionRange(),p=n.start!==n.end,t=o.value.substring(0,n.start),q=this._itemsTextStartsWithTypedValue(i,t);return!(q&&(p||this._bIsLastFocusedItemHeader));};k.prototype._getSelectionRange=function(){var o=this.getFocusDomRef(),v=this.getValue(),i=o.selectionStart,n=o.selectionEnd,r={start:i,end:n};if(!(D.browser.msie||D.browser.edge)){return r;}if(this._bIsLastFocusedItemHeader){r.start=v.length;r.end=v.length;}return r;};k.prototype.handleListItemsVisualFocus=function(o){if(this._oLastFocusedListItem){this._oLastFocusedListItem.removeStyleClass("sapMLIBFocused");this._oLastFocusedListItem=null;}if(o){this._oLastFocusedListItem=o;o.addStyleClass("sapMLIBFocused");}};k.prototype.init=function(){this._oRb=g.getLibraryResourceBundle("sap.m");a.prototype.init.apply(this,arguments);this.bOpenValueStateMessage=true;this._sValueBeforeOpen="";this._sInputValueBeforeOpen="";this._oSelectedItemBeforeOpen=null;this._oFirstItemTextMatched=null;this.bIsFocused=false;if(D.system.phone){this.attachEvent("_change",this.onPropertyChange,this);}this._oLastFocusedListItem=null;this._bIsLastFocusedItemHeader=null;};k.prototype.onBeforeRendering=function(){a.prototype.onBeforeRendering.apply(this,arguments);this._fillList();this.synchronizeSelection();};k.prototype._fillList=function(){var o=this._getList(),n,p,q,i,r;if(!o){return;}if(this._oLastFocusedListItem){r=this._getItemByListItem(this._oLastFocusedListItem);}o.destroyItems();n=this.getItems();if(this._sInputValueBeforeOpen){n=this.filterItems({properties:this._getFilters(),value:this._sInputValueBeforeOpen});}for(i=0,q=n.length;i<q;i++){p=this._mapItemToListItem(n[i]);o.addAggregation("items",p,true);}if(r){this._oLastFocusedListItem=this.getListItem(r);}};k.prototype.exit=function(){a.prototype.exit.apply(this,arguments);this._oRb=null;this._oSelectedItemBeforeOpen=null;this._oFirstItemTextMatched=null;this._oLastFocusedListItem=null;if(this._oSuggestionPopover){this._oSuggestionPopover.destroy();this._oSuggestionPopover=null;}};k.prototype.onBeforeRenderingPicker=function(){var o=this["onBeforeRendering"+this.getPickerType()];o&&o.call(this);};k.prototype.onBeforeRenderingDropdown=function(){var p=this.getPicker(),w=(this.$().outerWidth()/parseFloat(l.BaseFontSize))+"rem";if(p){p.setContentMinWidth(w);}};k.prototype.onBeforeRenderingList=function(){if(this.bProcessingLoadItemsEvent){var o=this._getList(),F=this.getFocusDomRef();if(o){o.setBusy(true);}if(F){F.setAttribute("aria-busy","true");}}};k.prototype.onAfterRenderingPicker=function(){var o=this["onAfterRendering"+this.getPickerType()];o&&o.call(this);m.call(this,false);};k.prototype.onAfterRenderingList=function(){var o=this.getSelectedItem(),i=this.getListItem(o);if(this.bProcessingLoadItemsEvent&&(this.getItems().length===0)){return;}var n=this._getList(),F=this.getFocusDomRef();this._highlightList(this._sInputValueBeforeOpen);if(o){n.setSelectedItem(i);this.handleListItemsVisualFocus(i);}if(n){n.setBusy(false);}if(F){F.removeAttribute("aria-busy");}};k.prototype.oninput=function(E){a.prototype.oninput.apply(this,arguments);if(E.isMarked("invalid")){return;}this.loadItems(function(){this.handleInputValidation(E,this.isComposingCharacter());},{name:"input",busyIndicator:false});if(this.bProcessingLoadItemsEvent&&(this.getPickerType()==="Dropdown")){this.open();}this.$().addClass("sapMFocus");this._getList().removeStyleClass("sapMListFocus");};k.prototype.handleInputValidation=function(E,i){var o=this.getSelectedItem(),v=E.target.value,n=v==="",p=E.srcControl,V,t=(this.getPickerType()==="Dropdown");if(n&&!this.bOpenedByKeyboardOrButton&&!this.isPickerDialog()){V=this.getItems();}else{V=this.filterItems({properties:this._getFilters(),value:v});}var q=!!V.length;var F=V[0];if(!n&&F&&F.getEnabled()){this.handleTypeAhead(p,V,v,i);}if(n||!q||(!p._bDoTypeAhead&&(this._getSelectedItemText()!==v))){this.setSelection(null);if(o!==this.getSelectedItem()){this.fireSelectionChange({selectedItem:this.getSelectedItem()});}}this._sInputValueBeforeOpen=v;if(this.isOpen()){setTimeout(function(){this._highlightList(v);}.bind(this));}if(q){if(n&&!this.bOpenedByKeyboardOrButton){this.close();}else if(t){this.open();this.scrollToItem(this.getSelectedItem());}}else if(this.isOpen()){if(t&&!this.bOpenedByKeyboardOrButton){this.close();}}else{this.clearFilter();}};k.prototype.handleTypeAhead=function(i,n,v,o){var p=this.intersectItems(this._filterStartsWithItems(v,'getText'),n);var q=this.getFilterSecondaryValues();var r=D.system.desktop;var t=this.getSelectedItem();if(i._bDoTypeAhead){var u=this.intersectItems(this._filterStartsWithItems(v,'getAdditionalText'),n);if(q&&!p[0]&&u[0]){!o&&i.updateDomValue(u[0].getAdditionalText());this.setSelection(u[0]);}else if(p[0]){!o&&i.updateDomValue(p[0].getText());this.setSelection(p[0]);}}else{this.setSelection(p[0]);}if(t!==this.getSelectedItem()){this.fireSelectionChange({selectedItem:this.getSelectedItem()});}if(i._bDoTypeAhead){if(r){s.call(i,v.length,i.getValue().length);}else{setTimeout(s.bind(i,v.length,i.getValue().length),0);}}this.$().addClass("sapMFocus");this._getList().removeStyleClass("sapMListFocus");};k.prototype.onSelectionChange=function(o){var i=this._getItemByListItem(o.getParameter("listItem")),p=this.getChangeEventParams(),n=(i!==this.getSelectedItem());this.setSelection(i);this.fireSelectionChange({selectedItem:this.getSelectedItem()});if(n){p.itemPressed=true;this.onChange(null,p);}};k.prototype.onItemPress=function(o){var i=o.getParameter("listItem"),t=i.getTitle(),p=this.getChangeEventParams(),n=(i!==this.getListItem(this.getSelectedItem()));if(i.isA("sap.m.GroupHeaderListItem")){return;}this.handleListItemsVisualFocus(i);this.updateDomValue(t);if(!n){p.itemPressed=true;this.onChange(null,p);}this.setProperty("value",t,true);if(this.getPickerType()==="Dropdown"){setTimeout(this.selectText.bind(this,this.getValue().length,this.getValue().length),0);}setTimeout(this.close.bind(this));};k.prototype.onBeforeOpen=function(){var p=this["onBeforeOpen"+this.getPickerType()],o=this.getFocusDomRef();if(this.hasLoadItemsEventListeners()&&!this.bProcessingLoadItemsEvent){this.loadItems();}this.addStyleClass(I.ICON_PRESSED_CSS_CLASS);if(o){this.getRoleComboNodeDomRef().setAttribute("aria-owns",this._getList().getId());}this.addContent();p&&p.call(this);};k.prototype.onBeforeOpenDialog=function(){var p=this.getPickerTextField();this._oSelectedItemBeforeOpen=this.getSelectedItem();this._sValueBeforeOpen=this.getValue();if(this.getSelectedItem()){this.filterItems({properties:this._getFilters(),value:""});}p.setValue(this._sValueBeforeOpen);};k.prototype.onAfterOpen=function(){var o=this.getFocusDomRef(),i=this.getSelectedItem(),n=this.getListItem(i);if(o){this.getRoleComboNodeDomRef().setAttribute("aria-expanded","true");n&&o.setAttribute("aria-activedescendant",n.getId());}m.call(this,true);};k.prototype.onBeforeClose=function(){a.prototype.onBeforeClose.apply(this,arguments);var o=this.getFocusDomRef();if(o){this.getRoleComboNodeDomRef().removeAttribute("aria-owns");o.removeAttribute("aria-activedescendant");}this.removeStyleClass(I.ICON_PRESSED_CSS_CLASS);};k.prototype.onAfterClose=function(){var o=this.getFocusDomRef();if(o){this.getRoleComboNodeDomRef().setAttribute("aria-expanded","false");}this.clearFilter();this._sInputValueBeforeOpen="";if(this.shouldValueStateMessageBeOpened()&&(document.activeElement===o)){this.openValueStateMessage();}};k.prototype.onItemChange=function(o){var i=this.getAssociation("selectedItem"),n=o.getParameter("newValue"),p=o.getParameter("name");if(i===o.getParameter("id")){switch(p){case"text":if(!this.isBound("value")){this.setValue(n);}break;case"key":if(!this.isBound("selectedKey")){this.setSelectedKey(n);}break;}}};k.prototype._handleItemTap=function(o){var t=jQuery(o.target).control(0);if(!t.isA("sap.m.GroupHeaderListItem")){this.close();}};k.prototype.onkeydown=function(E){var o=E.srcControl;a.prototype.onkeydown.apply(o,arguments);if(!o.getEnabled()||!o.getEditable()){return;}var i=K;o._bDoTypeAhead=(E.which!==i.BACKSPACE)&&(E.which!==i.DELETE);};k.prototype.oncut=function(E){var o=E.srcControl;a.prototype.oncut.apply(o,arguments);o._bDoTypeAhead=false;};k.prototype.onsapenter=function(E){var o=E.srcControl,i=o.getSelectedItem();if(i&&this.getFilterSecondaryValues()){o.updateDomValue(i.getText());}a.prototype.onsapenter.apply(o,arguments);if(!o.getEnabled()||!o.getEditable()){return;}if(o.isOpen()&&!this.isComposingCharacter()){o.close();}};k.prototype.onsapdown=function(E){var o=E.srcControl;if(!o.getEnabled()||!o.getEditable()){return;}E.setMarked();E.preventDefault();this.loadItems(function navigateToNextSelectableItem(){H.call(this,o,this.getNextFocusableItem(true));});};k.prototype.onsapup=function(E){var o=E.srcControl;if(!o.getEnabled()||!o.getEditable()){return;}E.setMarked();E.preventDefault();this.loadItems(function navigateToPrevSelectableItem(){H.call(this,o,this.getNextFocusableItem(false));});};k.prototype.onsaphome=function(E){var o=E.srcControl;if(!o.getEnabled()||!o.getEditable()){return;}E.setMarked();E.preventDefault();this.loadItems(function navigateToFirstSelectableItem(){var F=this.getSelectableItems()[0];H.call(this,o,F);});};k.prototype.onsapend=function(E){var o=E.srcControl;if(!o.getEnabled()||!o.getEditable()){return;}E.setMarked();E.preventDefault();this.loadItems(function navigateToLastSelectableItem(){var i=this.findLastEnabledItem(this.getSelectableItems());H.call(this,o,i);});};k.prototype.onsappagedown=function(E){var o=E.srcControl;if(!o.getEnabled()||!o.getEditable()){return;}E.setMarked();E.preventDefault();this.loadItems(function(){var i=this.getNonSeparatorSelectableItems(this.getSelectableItems()),n=i.indexOf(this.getSelectedItem())+10,p;n=(n>i.length-1)?i.length-1:Math.max(0,n);p=i[n];H.call(this,o,p);});};k.prototype.onsappageup=function(E){var o=E.srcControl;if(!o.getEnabled()||!o.getEditable()){return;}E.setMarked();E.preventDefault();this.loadItems(function(){var i=this.getNonSeparatorSelectableItems(this.getSelectableItems()),n=i.indexOf(this.getSelectedItem())-10,p;n=(n>i.length-1)?i.length-1:Math.max(0,n);p=i[n];H.call(this,o,p);});};k.prototype.onsapshow=function(E){var i,o;a.prototype.onsapshow.apply(this,arguments);if(!this.getValue()){i=this.getSelectableItems();o=this.getNonSeparatorSelectableItems(i)[0];if(o){this.setSelection(o);this.updateDomValue(o.getText());this.fireSelectionChange({selectedItem:o});setTimeout(function(){this.selectText(0,o.getText().length);}.bind(this),0);}}};k.prototype.onsaphide=k.prototype.onsapshow;k.prototype.onfocusin=function(E){var i=this.getPickerType()==="Dropdown";if(this._bIsBeingDestroyed){return;}if(E.target===this.getOpenArea()){this.bOpenValueStateMessage=false;if(i&&!this.isPlatformTablet()){this.focus();}}else{if(i){setTimeout(function(){if(document.activeElement===this.getFocusDomRef()&&!this.bIsFocused&&!this.bFocusoutDueRendering&&!this.getSelectedText()){this.selectText(0,this.getValue().length);}this.bIsFocused=true;}.bind(this),0);}if(!this.isOpen()&&this.bOpenValueStateMessage&&this.shouldValueStateMessageBeOpened()){this.openValueStateMessage();}this.bOpenValueStateMessage=true;}if(this.getEnabled()&&(!this.isOpen()||!this.getSelectedItem()||!this._getList().hasStyleClass("sapMListFocus"))){this.$().addClass("sapMFocus");}};k.prototype.onsapfocusleave=function(E){this.bIsFocused=false;var t,p,r,F,i=this.getSelectedItem();if(i&&this.getFilterSecondaryValues()){this.updateDomValue(i.getText());}a.prototype.onsapfocusleave.apply(this,arguments);if(this.isPickerDialog()){return;}p=this.getAggregation("picker");if(!E.relatedControlId||!p){return;}t=this.isPlatformTablet();r=g.byId(E.relatedControlId);F=r&&r.getFocusDomRef();if(d(p.getFocusDomRef(),F)&&!t){this.focus();}};k.prototype.setSelection=function(i){var o=this._getList(),n,p;this.setAssociation("selectedItem",i,true);this.setProperty("selectedItemId",(i instanceof b)?i.getId():i,true);if(typeof i==="string"){i=g.byId(i);}if(o){n=this.getListItem(i);if(n){o.setSelectedItem(n,true);}else{o.removeSelections(true);}}p=i?i.getKey():"";this.setProperty("selectedKey",p,true);this._handleAriaActiveDescendant(i);if(this._oSuggestionPopover){this._oSuggestionPopover._iPopupListSelectedIndex=this.getItems().indexOf(i);}};k.prototype.isSelectionSynchronized=function(){var i=this.getSelectedItem();return this.getSelectedKey()===(i&&i.getKey());};k.prototype.synchronizeSelection=function(){if(this.isSelectionSynchronized()){return;}var i=this.getSelectedKey(),v=this.getItemByKey(""+i);if(v&&(i!=="")){this.setAssociation("selectedItem",v,true);this.setProperty("selectedItemId",v.getId(),true);if(this._sValue===this.getValue()){this.setValue(v.getText());this._sValue=this.getValue();}}};k.prototype.isFiltered=function(){var o=this._getList();return o&&(o.getVisibleItems().length!==this.getItems().length);};k.prototype.isItemVisible=function(i){return i&&(i.bVisible===undefined||i.bVisible);};k.prototype.configPicker=function(p){var r=this.getRenderer(),i=r.CSS_CLASS_COMBOBOXBASE;p.setHorizontalScrolling(false).addStyleClass(i+"Picker").addStyleClass(i+"Picker-CTX").attachBeforeOpen(this.onBeforeOpen,this).attachAfterOpen(this.onAfterOpen,this).attachBeforeClose(this.onBeforeClose,this).attachAfterClose(this.onAfterClose,this).addEventDelegate({onBeforeRendering:this.onBeforeRenderingPicker,onAfterRendering:this.onAfterRenderingPicker},this);};k.prototype._configureList=function(o){var r=this.getRenderer();if(!o){return;}o.setMode(j.SingleSelectMaster).setIncludeItemInSelection(true).setWidth("100%").setRememberSelections(false).setBusyIndicatorDelay(0).addStyleClass(r.CSS_CLASS_COMBOBOXBASE+"List").addStyleClass(r.CSS_CLASS_COMBOBOX+"List");o.attachSelectionChange(this.onSelectionChange,this).attachItemPress(this.onItemPress,this);o.addEventDelegate({ontap:this._handleItemTap,onBeforeRendering:this.onBeforeRenderingList,onAfterRendering:this.onAfterRenderingList},this);};k.prototype.destroyItems=function(){this.destroyAggregation("items");if(this._getList()){this._getList().destroyItems();}return this;};k.prototype._mapItemToListItem=function(i){var o,n,p,A;var r=this.getRenderer();if(!i){return null;}A=(i.getAdditionalText&&this.getShowSecondaryValues())?i.getAdditionalText():"";n=r.CSS_CLASS_COMBOBOXBASE+"Item";p=(this.isItemSelected(i))?n+"Selected":"";if(i.isA("sap.ui.core.SeparatorItem")){o=this._mapSeparatorItemToGroupHeader(i,r);}else{o=new S({type:h.Active,info:A,visible:i.getEnabled()}).addStyleClass(n+" "+p);}o.setTitle(i.getText());this.setSelectable(i,i.getEnabled());o.setTooltip(i.getTooltip());i.data(r.CSS_CLASS_COMBOBOXBASE+"ListItem",o);return o;};k.prototype.isItemSelected=function(i){return i&&(i.getId()===this.getAssociation("selectedItem"));};k.prototype.getDefaultSelectedItem=function(){return null;};k.prototype.getChangeEventParams=function(){return{itemPressed:false};};k.prototype.clearSelection=function(){this.setSelection(null);};k.prototype.selectText=function(i,n){a.prototype.selectText.apply(this,arguments);this.textSelectionStart=i;this.textSelectionEnd=n;return this;};k.prototype.setAssociation=function(A,i,n){var o=this._getList();if(o&&(A==="selectedItem")){if(!(i instanceof b)){i=this.findItem("id",i);}o.setSelectedItem(this.getListItem(i),true);}return a.prototype.setAssociation.apply(this,arguments);};k.prototype.removeAllAssociation=function(A,i){var o=this._getList();if(o&&(A==="selectedItem")){L.prototype.removeAllAssociation.apply(o,arguments);}return a.prototype.removeAllAssociation.apply(this,arguments);};k.prototype.clone=function(i){var o=a.prototype.clone.apply(this,arguments),n=this._getList();if(!this.isBound("items")&&n){o.setSelectedIndex(this.indexOfItem(this.getSelectedItem()));}return o;};k.prototype.open=function(){var o=this._getList();a.prototype.open.call(this);if(this.getSelectedItem()){o.addStyleClass("sapMListFocus");this.$().removeClass("sapMFocus");}return this;};k.prototype.close=function(){var o=this._getList();a.prototype.close.call(this);this.$().addClass("sapMFocus");o&&o.removeStyleClass("sapMListFocus");return this;};k.prototype.findAggregatedObjects=function(){var o=this._getList();if(o){return L.prototype.findAggregatedObjects.apply(o,arguments);}return[];};k.prototype.setSelectedItem=function(i){if(typeof i==="string"){this.setAssociation("selectedItem",i,true);i=g.byId(i);}if(!(i instanceof b)&&i!==null){return this;}if(!i){i=this.getDefaultSelectedItem();}this.setSelection(i);this.setValue(this._getSelectedItemText(i));return this;};k.prototype.setSelectedItemId=function(i){i=this.validateProperty("selectedItemId",i);if(!i){i=this.getDefaultSelectedItem();}this.setSelection(i);i=this.getSelectedItem();this.setValue(this._getSelectedItemText(i));return this;};k.prototype.setSelectedKey=function(i){i=this.validateProperty("selectedKey",i);var n=(i===""),o=this.isBound("selectedKey")&&this.isBound("value")&&this.getBindingInfo("selectedKey").skipModelUpdate;if(n){this.setSelection(null);if(!o){this.setValue("");}return this;}var p=this.getItemByKey(i);if(p){this.setSelection(p);if(!o){this.setValue(this._getSelectedItemText(p));}return this;}this._sValue=this.getValue();return this.setProperty("selectedKey",i);};k.prototype.getSelectedItem=function(){var v=this.getAssociation("selectedItem");return(v===null)?null:g.byId(v)||null;};k.prototype.updateItems=function(){var r,o=this.getSelectedItem(),r=a.prototype.updateItems.apply(this,arguments);clearTimeout(this._debounceItemsUpdate);this._debounceItemsUpdate=setTimeout(this["_syncItemsSelection"].bind(this,o),0);return r;};k.prototype._syncItemsSelection=function(o){var i,n,p=this.getSelectedKey();if(!o||o===this.getSelectedItem()){return;}n=this.getItems();i=n.some(function(q){return p===q.getKey();});this.setSelectedItem(i&&p?this.getItemByKey(p):null);};k.prototype.removeItem=function(i){i=a.prototype.removeItem.apply(this,arguments);var o;if(this._getList()){this._getList().removeItem(i&&this.getListItem(i));}if(this.isBound("items")&&!this.bItemsUpdated){return i;}var v=this.getValue();if(this.getItems().length===0){this.clearSelection();}else if(this.isItemSelected(i)){o=this.getDefaultSelectedItem();this.setSelection(o);this.setValue(v);}return i;};k.prototype.applyShowItemsFilters=function(){var p=this.getPicker(),P=function(){p.detachBeforeOpen(P,this);p=null;this.filterItems({value:this.getValue()||"_",properties:this._getFilters()});};p.attachBeforeOpen(P,this);};return k;});
