function GhHelper(){
  var self = this;
  var user = $('#user-links > li > a').text().trim();
  var isPulls = window.location.pathname.split('/')[3] === 'pulls';
  var $wrapper = $('body > div.wrapper');
  var $header = $('div.wrapper > div.header');
  var $content = $('div.wrapper > div.site');
  $wrapper.addClass('gh-helper');
  $header.after('<div id="ghHelperNav" class="'+$header.attr('class')+'"><div class="container clearfix"><ul class="top-nav"></ul></div></div>');
  var $ghHelper = $('.gh-helper');
  var $ghHelperNav = $('#ghHelperNav');
  var $ghHelperNavUl = $ghHelperNav.find('div > ul.top-nav');
  var $allItems = isPulls ? $('ul.pulls-list-group > li.list-group-item > .list-group-item-name') : $('div.meta[data-path]');
  var typeIsVisible = {};
  var $ghLegend;
  self.addLink = function(fn, label) {
    $('<li><a>'+label+'</a></li>')
    .click(function() {
      self[fn]();
    })
    .appendTo($ghHelperNavUl);
  };
  self.addToggleLink = function(type) {
    var label = (isPulls?'':'.') + type;
    $('<li class="toggleLink selected"><a>'+label+' ('+fileTypes[type].length+')</a></li>')
    .click(function() {
      if (typeIsVisible[type]) {
        fileTypes[type].forEach(function(item) {
          if (isPulls) {
            item.parent().parent().parent().hide();
          } else {
            item.parent().hide();
          }
        });
        typeIsVisible[type] = false;
        $(this).removeClass('selected');
      } else {
        fileTypes[type].forEach(function(item) {
          if (isPulls) {
            item.parent().parent().parent().show();
          } else {
            item.parent().show();
          }
        });
        typeIsVisible[type] = true;
        $(this).addClass('selected');
      }
    })
    .appendTo($ghHelperNavUl);
  };
  self.addLegend = function() {
    $('<li><a class="octicon octicon-info"></a><div id="ghLegend"><div class="arrow"></div><div class="gh-legend-title">GitHub Review Filters</div><div class="gh-legend-label"><div>Visible</div><div>Hidden</div></div><div class="gh-legend-img"></div></div></li>')
    .appendTo($ghHelperNavUl);
    $ghLegend = $ghHelperNavUl.find('#ghLegend');
  };
  self.addDivider = function() {
    $('<div class="divider-vertical"></div>')
    .appendTo($ghHelperNavUl);
  };
  self.showAll = function() {
    $($allItems).parent().show();
    Object.keys(typeIsVisible).forEach(function(type) {
      typeIsVisible[type] = true;
    });
    $ghHelperNavUl.find('li.toggleLink').addClass('selected');
  };
  self.hideAll = function() {
    $($allItems).parent().hide();
    Object.keys(typeIsVisible).forEach(function(type) {
      typeIsVisible[type] = false;
    });
    $ghHelperNavUl.find('li.toggleLink').removeClass('selected');
  };
  self.addLegend();
  self.addLink('showAll', 'Show All');
  self.addLink('hideAll', 'Hide All');
  self.addDivider();
  var fileTypes = {};
  var searchStr = 'div.meta[data-path]';
  if (isPulls) {
    // List of pull requests
    searchStr = '.user-mention';
  }
  $(searchStr).each(function() {
    var fileType = isPulls ? $(this).text().trim() : $(this).attr('data-path').split('.').pop();
    if (!fileTypes.hasOwnProperty(fileType)) {
      fileTypes[fileType] = [];
    }
    typeIsVisible[fileType] = true;
    fileTypes[fileType].push($(this));
  });
  Object.keys(fileTypes).forEach(function(fileType) {
    self.addToggleLink(fileType);
  });
  $('#ghHelperNav > div > ul > li > .octicon').hover(function(){
    $ghLegend.fadeIn();
  }, function() {
    $ghLegend.fadeOut();
  });
}
var ghHelper = new GhHelper();
