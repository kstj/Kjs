/*
 * *********************************************************************
 * *********************************************************************
 * 
 * kjs.0.0.1.js
 * Copyright 2011 Kim Woodward
 * 
 * This file is part of Kjs.
 * 
 * Kjs is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Kjs is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with Kjs.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * *********************************************************************
 * *********************************************************************
 * 
 * Kjs is a javascript library used to develop feature-rich
 * web applications.
 * 
 * *********************************************************************
 * *********************************************************************
 * 
 * CHANGE LOG
 * 
 * 2011-09-27 Added Crockford's JSON scripts to our lib.
 * 2011-10-13 Changed version numbering for easier understanding.
 * 2011-10-13 Combined "Table" functions into base script.
 * 2011-10-13 Added MD5 functions to our lib.
 * 2011-10-13 Added "css_opaque" and "lightbox" functions into base script.
 * 
 * *********************************************************************
 * *********************************************************************
 * 
 * WISH LIST
 * 
 * 2011-10-13 Create a logging command to handle "console.log".
 * 
 * *********************************************************************
 * *********************************************************************
 */
var _Kjs = Object;
_Kjs = {
	__version: "version 0.0.1 / Sumatra / April 27, 2011",
	__author: "Kim St. John Woodward [KStJ]",
	__classNameAppend: 1,
	__classNameReplace: 0,
	__classNameRemove: -1,
	extend: function(item) {
		for (var i in this) {
			if (item) {
				if (!(/^__/.test(i))) {
					item[i] = this[i];
				}
			}
		}
	},
	prototype: function(name, func) {
		this[name] = func;
	},
	ajaxget: function(url, params, async, callback) {
		var xhr;
		if (window.XMLHttpRequest) {
			// code for IE7+, Firefox, Chrome, Opera, Safari
			xhr = new XMLHttpRequest();
		} else {
			// code for IE6, IE5
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
				callback(xhr.responseText);
			} else if (xhr.readyState === 4 && xhr.status !== 200) {
				callback("");
			}
		};
		url += (params.length > 0 ? "?" + params : "");
		xhr.open("GET", url, async);
		xhr.send();
		return xhr;
	}
};

var $ = function(arg) {
	var element,
		self = (this.getElementById ? this : document);
	if (self.getElementById(arg)) {
		element = self.getElementById(arg);
	} else {
		if (typeof arg === "string") {
			switch (arg.substring(0, 1)) {
				case "&":
					element = self.createElement(arg.substring(1));
					break;
				case "#":
					break;
				case ".":
					break;
				case "@":
					element = self.createTextNode(arg.substring(1));
					break;
				default:
					break;
			}
		} else  {
			element = arg;
		}
	}
	_Kjs.extend(element);
	return element;
};

_Kjs.prototype("version", function() {return _Kjs.__version;});
_Kjs.prototype("author", function() {return _Kjs.__author;});

_Kjs.prototype("$$", function(arg) {
	var element,
		self = (typeof this === "Document" ||  this.toString() === "[object DOMWindow]" ? document : this);
	if (typeof arg === "string") {
		switch (arg.substring(0, 1)) {
			case "&":
				element = self.getElementsByTagName(arg.substring(1));
				break;
			case "#":
				break;
			case ".":
				element = self.getElementsByClassName(arg.substring(1));
				break;
			case "@":
				break;
			default:
				break;
		}
	} else  {
		element = {};
	}
	_Kjs.extend(element);
	return element;
});

_Kjs.prototype("append", function(object) {
	var self = this;
	switch (typeof object) {
		case "number":
		case "string":
			self.appendChild(document.createTextNode(object));
			break;
		case "object":
			if (object) {
				self.appendChild(object);
			}
			break;
		default:
			if (object) {
				self.appendChild(object);
			}
	}
	return self;
});

_Kjs.prototype("appendto", function(key) {
	var self = this,
		element = $(key);
	if (element !== undefined) {
		element.appendChild(self);
	} else {
console.error("Kjs.appendto: element '" + key + "' is undefined.");
	}
	return self;
});

_Kjs.prototype("attr", function(key, value) {
	var self = this;
	if (arguments.length === 2) {
		self.setAttribute(key, value);
	} else {
		if (self.getAttribute) {
			self = self.getAttribute(key);
		}
	}
	return self;
});

_Kjs.prototype("browser", function(name) {
	var self = navigator.appName;
	if (arguments.length === 1) {
		self = (self.search(name) >= 0 ? true : false);
	}
	return self;
});

