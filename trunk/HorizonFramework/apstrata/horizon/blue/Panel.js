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
dojo.provide("apstrata.horizon.blue.Panel")

dojo.require("apstrata.horizon.Panel")

dojo.declare("apstrata.horizon.blue.Panel", 
[apstrata.horizon.Panel], 
{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl("apstrata.horizon.blue", "templates/HomePanel.html"),
	templateString: "<div class='panel' style='width: 400px;'><br><div style='height: 100%;overflow-x: auto;overflow-y: scroll'>{{ content }}</div></div>",
	
	maximizable: true,
	content: "",
	
	postCreate: function() {
		var tmp = ''
		
		for (i=0; i<1200; i++) tmp += (i+" ")
		dojo.style(this.domNode, {
			"innerHTML": ""
		})
		
		this.content = tmp
		
		this.render()
		
		this.inherited(arguments)
	}
	
})


