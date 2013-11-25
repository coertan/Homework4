/*  populateMenu.js
    This javascript file will load the menu data for dawg pizza from the
    menu.js file and use it to populate the menu page with items
*/



//this function will run on document load, and render all 3 categories of menu items
$( function(){
    renderPizza(com.dawgpizza.menu.pizzas);
    renderDrink(com.dawgpizza.menu.drinks);
    renderDessert(com.dawgpizza.menu.desserts);

});



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
            instance.find('.price').html('$' + this.prices[0] + '/ $' +this.prices[1] + '/ $' + this.prices[2]);
            instance.removeClass('template-vegetarian');
            veggiePizza.append(instance);
        }else{
            instance  = templateMeat.clone();
            instance.find('.name').html(this.name);
            instance.find('.desc').html(this.description);
            instance.find('.price').html('$' + this.prices[0] + '/ $' +this.prices[1] + '/ $' + this.prices[2]);
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
        instance.find('.menu1').html(this.name + ' $' + this.price);
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
        instance.find('.menu1').html(this.name + ' $' + this.price);
        desserts.append(instance);
        

    });
    desserts.fadeIn();
}
