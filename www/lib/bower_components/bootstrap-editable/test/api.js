$(function () {         
  
   $.support.transition = false;
   var fx = $('#async-fixture');
    
   module("api");
      
     test("validate, getValue, mark as saved", function () {
        var e = $(
          '<a href="#" data-type="text" id="username">user</a>' + 
          '<a href="#" data-type="textarea" id="comment">12345</a>' + 
          '<a href="#" data-type="select" id="sex" data-value="1" data-source=\'{"1":"q", "2":"w"}\'>q</a>' + 
          '<a href="#" data-type="date" id="dob">12345</a>'
         ).appendTo('#qunit-fixture');
        
        e = $('#qunit-fixture').find('a').editable({
           validate: {
                 username: function(value) {
                     if($.trim(value) !== 'user1') return 'username is required';
                 },
                 sex: function(value) {
                     if($.trim(value) != 2) return 'error';
                 }
             }
        });
        
        //check get value
        var values = e.editable('getValue');

        equal(values.username, 'user', 'username ok') ;
        equal(values.comment, '12345', 'comment ok') ;
        equal(values.sex, 1, 'sex ok') ;
        equal(values.dob, '12345', 'dob ok') ;
        
        //validate
        var errors = e.editable('validate'); 
        ok(errors.username && errors.sex && !errors.comment, 'validation failed ok');
        
        //enter correct values
        var e2 = $('#username');
        e2.click();
        var p = e2.data('popover').$tip;
        p.find('input').val('user1');
        p.find('button.btn-primary').click(); 
        ok(!p.is(':visible'), 'username changed');         
        
        e2 = $('#sex');
        e2.click();
        p = e2.data('popover').$tip;
        p.find('select').val(2);
        p.find('button.btn-primary').click(); 
        ok(!p.is(':visible'), 'sex changed');         
        
        //validate again
        var errors = e.editable('validate'); 
        ok($.isEmptyObject(errors), 'validation ok');  
        
        equal(e.filter('.editable-changed').length, 2, 'editable-changed exist');
        e.editable('markAsSaved');      
        ok(!e.filter('.editable-changed').length, 'editable-changed not exist');
    });
    
    test("getValue with originally empty elements", function () {
        var e = $(
          '<a href="#" data-type="text" id="username"></a>' + 
          '<a href="#" data-type="textarea" id="comment"></a>' + 
          '<a href="#" data-type="select" id="sex" data-source=\'{"1":"q", "2":"w"}\'></a>' + 
          '<a href="#" data-type="date" id="dob"></a>'
         ).appendTo('#qunit-fixture');
        
        $('#qunit-fixture').find('a').editable();
        
        //check get value
        var values = e.editable('getValue');

        equal(values.username, '', 'text empyt value') ;
        equal(values.comment, '', 'textarea empty value') ;
        ok(!('sex' in values), 'select value not present') ;
        ok(!('dob' in values), 'date value not present') ;
     });    
     
      asyncTest("'update' event", function () {
        expect(2);
        var e = $('<a href="#" data-pk="1" data-url="post.php" data-name="text1">abc</a>').appendTo(fx).editable(),
            e_nopk = $('<a href="#" data-url="post.php" data-name="text1">abc</a>').appendTo(fx).editable(),
            newVal = 'xyt';
        
        e.on('update', function() {
             equal($(this).data('editable').value, newVal, 'triggered update after submit');
        });

        e_nopk.on('update', function() {
             equal($(this).data('editable').value, newVal, 'triggered update after no-submit');
        });

        e_nopk.click();
        var p = e_nopk.data('popover').$tip;
        p.find('input').val(newVal);
        p.find('form').submit();        
                              
        e.click();
        p = e.data('popover').$tip;
        p.find('input').val(newVal);
        p.find('form').submit();
                
        setTimeout(function() {
           e.remove();    
           e_nopk.remove();    
           start();  
        }, timeout);                     
      });     
      
     test("'init' event", function () {
        expect(1);
        var e = $('<a href="#" data-pk="1" data-url="post.php" data-name="text1">abc</a>').appendTo('#qunit-fixture');
        
        e.on('init', function(e, editable) {
             equal(editable.value, 'abc', 'init triggered, value correct');
        });

        e.editable();
      });      
      
     asyncTest("'render' event for text", function () {
        expect(4);
        var val = 'afas',
            e = $('<a href="#" data-pk="1" data-type="text" data-url="post.php" data-name="text1">'+val+'</a>').appendTo(fx),
            isInit = true;
        
        e.on('render', function(e, editable) {
             equal(e.isInit, isInit, 'isInit flag correct');
             equal(editable.value, val, 'init triggered, value correct');
        });

        e.editable();   
        
        isInit = false;
        val = '123';
        
        e.click();
        var p = e.data('popover').$tip;
        p.find('input[type=text]').val(val);
        p.find('form').submit(); 
        
        setTimeout(function() {
           e.remove();    
           start();  
        }, timeout);                     
        
     });    
     
    asyncTest("'render' event for select", function () {
        expect(4);
        var val = '1',
            e = $('<a href="#" data-pk="1" data-type="select" data-url="post.php" data-name="text1" data-value="'+val+'"></a>').appendTo(fx),
            isInit = true;
        
        e.on('render', function(e, editable) {
             equal(e.isInit, isInit, 'isInit flag correct');
             equal(editable.value, val, 'init triggered, value correct');
        });

        e.editable({
            source: 'groups.php',
            autotext: 'always'
        });
        
        setTimeout(function() {
            isInit = false;
            val = '3';
            
            e.click();
            var p = e.data('popover').$tip;
            p.find('select').val(val);
            p.find('form').submit(); 
            
            setTimeout(function() {
               e.remove();    
               start();  
            }, timeout);  
        }, timeout);                                        
        
     });           
    
     asyncTest("'shown' / 'hidden' events", function () {
        expect(3);
        var val = '1',
            e = $('<a href="#" data-pk="1" data-type="select" data-url="post.php" data-name="text1" data-value="'+val+'"></a>').appendTo(fx);
        
        e.on('shown', function(event, editable) {
             var p = $(this).data('popover').$tip;
             ok(p.is(':visible'), 'popover shown');  
             equal(editable.value, val, 'show triggered, value correct');
        });
        
        e.on('hidden', function(event, editable) {
             var p = $(this).data('popover').$tip;
             ok(!p.is(':visible'), 'popover hidden'); 
        });        
        
        e.editable({
            source: 'groups.php',
        });
        
        e.click();
        
        setTimeout(function() {
             var p = e.data('popover').$tip;
             p.find('button[type=button]').click(); 
             
             e.remove();    
             start();  
        }, timeout);                                        
        
     });     
    
     test("show / hide methods", function () {
        var e = $('<a href="#" data-pk="1" data-url="post.php" data-name="text1">abc</a>').appendTo('#qunit-fixture').editable();
        e.editable('show');
        var p = e.data('popover').$tip;
        ok(p.is(':visible'), 'popover shown');
        e.editable('hide');
        ok(!p.is(':visible'), 'popover closed');
     });      
     
     test("option method", function () {
        var e = $('<a href="#" data-url="post.php" data-name="text">abc</a>').appendTo('#qunit-fixture').editable(),
            e1 = $('<a href="#" data-pk="1" data-name="text1">abc</a>').appendTo('#qunit-fixture').editable(),
            url = 'abc';
            
        $('#qunit-fixture a').editable('option', 'pk', 2);
            
        equal(e.data('editable').settings.pk, 2, 'pk set correctly');
        equal(e1.data('editable').settings.pk, 2, 'pk2 set correctly');
        
        $('#qunit-fixture a').editable('option', {url: url});
        equal(e.data('editable').settings.url, url, 'url set correctly');
        equal(e1.data('editable').settings.url, url, 'url2 set correctly');        
     });    
     
      asyncTest("'submit' method: client and server validation", function () {
        expect(6);  
        var ev1 = 'ev1',
            ev2 = 'ev2',
            e1v = 'e1v',
            e = $('<a href="#" class="new" data-type="text" data-url="post.php" data-name="text">'+ev1+'</a>').appendTo(fx).editable({
                validate: function(value) {
                    if(value == ev1) return 'invalid';
                }
            }),
            e1 = $('<a href="#" class="new" data-type="text" data-name="text1">'+e1v+'</a>').appendTo(fx).editable();

        $.mockjax({
            url: 'new-error.php',
            response: function(settings) {
                equal(settings.data.text, ev2, 'first value ok');
                equal(settings.data.text1, e1v, 'second value ok');
                equal(settings.data.a, 123, 'custom data ok');
                this.responseText = {errors: {
                    text1: 'server-invalid'
                  }
                };  
            }
        });
 
        $(fx).find('.new').editable('submit', {
            url: 'new.php',
            error: function(data) {
               ok(data.errors, 'errors defined');
               equal(data.errors.text, 'invalid', 'client validation error ok');
            }
        });
       
        //change value to pass client side validation
        e.click();
        var p = e.data('popover').$tip;
        p.find('input[type=text]').val(ev2);
        p.find('button[type=submit]').click(); 
       
        $(fx).find('.new').editable('submit', {
            url: 'new-error.php',
            data: {a: 123},
            error: function(data) {
                equal(data.errors.text1, 'server-invalid', 'server validation error ok');
                
                e.remove();
                e1.remove();
                start(); 
            }            
        });       
       
     });                  
        
        
     asyncTest("'submit' method: server error", function () {
       expect(2);  
        var ev1 = 'ev1',
            e1v = 'e1v',
            e = $('<a href="#" class="new" data-type="text" data-url="post.php" data-name="text">'+ev1+'</a>').appendTo(fx).editable(),
            e1 = $('<a href="#" class="new" data-type="text" data-name="text1">'+e1v+'</a>').appendTo(fx).editable();

       $(fx).find('.new').editable('submit', {
            url: 'error.php',
            error: function(data) {
                ok(!data.errors, 'no client errors');
                equal(data.responseText, 'customtext', 'server error ok');
                
                e.remove();
                e1.remove();
                start();                 
            }
        });
        
     });       
     
     asyncTest("'submit' method: success", function () {
       expect(7);  
        var ev1 = 'ev1',
            e1v = 'e1v',
            pk = 123,
            e = $('<a href="#" class="new" data-type="text" data-url="post.php" data-name="text">'+ev1+'</a>').appendTo(fx).editable(),
            e1 = $('<a href="#" class="new" data-type="text" data-name="text1">'+e1v+'</a>').appendTo(fx).editable();

        $.mockjax({
            url: 'new-success.php',
            response: function(settings) {
                equal(settings.data.text, ev1, 'first value ok');
                equal(settings.data.text1, e1v, 'second value ok');
                this.responseText = {id: pk};  
            }
        });            
            
       $(fx).find('.new').editable('submit', {
            url: 'new-success.php',
            success: function(data) {
                equal(e.data('editable').settings.pk, pk, 'pk1 ok'); 
                ok(!e.hasClass('editable-changed'), 'no "editable-changed" class'); 
                
                equal(e1.data('editable').settings.pk, pk, 'pk2 ok'); 
                ok(!e1.hasClass('editable-changed'), 'no "editable-changed" class'); 
                
                equal(data.id, pk, 'server result id ok');
                
                e.remove();
                e1.remove();
                start();                 
            }
        });
        
     });                          
  
});            