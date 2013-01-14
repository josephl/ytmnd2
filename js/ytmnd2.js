/*
 * ytmnd2.js
 * Copyright (c) 2013 Joseph Lee <josephl@cecs.pdx.edu>
 * See LICENSE for licensing rules
 * Project page: http://github.com/josephl/ytmnd2
 * Example page: http://josephl.github.com/ytmnd2
 */

var app = app || {};

// set preferences here
var bg = 'img/finding_forrester_2.jpg'; // background image
var subtitles = 'subtitles.txt';    // URL of file containt text to be zoomed
                                    // change content of default file 'subtitles'
                                    // or change to url of this value

$('body').css('background-image', 'url(' + bg + ')');

define(['jquery'], function($) {

    var YtmndModel = Backbone.Model.extend({

        defaults: function() {
            return {
                text: 'YOURE THE MAN NOW DOG.COM',
                index: app.ytmndCollection.getIndex()
            };
        },

        initialize: function(params) {
            this.set(params);
            this.on('change:text', function(e){
                //console.log(e);
            });
        },

        setText: function(t) {
            this.set({ text: t });
        }

    });

    var YtmndView = Backbone.View.extend({

        el: '#main',

        tagName: 'div',

        className: 'container',

        id: 'ytmnd',

        template: _.template($('#item-template').html()),

        initialize: function() {
            this.model.on('change:text', this.render, this);
        },

        render: function() {
            var tempModel = this.model.toJSON();
            //this.$el.empty();

            for (var i = 1; i < 50; i++) {
                var temp2 = {
                    fontSize: i * 2 + 'pt',
                    left: i * 2 + 'px',
                    top: (this.model.get('index') * 250 + i) + 'px',
                    color: 'rgb('+(i*4)+', '+(i*4)+', '+(i*4)+')'
                };
                this.$el.append(this.template(_.extend(tempModel, temp2)));
            }

            temp2.color = 'rbg(255, 255, 255)';
            this.$el.append(this.template(_.extend(tempModel, temp2)));

            return this;
        }

    });


    // Collection is entire text
    // each model is a line
    var YtmndCollection = Backbone.Collection.extend({

        model: YtmndModel,

        getIndex: function() {
            return this.length;
        },

        comparator: function(line) {
            return line.get('index');
        }


    });

    app.ytmndCollection = new YtmndCollection();

    var parseLines = function(rawtext) {
        var MAXLINE = 10;
        rawtext = rawtext.split(/ |\n|\t/);
        var lines = [];
        var templine = [];
        var tempword;
        while(rawtext.length > 0) {
            templine = [];
            while(templine.join(' ').length < MAXLINE &&
                rawtext.length > 0) {
                if (templine.concat(rawtext[0]).join(' ').length
                    < MAXLINE) {
                    templine.push(rawtext.shift());
                }
                else {
                    break;
                }
            }
            // top word too long for one line, break
            if (templine.length == 0 &&
                typeof rawtext[0] != 'undefined') {
                tempword = rawtext.shift();
                while (tempword.length > MAXLINE) {
                    lines.push(tempword.slice(0, 7) + '-');
                }
                if (tempword.length > 0) {
                    lines.push(tempword);
                }
            }
            else {
                lines.push(templine.join(' '));
            }
        }
        _.each(lines, function(line) {
            app.ytmndCollection.add({ text: line });
        })
    };

    // Main Application
    var AppView = Backbone.View.extend({

        el: '#main',

        initialize: function() {
            this.listenTo(app.ytmndCollection, 'add', this.addLine);
        },

        addLine: function(line) {
            var view = new YtmndView({ model: line });
            view.render();
        }

    });

    app.appView = new AppView();

    // get text w/ajax
    $.ajax({
        url: subtitles,
        success: function(data) {
            parseLines(data);
        }
    });

});