_Kjs.prototype("catchreturn", function(callback) {
	var self = this;
	self.listen("keydown", function(evt){
		if (evt.keyCode === 13) {
			callback();
		}
	});
	return self;
});

_Kjs.prototype("clearchildren", function() {
	var self = this;
	if (Boolean(self.hasChildNodes())) {
		while (self.childNodes.length >= 1) {
			self.removeChild(self.firstChild);
		}
	}
	return self;
});

_Kjs.prototype("cname", function(name, action) {
	var self = this;
	action = (action === undefined ? 0 : action);
	if (arguments.length > 0) {
		if (action === -1) {				// remove a class
			$(self).className = ($(self).className !== null ? $(self).className.replace(name, "") : "");
		} else if (action === 1) {			// append a class
			if ($(self).className.indexOf(" " + name) === -1) {
				$(self).className += " " + name;
			}
		} else {							// replace a class
			$(self).className = name;
		}
	} else {
		self = $(self).className;
	}
	return self;
});

_Kjs.prototype("connection", function(conn_loc, args, callback, asynch, ident) {
	var data = {},
		data_type = "json",
		self = this,
		status = 0,
		location = (arguments.length > 0 ? conn_loc : ""),
		async = (asynch === undefined ? true : asynch),
		conargs = (args === undefined ? {} : args),
		status_text = ["waiting", "done", "loading", "error"],
		xhr;
	ident = (ident === undefined ? false : ident);
	if ((typeof location === "string") && (location.indexOf("http") !== -1)) {
		xhr = _Kjs.ajaxget(location, conargs, true, function(result) {data=(data_type === "json" ? JSON.parse(result) : result); status=1;});
		this.getData = function() {return (status === 1 ? data : status_text[this.getStatus]);};
		this.getDataType = function() {return data_type;};
		this.getIdent = function() {return ident;};
		this.getStatus = function() {return status;};
		// this.setConnectionLocation = function(loc) {location = loc};
		this.resetData = function(loc) {location = loc;};
		this.setDataType = function(dtype) {data_type = (dtype === "xml" ? "xml" : "json");};
		this.setIdent = function(id) {ident = id;};
		this.setAsync = function(bool) {async = bool;};
		this.setArgs = function(args) {conargs = args;};
		this.update = function() {xhr = _Kjs.ajaxget(location, conargs, async, function(result) {data=(data_type === "json" ? JSON.parse(result) : result); status=1;});};
	} else {
		data = location;
		status = 1;
		this.update = function() {data = location;};
		this.getData = function() {return (status === 1 ? data : status_text[this.getStatus]);};
		this.getDataType = function() {return data_type;};
		this.getIdent = function() {return ident;};
		this.getStatus = function() {return status;};
		
		this.resetData = function(loc) {location = loc;};
		this.setDataType = function(dtype) {data_type = (dtype === "xml" ? "xml" : "json");};
		this.setIdent = function(id) {ident = id;};
		this.setAsync = function(bool) {async = bool;};
		this.setArgs = function(args) {conargs = args;};
	}
	return self;
});

_Kjs.prototype("css", function(tag, value) {
	var self = this;
	if (arguments.length === 1) {
		if (typeof tag === "string") {	// return value of "tag"
			self = self.style[tag];
		} else {						// import json values 
			$(tag).each(function(value, tag) {
				self.style[tag] = value;
			});
		}
	} else {
		self.style[tag] = value;
	}
	return self;
});

_Kjs.prototype("css_opaque", function(value) {
	var self = this;
	self.style.opacity = value;
	self.style.filter = "alpha(opacity=" + value * 100 + ")";
	return self;
});

_Kjs.prototype("date", function(datesep, timesep) {
	var self = this,
		today = new Date(),
		y = today.getYear() + 1900,
		m = today.getMonth() + 1,
		d = today.getDate(),
		h = today.getHours(),
		i = today.getMinutes(),
		s = today.getSeconds(),
		l = today.getMilliseconds(),
		fullsep, milsep;
	datesep = (datesep === undefined ? "" : datesep);
	fullsep = (datesep === undefined ? "" : " ");
	timesep = (timesep === undefined ? "" : timesep);
	milsep = (timesep === undefined ? "" : ".");
	this.getShortDate = function(format) {
		var retval = y + datesep + m + datesep + d;
		if (format === "mdY") {
			retval = m + datesep + d + datesep + y;
		}
		return retval;
	};
	this.getFullTime = function() {return y + datesep + m + datesep + d + "" + h + timesep + i + timesep + s + milsep + l;};
	this.getShortTime = function() {return h + timesep + i + timesep + s + milsep + l;};
	return self;
});

