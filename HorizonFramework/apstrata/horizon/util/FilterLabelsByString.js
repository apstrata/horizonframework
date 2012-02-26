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

dojo.provide("apstrata.horizon.util.FilterLabelsByString")

/*
 * default function used for dojo.store.Memory to filter items and highlight item labels based on a string
 */
apstrata.horizon.util.FilterLabelsByString = function(item, filterString) {
	var self = this
	var selected = false
	var pos

	// if we had modified label for highlighting chars, restore the original one
	if (item._originalLabel) item.label = item._originalLabel

	if (filterString == '') {
		// if there's no filter string, all items should be selected
		selected = true
	} else {
		// find the filter string pos in the label
		pos = (item.label.toLowerCase()).indexOf(filterString)
		selected = pos>=0

		if (selected) {
			// save the original label before adding highlight HTML
			item._originalLabel = item.label
			console.debug()
			// add highlight HTML
			item.label = item.label.substring(0, pos) + 
				"<span class='highlightFilter'>" + item.label.substring(pos, pos + filterString.length) + "</span>" + 
				item.label.substring(pos + filterString.length) 
		}
	}
	
	return selected
}
	