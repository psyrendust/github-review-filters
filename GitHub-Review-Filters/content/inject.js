/*global jQuery:true*/
/*global History:true*/
(function ($) {
  function GhHelper() {
    var self = this;
    self.$wrapper = $('body > div.wrapper');
    self.$header = $('div.wrapper > div.header');
    self.$content = $('div.wrapper > div.site');
    self.$wrapper.addClass('gh-helper');

    self.addLink = function(fn, label) {
      $('<li><a>' + label + '</a></li>')
      .click(function () {
        self[fn]();
      })
      .appendTo(self.$ghHelperNavUl);
    };

    self.addToggleLink = function (type) {
      var label = (self.isPulls ? '' : '.') + type;
      $('<li class="toggleLink selected"><a>' + label + ' (' + self.fileTypes[type].length + ')</a></li>')
      .click(function () {
        if (self.typeIsVisible[type]) {
          self.fileTypes[type].forEach(function (item) {
            if (self.isPulls) {
              item.parent().parent().parent().parent().hide();
            } else {
              item.parent().hide();
            }
          });
          self.typeIsVisible[type] = false;
          $(this).removeClass('selected');
        } else {
          self.fileTypes[type].forEach(function (item) {
            if (self.isPulls) {
              item.parent().parent().parent().parent().show();
            } else {
              item.parent().show();
            }
          });
          self.typeIsVisible[type] = true;
          $(this).addClass('selected');
        }
      })
      .appendTo(self.$ghHelperNavUl);
    };

    self.addLegend = function() {
      $('<li><a class="octicon octicon-info"></a><div id="ghLegend"><div class="arrow"></div><div class="gh-legend-title">GitHub Review Filters</div><div class="gh-legend-label"><div>Visible</div><div>Hidden</div></div><div class="gh-legend-img"></div></div></li>')
      .appendTo(self.$ghHelperNavUl);
      self.$ghLegend = self.$ghHelperNavUl.find('#ghLegend');
      self.$ghHelperNav.find('.octicon').hover(function(){
        self.$ghLegend.fadeIn();
      }, function () {
        self.$ghLegend.fadeOut();
      });
    };

    self.addDivider = function () {
      $('<div class="divider-vertical"></div>')
      .appendTo(self.$ghHelperNavUl);
    };

    self.showAll = function () {
      $(self.$allItems).parent().show();
      Object.keys(self.typeIsVisible).forEach(function (type) {
        self.typeIsVisible[type] = true;
      });
      self.$ghHelperNavUl.find('li.toggleLink').addClass('selected');
    };

    self.hideAll = function () {
      $(self.$allItems).parent().hide();
      Object.keys(self.typeIsVisible).forEach(function (type) {
        self.typeIsVisible[type] = false;
      });
      self.$ghHelperNavUl.find('li.toggleLink').removeClass('selected');
    };

    self.init = function () {
      var pathname = window.location.pathname.split('/');
      self.isEnterprise = $('body').hasClass('enterprise');
      self.isPulls = pathname[3] === 'pulls';
      self.fileTypes = {};
      self.searchStr = 'div.meta[data-path]';
      self.typeIsVisible = {};
      self.$header.after('<div id="ghHelperNav" class="' + self.$header.attr('class') + '"><div class="container clearfix"><ul class="top-nav"></ul></div></div>');
      self.$ghHelper = $('.gh-helper');
      self.$ghHelperNav = $('#ghHelperNav');
      self.$ghHelperNavUl = self.$ghHelperNav.find('div > ul.top-nav');
      self.$ghLegend = null;
      self.addLegend();
      self.addLink('showAll', 'Show All');
      self.addLink('hideAll', 'Hide All');
      self.addDivider();
      self.update();
      $('body').on('click', 'a.js-pull-request-tab', function updateClick() {
        self.update();
      });
      $('body').on('click', 'a.issue-title-link', function updateClick() {
        self.update();
      });
      $('body').on('DOMNodeInserted', '.wrapper > .site', function (e) {
        if (!!e.target.className && (e.target.className.indexOf('view-pull-request') >= 0 || e.target.className.indexOf('issues-listing') >= 0)) {
          self.update();
        }
      });
    };

    self.update = function () {
      var pathname = window.location.pathname.split('/');
      self.isEnterprise = $('body').hasClass('enterprise');
      self.isPulls = pathname[3] === 'pulls' || pathname[3] === 'issues';
      self.fileTypes = {};
      self.searchStr = 'div[data-path]';
      self.allItemsSearchStr = 'div[data-path]';
      self.typeIsVisible = {};
      self.$ghHelperNavUl.find('li.toggleLink').remove();
      if (self.isPulls) {
        // List of pull requests grouped by user's github handle
        self.searchStr = '.opened-by > a';
        self.allItemsSearchStr = 'ul.table-list-issues > li.table-list-item > .issue-title';
      }
      self.$allItems = $(self.allItemsSearchStr);
      $(self.searchStr).each(function () {
        var fileType = self.isPulls ? $(this).text().trim() : $(this).attr('data-path').split('.').pop();
        if (!self.fileTypes.hasOwnProperty(fileType)) {
          self.fileTypes[fileType] = [];
        }
        self.typeIsVisible[fileType] = true;
        self.fileTypes[fileType].push($(this));
      });
      Object.keys(self.fileTypes).forEach(function (fileType) {
        self.addToggleLink(fileType);
      });
    };

    self.init();

  }
  $(document).ready(function () {
    var ghHelper = new GhHelper();
    $(window).bind('popstate', function () {
      ghHelper.update();
    });
    ghHelper.update();
  });
}(jQuery));
