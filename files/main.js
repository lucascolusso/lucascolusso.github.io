/*
  Berkeley Center for New Media
  Copyright (C) 2017 by Systemantics, Bureau for Informatics

  Systemantics GmbH
  Bleichstr. 11
  41747 Viersen
  GERMANY

  Web:    www.systemantics.net
  Email:  hello@systemantics.net

  Permission granted to use the files associated with this
  website only on your webserver.

  Changes to these files are PROHIBITED due to license restrictions.
*/



// Detect touch device
var isTouch = 'ontouchstart' in document,
	noTouch = !isTouch;

function isMobile() {
	if (!$('#bp').length) {
		$("<div id=bp></div>").appendTo("body");
	}
	return $('#bp').width() == 2;
}

function positionHatching(){
	$(".js-hatching").each(function(){
		var item = $(this),
			wrapper = item.closest(".js-hatching-wrapper"),
			hatchingLeft = wrapper.offset().left,
			hatchingRight = $(window).width() - (hatchingLeft + wrapper.width());

		if(item.hasClass("bottom-hatching")){
			wrapperScrollheight = wrapper.find(".sidebar-infos-scrolling")[0].scrollHeight;

			if(wrapperScrollheight <= wrapper.height()){
				wrapper.addClass("disable-bottom-hatching");
			}else{
				wrapper.removeClass("disable-bottom-hatching");
			}
		}

		if(item.hasClass("sidebar-hatching")){
			hatchingTop = wrapper.offset().top - $(window).scrollTop();
		}else{
			hatchingTop = wrapper.offset().top;
		}

		item.css({
			'left': hatchingLeft,
			'right': hatchingRight,
			'top':  hatchingTop,
			'width': wrapper.width(),
		});
	});
}

function mobileMainTop(){
	if(isMobile()){
		$("main").css("margin-top", $("header").height());
	}else{
		$("main").css("margin-top", "");
	}
}
mobileMainTop();

function sidebarInfoBoxHeight(){
	if(!$(".sidebar-infos").length){
		return;
	}

	var item = $(".sidebar-infos"),
		itemHeight = $(window).height() - (item.offset().top - $(window).scrollTop() )- 66;

	item.css("height", itemHeight);
}

function removeLayer(){
	$(".layer").addClass("fade-out");

	setTimeout(function(){
		$("html").removeClass("layer-active");
		$(".layer").remove();

	}, 2500);
}

function sidebarPosition(){
	var wrapper = $(".wrap-sidebar"),
		pinItem = $(".sidebar-pin");

	pinItem.css({
		'left': wrapper.offset().left,
		'width': wrapper.width(),
	});
}

 function initLazyloading(){
    $('.lazyload').lazyload({
		placeholder : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
		effect : "fadeIn",
		effectspeed: 250,
		failure_limit: 9999,
	});
}
initLazyloading();

function infiniteLoad($item){
	var item = $item,
		url = item.find("a").attr("href");

	if(item.hasClass("js-infinity-loading")){
		return;
	}

	item.addClass("js-infinity-loading");
	item.find("a").remove();
	scrollPosition = $(window).scrollTop();

	$.get(url, function (htmlIn){
		item.remove();

		var content = $("<div/>").append(htmlIn.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ""));

		$(".load-more-button").remove();

		if($(".wrap-column-items").length){

			content.find(".wrap-column-items .column-items:eq(0)").children().appendTo($(".wrap-column-items .column-items:eq(0)"));
			content.find(".wrap-column-items .column-items:eq(1)").children().appendTo($(".wrap-column-items .column-items:eq(1)"));
			content.find(".js-infinity").appendTo($(".main"));

			if(isMobile()){

				$('html, body').animate({
					scrollTop: scrollPosition,
				}, 0);
			}
		}

		initLazyloading();
	});
};

