var economicClasses = [{
    "label": "Lower Class",
    "name": "lower_class",
    "value": 0,
    "guessedValue": 0,
    "guessedSlices": []
}, {
    "label": "Lower-middle Class",
    "name": "lower_middle_class",
    "value": 0,
    "guessedValue": 0,
    "guessedSlices": []
}, {
    "label": "Upper-middle Class",
    "name": "upper_middle_class",
    "value": 5,
    "guessedValue": 0,
    "guessedSlices": []
}, {
    "label": "Upper Class",
    "name": "upper_class",
    "value": 5,
    "guessedValue": 0,
    "guessedSlices": []
}, {
    "label": "Upper Upper Class",
    "name": "upper_upper_class",
    "value": 90,
    "guessedValue": 0,
    "guessedSlices": []
}];

availablePieces = [
    {
        "id": 1,
        "value": 5,
        "img": "images/slices/slice-1.png"
    },
    {
        "id": 2,
        "value": 5,
        "img": "images/slices/slice-2.png"
    },
    {
        "id": 3,
        "value": 10,
        "img": "images/slices/slice-3.png"
    },
    {
        "id": 4,
        "value": 10,
        "img": "images/slices/slice-4.png"
    },
    {
        "id": 5,
        "value": 10,
        "img": "images/slices/slice-5.png"
    },
    {
        "id": 6,
        "value": 10,
        "img": "images/slices/slice-6.png"
    },
    {
        "id": 7,
        "value": 10,
        "img": "images/slices/slice-7.png"
    },
    {
        "id": 8,
        "value": 10,
        "img": "images/slices/slice-8.png"
    },
    {
        "id": 9,
        "value": 10,
        "img": "images/slices/slice-9.png"
    },
    {
        "id": 10,
        "value": 10,
        "img": "images/slices/slice-10.png"
    },
    {
        "id": 11,
        "value": 10,
        "img": "images/slices/slice-11.png"
    }
];


// Initialize game by assinging updating the main slice
updateSlice();


function mainLayerPointerEvents(state){
    if (state){
        $('#game-layer').css('pointer-events', 'auto');
    }else{
        $('#game-layer').css('pointer-events', 'none');
    }
}

function showOverlay(layerName){
    $(layerName).css('display', 'flex');
}

function clearLayer(layerName){
    $(layerName).html('');
}

function setLayerContents(layerName, html){
    $(layerName).html(html);
}

// Guess check overlay
function closeOverlay(layerName) {
    var overlayLayer = $(layerName);
    overlayLayer.hide();
    clearLayer(layerName);
    mainLayerPointerEvents(true);
    
}

function displayScoreOverlay(correct, score = 100) {
    
    var layerName = '#score-overlay';

    // Define value defaults
    var cardHeader = '';
    var barType = 'danger'; // Red

    // If guessed correctly...
    if (correct) {
        // Set header of overlay to Congrats!
        cardHeader = 'Congrats!'

        // Prepare the background board: Hide slice and show controls
        $('#slice-placeholder').hide();
        if ($('#post-game-controls').length === 0) {
            $('.slice-placeholder-div').append(`
                <div id="post-game-controls" class="text-center my-3" style="width: 100%;">
                    <button class="btn btn-primary mr-2" onclick="resetGame()">Play Again</button>
                    <a href="index.html" class="btn btn-primary ml-2">Home</a>
                </div>
            `);
        }

        // HTML for overlay layer
        var htmlValue = `
    <div id="overlay-card" class="card">
        
        <div class="card-header">
            <div class="row align-items-center">
                <div class="col-1"></div>
                <div class="col-10 text-center">
                    <h2>${cardHeader}</h2>
                </div>
                <div class="col-1">
                    <button type="button" class="close" aria-label="Close" onClick="closeOverlay('${layerName}')">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="card-body">
            <h5 class="card-title text-center">You guessed correctly.</h5>
            <p class="text-center">We would like to encourage you to share this site and learn more about wealth inequality in the United States and around the globe.</p>
            <div class="row justify-content-center">
                <div class="col-12 text-center">
                    <button type="button" class="btn btn-primary mr-2" onClick="shareGame('` + layerName + `')">Share</button>
                    <button type="button" class="btn btn-primary ml-2" onClick="window.open('https://inequality.org/facts/income-inequality/', '_blank')">Learn More</button>
                </div>
            </div>
        </div>
    </div>
    
        
        
    </div>
    `;

    // If guess was not correct...
    } else {
        // Make decision based on score
        // Set header and bar type (color)
        if (score >= 80) {
            cardHeader = 'So close!'
            barType = 'success'; //Green
        } else if (score > 60) {
            cardHeader = 'You\'re getting there!'
            barType = 'info'; // Blue
        } else if (score >= 40) {
            cardHeader = 'Give it another try!'
            barType = 'warning'; // Yellow
        } else {
            cardHeader = 'Try to change things up!'
            //Uses default barType (danger - Red)
        }
        // HTML for overlay layer
        var htmlValue = `
    <div id="overlay-card" class="card">
        
        <div class="card-header">
            <div class="row">
                <div class="col-12 text-center">
                    <h2>${cardHeader}</h2>
                </div>
            </div>
        </div>
        <div class="card-body">
            <h5 class="card-title text-center">Score: ${score}</h5>
            <div class="progress my-3">
                <div class="progress-bar progress-bar-striped progress-bar-animated bg-${barType}" role="progressbar" aria-valuenow="${score}" aria-valuemin="0" aria-valuemax="100" style="width: ${score}%"></div>
            </div>
            <div class="row justify-content-center">
                <div class="col-12 text-center">
                    <button type="button" class="btn btn-primary mr-2" onClick="resetGame()">Try Again</button>
                    <button type="button" class="btn btn-primary ml-2" onClick="showAnswer()">Show Answer</button>
                </div>
            </div>
        </div>
    </div>
    
        
        
    </div>
    
    `;
    }
    
    clearLayer(layerName);
    setLayerContents(layerName, htmlValue);
    mainLayerPointerEvents(false);
    showOverlay(layerName);

}

