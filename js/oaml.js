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

    $("#searchForm").submit(function (event) {
        event.preventDefault();
        var term = $("#pSearch").val();
        products.filter.title = true;
        products.filter.titleTerm = term;
        products.filter.updateFilter();

    });

    $("#reset-filter").click(function (e) {
        products.filter.resetFilter();
    });

    $("button[name='requestButton']").hide();

    $(".filter-toggle").click(function(){
        $(".toggle-filter").toggle();
    });
};

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
// function updateFooterLocation() {
//     if ($("#footer").length > 0){
//         var windowHeight = $(window).height();
//         var difference = windowHeight - ($("#footer").offset().top + $("#footer").outerHeight());
//         if (difference > 0) {
//             $("#main").css('min-height', $("#main").height() + difference);
//         }
//     }
// }

// //init
// $(document).ready(function () {
//     updateFooterLocation();
// });