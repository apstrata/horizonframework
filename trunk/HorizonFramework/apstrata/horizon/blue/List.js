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
dojo.provide("apstrata.horizon.blue.List")

dojo.require("dojo.store.Memory")
dojo.require("apstrata.horizon.List")
dojo.require("apstrata.horizon.blue.TestData")

dojo.declare("apstrata.horizon.blue.List", 
[apstrata.horizon.List], 
{
	
	//
	// widget attributes
	//
	filterable: true,
	sortable: true,
	editable: true,
	maximizable: true,
	
	idProperty: 'id',
	labelProperty: 'Name',
	
	constructor: function() {
		var self = this
		this.store = musicStore // defined in apstrata.horizon.blue.TestData
	},
		
	postCreate: function() {
		dojo.style(this.domNode, "width", "250px")
		this.inherited(arguments)	
	},
	
	onClick: function(index, id) {
		var self = this
	}
})
