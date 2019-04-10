$(function ($) {
    $("h1").lettering('');

    var socket = io();

    $(".input-slider").each(function(){
        var update = {
            ctrl: $(this).attr("id")
        }
        this.noUiSlider.on('end', function (a, b) {
            socket.emit("update",$.extend(update,{
                val: a
            }))
        });
    })

});

$('.input-slider-container').each(function () {
    var slider = $(this).find('.input-slider');
    var sliderId = slider.attr('id');
    var minValue = slider.data('range-value-min');
    var maxValue = slider.data('range-value-max');

    var sliderValue = $(this).find('.range-slider-value');
    var sliderValueId = sliderValue.attr('id');
    var startValue = slider.data('range-value-min');
    console.log(startValue)

    var c = document.getElementById(sliderId),
        d = document.getElementById(sliderValueId);

    noUiSlider.create(c, {
        start: [parseInt(startValue)],
        connect: [true, false],
        //step: 1000,
        range: {
            'min': [parseInt(minValue)],
            'max': [parseInt(maxValue)]
        }
    });

    
})

