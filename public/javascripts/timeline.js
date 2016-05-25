/**
 * 
 * Created by qianminming on 15/05/2016.
 */

var groups = new vis.DataSet([
    {id: 0, content: 'G&%', value: 1},
    {id: 1, content: 'G&&', value: 3},
    {id: 2, content: 'G&(', value: 2}
]);

var min = new Date(1900, 3, 1); // 1 april
var max = new Date(2100, 3, 30); // 30 april

// create a dataset with items
// note that months are zero-based in the JavaScript Date object, so month 3 is April
var items = new vis.DataSet([
    {id: 1, group: 0, content: 'hire note 1', start: new Date(2016, 3, 19), end: new Date(2016, 3, 20), style: "color: black; background-color: pink;"},
    {id: 3, group: 1, content: 'hire note 2', start: new Date(2016, 3, 23), end: new Date(2016, 3, 24)},
    {id: 5, group: 2, content: 'hire note 3', start: new Date(2016, 3, 24), end: new Date(2016, 3, 27)}
]);



var groups2 = new vis.DataSet([
    {id: 0, content: 'SG$$', value: 1},
    {id: 1, content: 'SG$%', value: 3},
    {id: 2, content: 'SL)%', value: 2}
]);


// create a dataset with items
// note that months are zero-based in the JavaScript Date object, so month 3 is April
var items2 = new vis.DataSet([
    {id: 4, group: 0, content: 'hire note , this is long note 0', start: new Date(2016, 3, 17), end: new Date(2016, 3, 21),editable: false,style: "color: black; background-color: pink; opacity: 0.9;" },
    {id: 0, group: 0, content: 'hire note , this is long note 0', start: new Date(2016, 3, 17), end: new Date(2016, 3, 27), },
    {id: 1, group: 1, content: 'hire note 2', start: new Date(2016, 3, 16), end: new Date(2016, 3, 24)},
    {id: 2, group: 2, content: 'hire note 3', start: new Date(2016, 3, 24), end: new Date(2016, 3, 27)}
]);

var options = {
    // option groupOrder can be a property name or a sort function
    // the sort function must compare two groups and return a value
    //     > 0 when a > b
    //     < 0 when a < b
    //       0 when a == b
    groupOrder: function (a, b) {
        return a.value - b.value;
    },
    groupOrderSwap: function (a, b, groups) {
        var v = a.value;
        a.value = b.value;
        b.value = v;
    },
    groupEditable: true,
    showCurrentTime: true,
    multiselect: true,
    orientation: 'top',
    zoomMin: 1000 * 60 * 60 * 24 * 7,
    //timeAxis: {scale: 'week', step: 1},
    stack: false,
    editable:{add:true, remove:true},

    onAdd: function (item, callback) {
        prettyPrompt('Add item', 'Enter text content for new item:', item.content, function (value) {
            if (value) {
                item.content = value;
                callback(item); // send back adjusted new item
            }
            else {
                callback(null); // cancel item creation
            }
        });
    },

    onMove: function (item, callback) {
        var title = 'Do you really want to move the item to\n' +
            'start: ' + item.start + '\n' +
            'end: ' + item.end + '?';

        prettyConfirm('Move item', title, function (ok) {
            if (ok) {
                callback(item); // send back item as confirmation (can be changed)
            }
            else {
                callback(null); // cancel editing item
            }
        });
    },

    onMoving: function (item, callback) {
        if (item.start < min) item.start = min;
        if (item.start > max) item.start = max;
        if (item.end   > max) item.end   = max;

        callback(item); // send back the (possibly) changed item
    },

    onUpdate: function (item, callback) {
        prettyPrompt('Update item', 'Edit items text:', item.content, function (value) {
            if (value) {
                item.content = value;
                callback(item); // send back adjusted item
            }
            else {
                callback(null); // cancel updating the item
            }
        });
    },

    onRemove: function (item, callback) {
        prettyConfirm('Remove item', 'Do you really want to remove item ' + item.content + '?', function (ok) {
            if (ok) {
                callback(item); // confirm deletion
            }
            else {
                callback(null); // cancel deletion
            }
        });
    }
};

// create visualization
var container = document.getElementById('visualization');



var timeline = new vis.Timeline(container);
timeline.setOptions(options);
timeline.setGroups(groups);
timeline.setItems(items);



var container2 = document.getElementById('visualization2');
var timeline = new vis.Timeline(container2);
timeline.setOptions(options);
timeline.setGroups(groups2);
timeline.setItems(items2);




function prettyConfirm(title, text, callback) {
    swal({
        title: title,
        text: text,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#DD6B55"
    }, callback);
}

function prettyPrompt(title, text, inputValue, callback) {
    swal({
        title: title,
        text: text,
        type: 'input',
        showCancelButton: true,
        inputValue: inputValue
    }, callback);
}
