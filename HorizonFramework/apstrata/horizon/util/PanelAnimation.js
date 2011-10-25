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

dojo.provide("apstrata.horizon.util.PanelAnimation")

dojo.require('dojo.fx.easing')

/*
 * default function used by dojo.horizon.Panel to animate while opening
 */
apstrata.horizon.util.PanelAnimation = function(panel) {
	if (panel.parentNode) {

		var startLeft, endLeft
		if (panel.getParent().isFixedPanel()) {
			startLeft = -200
			endLeft = 0
		} else {
console.debug(panel.parentNode.offsetLeft, panel.parentNode.offsetWidth)		
			startLeft = panel.parentNode.offsetLeft 
			endLeft = panel.parentNode.offsetLeft + panel.parentNode.offsetWidth
		}

		dojo.style(panel.domNode, {
			left: (startLeft) + "px",
			opacity: .6
		})

		var _animation = {
			node: panel.domNode,
			easing: dojo.fx.easing.cubicInOut,
			duration: 500,
			onEnd: function() {
				panel.getContainer().autoScroll()
			},
			properties: {
			// The animation coordinates top/left have already been calculated during resize
				left: endLeft,
				opacity: apstrata.horizon.magicUIdimensions["panel.finalAlpha"]?apstrata.horizon.magicUIdimensions["panel.finalAlpha"]:1
			}
		}

		
//		_animation.properties = {
//		}
		
		dojo.animateProperty(_animation).play()
	}
}