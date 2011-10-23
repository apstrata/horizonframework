/*******************************************************************************
 *  Copyright 2009-2011 Apstrata
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

dojo.provide('apstrata.horizon.MultiColumnList');
dojo.require('apstrata.horizon.list.MultipleListContent')

dojo.require("dojox.grid.DataGrid")

dojo.declare('apstrata.horizon.MultiColumnList', 
[apstrata.horizon.Panel], 
{
	templatePath: dojo.moduleUrl("apstrata.horizon", "templates/List.html"),
	widgetsInTemplate: true,

	// This is a dojo.store data source of the widget
	store: null,

	width: 600,
	
	number:'1',name:'Almond',code:'#EFDECD',yearIssued:'1998',yearRetired:'',

	postCreate: function() {
		var self = this
		
		var data = new apstrata.ObjectStoreAdaptor({objectStore: self.store})

		var structure = [
			// view 1
			{ cells: [ new dojox.grid.cells.RowIndex({width: 5}) ], noscroll: true},
			// view 2
			[
				{ field: 'number', width: 'auto' },
				{ field: 'name', editable: 'true', width: 'auto' },
				{ field: 'code', editable: 'true', width: 'auto' },
				{ field: 'yearIssued', editable: 'true', width: 'auto' },
				{ field: 'yearRetired', editable: 'true', width: 'auto' }
			]
		]
		
		self._grid = new dojox.grid.DataGrid({
			structure: structure,
			store: data,
			rowsPerPage: 20,
			rowSelector: "20px"
		})

		// Instantiate the widget that will display the content
		dojo.place(self._grid.domNode, self.dvItems)

		self._grid.startup()

console.dir(self._grid)

		// Place the sorting filtering widget
		if (this.sortable || this.filterable) {
//			self._filterWidget = new this.filterWidget({parent: self})		
//			dojo.place(self._filterWidget.domNode, self.dvHeader)

//			dojo.connect(self._filterWidget, "onSortChange", dojo.hitch(this, "sort"))
//			dojo.connect(self._filterWidget, "onFilterChange", dojo.hitch(this, "filter"))
		}

	//	this.layout()
		this.reload()

		this.inherited(arguments)
	},
	
	reload: function() {
		this._showLoadingMessage(false)
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
	
	editItems: function(){
	},
	
	newItem: function() {
	},
	
	onClick: function(index, id) {},
	
	
	
});
