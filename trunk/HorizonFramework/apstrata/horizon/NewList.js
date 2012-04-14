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

	// Data
	store: null,
	labelAttribute: "label",
	idAttribute: "id",
	iconAttribute: "icon",

	// mode
	editable: true,
	multiEditMode: true,
	confirmPerChange: true,

	// Features
	filterable: false,
	sortable: false,

	// Visual
	dockOnClick: false,
	
	constructor: function(options) {
		dojo.mixin(this, options)	
		
		this._itemNodes = {}
		this._labelNodes = {}
		
		this._dirtyBuffer = {
			_buffer: {},
			empty: function() {this._buffer = {}},
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
				if (self._selectedId) 
					if (self._cachedResult[self._selectedId]) self.select(self._selectedId);
						else delete self._selectedId
			}
		)
	},
	
	isItemDeleteable: function(item) {
		return true
	},
	
	isItemEditable: function(item) {
		return true
	},

	// Actions
	
	/**
	 * Mark an item as selected
	 * 
	 * @param {string} id
	 */
	select: function(id) {
		this.highlight(id)
		
		this.onClick(id)
	},
	
	/**
	 * Highlight an item without causing an onClick
	 * 
	 * @param {Object} id
	 */
	highlight: function(id) {
		this._selectedId = id
		
		if (this._selectedNode) {
			dojo.removeClass(this._selectedNode, "itemSelected")
		}
		
		dojo.addClass(this._itemNodes[id], "itemSelected")
		this._selectedNode = this._itemNodes[id]
	},
	
	deSelect: function() {
		if (this._selectedNode) {
			dojo.removeClass(this._selectedNode, "itemSelected")
		}

		delete this._selectedId
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
	 * Called when the new button is clicked
	 */
	onNew: function() {},
	
	
	/**
	 * Called when the list is taken out of edit mode
	 *  The standard behavior commits items in the dirtyBuffer to the object store and reloads the list
	 * 
	 * @param {Object} list of items that changed
	 */
	onEditCommit: function(dirtyBuffer) {
		var self = this
				
		for (var id in dirtyBuffer) {
			var dirtyItem = dirtyBuffer[id]

			if (dirtyItem.deleted) this.store.remove(id)
			if (dirtyItem.change) {
				var item = self._cachedResult[id]
				self.setLabel(item, dirtyItem.change.newLabel)
				this.store.put(item)
			}
		}

		this.reload()

		console.dir(dirtyBuffer)
	},

	/**
	 * Called when an item is clicked
	 * 
	 * @param {string} id
	 */
	onClick: function(id) {},
	
	/**
	 * Called when an item delete icon is clicked
	 * 
	 * @param {string} id
	 */
	onDelete: function(id) {
		var self = this
		
		var label = this.getLabel(this._cachedResult[id])
		
		if (this.multiEditMode && this.confirmPerChange) {
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
						self._handleSingleEditMode()
					} else {
						self.resetItem(id)
					}
				}
			})
		}
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

		if (this.multiEditMode && this.confirmPerChange) {
			new apstrata.horizon.PanelAlert({
				panel: self,
				width: 320,
				height: 150,
				message: "Are you sure you want to change the label: " + '[' + oldLabel + "] to [" + newLabel + "] ?",
				iconClass: "editIcon",
				actions: ['Yes', 'No'],
				actionHandler: function(action){
					if (action == 'Yes') {
						self._handleSingleEditMode()
					}
					else {
						self.resetItem(id)
					}
				}
			})
		}
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
	
	setLabel: function(item, label) {
		item[this.labelAttribute] = label
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
		
		if (!this.isItemDeleteable(row)) {
			dojo.addClass(deleteNode, "deleteNodeDisabled");
		} else {
			dojo.connect(deleteNode, "onclick", dojo.hitch(self, "_onDelete", (self.getId(row)+"")))
		}
		
		dojo.style(deleteNode, "display", this.isEditMode()?"inline-block":"none")
		
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

			this._btnNew = new dijit.form.Button({label: "New", onClick: dojo.hitch(self, "onNew")})
			dojo.place(this._btnNew.domNode, this.dvFooter)
		}
	},
	
	_editList: function() {
		if (this._tglEdit.get('checked')) {
			this._startEditingList()
		} else {
			this._finishEditingList()
		}
	},

		_startEditingList: function() {
			this._tglEdit.set('label', 'Save Edits')
			this._btnNew.set('disabled', 'disabled')

			// show delete nodes
			dojo.query(".deleteNode", this.domNode).forEach(function(node){
				dojo.style(node, "display", "inline-block")
			})

			// Make non editable labels appear disabled
			for (id in this._cachedResult) {
				var row = this._cachedResult[id]
				var labelNode = this._labelNodes[id]

				if (!this.isItemEditable(row)) dojo.addClass(labelNode, "labelEditDisabled")
			}
		},
		
		_finishEditingList: function() {
			this._tglEdit.set('label', 'Edit')
			this._btnNew.set('disabled', '')
			
			if (self._activeInlineEdit) this._finishEditingLabel()

			// hide delete nodes
			dojo.query(".deleteNode", this.domNode).forEach(function(node){
				dojo.style(node, "display", "none")
			})
			
			// remove deleted row effect on label
			dojo.query(".label", this.domNode).forEach(function(node){
				dojo.removeClass(node, "deleted")
			})

			// remove disabled effect from non editable rows
			for (id in this._cachedResult) {
				var row = this._cachedResult[id]
				var labelNode = this._labelNodes[id]

				if (!this.isItemEditable(row)) dojo.removeClass(labelNode, "labelEditDisabled")		
			}
			
			if (this._tglEdit.get('checked')) this._tglEdit.set('checked', false)
			
			this.onEditCommit(this._dirtyBuffer.get())
			
			this._dirtyBuffer.empty()
		},
		
	_handleSingleEditMode: function() {
		if (!this.multiEditMode) this._finishEditingList()
	},
		
	_editLabel: function(id) {
		var self = this
		
		// If an edit is already active, don't edit
		if (this._activeInlineEdit) return
		
		if (!this.isItemEditable(this._cachedResult[id])) return
		
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
				self._startEditingLabel(id, newValue, v)
			},
			onCancel: function() {
				self._finishEditingLabel(v)
			}
		}, editNode)
	},

		_startEditingLabel: function(id, newValue, v) {
			var self = this
			self._activeInlineEdit.destroyRecursive()
			delete self._activeInlineEdit
			self._labelNodes[id].innerHTML = newValue
			self._dirtyBuffer.markChanged(id, v, newValue)
	
			self.onEditLabel(id, v, newValue)
		},
		
		_finishEditingLabel: function() {
			var self = this
			self._activeInlineEdit.destroyRecursive()
			delete self._activeInlineEdit
			self._labelNodes[id].innerHTML = v
		}

})