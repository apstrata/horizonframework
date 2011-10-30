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

dojo.declare("apstrata.horizon.blue.List", 
[apstrata.horizon.List], 
{
	_seed: "Items are, in general, returned in an indeterminate order. This isn’t always what you want to happen; there are definite cases where sorting items based on specific attributes is important. Fortunately, you do not have to do the sorting yourself because dojo.data provides a mechanism to do it for you. The mechanism is just another option passed to fetch, the sort array.",
	
	//
	// widget attributes
	//
	filterable: true,
	sortable: true,
	editable: true,
	maximizable: true,
	
	constructor: function() {
		var self = this
		
		this.items = []
		dojo.forEach(this._seed.split(" "), function(word) {
			self.items.push({id: word, label: word})
		})
		
		this.store = new dojo.store.Memory({data: self.items})
	},
		
	postCreate: function() {
		dojo.style(this.domNode, "width", "250px")
		this.inherited(arguments)	
	},
	
	onClick: function(index, id) {
		var self = this
	}
})
