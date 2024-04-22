/*
    ioBroker.vis animationviewer Widget-Set

    version: "0.0.1"

    Copyright 10.2015-2016 Kamran<gokturk413@gmail.com>

*/
"use strict";

// add translations for edit mode
if (vis.editMode) {
    $.extend(true, systemDictionary, {
        "myColor": { "en": "myColor", "de": "mainColor", "ru": "Мой цвет" },
        "myColor_tooltip": {
            "en": "Description of\x0AmyColor",
            "de": "Beschreibung von\x0AmyColor",
            "ru": "Описание\x0AmyColor"
        },
        "htmlText": { "en": "htmlText", "de": "htmlText", "ru": "htmlText" },
        "group_extraMyset": { "en": "extraMyset", "de": "extraMyset", "ru": "extraMyset" },
        "extraAttr": { "en": "extraAttr", "de": "extraAttr", "ru": "extraAttr" }
    });
}

// add translations for non-edit mode
$.extend(true, systemDictionary, {
    "Instance": { "en": "Instance", "de": "Instanz", "ru": "Инстанция" }
});

// this code can be placed directly in animationviewer.html
vis.binds.animationviewer = {
    version: "0.0.1",
    showVersion: function () {
        if (vis.binds.animationviewer.version) {
            console.log('Version animationviewer: ' + vis.binds.animationviewer.version);
            vis.binds.animationviewer.version = null;
        }
    },
    left_right: {
        createWidget: function (widgetID, view, data, style) {
            var $div = $('#' + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds.animationviewer.left_right.createWidget(widgetID, view, data, style);
                }, 100);
            }

            var text = '';
            /*text += 'OID: ' + data.oid + '</div><br>';
            text += 'OID value: <span class="myset-value">' + vis.states[data.oid + '.val'] + '</span><br>';
            text += 'Color: <span style="color: ' + data.myColor + '">' + data.myColor + '</span><br>';
            text += 'extraAttr: ' + data.extraAttr + '<br>';
            text += 'Browser instance: ' + vis.instance + '<br>';*/
            text += '<svg height=100% width=100% xmlns="http://www.w3.org/2000/svg"><line class="path90left" visibility="visible" x1="0" y1="0" x2="100%" y2="0" style="stroke:' + data.myColor + ';stroke-width:' + data.StrokeWidth + ';  fill: none; stroke-dasharray: 10px, 10px; stroke-dashoffset: 1; stroke-linecap: butt; stroke-linejoin: miter;" /></svg>';

            $('#' + widgetID).html(text);


            //vis.conn.gettingStates =0;
            //var key = [data.oid0,data.oid1]
            vis.conn._socket.emit('getState', data.oid0, function (error, state) {
                var st1 = state;
                vis.conn._socket.emit('getState', data.oid1, function (error, state) {
                    var st2 = state;

                    var left = data.left;
                    if(st1 === undefined)
                    {
                    var x1 = selectCase(st1.val, data.Condition0, data.ConditionValue0);
                    }
                    var right = data.right;
                    if(st2 === undefined)
                    {
                    var x2 = selectCase(st2.val, data.Condition1, data.ConditionValue1);
                    }
                    if (x1 == true || x2 == true) {
                        if (x1 == true) {
                            checkleft(left);
                        }
                        if (x2 == true) {
                            checkright(right);
                        }
                    }
                    else {
                        nothing();
                    }

                });
            });
            // subscribe on updates of value
            if (data.oid) {
                debugger;
                vis.states.bind(data.oid + '.val', function (e, newVal, oldVal) {
                    $div.find('.animationviewer-value').html(newVal);
                });
            }

            if (data.oid0) {
                debugger;
                vis.states.bind(data.oid0 + '.val', function (e, newVal, oldVal) {
                    var condition = data.Condition0;
                    var conditionvalue = data.ConditionValue0;
                    var left = data.left;
                    var x = selectCase(newVal, condition, conditionvalue);
                    if (x == true) {
                        checkleft(left);
                    }
                    else {
                        nothing();
                    }
                    checkIsSameOid(data, newVal);
                });
            }

            if (data.oid1) {
                debugger;
                vis.states.bind(data.oid1 + '.val', function (e, newVal, oldVal) {
                    var condition = data.Condition1;
                    var conditionvalue = data.ConditionValue1;
                    var right = data.right;
                    var x = selectCase(newVal, condition, conditionvalue);
                    if (x == true) {
                        checkright(right);
                    }
                    else {
                        nothing();
                    }
                    checkIsSameOid(data, newVal);
                });
            }

            function checkIsSameOid(data, newVal) {
                if (data.oid0 == data.oid1) {
                    var condition0 = data.Condition0;
                    var condition0value = data.ConditionValue0;
                    var left = data.left;
                    var condition1 = data.Condition1;
                    var condition1value = data.ConditionValue1;
                    var right = data.right;
                    var x = selectCase(newVal, condition0, condition0value);
                    var y = selectCase(newVal, condition1, condition1value);
                    if (x == true || y == true) {
                        if (x == true) {
                            checkleft(left);
                        }
                        if (y == true) {
                            checkright(right);
                        }
                    }
                    else {
                        nothing();
                    }
                }
            }

            function nothing() {
                //if(data==true)
                //{
                var svg = $('#' + widgetID).find("svg");
                var line = $(svg).find("line");
                $(line).attr("class", '');
                $(line).attr("visibility", 'hidden');
                //$(line).css('display', 'none');
                // }
            }

            function checkleft(data) {
                if (data == true) {
                    var svg = $('#' + widgetID).find("svg");
                    var line = $(svg).find("line");
                    $(line).attr("visibility", 'visible');
                    $(line).attr("class", 'path90left');
                }
            }

            function checkright(data) {
                if (data == true) {
                    var svg = $('#' + widgetID).find("svg");
                    var line = $(svg).find("line");
                    $(line).attr("visibility", 'visible');
                    $(line).attr("class", 'path90right');
                }
            }

            function selectCase(value, condition, conditionvalue) {
                var flag1;
                switch (condition) {
                    case 'exist':
                        flag1 = value.includes(conditionvalue);
                        break;

                    case 'equal':
                        if (parseInt(value) == parseInt(conditionvalue)) {
                            return flag1 = true;
                        }
                        break;

                    case 'is not equal':
                        if (parseInt(value) != parseInt(conditionvalue)) {
                            return flag1 = true;
                        }
                        break;

                    case 'less-than':
                        if (parseInt(value) < parseInt(conditionvalue)) {
                            return flag1 = true;
                        }
                        break;

                    case 'less-than or equal':
                        if (parseInt(value) <= parseInt(conditionvalue)) {
                            return flag1 = true;
                        }
                        break;

                    case 'greater-than':
                        if (parseInt(value) > parseInt(conditionvalue)) {
                            return flag1 = true;
                        }
                        break;

                    case 'greater-than or equal':
                        if (parseInt(value) >= parseInt(conditionvalue)) {
                            return flag1 = true;
                        }
                        break;
                }
                return flag1;
            }

        }
    },
