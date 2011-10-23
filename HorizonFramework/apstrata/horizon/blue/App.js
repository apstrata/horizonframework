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
dojo.provide("apstrata.horizon.blue.App")

dojo.require("apstrata.horizon.Container")
dojo.require("apstrata.horizon.blue.Home")
dojo.require("apstrata.horizon.blue.Menu")
dojo.require("apstrata.horizon.blue.TestPanel")


//dojo.require("apstrata.horizon.Preferences")

dojo.declare("apstrata.horizon.blue.App", 
[apstrata.horizon.Container], 
{
	applicationId: "blueHorizonDemo",
	
	postCreate: function() {
		var self = this

		// Create the leftMost Panel
		this.main = new apstrata.horizon.blue.Menu({container: self})

		this.main.deferred.then(function() {
//			self.main.openById('random')			
		})

		this.addMainPanel(this.main)
		
		this.inherited(arguments)
	},
	
	startup: function() {
		this.inherited(arguments)
	}
})





