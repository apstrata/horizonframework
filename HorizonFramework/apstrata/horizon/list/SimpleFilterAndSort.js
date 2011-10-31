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

dojo.provide('apstrata.horizon.list.SimpleFilterAndSort')

dojo.require("dojox.dtl._Templated")

dojo.require("dijit.Tooltip");

/*
 * This List provides a scrolling vertical list of items. It provides edit and new functionality  
 */
dojo.declare("apstrata.horizon.list.SimpleFilterAndSort", 
[dijit._Widget, dojox.dtl._Templated], 
{
	templatePath: dojo.moduleUrl("apstrata.horizon.list", "templates/SimpleFilterAndSort.html"),
	widgetsInTemplate: true,
	
	_sort: 0,
	
	constructor: function() {
		this.parent = arguments['parent']
	},
	
	layout: function() {
		var self = this
		
/* TODO: why doesn't this work?
		var p = dojo.position(this.fldSearchField)
		dojo.style(this.fldSearchField, {
			width: (self.parent.width - p.x) + "px"
		})
or this
		setTimeout(function(){
			var p = dojo.position(self.fldSearchField)
			var w = dojo.contentBox(self.parent.domNode).w
			
			dojo.style(self.fldSearchField, {
				width: (w - p.x) + "px"
			})
		},1)
 */

		setTimeout(
			function() {
			var p = dojo.marginBox (self.parent.domNode)
				dojo.style(self.fldSearchField, {
					width: (p.w - apstrata.horizon.magicUIdimensions["list.SimpleFilterAndSort.width"] - 3) + "px"
	//				width: (self.parent.width - (apstrata.horizon.magicUIdimensions["list.SimpleFilterAndSort.width"]?apstrata.horizon.magicUIdimensions["list.SimpleFilterAndSort.width"]:38)) + "px"
				})
			}, 
			1)

//				width: (self.parent.width - (apstrata.horizon.magicUIdimensions["list.SimpleFilterAndSort.width"]?apstrata.horizon.magicUIdimensions["list.SimpleFilterAndSort.width"]:38)) + "px"

	},
	
	postCreate: function() {
        new dijit.Tooltip({
            connectId: [self.imgUp],
            label: "sort ascending"
        });
		
        new dijit.Tooltip({
            connectId: [self.imgDown],
            label: "sort descening"
        });
		
		this.inherited(arguments)
		this.layout()
	},
	
	_upOn: function() {
		dojo.removeClass(this.imgUp, 'off')		
		dojo.addClass(this.imgUp, 'on')
	},
	
	_upOff: function() {
		if (this._sort == 1) return
		dojo.removeClass(this.imgUp, 'on')		
		dojo.addClass(this.imgUp, 'off')
	},
	
	_downOn: function() {
		dojo.removeClass(this.imgDown, 'off')		
		dojo.addClass(this.imgDown, 'on')
	},
	
	_downOff: function() {
		if (this._sort == 2) return
		dojo.removeClass(this.imgDown, 'on')		
		dojo.addClass(this.imgDown, 'off')
	},
	
	// manages sort ascending toggle
	_ascending: function() {
		if (this._sort != 1) {
			this._sort = 1
			this._upOn()
			this._downOff()

			this._queryOptions = {
				sort: [{
					attribute: "label",
					ascending: true
				}]
			}
		} else {
			this._sort = 0
			this._upOff()
			this._queryOptions = {}
		}
		
		this.onSortChange(this._sort)
	},
	
	// manages sort descending toggle
	_descending: function() {
		if (this._sort != 2) {
			this._sort = 2
			this._downOn()
			this._upOff()

			this._queryOptions = {
				sort: [{
					attribute: "label",
					descending: true
				}]
			}
		} else {
			this._sort = 0
			this._downOff()
			this._queryOptions = {}
		}

		this.onSortChange(this._sort)
	},

	filterChange: function(e) {
		var self = this
		if (e.keyCode == 8) {
			this._filter = (e.currentTarget.value).substr(0, e.currentTarget.value.length-1)
		} else {
			this._filter = e.currentTarget.value + e.keyChar
		}
		
		this.onFilterChange(this._filter)
	},
	
	onSortChange: function(sort) {},
	onFilterChange: function(filter) {}
})