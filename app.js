document.addEventListener('DOMContentLoaded', () =>
{  
    const gridDisplay = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const resultDisplay = document.getElementById('result');
    const resetButton = document.getElementById('reset');
    const doneButton = document.getElementById('done');
    const helpButton = document.getElementById('help');
    const undoButton = document.getElementById('undo');
    const width = 16;
    var squares = [];
    var squareRects = [];
    var labels = [];
    var checkedSquareAmt = 10;
    var currentLevelIndex = 8;

    //create a playing board
    function createBoard()
    {
        for (let i=0; i < width*width; i++)
        {
            square = document.createElement('input');
            square.setAttribute("type", "checkbox");
            square.id = "check";
            label = document.createElement('label');
            label.setAttribute("for", "check");
            label.classList.add("checkmark");
            gridDisplay.appendChild(square);
            gridDisplay.appendChild(label);
            labels.push(label);
            squares.push(square);
            squareRects.push(square.getBoundingClientRect());
        }
    }

    function setBoardState(boardArray)
    {
        inputs = document.getElementsByTagName('input');
        for (let i=0; i < width*width; i++)
        {
            inputs[i].checked = boardArray[i];
            if(trapInSquareIndex(i))
            {
                labels[i].style.backgroundColor = "indianred"
            }
            else if(boardArray[i] == true) 
            {
                labels[i].style.backgroundColor = "lightgreen";
            }
            else
            {
                labels[i].style.backgroundColor = "whitesmoke";
            }
        }
    }

    function turnAllSquaresYellow()
    {
        for(let i=0; i < width*width; i++)
        {
            labels[i].style.backgroundColor = 'gold';
        }
    }

    function turnTrapsToDefaultSquares()
    {
        var newSquares = []
        for(let i=0; i < width*width; i++)
        {
            if(trapInSquareIndex(i))
            {
                inputs[i].checked = true;
                labels[i].style.backgroundColor = "lightgreen";
                originalInputValues[i] = true;
                newSquares.push(inputs[i].checked);
            }
            else
            {
                inputs[i].checked = false;
                labels[i].style.backgroundColor = "whitesmoke";
                originalInputValues[i] = false;
                newSquares.push(inputs[i].checked);
            }
        }
        levelTrapPositions[currentLevelIndex] = []
        levels[currentLevelIndex] = newSquares;
    }

    function trapInSquareIndex(squareIndex)
    {
        //this could be more efficient
        for(let i=0; i < levelTrapPositions[currentLevelIndex].length; i++)
        {
            if(levelTrapPositions[currentLevelIndex][i] == squareIndex)
            {
                return true;
            }
        }
        return false;
    }

    function boardHasTraps()
    {
        for(let i=0; i < width*width; i++)
        {
            if(trapInSquareIndex(i)) return true;
        }
        return false;
    }

    function trapInSelectionArea()
    {
        for(let i=0; i < currentlySelectedSquares.length; i++)
        {
            if(currentlySelectedSquares[i] && trapInSquareIndex(i)) return true;
        }
        return false;
    }

    function clearBoard()
    {
        inputs = document.getElementsByTagName('input');
        for (let i=0; i < width*width; i++)
        {
            inputs[i].checked = false;
            labels[i].style.backgroundColor = "whitesmoke";
        }
        currentTrapsArray = [];
        levelTrapPositions[currentLevelIndex] = []
    }

    function initLevel()
    {
        setBoardState(levels[currentLevelIndex]);
        maximumMoveAmt = levelMoveAmounts[currentLevelIndex];
        currentMoveAmt = maximumMoveAmt; //moves are subtracted until player hits zero
        updateMovesElement();
        document.getElementById("level").innerHTML = "Level " + (currentLevelIndex+1);
    }

    function resetLevel()
    {
        pastBoardStates = [];
        setBoardState(levels[currentLevelIndex]);
        currentMoveAmt = maximumMoveAmt;
        updateMovesElement();
    }

    function levelWin()
    {
        //load next level:
        currentLevelIndex++;
        document.getElementById("level").innerHTML = "Level " + (currentLevelIndex+1);
        setBoardState(levels[currentLevelIndex]);
        initLevel();
    }

    function checkLevelWin()
    {
        if(!boxesStillChecked()) levelWin();
    }

    function createHelpText()
    {
        document.getElementById("help-text").innerHTML =
        "Your goal is to remove all the green squares by clicking and dragging your mouse, selecting them. <br> There are two rules that must be met with each selection: <br> 1. You must remove at least four old squares. <br> 2. You must create at least four new squares. <br> Press the 'Done' button when there are no green squares left."
    }

    var maximumMoveAmt = 0;
    var currentMoveAmt = 0;
    var pastBoardStates = [];
    var selectionBox;
    var newCheckboxAmt;
    var removedCheckboxAmt;
    var selectionBoxEnabled = true;
    var inputs;
    var labels;
    var originalInputValues = [];
    var currentlySelectedSquares = []
    var x;
    var y;
    var finX;
    var finY;
    var ismousedown = false;
    var editMode = false;
    var editTrapsMode = false;
    var currentTrapsArray = []
    
    document.addEventListener('mousedown', mouseDown);
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    resetButton.addEventListener('click', resetLevel);
    doneButton.addEventListener('click', checkLevelWin);
    helpButton.addEventListener('click', createHelpText)
    undoButton.addEventListener('click', undoMove);
    resetButton.addEventListener('mouseleave', enableSelectionBox);
    doneButton.addEventListener('mouseleave', enableSelectionBox);
    helpButton.addEventListener('mouseleave', enableSelectionBox);
    undoButton.addEventListener('mouseleave', enableSelectionBox);
    resetButton.addEventListener('mouseover', disableSelectionBox);
    doneButton.addEventListener('mouseover', disableSelectionBox);
    helpButton.addEventListener('mouseover', disableSelectionBox);
    undoButton.addEventListener('mouseover', disableSelectionBox);

    function keyDown(event)
    {
        if(event.key == "e") editMode = !editMode;
        if(event.key == "t") editTrapsMode = !editTrapsMode;
        if(event.key == "c") clearBoard();
        //reset current level:
        if(event.key == "r") resetLevel();
    }

    function keyUp(event)
    {
        //if(event.key == "e") editMode = false;
    }
    
    // when you press mouse down:
    // - original input values array is established
    // - bool array for whether a checkbox has already been selected created
    // - selectionBox box is created
    function mouseDown(event) 
    {
        if(selectionBoxEnabled && currentMoveAmt != 0) //this makes buttons easier to press
        {
            inputs = document.getElementsByTagName('input');
            setOriginalInputValues();
            setAlreadySelectedArray();
            createSelectionBox(event);
            newCheckboxAmt = 0;
            removedCheckboxAmt = 0;
            ismousedown = true;
        }
    }
    
    function mouseMove(event) 
    {
        if (ismousedown) 
        {
            scaleSelectionBox(event)
            checkIfOverSquare();
        }
    }
    
    function mouseUp(event) 
    {
        if(ismousedown)
        {
            ismousedown = false;
            if(selectionDoesNotSatisfyRules() && !editMode) //it's possible that this doesn't solve the problem correctly
            {
                setBoardToBeforeSelect();
            }
            else
            {
                savePreviousBoardState();
                if(!boxesStillChecked()) turnAllSquaresYellow();
                currentMoveAmt--;
                updateMovesElement();
            }
            selectionBox.remove();
            //logBoardState();
            //logTraps();
        }
    }

    window.oncontextmenu = function ()
    {
        selectionBox.remove();
        return false; // cancel default menu, so no checkboxes are drawn in a weird way
    }

    function updateMovesElement()
    {
        document.getElementById("move-amount").innerHTML = "Moves: " + currentMoveAmt + "/" + maximumMoveAmt;
    }


    function selectionDoesNotSatisfyRules()
    {
        return (newCheckboxAmt < 1 || removedCheckboxAmt < 1 || trapInSelectionArea()) && boxesStillChecked();
    }

    function disableSelectionBox()
    {
        selectionBoxEnabled = false;
    }

    function enableSelectionBox()
    {
        selectionBoxEnabled = true;
    }

    function boxesStillChecked()
    {
        inputs = document.getElementsByTagName('input');
        for(let i = 0; i < width*width; i++)
        {
            if(inputs[i].checked && !trapInSquareIndex(i)) return true;
        }
        return false;
    }

    function checkRandomBoxes()
    {
        inputs = document.getElementsByTagName('input');
        for(let i = 0; i < width*width; i++)
        {
            var random = Math.random();
            if(random > 0.75 && checkedSquareAmt < 20)
            {
                inputs[i].checked = true;
                checkedSquareAmt++;
            }
        }
    }

    function savePreviousBoardState()
    {
        previousBoardState = []
        for(let i = 0; i < width*width; i++)
        {
            previousBoardState.push(originalInputValues[i]);
        }
        pastBoardStates.push(previousBoardState);
    }

    function undoMove()
    {
        if(currentMoveAmt < maximumMoveAmt)
        {
            currentMoveAmt++;
            updateMovesElement();
            setBoardState(pastBoardStates.pop());
        }
    }

    function setBoardToBeforeSelect()
    {
        for(let i = 0; i < width*width; i++)
        {
            inputs[i].checked = originalInputValues[i];
            if(originalInputValues[i] == true)
            {
                labels[i].style.backgroundColor = "lightgreen";
            }
            else
            {
                labels[i].style.backgroundColor = "whitesmoke";
            }

            if(trapInSquareIndex(i))
            {
                labels[i].style.backgroundColor = "indianred"
            }
        }
    }

    function setAlreadySelectedArray()
    {
        for(let i = 0; i < width*width; i++)
        {
            currentlySelectedSquares[i] = false;
        }
    }

    function logBoardState()
    {
        inputs = document.getElementsByTagName('input');
        var checkedArray = [];
        for(let i = 0; i < width*width; i++)
        {
            checkedArray.push(inputs[i].checked);
        }
        var jsonArray = JSON.stringify(checkedArray);
        console.log(jsonArray);
    }

    function logTraps()
    {
        currentTrapsArray.sort();
        var jsonArray = JSON.stringify(currentTrapsArray);
        console.log(jsonArray);
    }

    function checkIfOverSquare()
    {
        selectionRect = selectionBox.getBoundingClientRect();
        for(let i = 0; i < width*width; i++)
        {
            if(selectionRect.right > inputs[i].getBoundingClientRect().left
            && selectionRect.bottom > inputs[i].getBoundingClientRect().top
            && selectionRect.left < inputs[i].getBoundingClientRect().right
            && selectionRect.top < inputs[i].getBoundingClientRect().bottom)
            {
                if(trapInSquareIndex(i)) //traps cannot be interacted with
                {
                    currentlySelectedSquares[i] = true;
                }
                else if(!currentlySelectedSquares[i])
                {
                    currentlySelectedSquares[i] = true;
                    if(originalInputValues[i] == false)
                    {
                        inputs[i].checked = true;
                        labels[i].style.backgroundColor = "lightgreen";
                        newCheckboxAmt++;
                    }
                    else
                    {
                        inputs[i].checked = false;
                        labels[i].style.backgroundColor = "whitesmoke";
                        removedCheckboxAmt++;
                    }

                    if(editTrapsMode)
                    {
                        labels[i].style.backgroundColor = "indianred";
                        currentTrapsArray.push(i);
                    }
                }
            }
            else if(currentlySelectedSquares[i])
            {
                currentlySelectedSquares[i] = false;
                if(trapInSquareIndex(i)) //traps cannot be interacted with
                {
                    currentlySelectedSquares[i] = false;
                }
                else if(originalInputValues[i] == false)
                {
                    inputs[i].checked = false;
                    labels[i].style.backgroundColor = "whitesmoke";
                    newCheckboxAmt--;
                }
                else
                {
                    inputs[i].checked = true;
                    labels[i].style.backgroundColor = "lightgreen";
                    removedCheckboxAmt--
                }
            }
        }
    }

    function setOriginalInputValues()
    {
        for(let i = 0; i < inputs.length; i++)
        {
            originalInputValues[i] = inputs[i].checked;
        }
    }

    function createSelectionBox(event)
    {
        x = event.pageX;
        y = event.pageY;
        var newSelection = document.createElement("div");
        newSelection.className = "selectionBox"
        newSelection.style.top = y.toString() + "px";
        newSelection.style.left = x.toString() + "px";
        document.body.appendChild(newSelection);
        selectionBox = newSelection;
    }

    function scaleSelectionBox(event)
    {
        finX = event.pageX;
        finY = event.pageY;
        dX = (finX - x);
        dY = (finY - y);
        if(finY < y) 
        {
            selectionBox.style.top = finY.toString() + 'px';
            selectionBox.style.bottom = y.toString() + 'px';
            dY = (y - finY);
        }
        if(finX < x) 
        {
            selectionBox.style.left = finX.toString() + 'px';
            selectionBox.style.right = x.toString() + 'px';
            dX = (x - finX);
        }
        xString = dX.toString() + 'px';
        yString = dY.toString() + 'px';
        selectionBox.style.width = xString;
        selectionBox.style.height = yString;
    }
    
    createBoard();
    initLevel();
})