function displayEClassOverlay(eClass){
    if (economicClasses[eClass]['guessedSlices'].length === 0) {
        return;
    }
    var layerName = '#slice-zone';
    
    var html = `
    <div id="overlay-card" class="card">
        <div class="card-header">
            <div class="row justify-content-center">
                <div class="col-12 text-center">
                    <h3>Click or tap on the slice you want to remove</h3>
                </div>
            </div>
        </div>
        <div class="card-body" style="max-height: 60vh; overflow-y: auto;">
            <div class="row justify-content-center align-items-center">`;

    var arr = economicClasses[eClass]['guessedSlices'];
    for (var i = 0; i < arr.length; i++){
        if (i > 0 && i % 4 == 0){
            html += '</div><div class="row justify-content-center align-items-center mt-2">';
        }
        html += `
            <div class="col-3 text-center">
                <button type="button" onClick="removeSliceFromEClass(${i},${eClass})" style="cursor: pointer; background: transparent; border: none; padding: 0;">
                    <img src="${arr[i]['img']}" style="max-height: 100px; width: auto;">
                </button>
            </div>`;
    }
    
    html += `
            </div>
            <div class="row justify-content-center mt-4">
                <div class="col-12 text-center">
                    <button type="button" class="btn btn-secondary" onClick="closeOverlay('#slice-zone')">Close</button>
                </div>
            </div>
        </div>
    </div>`;

    clearLayer(layerName);
    setLayerContents(layerName,html);
    mainLayerPointerEvents(false);
    showOverlay(layerName);
}

function checkGuess() {
    const sumOfGuesses = economicClasses.reduce((sum, economicClasses) => {
        return sum + parseInt(economicClasses.guessedValue);
    }, 0);
    if (sumOfGuesses != 100) {
        alert('Use all the wealth remaining ($' + (100 - sumOfGuesses) + ' trillion) before submitting your guess');
    } else {
        const sumOfDifferences = economicClasses.reduce((sum, economicClasses) => {
            return sum + Math.abs(economicClasses.value - economicClasses.guessedValue);
        }, 0);
        // Calculate the maximum possible sum of absolute differences
        const maxSumOfDifferences = 100;
        // Calculate the score
        var score = ((maxSumOfDifferences - sumOfDifferences) / maxSumOfDifferences) * 50;

        if (score > 0) {
            score += 50;
        } else {
            score = 50 + score;
        }
        if (score == 100) {
            displayScoreOverlay(true);
            // alert('You guessed correctly!');
        } else {
            displayScoreOverlay(false, score);
            //alert('You guessed in-correct: ' + averageDifference);
        }
    }
}

