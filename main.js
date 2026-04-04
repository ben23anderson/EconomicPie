var availablePieces = JSON.parse(JSON.stringify(INITIAL_PIECES));

// Add Event Listeners
$(document).ready(function() {
    initializeBoard();
    // Initialize game by assinging updating the main slice
    updateSlice();

    $('.droppable').on('click', function() {
        var eClass = $(this).attr('eClass');
        displayEClassOverlay(eClass);
    });

    // Score Overlay Delegation
    $('#score-overlay').on('click', '.share-btn', function() { shareGame('#score-overlay'); });
    $('#score-overlay').on('click', '.learn-more-btn', function() { window.open('https://inequality.org/facts/income-inequality/', '_blank'); });
    $('#score-overlay').on('click', '.close-overlay-btn', function() { closeOverlay('#score-overlay'); });
    $('#score-overlay').on('click', '.try-again-btn', function() { resetGame(); });
    $('#score-overlay').on('click', '.show-answer-btn', function() { showAnswer(); });

    // Slice Zone Delegation
    $('#slice-zone').on('click', '.close-overlay-btn', function() { closeOverlay('#slice-zone'); });
    $('#slice-zone').on('click', '.remove-slice-btn', function() {
        var index = $(this).data('index');
        var eClass = $(this).data('class');
        removeSliceFromEClass(index, eClass);
    });

    // Post Game Controls Delegation (Play Again)
    // Note: Home button is an <a> tag, so it works natively.
    $(document).on('click', '.play-again-btn', function() { resetGame(); });
});

function initializeBoard() {
    var container = $('#plate-container');
    var template = document.getElementById('template-plate-item').content;

    economicClasses.forEach(function(ec, index) {
        var clone = template.cloneNode(true);
        $(clone).find('.label-text').text(ec.label);
        $(clone).find('.droppable').attr('eClass', index);
        $(clone).find('.droppable img').attr('alt', ec.label + ' plate');
        $(clone).find('.value-text').attr('id', 'eClass-label-' + index);
        container.append(clone);
    });
}

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
            var controlsTemplate = document.getElementById('template-post-game-controls').content.cloneNode(true);
            $('.slice-placeholder-div').append(controlsTemplate);
        }

        // Clone Win Template
        var template = document.getElementById('template-score-win').content.cloneNode(true);
        
        clearLayer(layerName);
        $(layerName).append(template);
        mainLayerPointerEvents(false);
        showOverlay(layerName);

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
        
        // Clone Loss Template
        var template = document.getElementById('template-score-loss').content.cloneNode(true);
        
        // Populate Data
        $(template).find('.score-header').text(cardHeader);
        $(template).find('.score-text').text('Score: ' + Math.round(score));
        $(template).find('.progress-bar').addClass('bg-' + barType).css('width', score + '%').attr('aria-valuenow', score);

        clearLayer(layerName);
        $(layerName).append(template);
        mainLayerPointerEvents(false);
        showOverlay(layerName);
    }

}

function displayEClassOverlay(eClass){
    if (economicClasses[eClass]['guessedSlices'].length === 0) {
        return;
    }
    if (economicClasses[eClass]['guessedSlices'].length === 0) {
        return;
    }
    var layerName = '#slice-zone';
    
    // Clone Template
    var template = document.getElementById('template-slice-removal').content.cloneNode(true);
    var $grid = $(template).find('.slice-grid');

    var arr = economicClasses[eClass]['guessedSlices'];
    for (var i = 0; i < arr.length; i++){
        // Clone Item Template
        var itemTemplate = document.getElementById('template-slice-item').content.cloneNode(true);
        $(itemTemplate).find('img').attr('src', arr[i]['img']);
        $(itemTemplate).find('button').data('index', i).data('class', eClass);
        $grid.append(itemTemplate);
    }

    clearLayer(layerName);
    $(layerName).append(template);
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

function updateSlice() {
    // 1. Reset visibility state (hide draggable elements initially)
    $('#slice-value').css('visibility', 'hidden');
    $('#pie-image').css('visibility', 'hidden');
    $('#slice-placeholder').css('visibility', 'hidden');

    // 2. Calculate State
    const sumOfGuesses = calculateSumOfGuesses();
    
    // 3. Update UI Components
    updateRemainingWealthUI(sumOfGuesses);
    updatePlateVisuals();

    // 4. Check Game Flow
    if (availablePieces.length > 0) {
        // Game continues: Show and update draggable slice
        updateDraggableSlice();
        
        // Show main pie (it represents remaining wealth)
        $('#pie-image').css('visibility', 'visible');
        
        // Update main pie image based on remaining wealth
        updateMainPieImage(sumOfGuesses);

    } else {
        // Game Over: Check results
        checkGuess();
    }
}

function calculateSumOfGuesses() {
    return economicClasses.reduce((sum, ec) => sum + parseInt(ec.guessedValue), 0);
}

function updateRemainingWealthUI(sumOfGuesses) {
    var remaining = 100 - sumOfGuesses;
    $('#remaining').html(remaining);
}

function updateMainPieImage(sumOfGuesses) {
    var remaining = 100 - sumOfGuesses;
    // Only update image if there is remaining wealth to show
    if (remaining > 0) {
        var imageValue = remaining;
        // Handle missing images (e.g. 85, 75, 5) by rounding to nearest 10
        // We only have images for multiples of 10, plus 95.
        if (remaining !== 95 && remaining % 10 !== 0) {
            imageValue = Math.round(remaining / 10) * 10;
        }
        $('#pie-image').attr('src', 'images/Pies/pie-' + imageValue + '.png');
    }
}

function updateDraggableSlice() {
    var currentPiece = availablePieces[0];
    var $sliceVal = $('#slice-value');
    var $slicePlaceholder = $('#slice-placeholder');
    var $sliceImage = $('#slice-image');

    // Update Text
    $sliceVal.html("$" + currentPiece.value + " trillion").css('visibility', 'visible');

    // Update Image
    $sliceImage.attr('src', currentPiece.img);

    // Update Attributes & Position
    $slicePlaceholder.css({
        'visibility': 'visible',
        'transform': 'none'
    }).attr({
        'data-x': 0,
        'data-y': 0,
        'slice-id': currentPiece.id,
        'slice-value': currentPiece.value
    });
}

function updatePlateVisuals() {
    economicClasses.forEach((ec, i) => {
        // Update Label
        $('#eClass-label-' + i).html('$' + ec.guessedValue + ' trillion');

        // Update Plate Image
        var $droppable = $('.droppable[eClass="' + i + '"]');
        var $img = $droppable.find('img');
        var val = ec.guessedValue;
        
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
    });
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
        var controlsTemplate = document.getElementById('template-post-game-controls').content.cloneNode(true);
        $('.slice-placeholder-div').append(controlsTemplate);
    }
}

function resetGame() {
    // 1. Reset Economic Classes Data
    economicClasses.forEach(function(ec) {
        ec.guessedValue = 0;
        ec.guessedSlices = [];
    });

    // 2. Reset Available Pieces (Restore the original array)
    availablePieces = JSON.parse(JSON.stringify(INITIAL_PIECES));

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