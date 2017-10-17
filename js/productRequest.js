var selectedProducts = [];
$(document).ready(function(){
        controls.productRequest();
  //init
        $("#section2").addClass("hidden");
        $("#section3").addClass("hidden");
        $("#section4").addClass("hidden");
        $("#form-prev").hide();
        var totalSections = 4;
        var curSection = 1;
        $("#form-progress-1 .badge").addClass("current");

        //next button
        $("#form-next").click(function () {
            if (validation.validateSection()) {
                if (curSection < totalSections) {
                    curSection++;
                    updateSections();
                }
            }
        });

        //prev button
        $("#form-prev").click(function () {
            if (curSection != 1) {
                curSection--;
                updateSections();
            }
        });

        //submit form if valid
        $(".submit").click(function () {
            if (validation.validate()) {
                $( "#productRequest" ).submit();
            }
        });

        // go to section
        $(".form-progress .badge").click(function () {
            curSection = $(this).text();
            updateSections();
        });

        //validation object
        var validation = {};
        //validate all sections
        validation.validate = function () {
            var valid = true;
            for (i = 1; i <= 4; i++) {
                curSection = i;
                if (!validation.validateSection()) {
                    valid = false;
                }
            }
            if (!valid) {
                $("#form-validation-status").removeClass("hidden");
            }
            return valid;
        };

        //validate 1 section / page
        validation.validateSection = function () {
            var sectionId = "#section" + curSection;
            var progressId = "#form-progress-" + curSection;
            var valid = true;
            $(sectionId + ' input').each(function () {
                if ($(this).attr('required')) {
                    if ($(this).val() == '') {
                        $(this).parent().addClass('has-error');
                        valid = false;
                    } else {
                        $(this).parent().removeClass('has-error');
                    }
                }
            });
            //check radios
            if (!validation.validateRadio()) {
                valid = false;
            }
            if (valid) {
                $(progressId + " .badge").removeClass("error");
                $(progressId + " .badge").addClass("success");
                $("#form-validation-status").addClass("hidden");
            } else {
                $(progressId + " .badge").addClass("error");
                $(progressId + " .badge").removeClass("success");
                $("#form-validation-status").removeClass("hidden");
            }
            return valid;
        }

        //validate groups of radio buttons for a given section
        validation.validateRadio = function () {
            var radios = [];
            var radiosValid = true;
            $("#section" + curSection + " input:radio").each(function () {
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
                	//also check if it's hidden
                    $("#" + r).addClass("has-error");
                    radiosValid = false;
                } else {
                    $("#" + r).removeClass("has-error");
                }
            });
            return radiosValid;
        }

        // update form section indicators/buttons
        var updateSections = function () {
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
        $("input[name$='ForeignDisclosure']").click(function() {
            if ($(this).val() == "StandaloneForeignNationals" || $(this).val() == "EmbeddedForeignNationals") {
                $('#foreignInformation').show();
            }
            else {
                $('#foreignInformation').hide();
            }
        });
        $("button[name='requestButton']").click(function(){
            var id = $(this).val();
            var name = $('#name' + id).text();
            var classification = $('#classification' + id).text();
            var distributionLevel = $('#distribution' + id).text();
            var description = $('#description'+ id).text();
            var number = $('#versionInfo' + id).val();
            var desc = $('#versionDesc' + id).text();
            var releaseDate = $('#versionReleaseDate' + id).text();
            var version = {"number":number, "desc":desc, "releaseDate":releaseDate, "active":"true"};
            var product = {"version":version, "name":name, "description":description, "distributionLevel":distributionLevel, "classification":classification, "id":id};
            selectedProducts.push(product);
        });
        $("#mailPref").change(function() {
            var selectedMailPref = $("input:radio[name='MailingPreference']:checked").val();
            if (selectedMailPref!="AMRDEC" && selectedMailPref!="Email") {
                $("#mediaPref").toggleClass("hidden", false);
            } else {
                $("#mediaPref").toggleClass("hidden", true);
            }
        });
        $('span').each(function() {
           var text = $(this).text();
           if ($(this).text() == "Unclassified") {
                $(this).toggleClass('label-success');
           }
           else if ($(this).text() == "Confidential") {
                $(this).toggleClass('label-warning');
           }
           else if ($(this).text() == "Secret") {
                $(this).toggleClass('label-danger');
           }
        });


    });

