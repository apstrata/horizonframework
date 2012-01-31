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

dojo.provide('apstrata.horizon.LayoutPanel');

/*
 * This mixin class insures that a HStackable Widget animates/opens in the appropriate position in the Stackable Container
 */
dojo.declare("apstrata.horizon.LayoutPanel", 
[apstrata.horizon.Panel], 
{
	templatePath: dojo.moduleUrl("apstrata.horizon", "templates/LayoutPanel.html"),
	widgetsInTemplate: false,

	constructor: function(attrs) {
		this.templateString = "<div class='panel'><div dojoAttachPoint='dvContent' style='overflow-y: auto; '></div></div>"
		//this.maximizePanel = true
		this.setLayoutt(attrs.layout)
	},
	
	setLayoutt: function(layout) {
		if (layout) this._layoutt = layout; else this._layoutt = {}		
	},

	postCreate: function() {
		if (this._layoutt.header || this._layoutt.splitHeader) {
			this.dvHeader = dojo.create("div")
			dojo.place(this.dvHeader, this.domNode, "first")
		}

		if (this._layoutt.splitHeader) {
			this.dvHeaderLeft = dojo.create("div", {innerHTML: "left", style:"float:left; width: 50%"}, this.dvHeader)
			this.dvHeaderRight = dojo.create("div", {innerHTML: "right", style:"float:left; width: 50%"}, this.dvHeader)
			dojo.create("div", {style:"clear: both;"}, this.dvHeader)
		}

		if (this._layoutt.footer || this._layoutt.splitFooter) {
			this.dvFooter = dojo.create("div")
			dojo.place(this.dvFooter, this.domNode, "last")
		}

		if (this._layoutt.splitFooter) {
			this.dvFooterLeft = dojo.create("div", {innerHTML: "left", style:"float:left; width: 50%"}, this.dvFooter)
			this.dvFooterRight = dojo.create("div", {innerHTML: "right", style:"float:left; width: 50%"}, this.dvFooter)
			dojo.create("div", {style:"clear: both;"}, this.dvFooter)
		}
		
		this.inherited(arguments)
	},

	startup: function() {
		var self = this

		this.resize()

		this.inherited(arguments)
	},

	// function called each time containers dimensions change
	resize: function() {
		var self = this
		if (this.dvContent) dojo.style(this.dvContent, "height", self.getContentHeight() + "px")				

		this.inherited(arguments)
	},
	
	getContentHeight: function() {
		return  dojo.contentBox(this.domNode).h  
			- ((this.dvHeader)?dojo.contentBox(this.dvHeader).h:0) 
			- ((this.dvFooter)?dojo.contentBox(this.dvFooter).h:0)
	},
	
	destroy: function() {
		this.dvHeader.parentNode.removeChild(this.dvHeader)
		this.dvFooter.parentNode.removeChild(this.dvFooter)

		this.inherited(arguments)
	}
	
})
