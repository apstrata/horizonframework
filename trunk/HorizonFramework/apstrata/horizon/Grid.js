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
dojo.provide("apstrata.horizon.Grid")

dojo.require("dojox.grid.DataGrid")
dojo.require("apstrata.ObjectStore")

dojo.require("apstrata.horizon.Panel")

dojo.declare("apstrata.horizon.Grid", 
[apstrata.horizon.Panel], 
{
	templatePath: dojo.moduleUrl("apstrata.horizon", "templates/Grid.html"),
	widgetsInTemplate: true,

	store: null,
	
	startup: function() {
		var self = this

		var data = new apstrata.ObjectStoreAdaptor({objectStore: self.store})

		this._grid = new dojox.grid.DataGrid({
			store: data,
			structure: self.layout,
			rowsPerPage: 20,
			rowSelector: "0px"
		})

		dojo.connect(this._grid, "onRowClick", function(e) {
			self.onClick(e.rowIndex, self._grid.selection.getSelected()[0].key)
		})

		dojo.place(this._grid.domNode, this.dvContent)
		this._grid.startup()
		
		this.inherited(arguments)
	},

	onClick: function(index, id, args) {
		console.debug(index, id)
	}
	
})
