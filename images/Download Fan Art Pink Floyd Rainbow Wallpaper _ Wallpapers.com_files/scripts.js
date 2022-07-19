$(document).ready(()=> {
	const observer = lozad();
	observer.observe();
	
	var btn = $('#scrollBtn'),
		search = $('#searchArea'),
		searchm = $('#msearchbtn'),
		searchInput = $('.searchInput'),
		searchInputm = $('.msearch'),
		searchText = $('.search-text'),
		searchLogo = $('.search-logo'),
		menu = $('li.menu-item-has-children'),
	    loginButton = $('.front-login-button'),
		signupButton = $('.front-signup-button'),
		resetButton = $('.front-reset-password'),
		closeButton = $('.close-modal'),
		loginSubmitButton = $('.front-login-submit-button'),
		logoutSubmitButton = $('.front-logout-submit-button'),
		signupSubmitButton = $('.front-signup-submit-button'),
		resetSubmitButton = $('.front-reset-submit-button'),
		nextStep = $('.next-step-button'),
		showpassButton = $('.show-pass-button'),
		inputFile = $('input[type=file]'),
		cancelSubmitButton = $('.cancel-submit-button'),
		submitphotosButton = $('.submit-photos-button'),
		uploadActionArea = $('.upload-action'),
		searchResultsButton = $('.search-results-button'),
        bigSearchInput = $('#big-search'),
		smallSearchBtn = $('#small-search'),
		files = [],
		searchAutocomplete = [],
	 	topKeywords = [
			"Animal",
			"Anime",
			"Background",
			"Brand",
			"Car",
			"Cartoon",
			"Color",
			"Device",
			"Disney",
			"Fantasy",
			"Flower",
			"Gaming",
			"Holiday",
			"Horror",
			"Movie",
			"Music",
			"Nature",
			"Religious",
			"Space",
			"Sports",
			"Superhero",
			"Travel",
			"Tv Shows",
			"Others",
			"Celebrities"
    	];
	
	function preventDefaults(e) {
        e.preventDefault()
        e.stopPropagation()
    }
	
	$(window).scroll(function() {
	  if ($(window).scrollTop() > 300) {
		btn.removeClass('d-none');
	  } else {
		btn.addClass('d-none');
	  }
	});

	btn.on('click', function(e) {
	  e.preventDefault();
	  $('html, body').animate({scrollTop:0}, '300');
	});
	
	smallSearchBtn.on("click", function (e) {
		e.preventDefault();
		window.location = "/search/" + document.getElementById("big-search").value;
		
	});
	
	search.on('click', function(e) {
         e.stopPropagation()
         if(!search.hasClass("is-active")){
			searchInput.addClass("show")
			search.addClass("is-active")
			searchInput.focus();
			return
		}
		if(search.hasClass("is-active")){
			searchInput.focus();
			window.location = "/search/" + $(".search-input-box").val()
			return
		}
    })
	
	searchm.on('click', function(e){
		e.stopPropagation()
		window.location = "/search/" + searchInputm.val()
		//searchInputm.toggleClass('show');

// 		if(!searchm.hasClass('is-active')) {
// 			searchInputm.addClass("show")
// 			searchm.addClass("is-active")
// 			searchInputm.focus();
// 			return
// 		}
// 		if(searchm.hasClass("is-active")){
// 			searchInputm.focus();
// 			window.location = "/search/" + searchInputm.val()
// 			return
// 		}
	})
	
	searchInputm.on("click",function(e){
		searchLogo.addClass('d-none')
		searchText.addClass('d-none')
		return 
	})
	
	$(document).on("click", function(e){
		    if (!searchInputm.is(e.target) && !searchInputm.has(e.target).length) {
			document.getElementById("textfield1").value = ""
			searchText.removeClass('d-none')
			searchLogo.removeClass('d-none')
			return
    }
	})
	
	function sendToSearchPage(e) {
        if(e.keyCode === 13) {
            window.location = '/search/' + e.target.value;
        }
    }
	
	bigSearchInput.on('keypress', sendToSearchPage);
    searchInput.on('keypress', sendToSearchPage)
		
	$(document).on("click", function(e) {
        if ((!searchInput.is(e.target) && !searchInput.has(e.target).length) ) {
        	searchInput.removeClass("show")
 			search.removeClass("is-active")
			searchm.removeClass("is-active")
			return
    }
	});
	
	function getSoruce(q, result) {
		let query = q.term;
        $.ajax({
            url: epas.endpointUrl,
            type: 'POST',
            dataType: 'json',
            contentType: "application/json",
            crossDomain: true,
            data: JSON.stringify({
                "query": {
                    "multi_match": {
                        "query": query,
                        "type": "bool_prefix",
                        "fields": ["name"]
                    }
                },
                "suggest": {
                    "text": query,
                    "words": {
                        "phrase": {
                            "field": "post_title"
                        }
                    }
                }
            })
        }).then(function (data) {
            var searchAutocompleteList = [];
            var hits = data.hits.hits,
                suggestions = data.suggest.words[0].options;
            $.each(hits, function (i, item) {
                if (item._index.includes('term')) {
                    searchAutocompleteList.push({
                        label: item._source.name,
                        url: '/' + item._source.slug
                    });
                }
                if (item._index.includes('post')) {
                    searchAutocompleteList.push({label: item._source.post_title, url: item._source.permalink});
                }
            });
			$.each(suggestions, function (i, item) {
                searchAutocompleteList.push({label: item.text, url: '/search/' + item.text});
            });
			result($.map(searchAutocompleteList, function (item) {
                return item;
            }));
        });
    }
	
	const autoCompleteParams = {
        source: getSoruce,
        select: function(e, ui) {
            window.location = ui.item.url;
        }
    }

    function renderItem(ul, item) {
        return $("<li></li>")
            .data("item.autocomplete", item)
            .append($("<a href='#'>" + item.label + "</a>").html(item.label))
            .appendTo(ul);
    }
	
	$(document).on('keydown.autocomplete', '.search-autocomplete', function () {
        $(this).autocomplete(autoCompleteParams);
        if($(this).data()) {
            let ac = $(this).data('autocomplete');
            if(ac)
                ac._renderItem = renderItem;
        }
    });
	
	/* END SEARCH BOX */

    /* SUB MENU */
	
	menu.on('click', function(e) {
		var $window = $(window);
        var windowsize = $window.width();
		if (windowsize < 750) {
			e.preventDefault();
			$wrapper = $('.sub-menu-mobile-wrap');
			$wrapper.css('height', $window.height());
			$wrapper.css('display', 'block');
		//	if ($('.sub-menu-mobile-wrap .submenu-content ul').html() === '') {
// 				content = menu.children('.sub-menu li ul').html();
// 			    console.log(content,'content')

 				content = $(".navbar-cat").html()
				$('.sub-menu-mobile-wrap .submenu-content ul').html(content);
		//	}
        }
	});
	
	$(document).on('click', '.close-submenu', function (e) {
        e.preventDefault();
        $('.sub-menu-mobile-wrap').css('display', 'none');
    });

	
	loginButton.on('click', function(e) {
	  	e.preventDefault();
		$('.password-modal').removeClass('show');
		$('.signup-modal').removeClass('show');
		$('.login-modal').addClass('show');
	});
	
	 loginSubmitButton.on('click', function (e) {
        e.preventDefault();
        var form = $('.login-modal').find('form');
        if (form[0].checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            form.addClass('was-validated');
        } else {
            var username = $('.login-modal').find('#username').val();
            var password = $('.login-modal').find('#login-password').val();
			grecaptcha.enterprise.ready(function() {
    		grecaptcha.enterprise
				.execute('6LdyuSkgAAAAANZP-g4cGcnoY9Qq47SDnEOCb4PG', {action: 'login'})
				.then(function(token) {
				            login_post(username, password, token, form);
    					});
					});
        }
    });
	
	function login_post(username, password, token, form) {
        $.post(ajax_url,
            {
                action: 'login_user',
                data: {
                    username: username,
                    password: password,
					token: token
                }
            }).then(function (data) {
            var response = JSON.parse(data);
            if (response.success) {
                setTimeout(function () {
                    window.location.reload();
                });
            } else {
                form.children('.invalid-feedback').addClass('d-block');
            }
        });
    }
	
	logoutSubmitButton.on('click', function (e) {
        e.preventDefault();
        $.post(ajax_url, {action: 'logout_user'}).then(function () {
            setTimeout(function () {
                window.location = '/';
            });
        });
    });
	
	signupButton.on('click', function(e) {
	  	e.preventDefault();
		$('.password-modal').removeClass('show');
		$('.login-modal').removeClass('show');
		$('.signup-modal').addClass('show');
	});
	
	signupSubmitButton.on('click', function (e) {
        var form = $('.signup-modal').find('form');
        if (form[0].checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            form.addClass('was-validated');
        } else {
            var email = $('.signup-modal').find('#email').val();
            var password = $('.signup-modal').find('#password').val();
            var username = email.substring(0, email.indexOf('@'));
            e.preventDefault();
			grecaptcha.enterprise.ready(function() {
    			grecaptcha.enterprise
				.execute('6LdyuSkgAAAAANZP-g4cGcnoY9Qq47SDnEOCb4PG', {action: 'signup'})
				.then(function(token) {
					return $.post(ajax_url,
						   {
								action: 'create_user',
								data: {
									username: username,
									password: password,
									email: email,
									token: token
								}
							});})
				.then(function(data) {
					var response = JSON.parse(data);
					if (response.success) {
						setTimeout(function () {
                    		window.location.reload();
                		});
					} else if (response.data.errors.existing_user_login) {
						form.children('.invalid-feedback').addClass('d-block');
						console.log(data);
					}
				});
			});
        }
    });
	
	resetButton.on('click', function(e) {
	  	e.preventDefault();
		$('.login-modal').removeClass('show');
		$('.signup-modal').removeClass('show');
		$('.password-modal').addClass('show');
	});
	
	resetSubmitButton.on('click', function (e) {
        var form = $('.password-modal').find('form');
        if (form[0].checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            form.addClass('was-validated');
        } else {
            var email = $('.password-modal').find('#email').val();
            e.preventDefault();
            $.post(ajax_url,
                {
                    action: 'reset_password',
                    data: {
                        email: email
                    }
                }).then(function (data) {
                var response = JSON.parse(data);
                console.log(response);
            });
        }
    });
	
	closeButton.on('click', function(e) {
	  	e.preventDefault();
		$('.password-modal').removeClass('show');
		$('.signup-modal').removeClass('show');
		$('.login-modal').removeClass('show');
	});
	
	showpassButton.on('click', function (e) {
        var useTag = showpassButton.closest('.wallpapers-modal').find('svg.show-pass-button use'),
            passwordBlock = useTag.closest('.password-block');
        if (useTag.attr('xlink:href') == '#popular-icon') {
            useTag.attr('xlink:href', '#pw_show');
            passwordBlock.find('input').attr('type', 'password');
        } else {
            passwordBlock.find('input').attr('type', 'text');
            useTag.attr('xlink:href', '#popular-icon');
        }

    });
	
	nextStep.on('click', function(e) {	
	  	e.preventDefault();			
	});
	cancelSubmitButton.on('click', function(e) {
		$('.step1').addClass('show');
		$('.step2').removeClass('show');
		$('.files-for-upload').html('');
		files = [];
	});
	
	$.each(['dragenter', 'dragover', 'dragleave', 'drop'], function(ind, item) {
		uploadActionArea.on(item, function(e){
			preventDefaults(e);
		});
	});
	
	$.each(['dragenter', 'dragover'], function(ind, item) {
		uploadActionArea.on(item, function(e){
			highlight(e);
		});
	});
	
	$.each(['dragleave', 'drop'], function(ind, item) {
	  uploadActionArea.on(item, function(e){
		  unhighlight(e);
	  });
	});

	function highlight(e) {
	  uploadActionArea.addClass('highlight');
	}

	function unhighlight(e) {
	  uploadActionArea.removeClass('highlight');
	}
	
	uploadActionArea.on('drop', function(e){
		var dt = e.originalEvent.dataTransfer;
	  	var files = dt.files;
		renderFiles(files);
	});
	
	function renderFiles(files){
		if (files.length && files.length <= 10) {
			var i = 0;
			while (files[i]) {
				const reader = new FileReader();
			  	reader.addEventListener("load", function () {
					var block = $("<div class='co mb-4' style='height: 390px;'><li class='card' style='max-height: 280px;'><div><div class='remove-img'><svg height='16' width='16' style='margin: 8px 7px;'><use xlink:href='#close-icon-white'></use></svg></div><img class='lozad' src='" + reader.result + "' class='lozad card-img-top post' alt='' height='260'/><div class='tag-manager center'><button class='btn btn-primary add-keyword-button' style='border-radius: 10px;'>Add Keywords</button><div class='ui-menu hide'><input id='keywords' class='keywords-autocomplete' name='keyword'></div></div></div><div class='card-body mt-3' style='position: inherit;'><form class='image-details-form needs-validation' novalidate><input type='hidden' name='file' value='" + reader.result + "'><input type='text'name='title' placeholder='Enter Title' class='submit-input' required/><div class='invalid-feedback'>Title and Keywords are required fields</div><textarea name='description' type='text' placeholder='Enter Description (Optional)' class='submit-input'></textarea></form></div></li></div>");	
					$('.files-for-upload').append(block);
			  	}, {once: true});
				reader.readAsDataURL(files[i]);
				i++;
			}
			$('.step1').removeClass('show');
			$('.step2').addClass('show');
		}
	}
	
	submitphotosButton.on('click', function(e) {
		if(!submitphotosButton.hasClass('disabled')) {
			submitphotosButton.addClass('disabled');
			var forms = $('.files-for-upload').find('form');
			var i = 0;
			var filesToSubmit = [];
			var formsAreReady = true;
			$.each(forms, function(ind, item){
				var keyword = $(item).closest('.card').find('.keywords-autocomplete').val();
				if(item.checkValidity() === false || keyword === '') {
					event.preventDefault();
					event.stopPropagation();
					formsAreReady = false;
					$(item).addClass('was-validated');
				} else {
					var formObj = {
						keyword: keyword
					};
					$.each($(item).serializeArray(), function(_, obj){
						formObj[obj.name] = obj.value;
					});
					filesToSubmit.push(formObj);
				}
			});
			if(formsAreReady && filesToSubmit.length) {
				$('.progress').removeClass('hide');
				grecaptcha.enterprise.ready(function() {
    				grecaptcha.enterprise
					.execute('6LdyuSkgAAAAANZP-g4cGcnoY9Qq47SDnEOCb4PG', {action: 'signup'})
					.then(function(token) {
						return $.post(ajax_url, {
							action: 'post_create',
							data: {files: filesToSubmit, token},	
						})})
					.then(function(data){
						var response = JSON.parse(data);
						if (response.data.length == filesToSubmit.length) {
							submitphotosButton.removeClass('disabled');
							$('.step2').removeClass('show');
							$('.step3').addClass('show');
							$('.progress').addClass('hide');
							$.each($('.files-for-upload').find('img'), function(i, img){	
								var li = $('<li class="card mr-e" ><div class="pending-icon"><svg height="20" width="20"><use xlink:href="#pending-icon" class="mr-3"></use></svg>Pending...</div></li>');
								li.append(img);
								$('.files-for-pending').append(li);
							});
							$('.files-for-upload').html('');
							files = [];
						}
					});
				})} else {
				console.log('not ok');
			}
		}
	});
		
	inputFile.on('change', function(e) {
	  	e.preventDefault();
		renderFiles(e.target.files);	
	});
	
	$(document).on('click', '.close-submenu', function(e){
		e.preventDefault();
		$('.sub-menu-mobile-wrap').css('display', 'none');
	});
	
	$(document).on('click', '.add-keyword-button', function(e){
		e.preventDefault();
		$(e.target).addClass('hide');
		$(e.target).siblings('.ui-menu').removeClass('hide');
	});
	
	$(document).on('click', '.remove-img', function(e){
		e.preventDefault();
		var div = $(e.target).closest('div.co');
		if($(div).siblings().length == 0) {
			$('.step2').removeClass('show');
			$('.step1').addClass('show');
		}
		div.remove();
		
	});
	$(document).on('keydown.autocomplete', '.keywords-autocomplete', function() {
		$(this).autocomplete({
			source: topKeywords
		});
	});
	
	$(document).on('change', '.keywords-autocomplete', function(e) {
		var newValue = $(e.target).val();
		if(topKeywords.includes(newValue)) {
			var menu = $(e.target).closest('.ui-menu'),
				button = $(menu).siblings('button');
			button.html(newValue);
			button.removeClass('hide');
			menu.addClass('hide');
		}
	});
	
	$(document).on('click', '.download-item', function(event){
		const itemKey = event.currentTarget.dataset.itemKey;
		const itemUrl = `https://wallpapers.com/images${itemKey}.jpg`;
		const itemName = event.currentTarget.dataset.itemName;
		const a = document.createElement('a');
		a.href = itemUrl;
		a.download = itemName + '.jpg';
// 		a.target = '_blank';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	})
})

$(document).ready(function(){
	$("header nav ul.navbar-nav li.menu-item.menu-item-has-children")
	.hover(function(){
		$('#backdrop').show();
	}, function(){
		$('#backdrop').hide();
	})
	
})

function sendContactUs(){
    var forms = $('.contact-us-container').find('form');
	var formObj = {};
	$.each(forms, function(ind, item){
		if(item.checkValidity() === false) {
					event.preventDefault();
					event.stopPropagation();
					$(item).addClass('was-validated');
				}
					else {
						$.each($(item).serializeArray(), function(_, obj){
						formObj[obj.name] = obj.value;
					}) }
			});
	grecaptcha.enterprise.ready(function() {
    		grecaptcha.enterprise
				.execute('6LdyuSkgAAAAANZP-g4cGcnoY9Qq47SDnEOCb4PG', {action: 'send_contact_us'})
				.then(function(token) {
				            send_contact_us(token, formObj, forms);
    					});
	});
}

function send_contact_us(token, formObj, forms) {
        $.post(ajax_url,
            {
                action: 'send_contact_us',
                data: {
                    name: formObj.name,
					email: formObj.email,
					subject: formObj.subject,
					message: formObj.message,
					token: token
                }
            }).then(function (data) {
            console.log(data,'data');
            if (data === true) {
                    setTimeout(function () {
                    window.location.reload();
                });
            } else {
                forms.children('.invalid-feedback').addClass('d-block');
            }
        });
    }

$(document).ready(function () {
  let $grid = $(".card-columns");
  let option = {
    initLayout: false,
    itemSelector: ".content",
    masonry: {
      gutter: 10,
    },
    getSortData: {
      download: "[data-download] parseInt",
    },
    sortAscending: {
      download: false,
    },
  };

  let filters = {};

  function addName() {
    $grid.isotope(option);
    let elems = $grid.isotope("getFilteredItemElements");
    $(elems).each(function () {
      if (!$(this).hasClass("isotope-fix")) {
        $(this).find("img").removeAttr("height");
        $(this).addClass("isotope-fix");
        $(this).removeClass("card");
      }
    });
  }

  function concatValues(obj) {
    var value = "";
    for (var prop in obj) {
      value += obj[prop];
    }
    return value;
  }

  $(".orientation").on("click", function () {
    filters["orientation"] = $(this).attr("data-filter");
    $grid.isotope(option);
    let filterGroup = concatValues(filters);
    addName({ filter: filterGroup });
    $grid.isotope({ filter: filterGroup });
  });

//   $(".data-size-filter").on("click", function () {
//     filters["size"] = $(this).attr("data-filter");
//     $grid.isotope(option);
//     let filterGroup = concatValues(filters);
//     addName();
//     $grid.isotope({ filter: filterGroup });
//   });

//   $(".data-color-filter").on("click", function () {
//     filters["colour"] = $(this).attr("data-filter");
//     $grid.isotope(option);
//     let filterGroup = concatValues(filters);
//     addName();
//     $grid.isotope({ filter: filterGroup });
//   });

//   $(".download-btn").on("click", function () {
//     let sortValue = $(this).attr("data-sort-value");
//     $grid.isotope(option);
//     addName();
//     $grid.isotope({ sortBy: sortValue });
//   });

//   $(".original-order").on("click", function () {
//     let sortValue = $(this).attr("data-sort-value");
//     $grid.isotope(option);
//     addName();
//     $grid.isotope({ sortBy: sortValue });
//   });

  $(".reset-btn").on("click", function () {
    filters = {};
    $grid.isotope(option);
    addName();
    $grid.isotope({ filter: "*" });
  });
});