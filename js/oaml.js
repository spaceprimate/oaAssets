/**
 * page specific controllers
 */
var controls = {};

/*******************************************************************************                                                                                                                ***
 * PRODUCTS
 *******************************************************************************/
var products = {}; // products module
products.products = []; // products array
products.product = function (p) { // product constructor
    this.id = p.id;
    this.name = p.name;
    this.classification = p.classification;
    this.distribution = p.distribution;
    //this.description = p.description;
    this.type = p.type;
    this.subType = p.subType;
    this.constituents = p.constituents;
    this.display = true;
}

/**
 * restore the view to no filters 
 */
products.resetFilter = function () {
    $(".categoryTitle").show();
    $(".product").show();
    $(".collapse").removeClass("in");
    $('#pDist').prop('selectedIndex', 0);
}

products.showAll = function () {
    $(".categoryTitle").show();
    $(".product").show();
    $(".collapse").removeClass("in");
    $(".panel-group.collapse").addClass("in");
    $(".sub-panel-group.collapse").addClass("in");
};

/**
 * if a category title has no children under the current filter, hide it
 */
products.hideInactiveCategories = function () {
    $(".categoryTitle").each(function (i) {
        var id = $(this).find("a").attr("href");
        if ($(id).find('.active').length == 0) {
            $(this).hide();
        }
    });
};

/**
 * Prepares the product's view state for being filtered
 */
products.filterView = function () {
    //clear hidden category titles
    $(".categoryTitle").show();
    //remove product's active state from previous filter
    $("#inventorydiv .active").removeClass('active');
    //hide all the products
    $(".product").hide();
    // expand all the panel groups (not the actual panels)
    $(".collapse").css("height", "auto");
    $(".panel-group.collapse").addClass("in");
    $(".sub-panel-group.collapse").addClass("in");
};

//product filters
products.filter = {
    title: false,
    dist: false,
    titleTerm: '',
    distTerm: '',
    updateFilter: function () {
        products.filterView(); // switch view, hide all
        products.products.forEach(function (p) {
            p.display = true; // reset
            if (products.filter.title) {
                if (!products.filter.filterTitle(p)) {
                    p.display = false;
                }
            }
            if (products.filter.dist) {
                if (!products.filter.filterDist(p)) {
                    p.display = false;
                }
            }
            // set the view
            if (p.display) {
                var pId = "#product-" + p.id;
                $(pId).show();
                $(pId).addClass('active');
            }
        });
        products.hideInactiveCategories();
    }
}

products.filter.resetFilter = function () {
    products.filter.title = false;
    products.filter.dist = false;
    products.filter.updateFilter;
    $(".categoryTitle").show();
    $(".product").show();
    $(".collapse").removeClass("in");
    $('#pDist').prop('selectedIndex', 0);
    $("#pSearch").val('');
}

products.filter.filterTitle = function (p) {
    var term = products.filter.titleTerm.toLowerCase();
    if (p.name.toLowerCase().indexOf(term) >= 0) {
        return true;
    }
    return false;
}

products.filter.filterDist = function (p) {
    if (p.distribution == products.filter.distTerm) {
        return true;
    }
    return false;
}

products.filterDist = function (dist) {
    products.filterView();
    if (dist == 'all') {
        products.showAll();
    } else {
        products.products.forEach(function (p) {
            if (p.distribution == dist) {
                var pId = "#product-" + p.id;
                $(pId).show();
                $(pId).addClass('active');
            }
        });
        products.hideInactiveCategories();
    }
}

products.getDistributions = function () {
    var distributions = [];
    products.products.forEach(function (p) {
        if (!arrayHasString(distributions, p.distribution)) {
            distributions.push(p.distribution);
        }
    });
    return distributions;
}


/**
 * controls specific to products page
 */
controls.products = function(){
    var pDist = products.getDistributions();
    pDist.forEach(function (p) {
        $("#pDist").append("<option>" + p + "</option>");
    });

    $("#pDist").change(function () {
        var dist = $("#pDist :selected").text();
        if (dist == "Distribution" || dist == "all") {
            products.filter.dist = false;
        } else {
            products.filter.dist = true;
            products.filter.distTerm = dist;
        }
        products.filter.updateFilter();

    });

    // $("#searchForm").submit(function (event) {
    //     event.preventDefault();
    //     var term = $("#pSearch").val();
    //     products.filter.title = true;
    //     products.filter.titleTerm = term;
    //     products.filter.updateFilter();

    // });

    $("#reset-filter").click(function (e) {
        products.filter.resetFilter();
    });

    $("button[name='requestButton']").hide();

    $(".filter-toggle").click(function(){
        $(".toggle-filter").toggle();
    });
};


// /*******************************************************************************                                                                                                                ***
//  * PRODUCT REQUEST FORM
//  *******************************************************************************/
// controls.productRequest = function () {
    
