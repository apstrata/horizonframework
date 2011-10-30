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

dojo.provide('apstrata.horizon.List');

dojo.require('apstrata.widgets.Alert')

dojo.require('dijit.form.ToggleButton')
dojo.require('dijit.form.Button')

dojo.require("apstrata.horizon.Panel")
dojo.require('apstrata.horizon.list.SimpleListContent')
dojo.require('apstrata.horizon.util.FilterLabelsByString')
dojo.require('apstrata.horizon.list.SimpleFilterAndSort')

/*
 * This List provides a scrolling vertical list of items. It provides edit and new functionality  
 */
dojo.declare("apstrata.horizon.List", 
[apstrata.horizon.Panel], 
{
	templatePath: dojo.moduleUrl("apstrata.horizon", "templates/List.html"),
	widgetsInTemplate: true,

	//
	// widget attributes
	//
	editable: false,
	filterable: false,
	sortable: false,
	// Install simple filter widget
	filterWidget: apstrata.horizon.list.SimpleFilterAndSort,
	
	// This is a dojo.store data source of the widget
	store: null,
	
	//
	// private variables
	//
	_filter: '',
	_queryOptions: null,
	_editMode: false,

	// index of the essential item properties
	idProperty: 'key',
	labelProperty: 'title',
		
	//
	// Messages
	// TODO: get from resource bundle
	//
	_MSG_FILTER: 'type to filter',
	_MSG_DELETE: "Are you sure you want to delete item: ",
	
	contentClass: apstrata.horizon.list.SimpleListContent,
	
	constructor: function(args) {
		this._selectIds = args.selectIds
	},
	
	startup: function() {
		var self = this

		// Instantiate the widget that will display the content
		self._listContent = new this.contentClass({result: [], parent: self, selectIds: self._selectIds})

		dojo.place(self._listContent.domNode, self.dvItems)

		// Place the sorting filtering widget
		if (this.sortable || this.filterable) {
			self._filterWidget = new this.filterWidget({parent: self})		
			dojo.place(self._filterWidget.domNode, self.dvHeader)

			dojo.connect(self._filterWidget, "onSortChange", dojo.hitch(this, "sort"))
			dojo.connect(self._filterWidget, "onFilterChange", dojo.hitch(this, "filter"))
		}
		
		this.resize()
		this.reload()
		
		this.inherited(arguments)
	},
	
	sort: function(sort) {
		this._sort = sort
		this.reload()
	},
	
	filter: function(filter) {
		this._filter = filter
		this.reload()
	},

	// function called each time containers dimensions change
	resize: function() {
		var self = this

		// resize dvLoading
		dojo.style(self.dvLoading, "top", (self.getContentHeight()/2-10)+"px")
		dojo.style(self.dvLoading, "width", (self.width-10)+"px")

		if (self._listContent) self._listContent.layout()
		if (self._filterWidget) self._filterWidget.layout()
			
		this.inherited(arguments)
	},
	
	reload: function() {
		var self = this
		
		var query = this._queryParams()
		var queryOptions = this._queryOptions()
				
		this._showLoadingMessage(true)
		dojo.when(
			this.store.query(
				query,
				queryOptions
			),
			function(result) {
				self._showLoadingMessage(false)
				self._listContent.setData(result)				
			}
		)
	},

	_markSelected: function(e) {
		
	},

	openById: function(id) {
		this.inherited(arguments)
		this._listContent.selectItem(id)
	},	

	onClick: function(index, id, args) {},
	
	newItem: function() {},
	
	editItems: function() {
		var self = this
		
		// Close any open panels
		this.closePanel()
		
		if (this._editMode) {
			// toggle delete icons off
			var items = dojo.query('.deleteCell', this.domNode)
			dojo.forEach(items, function(item) {
				var icon = dojo.query('.iconDelete', item)
				
				if (icon) dojo.destroy(icon[0])
			})
			this._editMode = false
		} else {
			// toggle delete icons on
			var items = dojo.query('.deleteCell', this.domNode)
			
			dojo.forEach(items, function(item) {
				var n = dojo.create("div", {innerHTML: "<img src='"+ self._apstrataRoot +"/resources/images/pencil-icons/stop-red-sml.png'>"})
				n.setAttribute('itemId', item.getAttribute('itemId'))
				n.setAttribute('itemIndex', item.getAttribute('itemIndex'))

				dojo.addClass(n, 'iconDelete')
				dojo.place(n, item)
				
				dojo.connect(n, 'onclick', function(e) {
					var id = e.currentTarget.getAttribute('itemId')
					var item = self.store.get(id)

					self._alert(self._MSG_DELETE + '[' + item.label + "] ?", 
								e.currentTarget, 
								function(target) {
									self.store.remove(id)
									self._editMode = false
									self._refreshData()
									self._tglEdit.attr("checked", false) 
									
									self.onDeleteItem(target.getAttribute('itemIndex'), id, item)
								}, function(target) {
									
								})

				})
			})
			this._editMode = true
		}
	},

	
	onDeleteItem: function(index, label, attrs) {},

	_alert: function (msg, origin, yes, no) {
		dialog3 = new apstrata.widgets.Alert({width: 300, 
												height: 300, 
												actions: "yes,no", 
												message: msg, 
												clazz: "rounded-sml Alert", 
												iconSrc: apstrata.baseUrl + "/resources/images/pencil-icons/alert.png", 
												animation: {from: origin}, 
												modal: true })

		dialog3.show()
		dojo.connect(dialog3, "buttonPressed", function(label) {
			if (label == 'yes') {
				yes(origin)
			} else {
				no(origin)
			}
			dialog3.hide()
		})
	},
	
	/*
	 * Works by default for dojo.store.Memory and for filtering a label based on a string
	 * It should be overriden for different stores or for different filtering requirements 
	 */
	_queryParams: function() {
		var self = this

		return function(item) { return apstrata.horizon.util.FilterLabelsByString(item, self._filter) }
	},
	
	/*
	 * Works by default for dojo.store.Memory and for sorting the label attribute
	 * It should be overriden for different stores or for different sorting requirements 
	 */
	_queryOptions: function() {
		var _queryOptions = {}
		
		if (this._sort == 1) {
			_queryOptions = {
				sort: [{
					attribute: "label",
					ascending: true
				}]
			}
		} else if (this._sort == 2) {
			_queryOptions = {
				sort: [{
					attribute: "label",
					descending: true
				}]
			}
		} 
		
		return _queryOptions 
	},
	
	_showLoadingMessage: function(b) {
		if (b) {
			dojo.style(this.dvLoading, "display", "block")
			dojo.style(this.dvItems, "display", "none")

//			if (this.dvHeader) dojo.style(this.dvHeader, "display", "none")
			if (this.dvFooter) dojo.style(this.dvFooter, "display", "none")
		} else {
			dojo.style(this.dvLoading, "display", "none")
			dojo.style(this.dvItems, "display", "block")

//			if (this.dvHeader) dojo.style(this.dvHeader, "display", "block")
			if (this.dvFooter) dojo.style(this.dvFooter, "display", "block")
		}
	},
	
	getContentHeight: function() {
		return  dojo.contentBox(this.domNode).h  - dojo.contentBox(this.dvHeader).h - dojo.contentBox(this.dvFooter).h
	}
})			
