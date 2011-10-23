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
 * default function used for dojo.store.Memory to filter items and highlight item labels based on a string
 */
apstrata.horizon.util.PanelAnimation = function(panel) {
	if (panel.parentNode) {
		dojo.style(panel.domNode, {
			left: (panel.parentNode.offsetLeft) + "px",
			opacity: .6
		})

		var _animation = {
			node: panel.domNode,
			easing: dojo.fx.easing.cubicOut,
			duration: 200,
			onEnd: function() {
				panel.getContainer().autoScroll()
			}
		}
		
		// The animation coordinates top/left have already been calculated during resize
		_animation.properties = {
			left: panel.parentNode.offsetLeft + panel.parentNode.offsetWidth + panel.getContainer()._marginRight,
			opacity: apstrata.horizon.magicUIdimensions["panel.finalAlpha"]?apstrata.horizon.magicUIdimensions["panel.finalAlpha"]:1
		}
		
		dojo.animateProperty(_animation).play()
	}
}