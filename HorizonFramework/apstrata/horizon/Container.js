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

dojo.provide('apstrata.horizon.Container');

dojo.require('dojo.cookie');
dojo.require('dijit.layout._LayoutWidget')

dojo.require('apstrata.horizon.ControlToolbar');


/*
 * Layout widget container of the HStackable widgets
 */
dojo.declare("apstrata.horizon.Container2", 
[dijit.layout._LayoutWidget], 
{
	
	// Provides a unique key for storing preferences data (by default to a cookie)
	applicationId: "horizon",
	
	_marginRight: 5,


	__children: {},
	
	constructor: function(attrs) {
		if (attrs && attrs.applicationId) this.applicationId = attrs.applicationId

		// Extract the request params into an object		
		var s = window.location.search.substring(1)
		var params = s.split('&')
		this.request = {}
		for (var i=0; i<params.length; i++) {
			var tmp = params[i].split('=')
			this.request[tmp[0]] = tmp[1]
		}

		// Decompose the path (request param path) into an array
		if (this.request['path']) this.path = this.request['path'].split('/');
		else this.path = [];
		
		this._fixedMainPanel = false
	},
	
	addMainPanelx: function (child, fixed) {
		this._mainPanel = child
		//this.addChild(child)
		dojo.place(child.domNode, dojo.body())
		dojo.style(child.domNode, "zIndex", 105)
		
		if (fixed) this._fixedMainPanel = true
	},
	
	addChildx: function(child) {
		this.__children[child.id] = child
		
		this.inherited(arguments)
	},
	
	removeChildx: function(child) {
		if (this.__children[child.id]) delete this.__children[child.id]
		
		this.inherited(arguments)
	},
	
	autoScroll: function() {
		this.domNode.scrollLeft = this.domNode.scrollWidth - this.domNode.clientWidth
	},
		
	getRemainingFreeWidth: function(excludeId) {
		var w = 0
		
		for (id in this.__children) {
			if (id != excludeId) {
				var child = this.__children[id]
				
				w += child.domNode.offsetWidth
			}
		}

//	todo: don't know why this is not working on logout		
//		dojo.forEach(this.__children, function(child) {
//			w += child.domNode.offsetWidth
//		})

		return this.domNode.offsetWidth - w - this._marginRight * (this.getChildren().length)
	},

	_setFixedPanel: function() {
		var w = dijit.getViewport()
		var coord = {}
		
		var p = dojo.position(this._mainPanel.domNode)

//		coord.top = (this.margin.top + this._marginRight) + "px"
		coord.left = (this.margin.left + this._marginRight + p.w) + "px"
		coord.width = (w.w - this.margin.left - this.margin.right - 2*this._marginRight - p.w) + "px"
//		coord.height = (w.h - this.margin.top - this.margin.bottom - 2*this._marginRight) + "px"
		
//		this.height = (w.h - this.margin.top - this.margin.bottom - 2*this._marginRight)
console.dir(coord)		
		dojo.style(this.domNode, {
			left: coord.left,
			width: coord.width,
			background: "red"
		})
		
//		this.layout()
	},

	/*
	 * Auto calculate coordinates and size of Explorer based on 
	 *  window size and this.margin analog to CSS margin
	 */
	_layoutMarginModex: function() {
		var w = dijit.getViewport()
		
		var coord = {}

		coord.top = (this.margin.top + this._marginRight) + "px"
		coord.height = (w.h - this.margin.top - this.margin.bottom - 2*this._marginRight) + "px"

		if (this._fixedMainPanel) {
			var p = dojo.position(this._mainPanel.domNode)
			coord.left = (this.margin.left + this._marginRight + p.w) + "px"
			coord.width = (w.w - this.margin.left - this.margin.right - 2*this._marginRight - p.w) + "px"
		} else {
			coord.left = (this.margin.left + this._marginRight) + "px"
			coord.width = (w.w - this.margin.left - this.margin.right - 2*this._marginRight) + "px"
		}

		this.height = (w.h - this.margin.top - this.margin.bottom - 2*this._marginRight)
		
		dojo.style(this.domNode, {
			top: coord.top,
			left: coord.left,
			width: coord.width,
			height: coord.height,
			zIndex: "100"
		})

		coord.top = (this.margin.top + this._marginRight - 5) + "px"
		coord.left = (this.margin.left + this._marginRight - 5) + "px"
		coord.width = (w.w - this.margin.left - this.margin.right - 2*this._marginRight + 10) + "px"
		coord.height = (w.h - this.margin.top - this.margin.bottom - 2*this._marginRight + 10) + "px"

		dojo.style(this.background, {
			top: coord.top,
			left: coord.left,
			width: coord.width,
			height: coord.height,
			zIndex: "1"
		})

		coord.top = (this.margin.top - 23) + "px"
		coord.left = (w.w - 2*this._marginRight + 5 - 200) + "px"
		coord.left = (this.margin.left + this._marginRight + 5) + "px"

		this._controlToolbar.setPosition(coord.top, coord.left)
	},
		
	startup: function() {
		//setTimeout(dojo.hitch(this, 'loadPreferences'), 3000)
		this.loadPreferences();
		
		this.inherited(arguments)
	},

	loadPreferences: function() {
		var prefs = {}

		try {
			var prefs = dojo.fromJson(dojo.cookie(this.applicationId + "-prefs"))
			if (prefs) this.preferencesChanged(prefs); else prefs = {}
		} catch (err) {
			
		}
		
		return prefs
	},

	savePreferences: function(preferences) {
		dojo.cookie(this.applicationId + "-prefs", dojo.toJson(preferences), { expires: 365 })
		this.preferencesChanged(preferences)
	},

	preferencesChanged: function(preferences) {}
})


