_$.ready(function ($) {
    var container = $('.tpl-tree-container'),
        editor = $('#Template-files--file').data('editor'),
        modal = $('#file-modal'),
        ajaxUrl = function (action) {
            return $hb.uri.base + '/template/' + action + '/' + $('#Template-id').val();
        };
    editor.setSize('100%', 'calc(100vh - 72px)');
    editor.setOption('theme', 'dracula');
    container.on('click', 'a[data-type]', function (e) {
        e.preventDefault();
        var a = $(this);
        UIkit.notification('<span uk-spinner></span> ' + $hb.language._('please-wait-msg'));
        $.http.post(
            ajaxUrl('handle'),
            {
                type: a.data('type'),
                source: a.data('source') || '',
                task: 'load',
            },
            function (response) {
                UIkit.notification.closeAll();
                if (response.success) {
                    if (a.data('type') === 'file') {
                        modal.data('file', a.data('source'));
                        modal.data('contents', response.data);
                        UIkit.modal('#file-modal').show();
                    } else {
                        container.html($(response.data).html());
                    }
                } else {
                    UIkit.notification(response.message, {status: 'warning'});
                }
            }
        );
    });

    modal.on('shown', function () {
        editor.setValue(modal.data('contents'));
        editor.focus();
        editor.setCursor(editor.lineCount(), 0);
    });

    modal.find('.btn-save').on('click', function () {
        UIkit.notification('<span uk-spinner></span> ' + $hb.language._('please-wait-msg'));
        $.http.post(
            ajaxUrl('file'),
            {
                file: modal.data('file'),
                contents: editor.getValue(),
            },
            function (response) {
                UIkit.notification.closeAll();
                UIkit.notification(response.message, {status: response.success ? 'success' : 'warning'});
            }
        );
    });

    container.on('click', '.btn-remove', function (e) {
        e.preventDefault();
        var a = $(this).parent('.uk-grid').find('a[data-type]'),
            placeholders = {};
        placeholders[a.data('type')] = a.data('name');
        UIkit.modal.confirm($hb.language._('remove-' + a.data('type') + '-confirm-msg', placeholders))
            .then(
                function () {
                    UIkit.notification('<span uk-spinner></span> ' + $hb.language._('please-wait-msg'));
                    $.http.post(
                        ajaxUrl('handle'),
                        {
                            type: a.data('type'),
                            source: a.data('source') || '',
                            task: 'remove',
                        },
                        function (response) {
                            UIkit.notification.closeAll();

                            if (response.success) {
                                container.html($(response.data).html());
                            } else {
                                UIkit.notification(response.message, {status: 'warning'});
                            }
                        }
                    );
                },
                function () {
                }
            );
    });

    container.on('click', '.btn-rename', function (e) {
        e.preventDefault();
        var a = $(this).parent('.uk-grid').find('a[data-type]');
        UIkit.modal.prompt($hb.language._('name') + ': ' + a.data('name'), a.data('name')).then(function (name) {
            name = $.trim(name || '');

            if (name.length && name !== a.data('name')) {
                UIkit.notification('<span uk-spinner></span> ' + $hb.language._('please-wait-msg'));
                $.http.post(
                    ajaxUrl('rename'),
                    {
                        source: a.data('source'),
                        name: name,
                    },
                    function (response) {
                        UIkit.notification.closeAll();
                        container.html($(response.data).html());
                    }
                );
            }
        });
    });

    container.on('click', '.toggle a', function (e) {
        e.preventDefault();
        var name = $.trim($(this).next().val());

        if (name.length) {
            UIkit.notification('<span uk-spinner></span> ' + $hb.language._('please-wait-msg'));
            $.http.post(
                ajaxUrl('new-resource'),
                {
                    name: name,
                },
                function (response) {
                    UIkit.notification.closeAll();
                    container.html($(response.data).html());

                    if (name.match(/\.[a-z0-9]+$/gi)) {
                        modal.data('file', (container.find('[data-sub-dirs]').data('subDirs') || '') + '/' + name);
                        modal.data('contents', '');
                        UIkit.modal('#file-modal').show();
                    }
                }
            );
        }
    });
});