function changeValue(economicClass, sliceValue, changeType) {

    if (changeType == "add") {

        economicClass['guessedValue'] = parseInt(economicClass['guessedValue']) + parseInt(sliceValue);
    } else if (changeType == "subtract") {

        economicClass['guessedValue'] = parseInt(economicClass['guessedValue']) - parseInt(sliceValue);
    }
    $('#' + economicClass['name'] + '_label').html(economicClass['guessedValue']);
}

function updateSlice() {
    
    var pieDOMElement = document.getElementById('pie-image');
    var pieceDOMElement = document.getElementById('slice-placeholder');
    var sliceValueDOMElement = document.getElementById('slice-value');
    var remainingValueDOMElement = document.getElementById('remaining');
        sliceValueDOMElement.style.visibility = 'hidden'
        pieDOMElement.style.visibility = 'hidden';
        pieceDOMElement.style.visibility = 'hidden';
        const sumOfGuesses = economicClasses.reduce((sum, economicClasses) => {
            return sum + parseInt(economicClasses.guessedValue);
        }, 0);
        remainingValueDOMElement.innerHTML = (100 - sumOfGuesses);
    if(availablePieces.length > 0){
        sliceValueDOMElement.innerHTML="$"+ availablePieces[0].value + " trillion";
        
        if (sumOfGuesses != 100) {
            var remaining = 100 - sumOfGuesses;
            var imageValue = remaining;
            
            // Handle missing images (e.g. 85, 75, 5) by rounding to nearest 10
            // We only have images for multiples of 10, plus 95.
            if (remaining !== 95 && remaining % 10 !== 0) {
                imageValue = Math.round(remaining / 10) * 10;
            }
            pieDOMElement.setAttribute('src', 'images/Pies/pie-' + imageValue + '.png');
        }
        console.log('show');
        pieDOMElement.style.visibility = 'visible';
        sliceValueDOMElement.style.visibility = 'visible';
        pieceDOMElement.style.visibility = 'visible';
        var sliceImage = document.getElementById('slice-image');
        sliceImage.setAttribute('src', availablePieces[0].img)
        pieceDOMElement.style.transform = 'none';
        pieceDOMElement.setAttribute('data-y', 0);
        pieceDOMElement.setAttribute('data-x', 0);
        pieceDOMElement.setAttribute('slice-id', availablePieces[0].id);
        pieceDOMElement.setAttribute('slice-value', availablePieces[0].value);
        
        for (var i = 0; i < economicClasses.length; i++){
            document.getElementById('eClass-label-' + i).innerHTML = '$' + economicClasses[i].guessedValue + ' trillion';
            
            // Update plate image to show the total wealth as a pie chart
            var val = economicClasses[i].guessedValue;
            var $droppable = $('.droppable[eClass="' + i + '"]');
            var $img = $droppable.find('img');
            
            if (val > 0) {
                $droppable.addClass('has-slices');
                var imageValue = val;
                if (val !== 95 && val % 10 !== 0) {
                    imageValue = Math.round(val / 10) * 10;
                    if (imageValue === 0) imageValue = 10;
                }
                $img.attr('src', 'images/Pies/pie-' + imageValue + '.png').css('opacity', 1);
            } else {
                $droppable.removeClass('has-slices');
                $img.css('opacity', 0);
            }
        }
        
    }else{
        checkGuess();
    }
}

function addSliceToEClass(eClass, slice) {
    economicClasses[eClass]['guessedSlices'].push(slice);
    economicClasses[eClass]['guessedValue'] += Number(slice['value']);
}

function removeSliceFromEClass(sliceInex, eClass){
    availablePieces.unshift(economicClasses[eClass]['guessedSlices'][sliceInex]);
    economicClasses[eClass]['guessedValue'] -= economicClasses[eClass]['guessedSlices'][sliceInex]['value'];
    economicClasses[eClass]['guessedSlices'].splice(sliceInex,1);
    updateSlice();
    closeOverlay('#slice-zone');
}

interact('.droppable').dropzone({
    // only accept elements matching this CSS selector
    accept: '.slice',
    // Require pointer overlap for a drop to be possible
    overlap: 'pointer',


    // When slice is droped on square
    ondrop: function (event) {

        // Get class dropped on
        var currentClass = event.target.getAttribute('eClass');

        // Get slice dropped
        var dropped_slice = availablePieces.shift();

        // Add slice to guessedSlices of respective class
        addSliceToEClass(currentClass, dropped_slice);

        updateSlice();


    },
    ondragleave: function (event) {
        // Do NOTHING
    }

})