_Kjs.prototype("each", function(callback) {
	var self = this;
	for (var i in self) {
		if ((typeof self[i] !== "function")) {
			if (i !== "length") {
				callback(self[i], i);
			}
		}
	}
	return self;
});

_Kjs.prototype("html", function(string) {
	var self = this;
	if (arguments.length === 1) {
		self.innerHTML = string;
	} else {
		self = self.innerHTML;
	}
	return self;
});

_Kjs.prototype("lightbox", function(content, waitforready) {
	var self = this,
		rand_id = Math.floor(Math.random() * 1000) + 1000,
		css_documentbody = document.body.style.overflow,
		wrapper = $("&span").attr("id", "wrapper" + rand_id).css({"padding":"0","margin":"0"}).append($(content)),
		lbclose = function() {
			$("container" + rand_id).css_opaque(0).remove();
			$("overlay" + rand_id).css_opaque(0).remove();
			document.body.style.overflow = css_documentbody;
		}, showcontent = function() {
			var objwidth = (content.width ? content.width : $(content).style.width.replace(/px/, "")),
				objheight = (content.height ? content.height : $(content).style.height.replace(/px/, ""));
			$("container" + rand_id).css({
				"top":"50%",
				"left":"50%",
				"width":objwidth,
				"height":objheight,
				"margin-left":-(objwidth / 2),
				"margin-top":-(objheight / 2)
			}).css_opaque(1.0);
			$("overlay" + rand_id).listen("click", function() {
				lbclose();
			});
		}
		
	waitforready = (arguments.length === 2 ? Boolean(waitforready) : false);
	
	$("&div").attr("id", "overlay" + rand_id).css({
			"position":"absolute",
			"top":"0",
			"left":"0",
			"height":"100%",
			"width":"100%",
			"background":"#000",
			"z-index":"50",
			"cursor":"pointer"
		}).css_opaque(0.6).appendto($(document.body));
	$("&div").attr("id", "container" + rand_id).css({
			"position":"absolute",
			"left":"-9999em",
			"z-index":"51"
		}).append(wrapper).appendto($(document.body));
	$(document.body).css("overflow-y", "hidden");
	
	if (waitforready) {
		$(content).listen("load", function() {
			showcontent();
		});
	} else {
		showcontent();
	}
	
	return $("overlay" + rand_id);
});

_Kjs.prototype("listen", function(event, callback, stop) {
	var self = this;
	stop = (typeof stop === "undefined" ? false : true);
	if (Boolean(self.addEventListener)) {
		self.addEventListener(event, callback, stop);
	} else if (Boolean(self.attachEvent)) {
		self.attachEvent("on" + event, callback);
	}
	return self;
});

// _Kjs.prototype("listentokeys", function(kcode, callback) {
	// listen("keydown", function(e) {
		// var code;
		// if (!e) var e = window.event;
		// if (e.keyCode) code = e.keyCode;
		// else if (e.which) code = e.which;
		// if (code === kcode) {
			// callback();
		// }
	// }, false);
// });

_Kjs.prototype("listentokeys", function(kcode, callback) {
	this.listen("keydown", function(e) {
		var code;
		if (e === undefined) {
			e = window.event;
		}
		if (e.keyCode) {
			code = e.keyCode;
		} else if (e.which) {
			code = e.which;
		}
		if (code === kcode) {
			callback();
		}
	}, false);
});

_Kjs.prototype("prepend", function(object) {
	var self = this;
	switch (typeof object) {
		case "number":
		case "string":
			self.insertBefore(document.createTextNode(object), self.childNodes[0]);
			break;
		case "object":
			if (object) {
				self.insertBefore(object, self.childNodes[0]);
			}
			break;
		default:
			if (object) {
				self.insertBefore(object, self.childNodes[0]);
			}
	}
	return self;
});

_Kjs.prototype("remove", function() {
	var self = this;
	self.parentNode.removeChild(self);
	return false;
});

_Kjs.prototype("silence", function(event, callback) {
	var self = this;
	if (Boolean(self.removeEventListener)) {
		self.removeEventListener(event, callback, false);
	} else if (Boolean(self.detachEvent)) {
		self.detachEvent("on" + event, callback);
	}
	return self;
});

