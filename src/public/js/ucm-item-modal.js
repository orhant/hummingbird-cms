cmsCore.initUcmElementModal = function (elementId) {
    var $ = _$,
        frame = $('#' + elementId + '-frame'),
        input = $('#' + elementId),
        container = $('#' + elementId + '-container'),
        list = $('#' + elementId + '-list'),
        multiple = input.prop('multiple'),
        appendItem = function (id, title) {
            $(container.find('[type="template/ucm-item"]').text())
                .appendTo(list).attr('data-sort-id', id).find('.title').text(title);
        };

    var updateValue = function () {
        var opt;
        input.empty();
        list.find('[data-sort-id]').each(function () {
            opt = document.createElement('option');
            opt.value = $(this).attr('data-sort-id');
            opt.selected = true;
            input.append(opt);
        });

        input.trigger('change');
    };

    frame.attr('src', frame.attr('data-src'));
    frame.on('load', function () {
        var mQ = this.contentWindow._$,
            contents = mQ(this.contentDocument);
        contents.on('click', '[data-sort-id] a', function (e) {
            e.preventDefault();
            var a = mQ(this),
                p = a.parent('[data-sort-id]'),
                title = mQ.trim(p.attr('data-title'));

            if (multiple) {
                if (!list.find('[data-sort-id="' + p.attr('data-sort-id') + '"]').length) {
                    UIkit.notification(cmsCore.language._('item-added-success', {title: title}), {status: 'success'});
                    appendItem(p.attr('data-sort-id'), title);
                }

                updateValue();

            } else {
                list.empty();
                appendItem(p.attr('data-sort-id'), title);
                updateValue();
                UIkit.modal('#' + elementId + '-modal').hide();
            }
        });
    });

    list.on('click', 'a.remove', function (e) {
        e.preventDefault();
        $(this).parent('.list-item').remove();
        updateValue();
    });
};