$(function() {
	$('html').addClass(isTouch ? 'is-touch' : 'no-touch');

	FastClick.attach(document.body);

	sidebarPosition();

	// New JS here
	$(document).on("click", ".menu-item-holder,.menu-item-sub-holder", function(){
		var item = $(this),
			menuScrollTop = item.closest(".menu-scrolling").scrollTop();

		if(!item.is("a")){
			if(item.hasClass("is-open")){
				item.removeClass("is-open");
			}else{
				item.addClass("is-open");

				jumpTop = menuScrollTop + item.position().top - 1;

				$(".menu-scrolling").animate({
					'scrollTop': jumpTop,
				}, 500)
			}
		}
	});

	$(document).on("click", ".js-menu-toggle", function(){
		$("html").toggleClass("menu-active");
	});

	$(document).on("click", ".load-more-button a", function(e){
		if(isMobile()){
			e.preventDefault();

			infiniteLoad($(".js-infinity"));
		}
	});

	$(window).on("scroll", function(){
		var scrollY = $(window).scrollTop();

		if(scrollY > 0){
			$("html").addClass("is-scrolling");
		}else{
			$("html").removeClass("is-scrolling");
		}

		if($(".js-infinity").length && !isMobile()){
			if(scrollY + $(window).height() >= $(".js-infinity").offset().top){
				infiniteLoad($(".js-infinity"));
			}
		}
	});

	$(".sidebar-infos-scrolling").on("scroll", function(){
		var scrollY = $(this).scrollTop(),
			sidebar = $(this).closest(".sidebar-infos"),
			sidebarScrollHeight = sidebar.find(".sidebar-infos-scrolling")[0].scrollHeight;

		if(sidebarScrollHeight == (scrollY + sidebar.height())){
			sidebar.addClass("is-bottom");
		}else{
			sidebar.removeClass("is-bottom");
		}

		if(scrollY > 0){
			sidebar.addClass("is-scrolling");
		}else{
			sidebar.removeClass("is-scrolling");
		}
	});

	$(document).on("click", function(e){
		if( $("html").hasClass("menu-active") && !isMobile()){

			if( !$(e.target).closest(".menu-items").length && !$(e.target).hasClass("menu-button") && !$(e.target).closest(".menu-button").length ){
				$("html").removeClass("menu-active");
			}
		}
	});

	$(".wrap-menu-scrolling").clone().addClass("mobile-menu on-mobile").appendTo("header");

	$(".sidebar-archive-select").selectBoxIt();

	$(document).on("click", ".header-jump-link", function(){
		var item = $(".jump-item-" +  $(this).data("section")),
			headerHeight = $(".wrap-header").outerHeight();

		$("html, body").animate({
			'scrollTop': item.offset().top - headerHeight - 12 + "px",
		});
	});

	var scrollWidth = window.innerWidth - $(window).outerWidth();
	$(".menu-scrolling").css("width", "calc(100% + " + scrollWidth + "px)");

	//slideshow
	var transitionDurationSlideshow = 250;
	$(".slideshow").each(function () {
		$(this).slideshow({
			arrows: true,
			bullets: false,
			cyclic: true,
			duration: transitionDurationSlideshow,
			slideClick: true,
			keyboard: false,
			autoHeight: false,
			slideInit: function(slide, done){
				var $this = $(slide),
					slideimage = $this.find("img");

				if (slideimage.length == 0) {
					done();
					return;
				}

				var img = new Image(),
					imageSrc = slideimage.attr("data-image");

				img.onload = function() {
					slideimage.attr('src', slideimage.attr("data-image"));
					$this.addClass("loaded");
					$(".block-home-slideshow").addClass("home-slideshow-loaded");
				}

				img.src = imageSrc;
				done();
			}

		})
		.data("nextP", false);
	});

	$(document).on("slidechanged", ".slideshow", function(e, slide){
		var container = $(slide).closest(".inline-slideshow");

		container.find(".slideshow-info-counter-current").text($(slide).index()+1);
	});


	$(".js-lightbox").fancybox({
		speed: 0,
		margin: [14, 14, 46, 14],
		slideShow : false,
		fullScreen : false,
		thumbs : false,
		baseTpl	: '<div class="fancybox-container" role="dialog" tabindex="-1">' +
			'<div class="fancybox-bg"></div>' +
			'<div class="fancybox-controls">' +
				'<div class="fancybox-infobar">' +
					'<button data-fancybox-previous class="fancybox-button fancybox-button--left" title="Previous"></button>' +
					'<div class="fancybox-infobar__body">' +
						'<span class="js-fancybox-index"></span>&nbsp;/&nbsp;<span class="js-fancybox-count"></span>' +
					'</div>' +
					'<button data-fancybox-next class="fancybox-button fancybox-button--right" title="Next"></button>' +

					'<div class="fancybox-buttons">' +
						'<button data-fancybox-close class="fancybox-button fancybox-button--close" title="Close (Esc)"></button>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<div class="fancybox-slider-wrap">' +
				'<div class="fancybox-slider"></div>' +
			'</div>' +
		'</div>',
	});


	$(document).on("click", ".slideshow-lightbox", function(){
		$(this).closest(".inline-slideshow").find(".slide.current a").trigger("click");
	});

	var preload = ['BCNM-Slideshow-Fullscreen-Close-hover.svg','BCNM-Slideshow-Fullscreen-Hover.svg'];
     $(preload).each(function(){
        $('<img/>')[0].src = location.origin + "/elements/" + this;
    });

    $(document).on("submit", ".sidebar-form-newsletter", function(){
    	var form = $(this);

    	setTimeout(function(){
    		form.find(".sidebar-input").val("");
    	}, 250);

    });

    $('.menu-scrolling').on('scroll', function(){
    	var thisY = $(this).scrollTop();

    	if(thisY < 1){
    		$(".menu").removeClass("menu-is-scrolling");
    	}else{
    		$(".menu").addClass("menu-is-scrolling");
    	}

    });

	$(window).on("resize", function(){
		positionHatching();
		mobileMainTop();
		sidebarInfoBoxHeight();
		sidebarPosition();
	});

	$(window).on("load", function(){
		mobileMainTop();
		sidebarInfoBoxHeight();

		setTimeout(function(){
			positionHatching();
		}, 100);

		if ($('html').hasClass('layer-active')) {
			setTimeout(function(){
				removeLayer();
			}, 1000);
		}
	});

	if(isMobile()){
		if($('html').hasClass('menu-active')){
			$('html').removeClass('menu-active');
		}
	}

	$(window).on("load", function(){
		$('.isotope-items').isotope({
			itemSelector: '.teaser',
			layoutMode: 'masonry',
			masonry: {
					gutter: ".item-gutter",
					columnWidth: ".item-width"
			}
		});
	});

	$(document)
		.on('click', '.clickable-block', function (e) {
			if ($(e.target).is('a')) {
				return;
			}
			var href = $(this).data('href');
			if (href) {
				location.href = href;
				return false;
			}
		});

	$(document)
		.on('click', 'a', function (e) {
			if (this.hostname != location.hostname) {
				this.blur();
				window.open(this.href);
				e.preventDefault();
			}
		});
});
