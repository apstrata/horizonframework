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

dojo.provide('apstrata.horizon.Panel');

dojo.require('dojox.dtl._Templated');
dojo.require('dijit.layout.ContentPane')
dojo.require('apstrata.horizon.PanelIcons')
dojo.require("apstrata.horizon.PanelAlert")

dojo.require('apstrata.horizon.util.PanelAnimation')

dojo.declare("apstrata.horizon.Panel", 
[dijit._Widget, dojox.dtl._Templated], 
{
	templatePath: dojo.moduleUrl("apstrata.horizon", "templates/Panel.html"),
	widgetsInTemplate: true,

	parentListId: "",
	parentList: null,

	maximizePanel: false,

	/*
	 * Instantiate an HStackable and set its parent
	 */
	constructor: function(attrs) {
		if (attrs) {
			if (attrs.container) this.container = attrs.container

			if (attrs.parentList) {
				this._parent = attrs.parentList
				this.parentNode = attrs.parentList.domNode
			} else if (attrs.parentListId) {
				this.parentListId = attrs.parentListId
				
				if (this.parentListId != "") {
					this.parentNode = dojo.byId(this.parentListId)
					if (!this.parentNode) 
						throw Error('parentNode ' + attrs.parentListId + ' not found')
				}
			}

			this._selectIds = attrs.selectIds
		}
		
	
		this._fixedPanel = false
		this.deferred = new dojo.Deferred()
	},

	/*
	 */
	_setStyle: function() {
		var self = this

		// Change panel width to occupy all remaining free space in container
		if (this.maximizePanel) {
			if (this._openPanel) {
				if (!this._maximizeWidth) {
					var marginL = dojo.style(self.domNode, "marginLeft")
					var marginR = dojo.style(self.domNode, "marginRight")
					this._maximizeWidth = self.getContainer().getRemainingFreeWidth(self.id) - marginL - marginR +'px'		
				}
			} else {
				this._maximizeWidth = self.getContainer().getRemainingFreeWidth(self.id)+'px'		
			}
			dojo.style(this.domNode, {width: self._maximizeWidth})
		}
	},

	postCreate: function() {
		var self = this

		// mandatory style attributes for the panels to function
		dojo.style(this.domNode, "position", "absolute")
		dojo.style(this.domNode, "overflow", "hidden")
		dojo.style(this.domNode, "height", "99%")

		// When rendering the domNode id and widgetid are lost, save them them reinstall them in this.render
		this._savedId = this.domNode.id

		if (this.maximizable) {
			var icons = new apstrata.horizon.PanelIcons()
			dojo.place(icons.domNode, this.domNode)
			
//				dojo.style(icons.domNode, "left", dojo.position(self.domNode).w - dojo.position(icons.domNode).w - 20 + "px")
			
//			dojo.style(icons.domNode, "left", "10px")
			
			dojo.connect(icons, 'maximize', function() {
				self._savePos = dojo.marginBox(self.domNode)
				var w = dojo.marginBox(self.getContainer().domNode)
				
				var marginL = dojo.style(self.domNode, "marginLeft")
				var marginR = dojo.style(self.domNode, "marginRight")
				dojo.style(self.domNode, {
					left: "0px",
					width: w.w - marginL -marginR +"px", 
				})
			})
			dojo.connect(icons, 'restore', function() {
				var w = dojo.marginBox(self.getContainer().domNode)
				dojo.style(self.domNode, {
					left: self._savePos.l + "px",
					width: self._savePos.w +"px", 
				})
			})
		}
		
		this._animateToPosition()
		//self.deferred.callback({success: true})			

		this.inherited(arguments)
	},

	/**
	 * Panels are usually animated into place, this event gets called after the animation has ended
	 */
	onAnimationEnd: function() {
	},

	/*
	 * Creates sliding effect
	 */
	_animateToPosition: function() {
		var self = this
		apstrata.horizon.util.PanelAnimation(this)
	},

	getParent: function() {
		return this._parent
	},
	
	setFixedPanel: function(fixed) {
		this._fixedPanel = fixed	
	},
	
	isFixedPanel: function() {
		return this._fixedPanel
	},
	
	getPanelPosition: function() {
		return this.container.getChildPosition(this)
	},

	getContainer: function() {
		return this.container
	},

	/*
	 * Instantiates selected panel and opens it
	 */
	openPanel: function(panel, args) {
		var self = this
		// Destroy an existing child open panel
		this.closePanel();

		// Use the parentList and container parameters if they were sent in the argument list.
		var parentList = null;
		var container = null;
		if (args) {
			if (args.parentList)
				parentList = args.parentList;
			if (args.container)
				container = args.container;
		}
		if (parentList == null)
			parentList = self;
		if (container == null)
			container = self.getContainer();

		// Mixin to the custom args the pointers to the parent and container		
		var newArgs = dojo.mixin(args, {parentList: parentList, container: container})
		
		// Instantiate new Class 'panel'
		this._openPanel = new panel(newArgs)

		// Add to DojoLayout container
		this.getContainer().addChild(this._openPanel)
		
		return this._openPanel
	},
	
	/*
	 * Closes a panel and ensures cleanup
	 */
	closePanel: function() {
		// Destroy an existing child open panel
		if (this._openPanel) {
			this.getContainer().removeChild(this._openPanel)
			this._openPanel.destroyRecursive()
			this._openPanel = null
		}
	},
	
	/*
	 * 
	 */
	openById: function(id) {},
		
	close: function() {
		this.getParent().closePanel()
	},
	
	/*
	 * Ensures cleanup when a panel is destroyed
	 */
	destroy: function() {
		this.closePanel()
		this.inherited(arguments)
	},
		
	/*
	 * Executes animation effect after a slide contents have been refreshed
	 */
	render: function() {
		var self = this
		this.inherited(arguments)

		// When rendering the domNode id and widgetid are lost, reinstall them
		dojo.attr(this.domNode, 'id', this._savedId)
		dojo.attr(this.domNode, 'widgetid', this._savedId)

		this._setStyle()

		this._animateToPosition()
	},

	/*
	 * Invoked by the container when the window size changes
	 */
	layout: function() {
		this._setStyle()
	},
	
	resize: function() {
		this._setStyle()
	}
})
