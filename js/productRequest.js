var selectedProducts = [];
$(document).ready(function () {
    //init
    $("#section2").addClass("hidden");
    $("#section3").addClass("hidden");
    $("#section4").addClass("hidden");
    $("#form-prev").hide();
    $("#form-progress-1 .badge").addClass("current");
    $('#foreignInformation').hide();
    $("input[name$='ForeignDisclosure']").click(function () {
        if ($(this).val() == "StandaloneForeignNationals" || $(this).val() == "EmbeddedForeignNationals") {
            $('#foreignInformation').show();
        } else {
            $('#foreignInformation').hide();
        }
    });
    // toggles add/remove-product from modal
    $("button[name='requestButton']").click(function () {
        if ($(this).hasClass("active")) {
            removeProduct($(this).val());
            $(this).removeClass("active");
        } else {
            addProduct($(this).val());
            $(this).addClass("active");
        }
    });
    // remove(x) buttons in the Selected Products listing
    $("#selectedProducts").on("click", ".selectedProduct span", function () {
        var id = $(this).attr("data-id");
        removeProduct(id);
    });
    $("#clear-products").click(function (e) {
        e.preventDefault();
        removeAllProducts();
    });
    // check that #productRequest form is valid, then submit
    $("#submit-form").click(function (e) {
        e.preventDefault();
        console.log("validate was called at all?");
        if (validation.validate("#section1, #section2, #section3, #section4")) {
            console.log("validate returned true");
            $("#productRequest").submit();
        } else {
            console.log("validate returned false");
            $("html, body").animate({
                scrollTop: 0
            });
        }
    });
    //add product with a given id
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
            '<span class="version">Version: <b>' + product.version.number + '</b>' +
            '<span data-id="' + product.id + '" class="glyphicon glyphicon-remove pull-right pointer" alt="remove product" title="remove product"></span>' +
            '</li>');
        selectedProducts.push(product);
        updateProducts();
    };
    // remove product with a given id
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
    /**
     * check if any products have been added and update css classes
     * Add selected products data to #hiddenProducts input
     */
    var updateProducts = function () {
        if (selectedProducts.length > 0) {
            $("#selectedProducts").addClass("active");
        } else {
            $("#selectedProducts").removeClass("active");
        }
        $('#hiddenProducts').val(JSON.stringify(selectedProducts));
    };
    // init form setions
    var totalSections = 4;
    var curSection = 1;
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
    validation.validateInput = function (id) {
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
    validation.validateTextarea = function (id) {
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
                if ($(this).prop('checked') || ! $(this).prop('required') ) {
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
    $("#mailPref").change(function () {
        var selectedMailPref = $("input:radio[name='MailingPreference']:checked").val();
        if (selectedMailPref != "AMRDEC" && selectedMailPref != "Email") {
            $("#mediaPref").toggleClass("hidden", false);
        } else {
            $("#mediaPref").toggleClass("hidden", true);
        }
    });


    $('span').each(function() {
        var text = $(this).text();
        if ($(this).text().indexOf("Unclassified") >= 0) {
             $(this).toggleClass('label-success');
        }
        else if ($(this).text().indexOf("Confidential") >= 0) {
             $(this).toggleClass('label-warning');
        }
        else if ($(this).text().indexOf("Secret") >= 0) {
             $(this).toggleClass('label-danger');
        }
     });

     /**
      * Hide and remove 'required' status of question 6, if mailing preference is 
      * set to AMRDEC or Email
      */
      $("#MailingPreference input").change(function(){
          var curVal = $("[name=MailingPreference]:checked").val();
          if(curVal == "AMRDEC" || curVal == "Email"){
            $("#MediaPreference input").removeAttr("required");
            $("#MediaPreference").hide();
          }
          else{
            $("#MediaPreference input").prop("required", true);
            $("#MediaPreference").show();
          }
      });

});