/*  populateMenu.js
    This javascript file will load the menu data for dawg pizza from the
    menu.js file and use it to populate the menu page with items
*/


//this function will run on document load, and render all 3 categories of menu items
$( function(){

    //the first thing that happens when the document loads is that
    //we render the menu options; pizzas, drinks, and desserts
    renderPizza(com.dawgpizza.menu.pizzas);
    renderDrink(com.dawgpizza.menu.drinks);
    renderDessert(com.dawgpizza.menu.desserts);

    //next we create a cart object, which we will use to submit the order later
    var cart = {
        name: null,
        address1: null,
        address2: null,
        zip: null,
        phone: null,
        nextUrl: "http://students.washington.edu/edwarjm/info343/Homework4/index.html",
        items: [] //empty array
    }; //cart data

    //now we render the empty cart so that the subtotal/total/tax will have
    //0.00's listed.
    renderCart($('.cart-items-container'), cart);



    //this is the click handler for the add to cart buttons
    //this is the code that will add new items to the cart display
    //it creates a new cartItem object, pushes it into the larger
    //cart object that we're building to submit, and then calls the
    //function renderCart(cartContainer, cart) to render the cart objects
    $('.add-to-cart').click(function(){
        var cartContainer = $('.cart-items-container');
        var newCartItem = {
            type: this.getAttribute('data-type'),
            name: this.getAttribute('data-name'),
            size: this.getAttribute('data-size'),
            price: this.getAttribute('data-price')
        };
        cart.items.push(newCartItem);
        renderCart(cartContainer, cart);
    });


    //code to run when the user clicks the place order button on the main
    //order page.  it brings up a modal box which collects the name, address,
    //phone, etc, of the user.
    $('.place-order').click(function(){
        if( parseInt($('.cartStuff').find('.total-price').html()) < 20 || parseInt($('.cartStuff').find('.total-price').html()).length == 0){
            alert("We have a minimum order of $20 for delivery!");
        }else{
            $('.place-order-modal').modal();
            updateModalCart(cart);
        }
    }); //place-order click

    //this code clears out the cart contents in the modal dialog when
    //the modal window is closed.  this is to make sure that the current
    //cart is always displayed on the modal window.
    $('.place-order-modal').on('hidden.bs.modal', function () {
        $('.place-order-modal').find('.final-cart-container').empty();
    });


    //this is the code that runs when the ultimate submit button, displayed
    //on the modal window, is clicked.  it takes the users's name/address/etc
    //info, completes the cart object, and submits the order.
    //we also ensure that at least a first name has been given, an address has been
    //given, a zip code has been given, and a phone number has been given, before
    //the user is able to submit the order.

    $('.btn-submit').click(function(){

        //completing out overarching cart object
        cart.name = $('.order-form').find('input[name="first-name"]').val() + " " + $('.order-form').find('input[name="last-name"]').val();
        cart.address1 = $('.order-form').find('input[name="addr-1"]').val();
        cart.address2 = $('.order-form').find('input[name="addr-2"]').val();
        cart.zip = $('.order-form').find('input[name="zip"]').val();
        cart.phone = $('.order-form').find('input[name="phone"]').val();



        if(cart.address1.length == 0){
            alert("Please enter your address.");
            return false;
        }

        if($('.order-form').find('input[name="first-name"]').val().length == 0 || $('.order-form').find('input[name="last-name"]').val().length == 0 ){
            alert("Please enter your full name.");
            return false;
        }

        if(cart.zip.length == 0){
            alert("Please enter your zip code.");
            return false;
        }
        if(cart.phone.length == 0){
            alert("Please enter your phone number.");
            return false;
        }
        
        //the last step - we turn our cart into a JSON object and submit it to the proper
        //URL
        var json = JSON.stringify(cart);
        $('.submitme').find('input[name="cart"]').val(JSON.stringify(cart));
        $('.submitme').submit();
    });
 
    //this clears out the cart when the "clear cart" button is pressed
    $('.clear-cart').click(function(){
        cart.items.length = 0;;
        var cartContainer = $('.cart-items-container');
        renderCart(cartContainer, cart);

    });

    //this closes the modal window asking for the user's address/etc when
    //they click the cancel button
    $('.cancel-order').click(function(){
        $('.place-order-modal').modal('hide');
    });
        
        
}); 




//this function updates the cart shown on the modal window;
//the display serves as a confirmation, and allows the user
//to see what they are ordering as they are filling out their
//address
function updateModalCart(cart){
    var idx;
    var instance;
    var finalContainer = $('.final-cart-container');
    var template = $('.final-cart-template');
    var totalPrice = 0;
    finalContainer.hide();
    for(idx = 0; idx < cart.items.length; idx++ ){
        var item = cart.items[idx];
        instance = template.clone();
        totalPrice += parseInt(item.price);
        if(item.type == "pizza"){
            instance.find('.itemtext').html("("+item.size.charAt(0).toUpperCase() + item.size.slice(1) + ") " + item.name + " $" + parseInt(item.price).toFixed(2) );

        }else{
        instance.find('.itemtext').html(item.name + " $" + parseInt(item.price).toFixed(2) );

        }
        instance.removeClass('template');
        finalContainer.append(instance);
    }
    //add in the price information at the bottom
    instance=template.clone();
    instance.find('.itemtext').html("Subtotal: $" + totalPrice.toFixed(2));
    finalContainer.append(instance);

    instance=template.clone();
    instance.find('.itemtext').html("Tax: $" + (totalPrice * 0.095).toFixed(2));
    finalContainer.append(instance);

    instance=template.clone();
    instance.find('.itemtext').html("Total: $" + (totalPrice*1.095).toFixed(2));
    finalContainer.append(instance);
    finalContainer.fadeIn();
}



