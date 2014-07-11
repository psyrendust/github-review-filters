function GhHelper(){
  $('div.wrapper > div.header').css({
    'position': 'fixed',
    'width': '100%',
    'z-index': '100'
  }).append('<div class="container clearfix" id="gh-helper"><ul class="top-nav"></ul></div>');
  $('div.wrapper > div.site').css({
    'padding-top': '80px'
  });
  var self = this;
  var $ghHelper = $('#gh-helper');
  var $ghHelperNav = $('#gh-helper > ul.top-nav');
  var $allItems = $('div.meta[data-path]');
  var typeIsVisible = {};
  self.addLink = function(fn, label) {
    $('<li><a>'+label+'</a></li>')
    .click(function() {
      self[fn]();
    })
    .appendTo($ghHelperNav);
  };
  self.addToggleLink = function(type) {
    $('<li class="toggleLink selected"><a>.'+type+' ('+fileTypes[type].length+')</a></li>')
    .click(function() {
      if (typeIsVisible[type]) {
        fileTypes[type].forEach(function(item) {
          item.parent().hide();
        });
        typeIsVisible[type] = false;
        $(this).removeClass('selected');
      } else {
        fileTypes[type].forEach(function(item) {
          item.parent().show();
        });
        typeIsVisible[type] = true;
        $(this).addClass('selected');
      }
    })
    .appendTo($ghHelperNav);
  };
  self.addDivider = function() {
    $('<div class="divider-vertical"></div>')
    .appendTo($ghHelperNav);
  };
  self.showAll = function() {
    $($allItems).parent().show();
    Object.keys(typeIsVisible).forEach(function(type) {
      typeIsVisible[type] = true;
    });
    $('#gh-helper > ul > li.toggleLink').addClass('selected');
  };
  self.hideAll = function() {
    $($allItems).parent().hide();
    Object.keys(typeIsVisible).forEach(function(type) {
      typeIsVisible[type] = false;
    });
    $('#gh-helper > ul > li.toggleLink').removeClass('selected');
  };
  self.addLink('showAll', 'Show All');
  self.addLink('hideAll', 'Hide All');
  self.addDivider();
  var fileTypes = {};
  $('div.meta[data-path]').each(function() {
    var fileType = $(this).attr('data-path').split('.').pop();
    if (!fileTypes.hasOwnProperty(fileType)) {
      fileTypes[fileType] = [];
    }
    typeIsVisible[fileType] = true;
    fileTypes[fileType].push($(this));
  });
  Object.keys(fileTypes).forEach(function(fileType) {
    self.addToggleLink(fileType);
  });
}
var ghHelper = new GhHelper();