//     $('#foreignInformation').hide();


//     $("input[name$='ForeignDisclosure']").click(function () {
//         if ($(this).val() == "StandaloneForeignNationals" || $(this).val() == "EmbeddedForeignNationals") {
//             $('#foreignInformation').show();
//         } else {
//             $('#foreignInformation').hide();
//         }
//     });
//     $("button[name='requestButton']").click(function () {
//         //var id = $(this).val();
//         if ($(this).hasClass("active")) {
//             removeProduct($(this).val());
//             $(this).removeClass("active");
//         } else {
//             addProduct($(this).val());
//             $(this).addClass("active");
//         }
//     });


//     // remove(x) buttons in the Selected Products listing
//     $("#selectedProducts").on("click", ".selectedProduct span", function () {
//         var id = $(this).attr("data-id");
//         removeProduct(id);
//     });


//     $("#clear-products").click(function (e) {
//         e.preventDefault();
//         removeAllProducts();
//     });

//     //submit form if valid
//     $("#submit").click(function (e) {
//         e.preventDefault();
//         if (validation.validate("#section1, #section2, #section3, #section4")) {
//             $("#productRequest").submit();
//         } else {
//             $("html, body").animate({
//                 scrollTop: 0
//             });
//         }
//     });

//     var addProduct = function (id) {
//         var name = $('#name' + id).text();
//         var classification = $('#classification' + id).text();
//         var distribution = $('#distribution' + id).text();
//         var description = $('#description' + id).text();
//         var version = $('#versionInfo').val();

//         var product = {
//             "versions": version,
//             "name": name,
//             "description": description,
//             "distribution": distribution,
//             "classification": classification,
//             "id": id
//         };

//         $('#selectedProducts ul').append('<li class="selectedProduct list-group-item" data-id="' + product.id + '">' +
//             product.name +
//             '<span data-id="' + product.id + '" class="glyphicon glyphicon-remove pull-right pointer" alt="remove product" title="remove product"></span>' +
//             '</li>');
//         selectedProducts.push(product);

//         updateProducts();
//     };


//     var removeProduct = function (id) {
//         for (var i = selectedProducts.length - 1; i >= 0; i--) {
//             if (selectedProducts[i].id === id) {
//                 selectedProducts.splice(i, 1);
//             }
//         }
//         $("#selectedProducts").find("[data-id='" + id + "']").remove();
//         $("#productmodal").find(".requestButton[data-id='" + id + "']").removeClass("active");
//         updateProducts();
//     };

//     var removeAllProducts = function () {
//         $("#selectedProducts li").remove();
//         $("#productmodal .requestButton").removeClass("active");
//         updateProducts();
//     };

//     var updateProducts = function () {
//         if (selectedProducts.length > 0) {
//             $("#selectedProducts").addClass("active");
//         } else {
//             $("#selectedProducts").removeClass("active");
//         }
//         $('#hiddenProducts').val(JSON.stringify(selectedProducts));
//     };

//     // confirm back button clicks so users don't lose their form history accidentally. 
//     // if for some reason the user reloads the page n # of times, this will display this dialog n times
//     if (window.history && history.pushState) {
//         addEventListener('load', function () {
//             history.pushState(null, null, null); // creates new history entry with same URL
//             addEventListener('popstate', function () {
//                 var leavePage = confirm("Confirm back button? Your form data will not be saved!");
//                 if (leavePage) {
//                     history.back();
//                 } else {
//                     history.pushState(null, null, null);
//                 }
//             });
//         });
//     }
// };


/*******************************************************************************                                                                                                                ***
 * MULTI-SECTION FORM MANAGEMENT
 *******************************************************************************/
// var totalSections = 4;
// var curSection = 1;

// //next button
// $("#form-next").click(function (e) {
//     e.preventDefault();
    
//     if (validation.validate("#section" + curSection)) {
//         if (curSection < totalSections) {
//             curSection++;
//         }
//     } 
//     updateSections();
//     $("html, body").animate({
//         scrollTop: 0
//     });
// });

// //prev button
// $("#form-prev").click(function (e) {
//     e.preventDefault();
//     if (curSection != 1) {
//         curSection--;
//         updateSections();
//     }
//     $("html, body").animate({
//         scrollTop: 0
//     });
// });

// updaate form section indicators and navigation buttons
// var updateSections = function () {
//     var newSectionId = "#form-progress-" + curSection + " .badge";
//     $(newSectionId).addClass("visited");

//     $("#form-validation-status").addClass("hidden");

//     $(".form-section").each(function (i) {
//         e = i + 1;
        
//         if ($(this).hasClass("invalid")) {
//             $("#form-progress-" + e + " .badge").addClass("error");
//             $("#form-validation-status").removeClass("hidden");
//         } else {
//             $("#form-progress-" + e + " .badge").removeClass("error");
//         }
//     });

