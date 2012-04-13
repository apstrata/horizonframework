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

dojo.provide('apstrata.horizon.LoginWidget');

dojo.require('dojox.dtl._Templated');
dojo.require('dijit.form.ValidationTextBox')

dojo.require('apstrata.ui.forms.FormGenerator')
dojo.require('apstrata.ui.FlashAlert')

dojo.require('apstrata.sdk.Connection')
dojo.require('apstrata.sdk.Client')

dojo.declare("apstrata.horizon.LoginWidget", 
[dijit._Widget, dojox.dtl._Templated], 
{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl("apstrata.horizon", "templates/LoginWidget.html"),
	
	constructor: function(attrs) {
		this.type = attrs.type
	},

	postCreate: function() {
		var self = this

		this.form = new apstrata.ui.forms.FormGenerator({
			definition: {
				label: "Login",
				cssClass: "newClass",
				fieldset: [
					{name: "key", required: true, displayGroup: "master"},
					{name: "secret", required: true, type: "password", displayGroup: "master"},
					{name: "key", required: true, displayGroup: "key"},
					{name: "user", required: true, displayGroup: "user"},
					{name: "password", required: true, type: "password", displayGroup: "user"},
				],
				actions: ['login']
			},
			displayGroups: self.type?self.type:"master",
			login: function(values) {
				self.form.showAsBusy(true, self.dvLogin)
				var connection = new apstrata.sdk.Connection({credentials: values, loginType: apstrata.sdk.Connection.prototype._LOGIN_TYPE_MASTER})
				connection.login().then(
					function() {
						self.form.showAsBusy(false)
						if (self._success) self._success(values)
					},
					function() {
						self.form.showAsBusy(false)
						self.form.vibrate(self.domNode)
						self.message("BAD CREDENTIALS")
						
						if (self._failure) self._failure()
					}
				)
			}	
		})
		dojo.place(this.form.domNode, this.dvLogin)
		
		if (apstrata.apConfig) this.form.set("value", apstrata.apConfig)
		
		this.inherited(arguments)	
	},
	
	message: function(message) {
		var self = this
		
		var alert = new apstrata.ui.FlashAlert({
			message: message,
			node: self.dvLogin
		})
		dojo.place(alert.domNode, this.domNode)
	},
	
	then: function(success, failure) {
		this._success = success
		this._failure = failure
	},
	
	/**
	 * Intercepts calls to set when name = "dimension" and sets curtain size
	 * @param {Object} name
	 * @param {Object} v
	 */
	set: function(name, v) {
		if ((name=="dimension") && v){
			if (this.domNode) 
				dojo.style(this.domNode, {
					top: v.top + "px",
					left: v.left + "px",
					width: v.width  + "px",
					height: v.height  + "px"
				})
		}
		this.inherited(arguments)
	}
})