up_down:{
        createWidget: function (widgetID, view, data, style) {
            var $div = $('#' + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds.animationviewer.up_down.createWidget(widgetID, view, data, style);
                }, 100);
            }

            var text = '';
            /*text += 'OID: ' + data.oid + '</div><br>';
            text += 'OID value: <span class="myset-value">' + vis.states[data.oid + '.val'] + '</span><br>';
            text += 'Color: <span style="color: ' + data.myColor + '">' + data.myColor + '</span><br>';
            text += 'extraAttr: ' + data.extraAttr + '<br>';
            text += 'Browser instance: ' + vis.instance + '<br>';*/
            text += '<svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg"><line id="e1_line" class="pathdown" visibility="visible" x1="0" y1="0" x2="0" y2="100%" stroke=' + data.myColor + ' style="stroke-width: ' + data.StrokeWidth + '; fill: none; stroke-dasharray: 10px, 10px; stroke-dashoffset: 1; stroke-linecap: butt; stroke-linejoin: miter;"/></svg>';

            $('#' + widgetID).html(text);


            //vis.conn.gettingStates =0;
            //var key = [data.oid0,data.oid1]
            vis.conn._socket.emit('getState', data.oid0, function (error, state) {
                var st1 = state;
                vis.conn._socket.emit('getState', data.oid1, function (error, state) {
                    var st2 = state;

                    var up = data.up;
                    if(st1 === undefined)
                    {
                    var x1 = selectCase(st1.val, data.Condition0, data.ConditionValue0);
                    }
                    var down = data.down;
                    if(st2 === undefined)
                    {
                    var x2 = selectCase(st2.val, data.Condition1, data.ConditionValue1);
                    }
                    if (x1 == true || x2 == true) {
                        if (x1 == true) {
                            checkup(up);
                        }
                        if (x2 == true) {
                            checkdown(down);
                        }
                    }
                    else {
                        nothing();
                    }

                });
            });
            // subscribe on updates of value
            if (data.oid) {
                debugger;
                vis.states.bind(data.oid + '.val', function (e, newVal, oldVal) {
                    $div.find('.animationviewer-value').html(newVal);
                });
            }

            if (data.oid0) {
                debugger;
                vis.states.bind(data.oid0 + '.val', function (e, newVal, oldVal) {
                    var condition = data.Condition0;
                    var conditionvalue = data.ConditionValue0;
                    var up = data.up;
                    var x = selectCase(newVal, condition, conditionvalue);
                    if (x == true) {
                        checkup(up);
                    }
                    else {
                        nothing();
                    }
                    checkIsSameOid(data, newVal);
                });
            }

            if (data.oid1) {
                debugger;
                vis.states.bind(data.oid1 + '.val', function (e, newVal, oldVal) {
                    var condition = data.Condition1;
                    var conditionvalue = data.ConditionValue1;
                    var down = data.down;
                    var x = selectCase(newVal, condition, conditionvalue);
                    if (x == true) {
                        checkdown(down);
                    }
                    else {
                        nothing();
                    }
                    checkIsSameOid(data, newVal);
                });
            }

            function checkIsSameOid(data, newVal) {
                if (data.oid0 == data.oid1) {
                    var condition0 = data.Condition0;
                    var condition0value = data.ConditionValue0;
                    var up = data.up;
                    var condition1 = data.Condition1;
                    var condition1value = data.ConditionValue1;
                    var down = data.down;
                    var x = selectCase(newVal, condition0, condition0value);
                    var y = selectCase(newVal, condition1, condition1value);
                    if (x == true || y == true) {
                        if (x == true) {
                            checkup(up);
                        }
                        if (y == true) {
                            checkdown(down);
                        }
                    }
                    else {
                        nothing();
                    }
                }
            }

            function nothing() {
                //if(data==true)
                //{
                var svg = $('#' + widgetID).find("svg");
                var line = $(svg).find("line");
                $(line).attr("class", '');
                $(line).attr("visibility", 'hidden');
                //$(line).css('display', 'none');
                // }
            }

            function checkup(data) {
                if (data == true) {
                    var svg = $('#' + widgetID).find("svg");
                    var line = $(svg).find("line");
                    $(line).attr("visibility", 'visible');
                    $(line).attr("class", 'pathup');
                }
            }

            function checkdown(data) {
                if (data == true) {
                    var svg = $('#' + widgetID).find("svg");
                    var line = $(svg).find("line");
                    $(line).attr("visibility", 'visible');
                    $(line).attr("class", 'pathdown');
                }
            }

            function selectCase(value, condition, conditionvalue) {
                var flag1;
                switch (condition) {
                    case 'exist':
                        flag1 = value.includes(conditionvalue);
                        break;

                    case 'equal':
                        if (parseInt(value) == parseInt(conditionvalue)) {
                            return flag1 = true;
                        }
                        break;

                    case 'is not equal':
                        if (parseInt(value) != parseInt(conditionvalue)) {
                            return flag1 = true;
                        }
                        break;

                    case 'less-than':
                        if (parseInt(value) < parseInt(conditionvalue)) {
                            return flag1 = true;
                        }
                        break;

                    case 'less-than or equal':
                        if (parseInt(value) <= parseInt(conditionvalue)) {
                            return flag1 = true;
                        }
                        break;

                    case 'greater-than':
                        if (parseInt(value) > parseInt(conditionvalue)) {
                            return flag1 = true;
                        }
                        break;

                    case 'greater-than or equal':
                        if (parseInt(value) >= parseInt(conditionvalue)) {
                            return flag1 = true;
                        }
                        break;
                }
                return flag1;
            }

        }
    
}
};

vis.binds.animationviewer.showVersion();
