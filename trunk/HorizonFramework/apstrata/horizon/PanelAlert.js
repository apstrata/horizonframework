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
dojo.provide("apstrata.horizon.PanelAlert") 

 
dojo.declare("apstrata.horizon.PanelAlert", 
[dijit._Widget, dojox.dtl._Templated], 
{
	templatePath: dojo.moduleUrl("apstrata.horizon", "templates/PanelAlert.html"),
 	widgetsInTemplate: true,

	/**
	 * 
	 * @param {Object} attr: {panel: rootPanel, message: "", actions: ['button1', 'button2'], actionHandler: function(action) {} }
	 */
	width: 300,
	height: 200,
	
 	constructor: function(attr) {
		dojo.mixin(this, attr)
 	},
 	
 	postCreate: function() {
		var self = this

		var a = dojo.position(this.panel.domNode)

		// Style and position the widget
		dojo.addClass(this.domNode, "apstrataHorizonAlert")
		dojo.style(this.domNode, {
			top: (a.y) + "px",
			left: (a.x + a.w/2 - self.width/2) + "px",
			height: self.height + "px",
			width: self.width + "px"
		})
		dojo.place(this.domNode, dojo.body())

		// Add the buttons
		for (var i=0; i<self.actions.length; i++) {
			var button = new dijit.form.Button({
				label: self.actions[i],
				onClick: function() {
					self.onClick(this.label)
				}
			})
			dojo.place(button.domNode, this.dvActions)
		}
		
		// Put a curtain over the entire window because the alert is modal
/*
		var w = dijit.getViewport()
		this._curtain = dojo.create('div', {}, dojo.body())
		dojo.addClass(this._curtain, "apstrataHorizonAlertCurtain")

		dojo.style(this._curtain, {
			top: 0 + "px",
			left: 0 + "px",
			width: w.w + "px",
			height: w.h + "px"
		})
*/		
		this.panel.container.showCurtain()
		
		// If an icon path is specified, show the img
		if (this.icon) {
			dojo.create("img", {src: self.icon}, this.dvIcon)
		}
		
		// Position elements
		var d = dojo.contentBox(this.domNode)
		var m = dojo.position(this.dvMessage)
		var b = dojo.position(this.dvActions)
		var i = dojo.position(this.dvIcon)


		// Position the actions at the center lower part
		dojo.style(this.dvActions, {
			left: (d.w/2 - b.w/2) + "px",
			top: (d.h - b.h) + "px"
		})
		dojo.style(this.dvMessage, {
			left: (i.w) + "px",
			width: (d.w-i.w) + "px",
			height: (d.h - b.h) + "px"
		})
		
 	},
	
	onClick: function(action) {
		this.actionHandler(action)
		this.panel.container.hideCurtain()
//		this._curtain.parentNode.removeChild(this._curtain)
		this.destroyRecursive()
	}
 })