// Functions to enable click-to-edit fields
    function PreviewAndEditSection(element) {

        var element = element;
        var preview, edit, text_inputs, text_area;
        setup();

        function setup() {

            preview = element.querySelector('.preview');
            edit = element.querySelector('.edit');
            text_inputs = edit.querySelectorAll('input[type=text]');
            text_area = edit.querySelector('textarea');

           preview.addEventListener('click', previewClicked);
           preview.addEventListener('keyup', previewKeyedUp);

            if (text_inputs.length == 1) {
                text_inputs[0].addEventListener('blur', inputBlurred);
                text_inputs[0].addEventListener('keyup', enterKeyPressed);
            }

            if (text_area) {
                text_area.addEventListener('blur', inputBlurred);
            }


            var cancel = edit.querySelector('.cancel')
            if (cancel) {
                cancel.addEventListener('click', cancelClicked);
            }

            var save = edit.querySelector('.save')
            if (save) {
                save.addEventListener('click', saveAndPreview);
            }
        }

        function inputBlurred(event) {

            if (!edit.classList.contains('hidden') && !event.target.classList.contains('js-dependent')) {
                saveAndPreview(event);
            }
        }

        function cancelClicked(event) {

            showPreview();

            if (text_inputs[0]) {
                if (preview.classList.contains('empty')) {
                    text_inputs[0].value = '';
                } else {
                    text_inputs[0].value = preview.textContent;
                }
            }

            event.preventDefault()
        }

        function enterKeyPressed(event) {
            if (event.keyCode == 13) {
                saveAndPreview(event);
            }
        }

        function saveAndPreview(event) {

            /* TODO: MAKE CALL TO SAVE THE UPDATED FIELD */
            if (text_inputs[0]) {
                var value = text_inputs[0].value.trim();
                if (value == '') {
                    preview.classList.add('empty');
                    preview.textContent = preview.getAttribute('data-empty-text');
                } else {
                    preview.textContent = value;
                    preview.classList.remove('empty');
                }
            }
            if (text_area) {
                var value = text_area.value.trim();
                if (value == '') {
                    preview.classList.add('empty');
                    preview.textContent = preview.getAttribute('data-empty-text');
                } else {
                    if (text_area.classList.contains('for-bullets')) {
                        preview.innerHTML = value.replace(/^\*\s/gm, "<li>").replace(/\n/g, '</li>');
                    } else if (text_area.classList.contains('for-paragraphs')) {
                        preview.innerHTML = value.replace(/\n/g, "<br>").replace(/\n/g, '</li>');
                    } else {
                        preview.innerHTML = value;
                    }
                    preview.classList.remove('empty');
                }
            }

            showPreview();
            event.preventDefault()
        }

        function previewKeyedUp(event) {
            if (event.keyCode == 13) {
                showEdit();
            }
        }

        function previewClicked(event) {
            showEdit();
        }

        function showEdit() {
            preview.classList.toggle('hidden');
            edit.classList.toggle('hidden');
            if (text_inputs[0]) {
                text_inputs[0].focus();
            }
            if (text_area) {
                text_area.focus();
            }
        }

        function showPreview() {
            edit.classList.add('hidden');
            preview.classList.remove('hidden');
        }
    }

    function setupAutosave() {

        var previewAndEditSections = document.querySelectorAll('.preview-and-edit');

        for (var i = 0; i < previewAndEditSections.length; i++) {
            new PreviewAndEditSection(previewAndEditSections[i]);
        }

    }

    document.addEventListener('DOMContentLoaded', setupAutosave);

// Function from original CMS form page for type-ahead select

    document.addEventListener('DOMContentLoaded', function() {

        var publisherFields = document.querySelectorAll('select.publisher');
        for (var i = 0; i < publisherFields.length; i++) {
            govukGovernmentOrganisationsAutocomplete({
                selectElement: publisherFields[i],
                showAllValues: false,
                minLength: 2,
                defaultValue: ''
            });
        }
    });

// Functions from original CMS form page for moving dimensions up and down

    function moveDimensionUp(event) {
        event.preventDefault();
        var row = $(event.currentTarget).parents('tr:first');
        if (row.prev().length > 0) {
            row.insertBefore(row.prev());
            syncDimensionOrder();
        }
    }

    function moveDimensionDown(event) {
        event.preventDefault();
        var row = $(event.currentTarget).parents('tr:last');
        if (row.next().length > 0) {
            row.insertAfter(row.next());
            syncDimensionOrder();
        }
    }

    function syncDimensionOrder() {
        var rows = $('tr.movable'),
            dimensions = [],
            guid;

        $(rows).each(function (index, row) {
            guid = $(row).data('dimension-guid');
            dimensions.push({"index": index, "guid": guid});
        });
        $.ajax({
            type: 'POST',
            url: set_dimension_order_post_url,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({"dimensions": dimensions})
        });
    }

    $(document).ready(function () {
        $('.move-up').click(moveDimensionUp);
        $('.move-down').click(moveDimensionDown);
    })

//# sourceMappingURL=cms_autosave.js.map
