var selectedProducts = [];
$(document).ready(function () {
    //controls.productRequest();

    // [x]
    //init
    $("#section2").addClass("hidden");
    $("#section3").addClass("hidden");
    $("#section4").addClass("hidden");
    $("#form-prev").hide();
    
    $("#form-progress-1 .badge").addClass("current");

// [x]
    $('#foreignInformation').hide();
// [x]
    $("input[name$='ForeignDisclosure']").click(function () {
        if ($(this).val() == "StandaloneForeignNationals" || $(this).val() == "EmbeddedForeignNationals") {
            $('#foreignInformation').show();
        } else {
            $('#foreignInformation').hide();
        }
    });
// [x]
    $("button[name='requestButton']").click(function () {
        //var id = $(this).val();
        if ($(this).hasClass("active")) {
            removeProduct($(this).val());
            $(this).removeClass("active");
        } else {
            addProduct($(this).val());
            $(this).addClass("active");
        }
    });

    // [x]
    // remove(x) buttons in the Selected Products listing
    $("#selectedProducts").on("click", ".selectedProduct span", function () {
        var id = $(this).attr("data-id");
        removeProduct(id);
    });

    // [x]
    $("#clear-products").click(function (e) {
        e.preventDefault();
        removeAllProducts();
    });


    // [x]
    //submit form if valid
    $(".submit").click(function (e) {
        e.preventDefault();
        if (validation.validate("#section1, #section2, #section3, #section4")) {
            $("#productRequest").submit();
        } else {
            $("html, body").animate({
                scrollTop: 0
            });
        }
    });


    // [x]
    var addProduct = function (id) {
        var name = $('#name' + id).text();
        var classification = $('#classification' + id).text();
        var distributionLevel = $('#distribution' + id).text();
        var description = $('#description' + id).text();
        var number = $('#versionInfo' + id).val();
        var desc = $('#versionDesc' + id).text();
        var releaseDate = $('#versionReleaseDate' + id).text();
        var version = {
            "number": number,
            "desc": desc,
            "releaseDate": releaseDate,
            "active": "true"
        };



        var product = {
            "version": version,
            "name": name,
            "description": description,
            "distributionLevel": distributionLevel,
            "classification": classification,
            "id": id
        };

        $('#selectedProducts ul').append('<li class="selectedProduct list-group-item" data-id="' + product.id + '">' +
            product.name +
            '<span data-id="' + product.id + '" class="glyphicon glyphicon-remove pull-right pointer" alt="remove product" title="remove product"></span>' +
            '</li>');
        selectedProducts.push(product);

        updateProducts();
    };


    
    var removeProduct = function (id) {
        for (var i = selectedProducts.length - 1; i >= 0; i--) {
            if (selectedProducts[i].id === id) {
                selectedProducts.splice(i, 1);
            }
        }
        $("#selectedProducts").find("[data-id='" + id + "']").remove();
        $("#productmodal").find(".requestButton[data-id='" + id + "']").removeClass("active");
        updateProducts();
    };

    var removeAllProducts = function () {
        $("#selectedProducts li").remove();
        $("#productmodal .requestButton").removeClass("active");
        updateProducts();
    };

    var updateProducts = function () {
        if (selectedProducts.length > 0) {
            $("#selectedProducts").addClass("active");
        } else {
            $("#selectedProducts").removeClass("active");
        }
        $('#hiddenProducts').val(JSON.stringify(selectedProducts));
    };

    // confirm back button clicks so users don't lose their form history accidentally. 
    // if for some reason the user reloads the page n # of times, this will display this dialog n times
    if (window.history && history.pushState) {
        addEventListener('load', function () {
            history.pushState(null, null, null); // creates new history entry with same URL
            addEventListener('popstate', function () {
                var leavePage = confirm("Confirm back button? Your form data will not be saved!");
                if (leavePage) {
                    history.back();
                } else {
                    history.pushState(null, null, null);
                }
            });
        });
    }





/** =======  end productReq  ========================================================================
 * ===========================================================================================
 * ===========================================================================================
 *  * ===========================================================================================
 * ===========================================================================================
 *  * ===========================================================================================
 * ===========================================================================================
 *  * ===========================================================================================
 * ===========================================================================================
 *  * ===========================================================================================
 * ===========================================================================================
 *  * ===========================================================================================
 * ===========================================================================================
 * =========================================================================================== */
// [x]


var totalSections = 4;
var curSection = 1;

// [x]
//next button
$("#form-next").click(function (e) {
    e.preventDefault();
    
    if (validation.validate("#section" + curSection)) {
        if (curSection < totalSections) {
            curSection++;
        }
    } 
    updateSections();
    $("html, body").animate({
        scrollTop: 0
    });
});
//[x]
//prev button
$("#form-prev").click(function (e) {
    e.preventDefault();
    if (curSection != 1) {
        curSection--;
        updateSections();
    }
    $("html, body").animate({
        scrollTop: 0
    });
});






//[x]
// updaate form section indicators and navigation buttons
var updateSections = function () {
    var newSectionId = "#form-progress-" + curSection + " .badge";
    $(newSectionId).addClass("visited");

    $("#form-validation-status").addClass("hidden");

    $(".form-section").each(function (i) {
        e = i + 1;
        
        if ($(this).hasClass("invalid")) {
            $("#form-progress-" + e + " .badge").addClass("error");
            $("#form-validation-status").removeClass("hidden");
        } else {
            $("#form-progress-" + e + " .badge").removeClass("error");
        }
    });

    if (curSection == 1) {
        $("#form-prev").hide();
    } else {
        $("#form-prev").show();
    }
    if (curSection == 4) {
        $("#form-next").hide();
    } else {
        $("#form-next").show();
    }
    $(".form-section").addClass("hidden");
    $("#section" + curSection).removeClass("hidden");
    $(".form-progress .badge").removeClass("current");
    $("#form-progress-" + curSection + " .badge").addClass("current");
}

// [x]
// go to section
$(".form-progress .badge").click(function (e) {
    e.preventDefault();
    if ($(this).hasClass("visited")) {
        if (validation.validate("#section" + curSection)) {
            if (curSection < totalSections) {
                curSection++;
            }
            curSection = $(this).text();
        } 
        updateSections();
    }
});




/** =======  end 2  ========================================================================
 * ===========================================================================================
 * ===========================================================================================
 *  * ===========================================================================================
 * ===========================================================================================
 *  * ===========================================================================================
 * ===========================================================================================
 *  * ===========================================================================================
 * ===========================================================================================
 *  * ===========================================================================================
 * ===========================================================================================
 *  * ===========================================================================================
 * ===========================================================================================
 * =========================================================================================== */


/*******************************************************************************                                                                                                                ***
 * FORM VALIDATION
 *******************************************************************************/
var validation = {};

/**
 * Validation for multiple section forms
 * @param String - comma separated string of html ids for sections to be checked. 
 */
validation.validate = function (elementIds) {
    var ids = elementIds.split(',');
    var valid = true;
    var sectionValid = true;
    ids.forEach(function (id) {
        if (!validation.validateInput(id)) { //inputs
            sectionValid = false;
        }
        if (!validation.validateTextarea(id)) { //textarea
            sectionValid = false;
        }
        if (!validation.validateRadio(id)) { //radios
            sectionValid = false;
        }
        if (!validation.validateProducts(id)) { //at least 1 product
            sectionValid = false;
        }

        if (!sectionValid) {
            $(id).addClass("invalid");
            valid = false;
        } else {
            $(id).removeClass("invalid");
        }

    });
    return valid;
};

validation.validateInput = function(id){
    var inputValid = true;
    $(id + ' input').each(function () {
        if ($(this).attr('required')) {
            if ($(this).val() == '') {
                $(this).parent().addClass('has-error');
                inputValid = false;
            } else {
                $(this).parent().removeClass('has-error');
            }
        }
    });
    return inputValid;
};

validation.validateTextarea = function(id){
    var textValid = true;
    $(id + ' textarea').each(function () {
        if ($(this).attr('required')) {
            if ($(this).val() == '') {
                $(this).parent().addClass('has-error');
                textValid = false;
            } else {
                $(this).parent().removeClass('has-error');
            }
        }
    });
    return textValid;
};


//validate groups of radio buttons for a given section
validation.validateRadio = function (id) {
    var radios = [];
    var radiosValid = true;
    $(id + " input:radio").each(function () {
        if ($.inArray($(this).attr('name'), radios) < 0) {
            radios.push($(this).attr('name'));
        }
    });
    radios.forEach(function (r) {
        var checked = false;
        $("input[name=" + r + "]").each(function () {
            if ($(this).prop('checked')) {
                checked = true;
            }
        });
        if (!checked) {
            $("#" + r).addClass("has-error");
            radiosValid = false;
        } else {
            $("#" + r).removeClass("has-error");
        }
    });
    return radiosValid;
}

validation.validateProducts = function (id) {
    if ($(id).has('#selectedProducts').length > 0) {
        if (selectedProducts.length > 0) {
            return true;
        } else {
            $("#selectedProducts .hide-active").addClass("text-danger");
            $("#selectedProducts .hide-active").css("font-size", "18px");
            return false;
        }
    } else {
        return true;
    }
};






/** =======  end validation  ========================================================================
 * ===========================================================================================
 * ===========================================================================================
 *  * ===========================================================================================
 * ===========================================================================================
 *  * ===========================================================================================
 * ===========================================================================================
 *  * ===========================================================================================
 * ===========================================================================================
 *  * ===========================================================================================
 * ===========================================================================================
 *  * ===========================================================================================
 * ===========================================================================================
 * =========================================================================================== */
    

    // //next button
    // $("#form-next").click(function () {
    //     if (validation.validateSection()) {
    //         if (curSection < totalSections) {
    //             curSection++;
    //             updateSections();
    //         }
    //     }
    // });

    //prev button
    // $("#form-prev").click(function () {
    //     if (curSection != 1) {
    //         curSection--;
    //         updateSections();
    //     }
    // });

    //submit form if valid
    // $(".submit").click(function () {
    //     if (validation.validate()) {
    //         $("#productRequest").submit();
    //     }
    // });

    // go to section
    // $(".form-progress .badge").click(function () {
    //     curSection = $(this).text();
    //     updateSections();
    // });

    //validation object
    //var validation = {};
    //validate all sections
    // validation.validate = function () {
    //     var valid = true;
    //     for (i = 1; i <= 4; i++) {
    //         curSection = i;
    //         if (!validation.validateSection()) {
    //             valid = false;
    //         }
    //     }
    //     if (!valid) {
    //         $("#form-validation-status").removeClass("hidden");
    //     }
    //     return valid;
    // };

    //validate 1 section / page
    // validation.validateSection = function () {
    //     var sectionId = "#section" + curSection;
    //     var progressId = "#form-progress-" + curSection;
    //     var valid = true;
    //     $(sectionId + ' input').each(function () {
    //         if ($(this).attr('required')) {
    //             if ($(this).val() == '') {
    //                 $(this).parent().addClass('has-error');
    //                 valid = false;
    //             } else {
    //                 $(this).parent().removeClass('has-error');
    //             }
    //         }
    //     });
    //     //check radios
    //     if (!validation.validateRadio()) {
    //         valid = false;
    //     }
    //     if (valid) {
    //         $(progressId + " .badge").removeClass("error");
    //         $(progressId + " .badge").addClass("success");
    //         $("#form-validation-status").addClass("hidden");
    //     } else {
    //         $(progressId + " .badge").addClass("error");
    //         $(progressId + " .badge").removeClass("success");
    //         $("#form-validation-status").removeClass("hidden");
    //     }
    //     return valid;
    // }

    //validate groups of radio buttons for a given section
    // validation.validateRadio = function () {
    //     var radios = [];
    //     var radiosValid = true;
    //     $("#section" + curSection + " input:radio").each(function () {
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
    //             //also check if it's hidden
    //             $("#" + r).addClass("has-error");
    //             radiosValid = false;
    //         } else {
    //             $("#" + r).removeClass("has-error");
    //         }
    //     });
    //     return radiosValid;
    // }

    // update form section indicators/buttons
    // var updateSections = function () {
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
    // $("input[name$='ForeignDisclosure']").click(function () {
    //     if ($(this).val() == "StandaloneForeignNationals" || $(this).val() == "EmbeddedForeignNationals") {
    //         $('#foreignInformation').show();
    //     } else {
    //         $('#foreignInformation').hide();
    //     }
    // });
    // $("button[name='requestButton']").click(function () {
    //     var id = $(this).val();
    //     var name = $('#name' + id).text();
    //     var classification = $('#classification' + id).text();
    //     var distributionLevel = $('#distribution' + id).text();
    //     var description = $('#description' + id).text();
    //     var number = $('#versionInfo' + id).val();
    //     var desc = $('#versionDesc' + id).text();
    //     var releaseDate = $('#versionReleaseDate' + id).text();
    //     var version = {
    //         "number": number,
    //         "desc": desc,
    //         "releaseDate": releaseDate,
    //         "active": "true"
    //     };
    //     var product = {
    //         "version": version,
    //         "name": name,
    //         "description": description,
    //         "distributionLevel": distributionLevel,
    //         "classification": classification,
    //         "id": id
    //     };
    //     selectedProducts.push(product);
    // });
    $("#mailPref").change(function () {
        var selectedMailPref = $("input:radio[name='MailingPreference']:checked").val();
        if (selectedMailPref != "AMRDEC" && selectedMailPref != "Email") {
            $("#mediaPref").toggleClass("hidden", false);
        } else {
            $("#mediaPref").toggleClass("hidden", true);
        }
    });
    $('span').each(function () {
        var text = $(this).text();
        if ($(this).text() == "Unclassified") {
            $(this).toggleClass('label-success');
        } else if ($(this).text() == "Confidential") {
            $(this).toggleClass('label-warning');
        } else if ($(this).text() == "Secret") {
            $(this).toggleClass('label-danger');
        }
    });


});