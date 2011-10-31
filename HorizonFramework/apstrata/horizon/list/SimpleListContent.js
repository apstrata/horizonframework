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

		if (args.selectIds) {
			this._selectId = args.selectIds.shift()
			this._selectIds = args.selectIds
		}
		
		this._lastSelectedIndex = null

		this._normalizeResult(args.result)
	},
	
	postCreate: function() {
		this.inherited(arguments)
	},
	
	startup: function() {
		this.render()
		this.inherited(arguments)
	},
	
	setData: function(result) {
		var self = this
		
		this._normalizeResult(result)
		this.render()
		this.layout()
	},
	
	layout: function() {
		var self = this

		dojo.style(self.domNode, "height", self.parent.getContentHeight() + "px")				
		if (self._lastSelectedIndex) self.toggleItem(self._lastSelectedIndex, true)
	},

	render: function() {
		var self = this
		this.inherited(arguments)

		this.select()

//		setTimeout( dojo.hitch(this, "select"), 1)
/*
		setTimeout(
			dojo.hitch(this, function() {
					if (self._selectId) {
						self.selectItem(self._selectId, true)
						self._selectId = null
					}
				}), 1)

		setTimeout(function() {
			if (self._selectId) {
				self.selectItem(self._selectId, true)
				self._selectId = null
			}
		}, 1)
*/
	},

	select: function() {
		var self = this
		if (this._selectId) {
			var node = dojo.query("[itemid$=\""+ this._selectId +"\"]", this.domNode)[0]
			var index = node.getAttribute('itemIndex')
	
			if (this._lastSelectedIndex) this.toggleItem(this._lastSelectedIndex, false)
			this.toggleItem(this._selectId, true)
			this._lastSelectedIndex = this._selectId
			
			this.parent.onClick(index, this._selectId, { selectIds: self._selectIds })
		}
	},

	toggleItem: function(id, selected) {
		var node = dojo.query("[itemid$=\""+ id +"\"]", this.domNode)[0]
		if (selected) {
			dojo.addClass(node, "itemSelected")
		} else {
			dojo.removeClass(node, "itemSelected")
		}
	},
	

	_onClick: function(e) {
		if (this.noEdit) return;
		if (this._editMode) return;

		var index = e.currentTarget.getAttribute('itemIndex')
		var id = e.currentTarget.getAttribute('itemId')

		this._selectId = id
		this.select()
	},
	
	_onMouseover: function(e) {
		this._saveBackground = e.currentTarget.style.background
		dojo.addClass(e.currentTarget, "itemMouseOver")
	},
	
	_onMouseout: function(e) {
		var self = this
		dojo.removeClass(e.currentTarget, "itemMouseOver")
	},
	
	_markSelected: function(e) {}
})