_Kjs.prototype("table", function() {
	var self = this,
		tableElem = $("&table"),
		tableBody = $("&tbody"),
		tableData = {},
		tableConn = {},
		tableLayout = {},
		tableDataStorage = "local",	//	'local' or 'server'
		tableSort = "",
		tableLastSort = "",
		tableStart = 0,
		tableLimit = 10,
		tableSortDir = 1,
		tableLastSortDir = 1,
		tableSearchParams = "",
		footerId,
		tableCellClickCallback = {},
		tableCellDblClickCallback = {},
		tableRowClickCallback = {},
		tableRowDblClickCallback = {},
		tableBanner = {};
	
	function addFooter(data) {
		var tfoot = $("&tfoot"),
			id = _Kjs.date().getFullTime(),
			start = $("&span").attr("id", "tableFooterDisplay_start-" + id).append(tableStart + 1),
			end = $("&span").attr("id", "tableFooterDisplay_end-" + id).append(tableLimit + tableStart),
			total = $("&span").attr("id", "tableFooterDisplay_total-" + id).append(data.total),
			sel_page = $("&select").attr("id", "tableFooterJump-" + id),
			btn_srch = $("&button").append("Find"),
			inpt_srch = $("&input").attr("type", "textbox").attr("id", "tableFooterSearch-" +id).catchreturn(function(){btn_srch.click();}),
			btn_fwd = $("&button").append(">"),
			btn_ffwd = $("&button").append(">>"),
			btn_back = $("&button").append("<"),
			btn_rwd = $("&button").append("<<"),
			display = $("&span").append("Displaying ").append(start).append("-").append(end).append(" of ").append(total).append(" total items."),
			search_info = $("&span").attr("id", "tableFooterSearchInfo-" + id).append(" "),
			search = $("&span").css("float", "right").append(search_info).append(inpt_srch).append(btn_srch),
			jump = $("&span").css("float", "left").append("Jump to page ");
		btn_rwd.onclick = function(){tableStart=0; updateFooter(id); refresh();};
		btn_ffwd.onclick = function(){tableStart=Math.floor(data.total / tableLimit) * tableLimit; updateFooter(id); refresh();};
		btn_fwd.onclick = function(){tableStart=(tableStart + tableLimit > data.total ? tableStart : tableStart + tableLimit); updateFooter(id); refresh();};
		btn_back.onclick = function(){tableStart=(tableStart === 0 || tableStart - tableLimit <= 0 ? 0 : tableStart - tableLimit); updateFooter(id); refresh();};
		btn_srch.onclick = function(){searchTable();};
		display.append(btn_fwd).append(btn_ffwd).prepend(btn_back).prepend(btn_rwd);
		for (var i=0; i<Math.ceil(data.total / tableLimit); i+=1) {
			sel_page.append($("&option").attr("value", i).html(i + 1));
		}
		sel_page.onchange = function() {var page = sel_page.selectedIndex; tableStart = tableLimit * page; updateFooter(id); refresh();};
		jump.append(sel_page);
		tfoot.append($("&tr").append($("&th").attr("colspan", tableLayout.length).append(jump).append(display).append(search)));
		tableElem.append(tfoot);
		footerId = id;
	}
	
	function addHeader() {
		var thead = $("&thead"),
			tr = $("&tr");
		if (tableBanner.length > 0) {
			$(tableBanner).each(function(value) {
				var th = $("&th");
				$(value).each(function(v, k) {
					if (k === "value") {
						th.append(v);
					} else {
						th.attr(k, v);
					}
				});
				tr.append(th);
			});
			thead.append(tr);
			tr = $("&tr");
		}
		$(tableLayout).each(function(value) {
			var th = $("&th");
			if (value.width !== undefined) {
				th.attr("width", value.width);
			}
			if (value.sortable !== undefined && value.sortable) {
				th.attr("sort", true);
				th.attr("name", value.name);
				th.onclick = function () {setSort($(th));refresh();};
			}
			th.attr("align", "left").attr("nowrap", "nowrap");
			tr.append(th.append(value.label !== undefined ? value.label : value.name ));
		});
		tableElem.append(thead.append(tr));
	}
	
	function addRow(items) {
		var tr = $("&tr");
		$(tableLayout).each(function(value) {
			if (items && items[value.name] !== "") {
				// add listeners for a click or double-click on rows and cells
				tr.append($("&td").append(items[value.name]).listen("click", tableCellClickCallback)
						.listen("dblclick", tableCellDblClickCallback))
					.listen("click", tableRowClickCallback).listen("dblclick", tableRowDblClickCallback);
			} else {
				tr.append($("&td").html("&nbsp;"));
			}
			tr.cname(tableBody.getElementsByTagName("tr").length % 2 > 0 ? "alt" : "", _Kjs.__classNameAppend);
			if (tableConn.getIdent() && items) {		// add a record identifier to each row if necessary
				tr.attr("ident", items[tableConn.getIdent()]);
			}
		});
		tr.appendto(tableBody);
	}
	
	function addRowBlank() {
		var tr = $("&tr");
		$(tableLayout).each(function(){
			tr.append($("&td").html("&nbsp;"));
		});
		tr.cname(tableBody.$$("&tr").length % 2 > 0 ? "alt" : "", _Kjs.__classNameReplace);
		tr.appendto(tableBody);
	}
	
	function create(conn, layout, banner) {
		var data = conn.getData();
		tableConn = conn;
		if (layout === undefined) {
			layout = [];
			$(tableConn.getData().items[0]).each(function(value, key) {
				layout.push({"name" : key});
			});
		}
		tableLayout = (layout === undefined ? {} : layout);
		tableBanner = (banner === undefined ? {} : banner);
		addHeader();
		addFooter(data);
		tableElem.append(tableBody);
		for (var i=tableStart; i<tableLimit+tableStart; i+=1) {
			addRow($(tableConn.getData().items)[i]);
		}
		tableElem.attr("id", (tableElem.attr("id") === null ? MD5(new _Kjs.date().getFullTime()) : tableElem.attr("id")));
		return tableElem;
	}
	
	function DOM() {
		return tableElem;
	}
	
	function refresh() {
		var args = "";
		if (tableDataStorage === "server") {
			if (tableSort !== "") {
				args += (args.length > 0 ? "&" : "") + "orderby=" + tableSort;
			}
			if (tableStart !== 0) {
				args += (args.length > 0 ? "&" : "") + "start=" + tableStart;
			}
console.log(args);
			update(args);
		} else {
			tableBody.clearchildren();
			if (tableSort !== "") {
				tableConn.getData().items.sort(function(a,b) {
					if ((tableSort !== tableLastSort) || (tableSortDir !== tableLastSortDir)) {
						if (a[tableSort].toLowerCase() < b[tableSort].toLowerCase()) {
							return (tableSortDir ? -1 : 1);
						} else if (a[tableSort].toLowerCase() == b[tableSort].toLowerCase()) {
							return 0;
						} else {
							return (tableSortDir ? 1 : -1);
						}
						tableLastSort = tableSort;
						tableLastSortDir = tableSortDir;
console.log(tableLastSort);
console.log(tableLastSortDir);
console.log(tableSort);
console.log(tableSortDir);
					}
				});
			}
			for (var i=tableStart; i<tableLimit+tableStart; i+=1) {
				if ($(tableConn.getData().items)[i] !== undefined) {
					addRow($(tableConn.getData().items)[i]);
				} else {
					addRowBlank();
				}
			}
			if (tableSearchParams.length > 0) {
				searchTable(tableSearchParams);
			}
		}
		return tableElem;
	}
	
	function searchTable(params) {
		var data = tableConn.getData(),
			terms = $("tableFooterSearch-" + footerId).value,
			results = [];
		if ((tableSearchParams !== terms) || (params !== undefined)) {
			tableBody.$$("&tr").each(function(value){value.cname("row-selected", _Kjs.__classNameRemove);});	// remove selection
			tableSearchParams = (params !== undefined ? params : terms);
			if (terms === "") {
				$("tableFooterSearchInfo-" + footerId).clearchildren().append(" ");
				tableBody.$$("&tr").each(function(value){value.cname("row-found", _Kjs.__classNameRemove);}); // remove previous finds
			} else {
				for (var i=0; i<data.items.length; i+=1) {
					$(data.items[i]).each(function(value){
						if (value.toLowerCase().indexOf(terms.toLowerCase()) !== -1) {
							results.push(i);
						}
					});
				}
				tableBody.$$("&tr").each(function(value){value.cname("row-found", _Kjs.__classNameRemove)});
				if (results.length > 0) {
					var page_results = [];
					$(results).each(function(value){if (value >= tableStart && value < tableStart + tableLimit) {page_results.push(value)}});
					if (page_results.length > 0) {
						$(page_results).each(function(value){tableBody.$$("&tr")[value - tableStart].cname("row-found", _Kjs.__classNameAppend)});
					}
				}
				$("tableFooterSearchInfo-" + footerId).clearchildren().append("Found " + results.length + " ");
			}
		}
	}
	
	function setCallback(cellrow, click, callback) {
		if (cellrow === "cell") {
			if (click === 1) {
				tableCellClickCallback = callback;
			} else {
				tableCellDblClickCallback = callback;
			}
		} else {
			if (click === 1) {
				tableRowClickCallback = callback;
			} else {
				tableRowDblClickCallback = callback;
			}
		}
	}
	
	function setDataStorage(storagelocation) {
		if (storagelocation === "server") {
			tableDataStorage = "server";
		} else {
			tableDataStorage = "local";
		}
	}
	
	function setSort(column) {
		tableSortDir = (tableSort == column.attr("name") ? 1 - tableSortDir : 1);
		tableElem.$$(".sortdesc").each(function (value) {value.cname("sortdesc", _Kjs.__classNameRemove);});
		tableElem.$$(".sortasc").each(function (value) {value.cname("sortasc", _Kjs.__classNameRemove);});
		column.cname(tableSortDir === 1 ? "sortdesc" : "sortasc", _Kjs.__classNameAppend);
		tableSort = column.attr("name");
		updateFooter(footerId);
	}
	
	function update(args) {
		tableConn.setAsync(false);
		if (args !== undefined) {
			tableConn.setArgs(args);
		}
		tableConn.update();
		tableBody.clearchildren();
		if (tableSort !== "" && tableDataStorage !== "server") {
			tableConn.getData().items.sort(function(a,b) {
				if (a[tableSort].toLowerCase() < b[tableSort].toLowerCase()) {
					return (tableSortDir ? -1 : 1);
				} else if (a[tableSort].toLowerCase() == b[tableSort].toLowerCase()) {
					return 0;
				} else {
					return (tableSortDir ? 1 : -1);
				}
			});
			$$("&td").each(function(value){value.listen("dblclick", tableClickCallback);});
		}
		for (var i=tableStart; i<tableLimit+tableStart; i+=1) {
			if ($(tableConn.getData().items)[i] !== undefined) {
				addRow($(tableConn.getData().items)[i]);
			} else {
				addRowBlank();
			}
		}
		tableConn.setAsync(true);
		return tableElem;
	}
	
	function updateFooter(id) {
		var data = tableConn.getData();
		$("tableFooterDisplay_start-" + id).clearchildren().append(tableStart + 1);
		$("tableFooterDisplay_end-" + id).clearchildren().append(tableLimit + tableStart);
		$("tableFooterDisplay_total-" + id).clearchildren().append(data.total);
		$("tableFooterJump-" + id).selectedIndex = Math.floor(tableStart / tableLimit);
	}
		
	this.addRow = addRow;
	this.connection = tableConn;
	this.create = create;
	this.DOM = DOM;
	this.setCallback = setCallback;
	this.setDataStorage = setDataStorage;
	this.setLimit = function(newlimit) {tableLimit = newlimit;};
	this.update = update;
	
	return self;
});

