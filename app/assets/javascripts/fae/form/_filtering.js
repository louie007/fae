/* global Fae, fae_chosen, fileinputer, FCH, Cookies */

/**
 * Fae Filtering, Sorting and Paging
 * @namespace form.filtering
 * @memberof form
 */
Fae.form.filtering = {

  init: function() {
    this.$filter_form = $('.js-filter-form');
    this.$pagination = $('.pagination');

    // init only on pages with filering, sorting or paging
    if (this.$filter_form.length || this.$pagination.length || $('.js-sort-column').length) {
      // this.setFilterDropDowns();
      // this.applyCookies();
      this.fry = new Fryr(this._refresh_table);

      this.filterFormListeners();
    }
  },

  _refresh_table: function() {
    // hardcode _this because this === Fryr object
    var _this = Fae.form.filtering;
    var post_url = _this.$filter_form.attr('action');

    // if (!$.isEmptyObject(this.params)) {
      $.post(post_url, this.params, function(data){
        _this.$filter_form.next('table').replaceWith( $(data).find('table').first() );
        _this.$pagination.html( $(data).find('.pagination').first().html() );

        Fae.tables.columnSorting();
        Fae.tables.rowSorting();
        Fae.tables.sortColumnsFromCookies();
        Fae.navigation.lockFooter();
      });
    // }
  },

  filterFormListeners: function() {
    var _this = this;

    this.$filter_form
      .on('submit', function(ev) {
        ev.preventDefault();
        _this.fry.update('search', $('#filter_search').val());
      })
      // Reset filter button
      .on('click', '.js-reset-btn', function(ev) {
        // TODO: reset button logic
        // ev.preventDefault();

        // var $form = $(this).closest('form');

        // $form.get(0).reset();
        // $form.find('select').val('').trigger('chosen:updated');
        // // reset hashies
        // window.location.hash = '';

        // // Spoof form submission
        // $form.submit();

        // $(this).hide();
      })

      .on('click', '.table-filter-keyword-wrapper i', function() {
        _this.fry.update('search', $('#filter_search').val());
      })

      .on('change', 'select', function() {
        // Update hash when filter dropdowns changed
        var key = $(this).attr('id').split('filter_')[1];
        var value = $(this).val();
        _this.fry.update(key, value);

        // TODO: reset button logic
        // $('.js-reset-btn').show();
      });
  },





  setFilterDropDowns: function() {
    var cookie_name = this.$filter_form.attr('data-cookie-key');
    Cookies.set(cookie_name, params);

    // Exit early if params is blank
    if ($.isEmptyObject(params)) {
      return;
    }

    // Loop through all available params to find the select menu and the proper option
    $.each(params, function(key, value) {
      var $select = $('.js-filter-form .table-filter-group #filter_' + key);

      if($select.length) {
        var $option = $select.find('option[value="' + value + '"]');

        // Ensure we find the option and that it isn't already chosen
        if($option.length && $option.prop('selected') !== 'selected') {
          $option.prop('selected', 'selected');
          $select.trigger('chosen:updated');
        }
      }
    });
  },

  /**
   * If cookies are available, load them into the hash
   */
  applyCookies: function() {
    var cookie_key = $('.js-filter-form').attr('data-cookie-key');

    if (cookie_key) {
      var cookie = Cookies.getJSON(cookie_key);

      if (!$.isEmptyObject(cookie)) {
        var keys = Object.keys(cookie)
        var hash = '?';

        for(var i = 0; i < keys.length; i++) {
          if (hash !== '?') {
            hash += '&';
          }
          hash += keys[i] + '=' + cookie[keys[i]];
        }

        if (hash !== '?') {
          window.location.hash = hash;
        }
      }
    }
  },

};
