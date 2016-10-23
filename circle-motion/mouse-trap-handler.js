// single keys 
Mousetrap.bind(['left', 'a'], function() { 
    image1.x -= 10; 
    return false;
});

Mousetrap.bind('right', function() { image1.x += 10; console.log(image1); });
Mousetrap.bind("d", function() { image1.x += 10; console.log('d'); });

Mousetrap.bind("up", function() { image1.y -= 10; console.log(image1); });
Mousetrap.bind("w", function() { image1.y -= 10; console.log(image1); });
Mousetrap.bind("down", function() { image1.y += 10; console.log(image1); });
Mousetrap.bind("s", function() { image1.y += 10; console.log('s'); });

Mousetrap.bind("s+d", function() { 
    image1.y += 10;
    image1.x += 10; 
});
Mousetrap.bind("s", function() { image1.y += 10; console.log(image1); });
Mousetrap.bind('esc', function() { console.log('escape'); }, 'keyup');

// konami code! 
Mousetrap.bind('up up down down left right left right b a enter', function() {
    console.log('konami code');
});