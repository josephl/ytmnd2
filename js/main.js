// require

requirejs.config({
    shim: {
        'libs/underscore': {
            exports: '_'
        },
        'libs/backbone': {
            deps: ['libs/underscore', 'libs/jquery'],
            exports: 'Backbone'
        },
        'libs/d3.v3': {
            deps: ['libs/jquery'],
            exports: 'd3'
        },
        'ytmnd2': {
            deps: ['libs/jquery', 'libs/backbone', 'libs/d3.v3']
        }
    }
});

define(
    ['libs/underscore', 'libs/backbone', 'libs/d3.v3', 'ytmnd2'],
    function(jQueryLocal, underscoreLocal,
        backboneLocal, d3Local) {
    }
);