_Kjs.prototype("text", function(string) {
	var self = this;
	if (arguments.length === 1) {
		if (Boolean(self.tnode())) {
			self.tnode().nodeValue = string;
		} else {
			if (self.attr("value")) {
				self.attr("value", string);
			} else {
				self = string;
			}
		}
	} else {
		if (Boolean(self.tnode())) {
			self = self.tnode().nodeValue;
		} else {
			if (self.attr("value")) {
				self = self.attr("value");
			}
		}
	}
	return self;
});

_Kjs.prototype("tnode", function() {
	var self = this, node = false;
	if (self.hasChildNodes()) {
		for (var i = 0; i < self.childNodes.length; i += 1) {
			node = (self.childNodes[i].nodeType === 3 || self.childNodes[i].nodeName === "#text" ? self.childNodes[i] : node);
		}
	}
	return node;
});

var $$ = _Kjs.$$;

var DOMWindow = window;
DOMWindow.listen = _Kjs.listen;
DOMWindow.listentokeys = _Kjs.listentokeys;
DOMWindow.silence = _Kjs.silence;
DOMWindow.silencekeys = _Kjs.silencekeys;

function getElementsByClass(classname) {
	var nodewalk = function(node, container) {
			container = (typeof container === "undefined" ? [] : container);
			$(node).each(function(cnode) {
				if (cnode.nodeType !== 3) {
					if ($(cnode).cname() === classname) {
						container.push(cnode);
					} else if (cnode.hasChildNodes()) {
						container = nodewalk(cnode.childNodes, container);
					}
				}
			});
			return container;
		};
	return nodewalk(document.getElementsByTagName("body"));
}