//     if (curSection == 1) {
//         $("#form-prev").hide();
//     } else {
//         $("#form-prev").show();
//     }
//     if (curSection == 4) {
//         $("#form-next").hide();
//     } else {
//         $("#form-next").show();
//     }
//     $(".form-section").addClass("hidden");
//     $("#section" + curSection).removeClass("hidden");
//     $(".form-progress .badge").removeClass("current");
//     $("#form-progress-" + curSection + " .badge").addClass("current");
// }

// go to section
// $(".form-progress .badge").click(function (e) {
//     e.preventDefault();
//     if ($(this).hasClass("visited")) {
//         if (validation.validate("#section" + curSection)) {
//             if (curSection < totalSections) {
//                 curSection++;
//             }
//             curSection = $(this).text();
//         } 
//         updateSections();
//     }
// });

// /*******************************************************************************                                                                                                                ***
//  * FORM VALIDATION
//  *******************************************************************************/
// var validation = {};

// /**
//  * Validation for multiple section forms
//  * @param String - comma separated string of html ids for sections to be checked. 
//  */
// validation.validate = function (elementIds) {
//     var ids = elementIds.split(',');
//     var valid = true;
//     var sectionValid = true;
//     ids.forEach(function (id) {
//         if (!validation.validateInput(id)) { //inputs
//             sectionValid = false;
//         }
//         if (!validation.validateTextarea(id)) { //textarea
//             sectionValid = false;
//         }
//         if (!validation.validateRadio(id)) { //radios
//             sectionValid = false;
//         }
//         if (!validation.validateProducts(id)) { //at least 1 product
//             sectionValid = false;
//         }

//         if (!sectionValid) {
//             $(id).addClass("invalid");
//             valid = false;
//         } else {
//             $(id).removeClass("invalid");
//         }

//     });
//     return valid;
// };

// validation.validateInput = function(id){
//     var inputValid = true;
//     $(id + ' input').each(function () {
//         if ($(this).attr('required')) {
//             if ($(this).val() == '') {
//                 $(this).parent().addClass('has-error');
//                 inputValid = false;
//             } else {
//                 $(this).parent().removeClass('has-error');
//             }
//         }
//     });
//     return inputValid;
// };

// validation.validateTextarea = function(id){
//     var textValid = true;
//     $(id + ' textarea').each(function () {
//         if ($(this).attr('required')) {
//             if ($(this).val() == '') {
//                 $(this).parent().addClass('has-error');
//                 textValid = false;
//             } else {
//                 $(this).parent().removeClass('has-error');
//             }
//         }
//     });
//     return textValid;
// };


// //validate groups of radio buttons for a given section
// validation.validateRadio = function (id) {
//     var radios = [];
//     var radiosValid = true;
//     $(id + " input:radio").each(function () {
//         if ($.inArray($(this).attr('name'), radios) < 0) {
//             radios.push($(this).attr('name'));
//         }
//     });
//     radios.forEach(function (r) {
//         var checked = false;
//         $("input[name=" + r + "]").each(function () {
//             if ($(this).prop('checked')) {
//                 checked = true;
//             }
//         });
//         if (!checked) {
//             $("#" + r).addClass("has-error");
//             radiosValid = false;
//         } else {
//             $("#" + r).removeClass("has-error");
//         }
//     });
//     return radiosValid;
// }

// validation.validateProducts = function (id) {
//     if ($(id).has('#selectedProducts').length > 0) {
//         if (selectedProducts.length > 0) {
//             return true;
//         } else {
//             $("#selectedProducts .hide-active").addClass("text-danger");
//             $("#selectedProducts .hide-active").css("font-size", "18px");
//             return false;
//         }
//     } else {
//         return true;
//     }
// };

/*******************************************************************************                                                                                                                ***
 * HELPER FUNCTIONS
 *******************************************************************************/
function arrayHasString(arr, str) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == str) {
            return true;
        }
    }
    return false;
}

function verticalAlign(id){
    $(id).css({
        'position': 'absolute',
        'left': '50%',
        'top': '50%',
        'margin-left': function () {
            return -$(this).outerWidth() / 2
        },
        'margin-top': function () {
            return -$(this).outerHeight() / 2
        }
    });
}

/**
 * Even if content doesn't fill up the sreen, make sure the footer is still on the bottom of the screen. 
 */
function updateFooterLocation() {


    if ($("#footer").length > 0){
        var windowHeight = $(window).height();
        var difference = windowHeight - ($("#footer").offset().top + $("#footer").outerHeight());
        if (difference > 0) {
            $("#main").css('min-height', $("#main").height() + difference);
        }
    }
    
}

//init
$(document).ready(function () {
    updateFooterLocation();
});