(function ($) {
    window.addEventListener('load', function () {
        var listForm = $('#admin-list-form'),
            editForm = $('#admin-edit-form'),
            toolbars = $('.toolbars-container');

        if (listForm.length) {
            var filterFields = listForm.find('[name^="filters["]').not('[name="filters[search]"]'),
                limitBox = listForm.find('select[name="filters[limit]"]'),
                cid = listForm.find('input[type="checkbox"][name="cid[]"]');
            listForm.find('.check-all').on('change', function () {
                cid.prop('checked', this.checked);
            });

            toolbars.find('a.toolbar-delete, a.toolbar-trash, a.toolbar-copy, a.toolbar-unlock').on('click', function (e) {
                e.preventDefault();
                const a = $(this);

                if (listForm.find('input[type="checkbox"][name="cid[]"]:checked').length) {

                    const submitForm = function () {
                        listForm.attr('action', a.attr('href'));

                        if (a.hasClass('toolbar-trash')) {
                            listForm.find('[name="postAction"]').val('T');
                        }

                        listForm.submit();
                    };

                    if (a.hasClass('toolbar-delete')) {
                        UIkit.modal.confirm(cmsCore.language._('confirm-delete-items')).then(submitForm, function () {
                        });
                    } else {
                        submitForm();
                    }

                } else {
                    UIkit.notification(cmsCore.language._('select-items-first'), {status: 'warning'});
                }
            });

            toolbars.find('.toolbar-rebuild').on('click', function (e) {
                e.preventDefault();
                const action = $(this).attr('href');
                UIkit.modal.confirm(cmsCore.language._('confirm-rebuild-nested-msg')).then(
                    function () {
                        listForm.attr('action', action);
                        listForm.submit();
                    }, function () {
                    }
                );
            });

            if (filterFields.length) {
                filterFields.on('change', function () {
                    listForm.submit();
                });
            }

            if (limitBox.length) {
                limitBox.on('change', function () {
                    listForm.submit();
                });
            }

            listForm.find('a[data-sort]').on('click', function (e) {
                e.preventDefault();
                var sort = listForm.find('[name="_sort"]');

                if (sort.length) {
                    sort.remove();
                }

                listForm.append('<input type="hidden" name="_sort" value="' + $(this).attr('data-sort') + '"/>');
                listForm.submit();
            });

            listForm.find('a.reset-filter').on('click', function (e) {
                e.preventDefault();
                listForm.find('[name^="filters["]').val('');
                listForm.find('[name="postAction"]').val('resetFilter');
                listForm.submit();
            });

            listForm.find('.search-icon').on('click', function (e) {
                e.preventDefault();
                listForm.submit();
            });

            listForm.find('[name="filters[search]"]').on('keyup', function (e) {
                if (e.key === 'Enter') {
                    listForm.submit();
                }
            });

            listForm.find('.item-status a[data-state]').on('click', function (e) {
                e.preventDefault();
                const a = $(this);
                const p = a.parent();
                listForm.find('[name="postAction"]').val(a.attr('data-state'));
                listForm.find('[name="entityId"]').val(p.attr('data-entity-id'));
                listForm.attr('action', p.attr('data-uri'));
                listForm.submit();
            });

            listForm.find('.ucm-children-link').on('click', function (e) {
                e.preventDefault();
                listForm.find('[name="postAction"]').val('loadChildren');
                listForm.find('[name="entityId"]').val($(this).parent('[data-id]').attr('data-id'));
                listForm.submit();
            });

            var ordering = listForm.find('[data-column="ordering"]'),
                sortTable = listForm.find('table[data-sort-handle]');

            if (ordering.length
                && ordering.hasClass('sort-active')
                && sortTable.length
            ) {
                sortTable.on('change', 'input[name="ordering"]', function () {
                    var
                        ordering = parseInt(this.value),
                        id = $(this).parent('tr[data-sort-id]').attr('data-sort-id');

                    if (!isNaN(ordering) && ordering > 0) {
                        $.http.post(
                            $hb.uri.base + '/' + sortTable.attr('data-sort-handle'),
                            {
                                'id': id,
                                'ordering': ordering,
                            }
                        );
                    }
                });

                var dragulaCss = $hb.public('css/dragula.min.css'),
                    dragulaJs = $hb.public('js/dragula.min.js'),
                    handleOrdering = function () {
                        dragula(
                            [document.querySelector('#admin-list-form table > tbody')],
                            {
                                accepts: function (el, target, source, sibling) {
                                    if (!sibling) {
                                        sibling = el.previousElementSibling;
                                    }

                                    return sibling && el.getAttribute('data-sort-group') === sibling.getAttribute('data-sort-group');
                                },
                                invalid: function (el, handle) {
                                    return (el.classList.contains('uk-button') || el.tagName === 'A');
                                },
                            }
                        ).on('drop', function (el, target, source, sibling) {
                            var group = sortTable.find('tr[data-sort-group="' + el.getAttribute('data-sort-group') + '"]'),
                                direction = ordering.data('direction') === 'ASC' ? 'DESC' : 'ASC',
                                cid = [],
                                sortNumbers = [];
                            group.each(function () {
                                cid.push(this.getAttribute('data-sort-id'));
                                sortNumbers.push(parseInt(this.getAttribute('data-ordering')));
                            });
                            sortNumbers.sort(function (a, b) {
                                return direction === 'ASC' ? a - b : b - a;
                            }); 
                            $.http.post(
                                $hb.uri.base + '/' + sortTable.attr('data-sort-handle'),
                                {
                                    cid: cid,
                                    direction: direction,
                                },
                                function () {
                                    group.each(function (index) {
                                        if (typeof sortNumbers[index] !== 'undefined') {
                                            this.querySelector('input[name="ordering"]').value = sortNumbers[index];
                                        }
                                    });
                                }
                            );
                        });
                    };

                if (!$('head link[href="' + dragulaCss + '"]').length) {
                    $('<link rel="stylesheet" href="' + dragulaCss + '" type="text/css"/>').appendTo('head');
                }

                if (window.dragula) {
                    handleOrdering();
                } else {
                    var js = document.createElement('script');
                    js.src = dragulaJs;
                    js.onload = handleOrdering;
                    document.body.appendChild(js);
                }
            }
        }

        if (editForm.length) {
            toolbars.find('a.toolbar-save, a.toolbar-save2close').on('click', function (e) {
                e.preventDefault();
                console.log(editForm.find('input, select, text, textarea').validate())
                if (editForm.find('input, select, text, textarea').validate()) {
                    editForm.attr('action', $(this).attr('href'));
                    editForm.submit();
                }
            });
        }

        $(document).on('click', 'a.item-language-title', function (e) {
            e.preventDefault();
            const a = $(this);
            a.addClass('active').siblings('.item-language-title').removeClass('active');
            $('input[data-language="' + a.data('language') + '"]').removeClass('uk-hidden').siblings('[data-language]').addClass('uk-hidden');
        });

        $(document).on('change', 'input.item-language-input', function (e) {
            e.preventDefault();
            let el = $(this),
                dataLangTitle = {}, input;
            el.siblings('input.item-language-input').and(el).each(function () {
                input = $(this);
                dataLangTitle[input.attr('data-language')] = $.trim(input.val());
            });

            el.siblings('.item-language-input-value').val(JSON.stringify(dataLangTitle));
        });

        if (cmsCore.uri.isHome) {
            $('#admin-aside .home-dashboard').addClass('uk-text-primary');
        } else {
            var activeUri = '/' + $('#admin-aside nav[data-active-uri]').attr('data-active-uri');

            $('#admin-aside .uk-nav-sub a').each(function () {
                if (this.href && this.href.toString().indexOf(activeUri) !== -1) {
                    $(this).addClass('uk-text-primary')
                        .parent('.uk-parent').find('>a')
                        .addClass('uk-text-bold');
                }
            });
        }

        // Mini choices
        $('select').choices();
        $('[data-field-id][type="text"], [data-field-id][type="email"]').addClass('uk-input');
        $('textarea[data-field-id]').addClass('uk-textarea');
        $('[data-field-id][type="checkbox"]').addClass('uk-checkbox');
        $('[data-field-id][type="radio"]').addClass('uk-radio');
    });
})(_$);