/*
 * *********************************************************************
 * *********************************************************************
 * 
 * MD5 (Message-Digest Algorithm)
 * http://www.webtoolkit.info/
 * 
 * *********************************************************************
 * *********************************************************************
 */
var MD5=function(string){function RotateLeft(lValue,iShiftBits){return(lValue<<iShiftBits)|(lValue>>>(32-iShiftBits));}
function AddUnsigned(lX,lY){var lX4,lY4,lX8,lY8,lResult;lX8=(lX&0x80000000);lY8=(lY&0x80000000);lX4=(lX&0x40000000);lY4=(lY&0x40000000);lResult=(lX&0x3FFFFFFF)+(lY&0x3FFFFFFF);if(lX4&lY4){return(lResult^0x80000000^lX8^lY8);}
if(lX4|lY4){if(lResult&0x40000000){return(lResult^0xC0000000^lX8^lY8);}else{return(lResult^0x40000000^lX8^lY8);}}else{return(lResult^lX8^lY8);}}
function F(x,y,z){return(x&y)|((~x)&z);}
function G(x,y,z){return(x&z)|(y&(~z));}
function H(x,y,z){return(x^y^z);}
function I(x,y,z){return(y^(x|(~z)));}
function FF(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(F(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b);}
function GG(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(G(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b);}
function HH(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(H(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b);}
function II(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(I(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b);}
function ConvertToWordArray(string){var lWordCount;var lMessageLength=string.length;var lNumberOfWords_temp1=lMessageLength+8;var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1%64))/64;var lNumberOfWords=(lNumberOfWords_temp2+1)*16;var lWordArray=Array(lNumberOfWords-1);var lBytePosition=0;var lByteCount=0;while(lByteCount<lMessageLength){lWordCount=(lByteCount-(lByteCount%4))/4;lBytePosition=(lByteCount%4)*8;lWordArray[lWordCount]=(lWordArray[lWordCount]|(string.charCodeAt(lByteCount)<<lBytePosition));lByteCount++;}
lWordCount=(lByteCount-(lByteCount%4))/4;lBytePosition=(lByteCount%4)*8;lWordArray[lWordCount]=lWordArray[lWordCount]|(0x80<<lBytePosition);lWordArray[lNumberOfWords-2]=lMessageLength<<3;lWordArray[lNumberOfWords-1]=lMessageLength>>>29;return lWordArray;}
function WordToHex(lValue){var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;for(lCount=0;lCount<=3;lCount++){lByte=(lValue>>>(lCount*8))&255;WordToHexValue_temp="0"+lByte.toString(16);WordToHexValue=WordToHexValue+WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);}
return WordToHexValue;}
function Utf8Encode(string){string=string.replace(/\r\n/g,"\n");var utftext="";for(var n=0;n<string.length;n++){var c=string.charCodeAt(n);if(c<128){utftext+=String.fromCharCode(c);}
else if((c>127)&&(c<2048)){utftext+=String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128);}
else{utftext+=String.fromCharCode((c>>12)|224);utftext+=String.fromCharCode(((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128);}}
return utftext;}
var x=Array();var k,AA,BB,CC,DD,a,b,c,d;var S11=7,S12=12,S13=17,S14=22;var S21=5,S22=9,S23=14,S24=20;var S31=4,S32=11,S33=16,S34=23;var S41=6,S42=10,S43=15,S44=21;string=Utf8Encode(string);x=ConvertToWordArray(string);a=0x67452301;b=0xEFCDAB89;c=0x98BADCFE;d=0x10325476;for(k=0;k<x.length;k+=16){AA=a;BB=b;CC=c;DD=d;a=FF(a,b,c,d,x[k+0],S11,0xD76AA478);d=FF(d,a,b,c,x[k+1],S12,0xE8C7B756);c=FF(c,d,a,b,x[k+2],S13,0x242070DB);b=FF(b,c,d,a,x[k+3],S14,0xC1BDCEEE);a=FF(a,b,c,d,x[k+4],S11,0xF57C0FAF);d=FF(d,a,b,c,x[k+5],S12,0x4787C62A);c=FF(c,d,a,b,x[k+6],S13,0xA8304613);b=FF(b,c,d,a,x[k+7],S14,0xFD469501);a=FF(a,b,c,d,x[k+8],S11,0x698098D8);d=FF(d,a,b,c,x[k+9],S12,0x8B44F7AF);c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);a=FF(a,b,c,d,x[k+12],S11,0x6B901122);d=FF(d,a,b,c,x[k+13],S12,0xFD987193);c=FF(c,d,a,b,x[k+14],S13,0xA679438E);b=FF(b,c,d,a,x[k+15],S14,0x49B40821);a=GG(a,b,c,d,x[k+1],S21,0xF61E2562);d=GG(d,a,b,c,x[k+6],S22,0xC040B340);c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);b=GG(b,c,d,a,x[k+0],S24,0xE9B6C7AA);a=GG(a,b,c,d,x[k+5],S21,0xD62F105D);d=GG(d,a,b,c,x[k+10],S22,0x2441453);c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);b=GG(b,c,d,a,x[k+4],S24,0xE7D3FBC8);a=GG(a,b,c,d,x[k+9],S21,0x21E1CDE6);d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);c=GG(c,d,a,b,x[k+3],S23,0xF4D50D87);b=GG(b,c,d,a,x[k+8],S24,0x455A14ED);a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);d=GG(d,a,b,c,x[k+2],S22,0xFCEFA3F8);c=GG(c,d,a,b,x[k+7],S23,0x676F02D9);b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);a=HH(a,b,c,d,x[k+5],S31,0xFFFA3942);d=HH(d,a,b,c,x[k+8],S32,0x8771F681);c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);a=HH(a,b,c,d,x[k+1],S31,0xA4BEEA44);d=HH(d,a,b,c,x[k+4],S32,0x4BDECFA9);c=HH(c,d,a,b,x[k+7],S33,0xF6BB4B60);b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);d=HH(d,a,b,c,x[k+0],S32,0xEAA127FA);c=HH(c,d,a,b,x[k+3],S33,0xD4EF3085);b=HH(b,c,d,a,x[k+6],S34,0x4881D05);a=HH(a,b,c,d,x[k+9],S31,0xD9D4D039);d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);b=HH(b,c,d,a,x[k+2],S34,0xC4AC5665);a=II(a,b,c,d,x[k+0],S41,0xF4292244);d=II(d,a,b,c,x[k+7],S42,0x432AFF97);c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);b=II(b,c,d,a,x[k+5],S44,0xFC93A039);a=II(a,b,c,d,x[k+12],S41,0x655B59C3);d=II(d,a,b,c,x[k+3],S42,0x8F0CCC92);c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);b=II(b,c,d,a,x[k+1],S44,0x85845DD1);a=II(a,b,c,d,x[k+8],S41,0x6FA87E4F);d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);c=II(c,d,a,b,x[k+6],S43,0xA3014314);b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);a=II(a,b,c,d,x[k+4],S41,0xF7537E82);d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);c=II(c,d,a,b,x[k+2],S43,0x2AD7D2BB);b=II(b,c,d,a,x[k+9],S44,0xEB86D391);a=AddUnsigned(a,AA);b=AddUnsigned(b,BB);c=AddUnsigned(c,CC);d=AddUnsigned(d,DD);}
var temp=WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);return temp.toLowerCase();};

/*
 * *********************************************************************
 * *********************************************************************
 * 
 * json2.js by Douglas Crockford
 * https://github.com/douglascrockford/JSON-js.git
 * 
 * *********************************************************************
 * *********************************************************************
 */
var JSON;if(!JSON){JSON={};}(function(){"use strict";function f(n){return n<10?'0'+n:n;}if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+f(this.getUTCMonth()+1)+'-'+f(this.getUTCDate())+'T'+f(this.getUTCHours())+':'+f(this.getUTCMinutes())+':'+f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}if(typeof rep==='function'){value=rep.call(holder,key,value);}switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v;}if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==='string'){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}return str('',{'':value});};}if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}return reviver.call(holder,key,value);}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}throw new SyntaxError('JSON.parse');};}}());