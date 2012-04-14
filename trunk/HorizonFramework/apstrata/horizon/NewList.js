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
dojo.require('apstrata.horizon.PanelAlert')

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
	multiSelect: false,

	labelAttribute: "Album",
	idAttribute: "id",
	iconAttribute: "icon",
	
	constructor: function(options) {
		dojo.mixin(this, options)	
		
		this.store = musicStore
		this._itemNodes = {}
		this._labelNodes = {}
		
		this._dirtyBuffer = {
			_buffer: {},
			get: function(){return this._buffer},
			markDeleted: function(id, d) {
				if (!this._buffer[id]) {
					this._buffer[id] = {
						id: id,
						deleted: d
					}
				} else this._buffer[id].deleted = d
			},
			markChanged: function(id, o, n) {
				var change = { oldLabel: o, newLabel: n }
				if (!this._buffer[id]) {
					this._buffer[id] = {
						id: id,
						change: change
					}
				} else this._buffer[id].change = change
			},
			isDeleted: function(id) {
				return this._buffer[id] && this._buffer[id].deleted
			},
			revert: function(id) {
				if (this._buffer[id]) delete this._buffer[id]
			}
		}
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
				self._render(result)				
			}
		)
	},

	//
	// Actions
	//
	
	/**
	 * Mark an item as selected
	 * 
	 * @param {string} id
	 */
	select: function(id) {
		this._selectedId = id
		
		if (this._selectedNode) {
			dojo.removeClass(this._selectedNode, "itemSelected")
		}
		
		dojo.addClass(this._itemNodes[id], "itemSelected")
		this._selectedNode = this._itemNodes[id]
		
		this.onClick(id)
	},
	
	/**
	 * Revert changes made on an item
	 * 
	 * @param {string} id
	 */
	resetItem: function(id) {
		this._dirtyBuffer.revert(id)
		var r = this._cachedResult[id] //this.store.get(id)
		this._renderItem(r)
	},
	
	//
	// Properties
	//
	
	/**
	 * Returns true if the list is in edit mode
	 */
	isEditMode: function() {
		return this._tglEdit && this._tglEdit.get('checked')
	},
	
	//
	// Events
	//
	
	/**
	 * Called when an item is clicked
	 * 
	 * @param {string} id
	 */
	onClick: function(id) {},
	
	/**
	 * Called when the new button is clicked
	 */
	onNew: function() {},

	/**
	 * Called when an item delete icon is clicked
	 * 
	 * @param {string} id
	 */
	onDelete: function(id) {
		var self = this
		
		var label = this.getLabel(this._cachedResult[id])
		
		new apstrata.horizon.PanelAlert({
			panel: self,
			width: 320,
			height: 150,
			message: "Are you sure you want to delete item: " + '[' + label + "] ?",
			iconClass: "deleteIcon",
			actions: [
				'Yes',
				'No'
			],
			actionHandler: function(action) {
				if (action=='Yes') {
				} else {
					self.resetItem(id)
				}
			}
		})
	},

	/**
	 * Called when a label is edited
	 * 
	 * @param {string} id
	 * @param {string} oldLabel
	 * @param {string} newLabel
	 */
	onEditLabel: function(id, oldLabel, newLabel) {
		var self = this
		new apstrata.horizon.PanelAlert({
			panel: self,
			width: 320,
			height: 150,
			message: "Are you sure you want to change the label: " + '[' + oldLabel + "] to [" + newLabel + "] ?",
			iconClass: "editIcon",
			actions: [
				'Yes',
				'No'
			],
			actionHandler: function(action) {
				if (action=='Yes') {
				} else {
					self.resetItem(id)
				}
			}
		})
	},
	
	//
	// Private events
	//
	
	/**
	 * manages the highliting of deleted items
	 * 
	 * @param {string} id
	 */
	_onDelete: function(id) {
		
		if (this._dirtyBuffer.isDeleted(id)) {
			dojo.removeClass(this._labelNodes[id], "deleted")
			this._dirtyBuffer.markDeleted(id, false)
		} else {
			dojo.addClass(this._labelNodes[id], "deleted")
			this._dirtyBuffer.markDeleted(id, true)
			this.onDelete(id)
		}
	},
	
	//
	// Data methods
	//
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
	
	_render: function(result) {
		var self = this
		
		self.dvContent.innerHTML = ''
		
		this._cachedResult = {}

		dojo.forEach(result, function(row) {
			
			self._cachedResult[self.getId(row)] = row
			
			var n = dojo.create("div", {"data-id": self.getId(row)})
			dojo.addClass(n, "item")
			dojo.place(n, self.dvContent)
			
			self._itemNodes[self.getId(row)] = n

			self._renderItem(row)
		})
	},
	
	_renderItem: function(row) {
		var self = this
		
		var n = self._itemNodes[self.getId(row)]
		n.innerHTML = ""
		
		// Outer div
		var contentNode = dojo.create("div")
		dojo.place(contentNode, n)
		dojo.addClass(contentNode, "itemContent")
		dojo.connect(contentNode, "onclick", dojo.hitch(self, "select", (self.getId(row)+"")))

		// delete icon div
		var deleteNode = dojo.create("div")
		dojo.place(deleteNode, contentNode)
		dojo.addClass(deleteNode, "deleteNode")
		dojo.style(deleteNode, "display", this.isEditMode()?"inline-block":"none")
		dojo.connect(deleteNode, "onclick", dojo.hitch(self, "_onDelete", (self.getId(row)+"")))
		
		// item icon div
		var iconNode = dojo.create("div")
		dojo.place(iconNode, contentNode)
		var iconClass = self.getIconClass(row)
		if (iconClass) dojo.addClass(iconNode, iconClass)

		// item label div
		var labelNode = dojo.create("div", {innerHTML: self.getLabel(row)})
		dojo.place(labelNode, contentNode)
		dojo.addClass(labelNode, "label")
		dojo.connect(labelNode, "onclick", dojo.hitch(self, "_editLabel", (self.getId(row)+"")))
		self._labelNodes[self.getId(row)] = labelNode
	},
	
	_addActions: function() {
		var self = this
		
		if (this.editable) {
			this._tglEdit = new dijit.form.ToggleButton({label: "Edit", iconClass:"dijitCheckBoxIcon" ,onClick: dojo.hitch(self, "_editList")})
			dojo.place(this._tglEdit.domNode, this.dvFooter)

			var btnNew = new dijit.form.Button({label: "New", onClick: dojo.hitch(self, "onNew")})
			dojo.place(btnNew.domNode, this.dvFooter)
		}
	},
	
	_editList: function() {
		if (this._tglEdit.get('checked')) {
			dojo.query(".deleteNode", this.domNode).forEach(function(node){
				dojo.style(node, "display", "inline-block")
			})
		} else {
			dojo.query(".deleteNode", this.domNode).forEach(function(node){
				dojo.style(node, "display", "none")
			})
console.dir(this._dirtyBuffer.get())						
		}
	},
	
	_editLabel: function(id) {
		var self = this
		
		// If an edit is already active, don't edit
		if (this._activeInlineEdit) return
		
		// If the list is not in edit mode
		if (!this._tglEdit.get('checked')) return
		
		// If the current item is deleted
		if (this._dirtyBuffer.isDeleted(id)) return
		
		var v = self._labelNodes[id].innerHTML
		self._labelNodes[id].innerHTML = ""
		var editNode = dojo.create("div", {innerHTML:v})
		dojo.place(editNode, self._labelNodes[id])

		this._activeInlineEdit = new dijit.InlineEditBox({ 
			editor: "dijit.form.TextBox",
			renderAsHtml: false, 
			autoSave: true,
			editorParams: {},
			onChange:function() {
				var newValue = this.get("value")
				self._activeInlineEdit.destroyRecursive()
				delete self._activeInlineEdit
				self._labelNodes[id].innerHTML = newValue
				self.onEditLabel(id, v, newValue)
				self._dirtyBuffer.markChanged(id, v, newValue)
			},
			onCancel: function() {
				self._activeInlineEdit.destroyRecursive()
				delete self._activeInlineEdit
				self._labelNodes[id].innerHTML = v
			}
		}, editNode)
		
//self._renderItem(self.store.get(id))
	}

})