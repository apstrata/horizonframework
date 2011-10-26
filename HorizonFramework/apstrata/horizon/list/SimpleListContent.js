/*******************************************************************************
 *  Copyright 2009 Apstrata
 *  
 *  This file is part of Apstrata Database Javascript Client.
 *  
 *  Apstrata Database Javascript Client is free software: you can redistribute it
 *  and/or modify it under the terms of the GNU Lesser General Public License as
 *  published by the Free Software Foundation, either version 3 of the License,
 *  or (at your option) any later version.
 *  
 *  Apstrata Database Javascript Client is distributed in the hope that it will be
 *  useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *  
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with Apstrata Database Javascript Client.  If not, see <http://www.gnu.org/licenses/>.
 * *****************************************************************************
 */

dojo.provide('apstrata.horizon.list.SimpleListContent');

dojo.declare("apstrata.horizon.list.SimpleListContent", 
[dijit._Widget, dojox.dtl._Templated], 
{
	templatePath: dojo.moduleUrl("apstrata.horizon.list", "templates/SimpleListContent.html"),
	widgetsInTemplate: true,
	data: [],
	
	// these are calculated dynamically based on list width
	_labelWidth: 85,
	_itemWidth: 120,
	height: 100,
	
	_normalizeResult: function(result) {
		var self = this
		
		this.data = []
		result.forEach(function(item){
			if (!item['id']) item['id'] = item[self.parent.idProperty]
			if (!item['label']) item['label'] = item[self.parent.labelProperty] || "<empty>"
			self.data.push(item)
		});
	},
	
	constructor: function(args) {
		var self = this
		this.result = args.result
		this.parent = args.parent
		
		this._lastSelectedIndex = null

		this._normalizeResult(args.result)
	},
	
	postCreate: function() {
console.debug('SimpleListContent: postCreate')

		var self = this
				
		this.render()
		this.inherited(arguments)
	},

	layout: function() {
console.debug('SimpleListContent: layout')
		var self = this
				
		setTimeout(
			function() {
				dojo.style(self.domNode, "height", self.parent.getContentHeight() + "px")				
				if (self._lastSelectedIndex) self.toggleItem(self._lastSelectedIndex, true)
			}, 
			1)
	},
	
	render: function() {
		var self = this
		this.inherited(arguments)
	},

	setData: function(result) {
		var self = this
		
		this._normalizeResult(result)
		this.render()
		this.layout()
	},
	
	toggleItem: function(id, selected) {
		if (selected) {
			dojo.addClass(dojo.byId(this.id+"-"+id), "itemSelected")
		} else {
			dojo.removeClass(dojo.byId(this.id+"-"+id), "itemSelected")
		}
	},
	
	selectItem: function(id) {
		var node = dojo.byId(this.id+"-"+id)
		var index = node.getAttribute('itemIndex')
	
		if (this._lastSelectedIndex) this.toggleItem(this._lastSelectedIndex, false)
		this.toggleItem(id, true)
		this._lastSelectedIndex = id
	},

	_onClick: function(e) {
		if (this.noEdit) return;
		if (this._editMode) return;

		var index = e.currentTarget.getAttribute('itemIndex')
		var id = e.currentTarget.getAttribute('itemId')

		this.selectItem(id)

		this.parent.onClick(index, id)
	},
	
	_onMouseover: function(e) {
		this._saveBackground = e.currentTarget.style.background
		dojo.addClass(e.currentTarget, "itemMouseOver")
	},
	
	_onMouseout: function(e) {
		var self = this
		dojo.removeClass(e.currentTarget, "itemMouseOver")
	},
	
	_markSelected: function(e) {},
	select: function(index, label, attrs) {},
	onClick: function(index, label, attrs) {}
})
