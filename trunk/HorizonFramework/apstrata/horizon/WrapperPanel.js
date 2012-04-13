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

dojo.provide('apstrata.horizon.WrapperPanel');

dojo.require("apstrata.horizon.Panel")

/**
 * Wraps any dijit inside a panel
 */
dojo.declare("apstrata.horizon.WrapperPanel", 
[apstrata.horizon.Panel], 
{
//	templatePath: dojo.moduleUrl("apstrata.horizon", "templates/List.html"),
	templateString: "<div></div>",
	widgetsInTemplate: true,
	
	constructor: function(options) {
		this.options = options
	},
	
	startup: function() {
		var self = this

		dojo.place(self.options.widget.domNode, self.dvContent)
		
		if (this.optinos.widget) this.optinos.widget.reload()
		
		this.inherited(arguments)
	},
		
	reload: function() {
		var self = this
		
		if (this.optinos.widget) this.optinos.widget.reload()
		
		this.inherited(arguments)
	}	
})