interact('.draggable')
    .draggable({
        inertia: true,
        listeners: {
            // call this function on every dragmove event
            move: dragMoveListener,

            start(event) {
                var target = event.target;
                sessionStorage.setItem('piece_id', target.getAttribute('id'));
                sessionStorage.setItem('sliceID', event.target.getAttribute('id'));
            },
            //
            // call this function on every dragend event
            end(event) {
                if (!event.relatedTarget) {
                    var target = event.target;
                    target.style.transform = 'translate(0px, 0px)';
                    target.setAttribute('data-x', 0);
                    target.setAttribute('data-y', 0);
                }
            }
        }
    })

function dragMoveListener(event) {
    var target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

function showAnswer() {
    closeOverlay('#score-overlay');
    
    // Hide game controls
    $('#slice-placeholder').hide();
    $('#pie-image').css('visibility', 'hidden');
    $('#slice-value').css('visibility', 'hidden');
    $('#remaining-container').html('Actual Wealth Distribution');

    for (var i = 0; i < economicClasses.length; i++) {
        // Update label with actual value
        $('#eClass-label-' + i).html('$' + economicClasses[i].value + ' trillion');
        
        // Update plate images to show actual wealth as a pie chart
        var val = economicClasses[i].value;
        var $img = $('.droppable[eClass="' + i + '"] img');
        
        if (val > 0) {
            var imageValue = val;
            if (val !== 95 && val % 10 !== 0) {
                imageValue = Math.round(val / 10) * 10;
                if (imageValue === 0) imageValue = 10;
            }
            $img.attr('src', 'images/Pies/pie-' + imageValue + '.png').css('opacity', 1);
        } else {
            $img.css('opacity', 0);
        }
    }
    
    // Disable interactions
    $('.droppable').css('pointer-events', 'none');

    // Add controls to return home or restart
    if ($('#post-game-controls').length === 0) {
        $('.slice-placeholder-div').append(`
            <div id="post-game-controls" class="text-center my-3" style="width: 100%;">
                <button class="btn btn-primary mr-2" onclick="resetGame()">Play Again</button>
                <a href="index.html" class="btn btn-primary ml-2">Home</a>
            </div>
        `);
    }
}

function resetGame() {
    // 1. Reset Economic Classes Data
    economicClasses.forEach(function(ec) {
        ec.guessedValue = 0;
        ec.guessedSlices = [];
    });

    // 2. Reset Available Pieces (Restore the original array)
    availablePieces = [
        {
            "id": 1,
            "value": 5,
            "img": "images/slices/slice-1.png"
        },
        {
            "id": 2,
            "value": 5,
            "img": "images/slices/slice-2.png"
        },
        {
            "id": 3,
            "value": 10,
            "img": "images/slices/slice-3.png"
        },
        {
            "id": 4,
            "value": 10,
            "img": "images/slices/slice-4.png"
        },
        {
            "id": 5,
            "value": 10,
            "img": "images/slices/slice-5.png"
        },
        {
            "id": 6,
            "value": 10,
            "img": "images/slices/slice-6.png"
        },
        {
            "id": 7,
            "value": 10,
            "img": "images/slices/slice-7.png"
        },
        {
            "id": 8,
            "value": 10,
            "img": "images/slices/slice-8.png"
        },
        {
            "id": 9,
            "value": 10,
            "img": "images/slices/slice-9.png"
        },
        {
            "id": 10,
            "value": 10,
            "img": "images/slices/slice-10.png"
        },
        {
            "id": 11,
            "value": 10,
            "img": "images/slices/slice-11.png"
        }
    ];

    // Remove post game controls if they exist
    $('#post-game-controls').remove();

    // Restore the remaining text container
    $('#remaining-container').html('$<span id="remaining">100</span> Trillion Remaining');

    // 3. Re-enable interactions and update UI
    $('.droppable').css('pointer-events', 'auto');
    $('#slice-placeholder').show();
    closeOverlay('#score-overlay');
    updateSlice();
}

function shareGame(layerName) {
    var shareData = {
        title: 'Economic Pie',
        text: 'I just played the Economic Pie game! Can you guess the wealth distribution in the US?',
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch((error) => console.log('Error sharing', error));
    } else {
        // Fallback: Copy URL to clipboard
        var dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = window.location.href;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        alert('Link copied to clipboard!');
    }
    // Overlay remains open so user can choose to Learn More or Close
}