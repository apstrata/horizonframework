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

	width: 400,
	store: null,
	heights: {
		header: 30,
		footer: 50
	},

	headerHeight: 30,
	contentHeight: 0,
	footerHeight: 50,
	
	constructor: function() {
		this.store = new apstrata.ObjectStore({
			connection: bluehorizon.config.apstrataConnection,
			store: "website",
			queryFields: "apsdb.documentKey, formType, title, template"
		})
	},
	
	postCreate: function() {
		var self = this

		var data = new apstrata.ObjectStoreAdaptor({objectStore: self.store})

		var layoutNumbers = [
			// view 1
			{ cells: [ new dojox.grid.cells.RowIndex({width: 5}) ], noscroll: true},
			// view 2
			[
				{ field: 'apsdb.documentKey', width: 'auto' },
				{ field: 'formType', editable: 'true', width: 'auto' },
				{ field: 'title', editable: 'true', width: 'auto' },
				{ field: 'template', editable: 'true', width: 'auto' }
			]
		]

		this._grid = new dojox.grid.DataGrid({
			store: data,
			structure: layoutNumbers,
			rowsPerPage: 20,
			rowSelector: "20px"
		})

		dojo.place(this._grid.domNode, this.dvMiddle)
		this._grid.startup()
		
//		this.autoDimension()
		

//		this.resizeLayout()
		var d = dojo.contentBox(this.domNode)
		var height = d.h-this.heights.header-this.heights.footer

		this.headerHeight = this.heights.header
		this.contentHeight = height
		this.footerHeight = this.heights.footer

		this.inherited(arguments)
	},

	autoDimension: function() {
		var d = dojo.contentBox(this.domNode)
		
		var height = d.h-this.heights.header-this.heights.footer

		dojo.style(this.dvHeader, "height", this.heights.header+"px")
		dojo.style(this.dvMiddle, "height", height+"px")
		dojo.style(this.dvFooter, "height", this.heights.footer+"px")
	},
	
	layout: function() {
		var self = this
	
//		this.autoDimension()
		
//		dojo.contentBox(this._grid.domNode, {w: d.w, h: height});
//		this._grid.update();


//		this.inherited(arguments)
	},

	getContentHeight: function() {
		
		return this.getContainer().height
	}
	
})