//this function renders the items in a given cart object
//in a given container.  the click handler for the remove item
//button is also contained in this function
function renderCart(container, cart){
    container.empty();
    var totalPrice = 0;
    var instance;
    var itemTemplate = $('.cart-item-template');
    var idx;
    var item;
    for(idx = 0; idx < cart.items.length; idx++){
        item = cart.items[idx];
        totalPrice = totalPrice +   parseInt(item.price);
        instance = itemTemplate.clone();
        if(item.type == "pizza"){
            instance.find('.title').html(item.name + " ("+item.size+")");
        }else{
            instance.find('.title').html(item.name);
        }


        instance.find('.price').html(parseInt(item.price).toFixed(2));
        instance.find('.remove-item').attr({'data-index': idx});
        instance.removeClass('cart-item-template');
        container.append(instance);

    }
    container.fadeIn();

    //add the price information
    var tax = parseInt(totalPrice) * 0.095;
    $('.cart-footer').find('.tax-amount').html(tax.toFixed(2));
    var finalPrice = parseInt(totalPrice) + tax;
    $('.cart-footer').find('.total-price').html(finalPrice.toFixed(2));


    //this is the click handler for when the remove item button
    //is clicked.  it removes the specified item from the cart
    //then rerenders the cart without that item
    $('.remove-item').click(function(){
        var idxToRemove = this.getAttribute('data-index');
        cart.items.splice(idxToRemove, 1);
        renderCart(container, cart);
    });

}


//this function will render all the pizza menu items
//because a pizza can be meat or vegetarian, the script
//will check which the current pizza is and load it into the
//appropriate box
function renderPizza(entries) {
    
    //our 2 templates
    var templateMeat = $('.template-meat');
    var templateVeggie = $('.template-vegetarian');

    //our 4 containers
    var meatPizza = $('.meatpizza');
    var veggiePizza = $('.veggiepizza');

    var instance;

    veggiePizza.hide();
    veggiePizza.empty();
    meatPizza.hide();
    meatPizza.empty();

    //for each pizza, figure out if it's meat or veggie, and then load it
    //into the appropriate template
    $.each(entries, function(){
        if(this.vegetarian){  //vegetarian pizza
            instance  = templateVeggie.clone();
            instance.find('.name').html(this.name);
            instance.find('.desc').html(this.description);

            instance.find('.priceSmall').html('Small - $' + this.prices[0]);
            instance.find('.priceMedium').html('Medium - $' + this.prices[1]);
            instance.find('.priceLarge').html('Large - $' + this.prices[2]);

            instance.find('.btn-small').attr({
                'data-type': "pizza",
                'data-size': "small",
                'data-name': this.name,
                'data-price': this.prices[0]
            });
            instance.find('.btn-medium').attr({
                'data-type': "pizza",
                'data-size': "medium",
                'data-name': this.name,
                'data-price': this.prices[1]
            });
            instance.find('.btn-large').attr({
                'data-type': "pizza",
                'data-size': "large",
                'data-name': this.name,
                'data-price': this.prices[2]

            }); 
            instance.removeClass('template-vegetarian');

            veggiePizza.append(instance);
        }else{
            instance  = templateMeat.clone();
            instance.find('.name').html(this.name);
            instance.find('.desc').html(this.description);

            instance.find('.priceSmall').html('Small - $' + this.prices[0]);
            instance.find('.priceMedium').html('Medium - $' + this.prices[1]);
            instance.find('.priceLarge').html('Large - $' + this.prices[2]);

            instance.find('.btn-small').attr({
                'data-type': "pizza",
                'data-size': "small",
                'data-name': this.name,
                'data-price': this.prices[0]
            });
            instance.find('.btn-medium').attr({
                'data-type': "pizza",
                'data-size': "medium",
                'data-name': this.name,
                'data-price': this.prices[1]
            });
            instance.find('.btn-large').attr({
                'data-type': "pizza",
                'data-size': "large",
                'data-name': this.name,
                'data-price': this.prices[2]

            }); 
            instance.removeClass('template-meat');
            meatPizza.append(instance);
        }

    });


    meatPizza.fadeIn();
    veggiePizza.fadeIn();
}


//this function will populate the drinks part of the menu
function renderDrink(entries) {
    
    //our 2 templates
    var templateDrink = $('.template-drink');

    //our 4 containers
    var drinks = $('.drinks');
    var instance;
    drinks.hide();
    drinks.empty();

    $.each(entries, function(){

        instance  = templateDrink.clone();
        instance.find('.menu3').html(this.name + ' $' + this.price);

        instance.find('.btn').attr({
                'data-type': "drink",
                'data-name': this.name,
                'data-price': this.price
            });
        drinks.append(instance);
        

    });
    drinks.fadeIn();
}


//this function will populate the desserts part of the menu
function renderDessert(entries) {
    
    //our 2 templates
    var templateDessert = $('.template-dessert');

    //our 4 containers
    var desserts = $('.desserts');
    var instance;
    desserts.hide();
    desserts.empty();

    $.each(entries, function(){

        instance  = templateDessert.clone();
        instance.find('.menu3').html(this.name + ' $' + this.price);
        instance.find('.btn').attr({
                'data-type': "dessert",
                'data-name': this.name,
                'data-price': this.price
            });
        desserts.append(instance);
        

    });
    desserts.fadeIn();
}
