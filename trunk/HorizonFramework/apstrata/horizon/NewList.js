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

dojo.provide('apstrata.horizon.NewList');

dojo.require('apstrata.widgets.Alert')

dojo.require('dijit.form.ToggleButton')
dojo.require('dijit.form.Button')

dojo.require("apstrata.horizon.blue.TestData")


dojo.require("apstrata.horizon.Panel")

/*
 * This List provides a scrolling vertical list of items. It provides edit and new functionality  
 */
dojo.declare("apstrata.horizon.NewList", 
[apstrata.horizon.Panel], 
{
	
	templatePath: dojo.moduleUrl("apstrata.horizon", "templates/NewList.html"),
	
	//
	// Public attributes
	//	
	store: null,
	editable: true,
	filterable: false,
	sortable: false,
	dockOnClick: false,
	
	
	constructor: function(options) {
		dojo.mixin(this, options)	
		
		this.store = musicStore
	},
	
	postCreate: function(options) {
		this.reload()
		this._addActions()
		
		this.inherited(arguments)
	},
	
	// 
	// Public methods
	//
	resize: function() {
		var h = dojo.contentBox(this.domNode).h
		var hh = dojo.contentBox(this.dvHeader).h
		var fh = dojo.contentBox(this.dvFooter).h
		
		dojo.style(this.dvContent, {
			height: h-hh-fh + "px"
		})
	},
	
	reload: function() {
		var self = this
		
		if (!this.store) return

		var query = function(item) { return true }
		var queryOptions = {}

		dojo.when(
			this.store.query(query, queryOptions),
			function(result) {
				self._generate(result)				
			}
		)
	},

	//
	// Actions
	//
	select: function(id) {
		this._selectedId = id
		
		if (this._selectedNode) {
			dojo.removeClass(this._selectedNode, "itemSelected")
		}
		
		dojo.addClass(this._itemNodes[id], "itemSelected")
		this._selectedNode = this._itemNodes[id]
		
		this.onClick(id)
	},
	
	//
	// Events
	//
	onClick: function(id) {},
	onNew: function() {},

	//
	// Data methods
	//
	
	labelAttribute: "Album",
	idAttribute: "id",
	
	getLabel: function(item) {
		return item[this.labelAttribute]
	},

	
	getId: function(item) {
		return item[this.idAttribute]
	},
	
	getIconClass: function(item) {
		return "icon"
		return item[this.iconAttribute]
	},
	

	//
	// Private methods
	//
	
	_itemNodes: {},
	
	_generate: function(result) {
		var self = this
		
		self.dvContent.innerHTML = ''

		dojo.forEach(result, function(row) {
			var n = dojo.create("div", {"data-id": self.getId(row)})
			dojo.addClass(n, "item")
			dojo.place(n, self.dvContent)
			
			self._itemNodes[self.getId(row)] = n

			var contentNode = dojo.create("div")
			dojo.place(contentNode, n)
			dojo.addClass(contentNode, "itemContent")
			dojo.connect(contentNode, "onclick", dojo.hitch(self, "select", (self.getId(row)+"")))

			var iconClass = self.getIconClass(row)
			var iconNode = dojo.create("div")
			dojo.place(iconNode, contentNode)
			if (iconClass) dojo.addClass(iconNode, iconClass)

			var labelNode = dojo.create("div", {innerHTML: self.getLabel(row)})
			dojo.place(labelNode, contentNode)
			dojo.addClass(labelNode, "label")
			
		})
		
		
//		this.select("3")
	},
	
	_addActions: function() {
		var self = this
		
		if (this.editable) {
			var btnEdit = new dijit.form.ToggleButton({label: "Edit", onClick: dojo.hitch(self, "_editList")})
			dojo.place(btnEdit.domNode, this.dvFooter)

			var btnNew = new dijit.form.Button({label: "New", onClick: dojo.hitch(self, "onNew")})
			dojo.place(btnNew.domNode, this.dvFooter)
		}
	},
	
	_editList: function() {
		
	}
	
	
})