dojo.declare("apstrata.horizon.Container", 
[apstrata.horizon.Container2], 
{
	
	margin: null,
	marginMax: {left: 0,right: 0,top: 50,bottom: 0},
	
	consturctor: function() {
		this._maximize = false
		this._mainPanel = false
	},
	
	postCreate: function() {
		var self = this

		// save the current position set in CSS
		this._savePosition = dojo.position(this.domNode)
		this._CSSdim = dojo.position(this.domNode)
		
		// Add the mandatory CSS class to the Layout widgets's dom node
		dojo.addClass(this.domNode, 'horizon')

		// Create the fixed left div
		this.fixedPanelNode = dojo.create("div", null, dojo.body())
		dojo.addClass(this.fixedPanelNode, "horizon")

		// Create the background transparent div
		this.background = dojo.create("div", null, dojo.body())
		dojo.addClass(this.background, "horizonBackground")
		
		// Only add the control toolbar if it is not already set by the user-application.
		if (!self._controlToolbar) {
			self._controlToolbar = new apstrata.horizon.ControlToolbar({container: self});
			dojo.place(self._controlToolbar.domNode, dojo.body());
			dojo.connect(self._controlToolbar, "maximize", dojo.hitch(this, 'maximize'))
			dojo.connect(self._controlToolbar, "restore", dojo.hitch(this, 'restore'))
		}
		
		this.layout()

		this.inherited(arguments)
	},
	
	startup: function() {
		this.inherited(arguments)
	},
	
	layout: function() {
		this._containerLayout()
		
		// Call layout for each contained widget upon resize
		dojo.forEach(this.getChildren(), function(child) {
			child.layout();
		})

		this.inherited(arguments)
	},
	
	maximize: function() {
		this._maximize = true
		this.layout()
	},
	
	restore: function() {
		this._maximize = false
		this.layout()
	},
	
	_containerLayout: function() {
		var self = this

		var w = dijit.getViewport()

		// Get the border margin of from background div's CSS class
		var bMargin = dojo.style(this.background, "borderTopWidth")

		// Get control bar height
		var cBarH = dojo.position(this._controlToolbar.domNode).h

		// Calculate bounding dimensions
		var bounding = {}
		if (this._maximize) {
			bounding.top = cBarH + bMargin
			bounding.left = bMargin
			bounding.height = w.h - cBarH - 2*bMargin
			bounding.width = w.w - 2*bMargin
		} else if (this.margin) {
			bounding.top = this.margin.top + cBarH + bMargin
			bounding.left = this.margin.left + bMargin
			bounding.height = w.h - this.margin.top - this.margin.bottom - cBarH - 2*bMargin
			bounding.width = w.w - this.margin.left - this.margin.right - 2*bMargin
		} else {
			// restore dimensions from container CSS class
			bounding.top = this._CSSdim.y
			bounding.left = this._CSSdim.x
			bounding.height = this._CSSdim.h
			bounding.width = this._CSSdim.w
		}
		
		
		var container = {}
		var fixedPanel = {}
		
		if (this._mainPanel) {
			// get main panel's width
			var mpw = dojo.position(this._mainPanel.domNode).w

			// Calculate fixed section dimensions
			fixedPanel.top = bounding.top
			fixedPanel.width = mpw
			fixedPanel.left = bounding.left
			fixedPanel.height = bounding.height
	
			// Calculate Scrolling section dimensions
			container.top = bounding.top
			container.height = bounding.height
			container.left = bounding.left + fixedPanel.width
			container.width = bounding.width - fixedPanel.width			
		} else {
			// Calculate Scrolling section dimensions
			container = bounding			
		}

		// Calculate Background dimensions
		//	Make it wrap around bounding
		var background = {}
		background.top = (bounding.top - bMargin)
		background.left = (bounding.left - bMargin)
		background.width = (bounding.width)
		background.height = (bounding.height)

		// Calculate Control toolbar position
		var toolbar = {}
		toolbar.top = (bounding.top - cBarH - bMargin)
		toolbar.left = (bounding.left + bMargin * 2)

		// Position divs
		dojo.style(this.domNode, {
			top: container.top + "px",
			left: container.left + "px",
			width: container.width  + "px",
			height: container.height  + "px",
			zIndex: "100"
		})
		dojo.style(this.fixedPanelNode, {
			top: fixedPanel.top + "px",
			left: fixedPanel.left + "px",
			width: fixedPanel.width  + "px",
			height: fixedPanel.height  + "px",
			zIndex: "100"
		})
		dojo.style(this.background, {
			top: background.top + "px",
			left: background.left + "px",
			width: background.width  + "px",
			height: background.height  + "px",
			zIndex: "1"
		})

		this._controlToolbar.setPosition(toolbar.top + "px", toolbar.left + "px")
	},

	addMainPanel: function (child, fixed) {
		var self = this
		this._mainPanel = child
		
		setTimeout(function() {
			dojo.place(child.domNode, self.fixedPanelNode)
			child.layout()
		}, 100)
	},
	
	addChild: function(child) {
		this.__children[child.id] = child
		
		this.inherited(arguments)
	},
	
	removeChild: function(child) {
		if (this.__children[child.id]) delete this.__children[child.id]
		
		this.inherited(arguments)
	},
})
