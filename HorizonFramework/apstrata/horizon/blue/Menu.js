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
dojo.provide("apstrata.horizon.blue.Menu")

dojo.require("dojo.store.Memory")
dojo.require("apstrata.horizon.Menu")

dojo.declare("apstrata.horizon.blue.Menu", 
[apstrata.horizon.Menu], 
{
	items: [
			{	
				id:"home", 
				label: "Home", 
				iconSrc: apstrata.baseUrl+"/resources/images/pencil-icons/home.png",
				panelClass: "apstrata.horizon.blue.Home"
			},
			{
				id:"panel", 
				label: "Panel", 
				iconSrc: apstrata.baseUrl+"/resources/images/pencil-icons/computer.png", 
				panelClass: "apstrata.horizon.blue.Panel"
			},
			{
				id:"list", 
				label: "List", 
				iconSrc: apstrata.baseUrl+"/resources/images/pencil-icons/computer.png", 
				panelClass: "apstrata.horizon.blue.List"
			},
			{
				id:"datalist", 
				label: "List from apstrata", 
				iconSrc: apstrata.baseUrl+"/resources/images/pencil-icons/computer.png", 
				panelClass: "apstrata.horizon.blue.DataList"
			},
			{
				id:"grid", 
				label: "Grid", 
				iconSrc: apstrata.baseUrl+"/resources/images/pencil-icons/computer.png", 
				panelClass: "apstrata.horizon.blue.Grid"
			},
			{
				id:"random", 
				label: "Colors", 
				iconSrc: apstrata.baseUrl+"/resources/images/pencil-icons/computer.png", 
				panelClass: "apstrata.horizon.blue.Colors"
			},
			{	
				id:"preferences", 
				label: "Preferences", 
				iconSrc: apstrata.baseUrl+"/resources/images/pencil-icons/tick.png", 
				panelClass: "apstrata.horizon.Preferences"
			}
		],
	
	//
	// widget attributes
	//
	filterable: true,
	sortable: true,
	editable: false,
	
	constructor: function() {
		var self = this
		this.store = new dojo.store.Memory({data: self.items})
	},
	
//	startup: function() {
//		this.home()
		
//		this.inherited(arguments)
//	},
	
	home: function() {
		dojo.require("apstrata.horizon.blue.Panel")
		var a = this.openPanel(apstrata.horizon.blue.Panel)
		a.deferred.then(function() {
console.debug(a.id +' done')
//			self.openById('random')			
		})
		
//		this.openPanel(apstrata.horizon.blue.Home)
	}
})

