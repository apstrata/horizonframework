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
dojo.provide("apstrata.horizon.blue.DataList")

dojo.require("apstrata.horizon.List")

dojo.require("apstrata.Connection")
dojo.require("apstrata.ObjectStore")

dojo.declare("apstrata.horizon.blue.DataList", 
[apstrata.horizon.List], 
{
	items: [],
	
	//
	// widget attributes
	//
	filterable: true,
	sortable: true,
	editable: true,
	width: 400,
	
	idProperty: 'key',
	labelProperty: 'title',
	
	constructor: function() {
		var self = this
		
		this.store = new apstrata.ObjectStore({
			connection: bluehorizon.config.apstrataConnection,
			store: "website",
			queryFields: "formType, title, template"
		})
	},

	_queryParams: function() {
		var self = this

		var query =  (self._filter=="")?{}:{query: "title like \"" + self._filter + "%\""}

		var sort = {} 
		if (this._sort == 1) {
			sort = {sort: "title<string:ASC>"}
		} else if (this._sort == 2) {
			sort = {sort: "title<string:DESC>"}
		}
		
		return dojo.mixin(query, sort)
	},
	
	_queryOptions: function() {
		return {}		
	},
		
	onClick: function(index, id) {
		var self = this
	}
})
