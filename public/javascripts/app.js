'use strict';


var ngVisApp = angular.module('ngVisApp', ['ngVis']);

ngVisApp.controller('appController', function ($scope, $location, $timeout, $http, VisDataSet) {

    $scope.logs = {};

    $scope.defaults = {
        orientation: ['top', 'bottom'],
        autoResize: [true, false],
        showCurrentTime: [true, false],
        showCustomTime: [true, false],
        showMajorLabels: [true, false],
        showMinorLabels: [true, false],
        align: ['left', 'center', 'right'],
        stack: [true, false],

        moveable: [true, false],
        zoomable: [true, false],
        selectable: [true, false],
        editable: [true, false]
    };
    
    var min = new Date(1900, 3, 1); // 1 april
    var max = new Date(2100, 3, 30); // 30 april

    var options = {
        groupEditable: true,
        showCurrentTime: true,
        multiselect: true,
        orientation: 'top',
        zoomMin: 1000 * 60 * 60 * 24 * 7,
        stack: false,
        editable: {
            add: true, remove: true
        },
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

        // onUpdate: function (item, callback) {
        //     prettyPrompt('Update item', 'Edit items text:', item.content, function (value) {
        //         if (value) {
        //             item.content = value;
        //             callback(item); // send back adjusted item
        //         }
        //         else {
        //             callback(null); // cancel updating the item
        //         }
        //     });
        // },
        onUpdate: function (item, callback) {
            complex(item.content, item,  function(isConfirm){
                if (isConfirm){
                    item.content = this.swalForm.note || item.content;
                    item.start = this.swalForm.from2 || item.start;
                    item.end = this.swalForm.theend || item.end;
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

    function complex (inputeValue, item, callback) {
        swal.withForm({
            title: 'More complex Swal-Forms example',
            text: 'This has different types of inputs',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Get form data!',
            closeOnConfirm: true,
            formFields: [
                { id: 'note', value: inputeValue, placeholder: inputeValue },
              
                { name: 'from1',  type: 'date' , value: moment(item.start).format("YYYY-MM-DD")},
                { name: 'from2',  type: 'date' , value: moment(item.start).format("YYYY-MM-DD")},
                { name: 'theend',  type: 'date', value: moment(item.end).format("YYYY-MM-DD") }
            ]
        },callback);
    }


    $http.get('http://localhost:3000/events')
      .then(function(response) {
          console.log(response);

          var len = response.data.length;

          var arr = [];
          for (var i = 0; i < len; i++) {
              console.log(response.data[i].deletedFlag);
              if(!response.data[i].deletedFlag) {
                  arr.push({
                      id: i,
                      group: response.data[i].productID,
                      content: response.data[i]._id,
                      start: new Date(response.data[i].from1),
                      end: new Date(response.data[i].end)
                  });
              }
          }
          
          $scope.items = VisDataSet(arr);
      });
    
    $http.get('http://localhost:3000/products')
      .then(function (response) {
          console.log(response);

          var len = response.data.length;

          var arr = [];
          for (var i = 0; i < len; i++) {
              arr.push({
                  id: i,
                  content: response.data[i].productName,
                  title: response.data[i].productionCondition,
              });
          }

          $scope.groups = VisDataSet(arr);

          $scope.data = {groups: $scope.groups, items: $scope.items};
      });
    

    // $scope.data = {groups: groups, items: items};
    
    var orderedSorting = function (a, b) {
        // option groupOrder can be a property name or a sort function
        // the sort function must compare two groups and return a value
        //     > 0 when a > b
        //     < 0 when a < b
        //       0 when a == b
        return a.value - b.value;
    };

    $scope.options = angular.extend(options, {
        editable: true
    })

    $scope.onSelect = function (items) {
        // debugger;
        // alert('select');
    };

    $scope.onClick = function (props) {
        //debugger;
        // alert('Click');
    };

    $scope.onDoubleClick = function (props) {
        // debugger;
        // alert('DoubleClick');
    };

    $scope.rightClick = function (props) {
        // alert('Right click!');
        props.event.preventDefault();
    };
    
    //$scope.onLoaded = function (props) {
         //alert('On Load!');
    //};


    $scope.onLoaded = function(user) {

    };


    $scope.onRangeChanged = function (props) {
        // alert('Right click!');
    };

    $scope.onRangeChange = function (props) {
        // alert('Right click!');
    };

    $scope.events = {
        rangechange: $scope.onRangeChange,
        rangechanged: $scope.onRangeChanged,
        onload: $scope.onLoaded,
        select: $scope.onSelect,
        click: $scope.onClick,
        doubleClick: $scope.onDoubleClick,
        contextmenu: $scope.rightClick
    };


});
