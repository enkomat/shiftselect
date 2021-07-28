document.addEventListener('DOMContentLoaded', () =>
{  
    const gridDisplay = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const resultDisplay = document.getElementById('result');
    const resetButton = document.getElementById('reset');
    const doneButton = document.getElementById('done');
    const helpButton = document.getElementById('help');
    const undoButton = document.getElementById('undo');
    const nextLevelButton = document.getElementById('next-level');
    const lastLevelButton = document.getElementById('last-level');
    const width = 16;
    var squares = [];
    var squareRects = [];
    var labels = [];
    var checkedSquareAmt = 10;
    var currentLevelIndex = 12;

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
        if(boardArray[0] == true || boardArray[0] == false)
        {
            console.log(boardArray[0]);
            buildBoardFromBooleans(boardArray);
        }
        else
        {
            buildBoardFromColors(boardArray);
        }
    }

    function buildBoardFromColors(boardArray)
    {
        for (let i=0; i < width*width; i++)
        {
            labels[i].style.backgroundColor = boardArray[i];
        }
    }

    function buildBoardFromBooleans(boardArray)
    {
        inputs = document.getElementsByTagName('input');
        for (let i=0; i < width*width; i++)
        {
            inputs[i].checked = boardArray[i];
            if(boardArray[i] == true) 
            {
                labels[i].style.backgroundColor = colors.GREEN;
            }
            else if(boardArray[i] == false)
            {
                labels[i].style.backgroundColor = colors.GREY;
                //these ifs here so green squares can overwrite them when pressing undo, because this function is called from undoMove as well. there could be a better solution.
                if(fillableInSquareIndex(i))
                {
                    labels[i].style.backgroundColor = colors.BLUE;
                }
            }
        }
    }

    function fillableInSquareIndex(squareIndex)
    {
        for(let i=0; i < levelFillablePositions[currentLevelIndex].length; i++)
        {
            if(levelFillablePositions[currentLevelIndex][i] == squareIndex)
            {
                return true;
            }
        }
        return false;
    }

    function clearBoard()
    {
        inputs = document.getElementsByTagName('input');
        for (let i=0; i < width*width; i++)
        {
            inputs[i].checked = false;
            labels[i].style.backgroundColor = colors.GREY;
        }
        currentTrapsArray = [];
        currentFillablesArray = [];
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

    function checkLevelWin()
    {
        if(boardEmpty()) moveToNextLevel();
    }

    function createHelpText()
    {
        document.getElementById("help-text").innerHTML =
        "Your goal is to remove all green squares by clicking and dragging your mouse over them. <br> There are two rules and one exception that must be met with each selection you make: <br><br> 1. You must remove at least one green square. <br> 2. You must create at least one new square. <br> Exception: On the last move before solving the level, the move on which you remove all of the remaining green squares, you do not have to create new squares. <br><br> The amount of moves you have per level is limited and is located under the board. Press the 'Done' button when there are no green squares left."
    }

    const colors = 
    {
        GREY: "whitesmoke",
        GREEN: "lightgreen",
        BLUE: "lightskyblue",
        RED: "lightcoral",
        NONE: "none"
    }

    var maximumMoveAmt = 0;
    var currentMoveAmt = 0;
    var pastBoardStates = [];
    var selectionBox;
    var newCheckboxAmt;
    var removedCheckboxAmt;
    var blueAmt;
    var greenAmt;
    var selectionBoxEnabled = true;
    var lastSelectionColor = colors.GREEN;
    var originalSelectionColor = colors.NONE;
    var currentSelectionColor = colors.GREY;
    var wrongColorAmt = 0;
    var inputs;
    var labels;
    var originalInputValues = [];
    var originalSquareColors = [];
    var currentlySelectedSquares = [];
    var x;
    var y;
    var finX;
    var finY;
    var ismousedown = false;
    var editMode = false;
    var editTrapsMode = false;
    var editWallsMode = false;
    var currentTrapsArray = [];
    var currentFillablesArray = [];
    
    document.addEventListener('mousedown', mouseDown);
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
    document.addEventListener('keydown', keyDown);
    resetButton.addEventListener('click', resetLevel);
    doneButton.addEventListener('click', checkLevelWin);
    helpButton.addEventListener('click', createHelpText)
    undoButton.addEventListener('click', undoMove);
    nextLevelButton.addEventListener('click', moveToNextLevel);
    lastLevelButton.addEventListener('click', moveToLastLevel);
    resetButton.addEventListener('mouseleave', enableSelectionBox);
    doneButton.addEventListener('mouseleave', enableSelectionBox);
    helpButton.addEventListener('mouseleave', enableSelectionBox);
    undoButton.addEventListener('mouseleave', enableSelectionBox);
    nextLevelButton.addEventListener('mouseleave', enableSelectionBox);
    lastLevelButton.addEventListener('mouseleave', enableSelectionBox);
    resetButton.addEventListener('mouseover', disableSelectionBox);
    doneButton.addEventListener('mouseover', disableSelectionBox);
    helpButton.addEventListener('mouseover', disableSelectionBox);
    undoButton.addEventListener('mouseover', disableSelectionBox);
    nextLevelButton.addEventListener('mouseover', disableSelectionBox);
    lastLevelButton.addEventListener('mouseover', disableSelectionBox);

    function keyDown(event)
    {
        if(event.key == "e") editMode = !editMode;
        if(event.key == "t") editTrapsMode = !editTrapsMode;
        if(event.key == "w") editWallsMode = !editWallsMode;
        if(event.key == "1") originalSelectionColor = colors.GREEN;
        if(event.key == "2") originalSelectionColor = colors.BLUE;
        if(event.key == "3") originalSelectionColor = colors.GREY;
        if(event.key == "c") clearBoard();
        //reset current level:
        if(event.key == "r") resetLevel();
    }
    
    // when you press mouse down:
    // - original input values array is established
    // - bool array for whether a checkbox has already been selected created
    // - selectionBox box is created
    function mouseDown(event) 
    {
        if(selectionBoxEnabled && currentMoveAmt != 0) //this makes buttons easier to press
        {
            saveCurrentBoardState();
            wrongColorAmt = 0;
            if(!editMode) originalSelectionColor = colors.NONE;
            inputs = document.getElementsByTagName('input');
            setOriginalInputValues();
            setOriginalSquareColors();
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
            if(!editMode)
            {
                if(selectionDoesNotSatisfyRules()) //it's possible that this doesn't solve the problem correctly
                {
                    console.log("set board to before select")
                    setBoardToBeforeSelect();
                }
                else
                {
                    console.log("made a move")
                    currentMoveAmt--;
                    updateMovesElement();
                    if(boardEmpty()) 
                    {
                        document.getElementById("move-amount").innerHTML = "Level solved! Press done to move to the next level."
                        document.getElementById("move-amount").style.color = "green";
                    }
                }
            }
            if(originalSelectionColor != colors.GREY || originalSelectionColor != colors.NONE)
            {
                lastSelectionColor = originalSelectionColor;
            }
            originalSelectionColor = colors.NONE;
            currentlySelectedSquares = [];
            ismousedown = false;
            logBoardColors();
            selectionBox.remove();
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
        if(currentMoveAmt == 0)
        {
            document.getElementById("move-amount").style.color = "red";
        }
        else
        {
            document.getElementById("move-amount").style.color = "black";
        }
    }

    function selectionDoesNotSatisfyRules()
    {
        return (newCheckboxAmt < 1 || removedCheckboxAmt < 1) && colorStillExists(originalSelectionColor);
    }

    function disableSelectionBox()
    {
        selectionBoxEnabled = false;
    }

    function enableSelectionBox()
    {
        selectionBoxEnabled = true;
    }

    function colorStillExists(color)
    {
        inputs = document.getElementsByTagName('input');
        for(let i = 0; i < width*width; i++)
        {
            if(labels[i].style.backgroundColor == color) return true;
        }
        return false;
    }

    function boardEmpty()
    {
        for(let i = 0; i < width*width; i++)
        {
            if(labels[i].style.backgroundColor != colors.GREY) return false;
        }
        return true;
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

    function saveCurrentBoardState()
    {
        currentBoardState = []
        for(let i = 0; i < width*width; i++)
        {
            currentBoardState.push(labels[i].style.backgroundColor);
        }
        pastBoardStates.push(currentBoardState);
    }

    function moveToNextLevel()
    {
        lastSelectionColor = colors.GREEN;
        currentLevelIndex++;
        document.getElementById("level").innerHTML = "Level " + (currentLevelIndex+1);
        setBoardState(levels[currentLevelIndex]);
        initLevel();
    }

    function moveToLastLevel()
    {
        if(currentLevelIndex == 0) return;
        currentLevelIndex--;
        document.getElementById("level").innerHTML = "Level " + (currentLevelIndex+1);
        setBoardState(levels[currentLevelIndex]);
        initLevel();
    }

    function undoMove()
    {
        if(currentMoveAmt < maximumMoveAmt)
        {
            currentMoveAmt++;
            updateMovesElement();
            var lastBoardColors = pastBoardStates.pop();
            console.log(lastBoardColors);
            for(let i = 0; i < width*width; i++)
            {
                labels[i].style.backgroundColor = lastBoardColors[i];
            }
        }
    }

    function setBoardToBeforeSelect()
    {
        for(let i = 0; i < width*width; i++)
        {
            labels[i].style.backgroundColor = originalSquareColors[i];
        }
        pastBoardStates.pop();
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

    function logBoardColors()
    {
        var colorsArray = [];
        for(let i = 0; i < width*width; i++)
        {
            colorsArray.push(labels[i].style.backgroundColor)
        }
        var jsonArray = JSON.stringify(colorsArray);
        console.log(jsonArray);
    }

    function logFillables()
    {
       currentFillablesArray.sort();
       var jsonArray = JSON.stringify(currentFillablesArray);
       console.log(jsonArray);
    }

    function logTraps()
    {
        currentTrapsArray.sort();
        var jsonArray = JSON.stringify(currentTrapsArray);
        console.log(jsonArray);
    }

    function checkSelectionRectCollision(i)
    {
        selectionRect = selectionBox.getBoundingClientRect(); //inefficient for this call to be here
        return selectionRect.right > inputs[i].getBoundingClientRect().left
            && selectionRect.bottom > inputs[i].getBoundingClientRect().top
            && selectionRect.left < inputs[i].getBoundingClientRect().right
            && selectionRect.top < inputs[i].getBoundingClientRect().bottom
    }

    function changeSquareColor(i)
    {
        currentSelectionColor = labels[i].style.backgroundColor;

        //this exists so color of selection starting from grey changes based on what you selected last
        if(originalSelectionColor == colors.GREY)
        {
            if(lastSelectionColor == colors.GREEN)
            {
                originalSelectionColor = colors.GREEN;
            }
            else if(lastSelectionColor == colors.BLUE)
            {
                originalSelectionColor = colors.BLUE;
            }
        }

        if(originalSelectionColor == colors.GREEN)
        {
            if(currentSelectionColor == colors.GREEN)
            {
                //turn current square grey
                labels[i].style.backgroundColor = colors.GREY;
            }
            else if(currentSelectionColor == colors.GREY)
            {
                //turn current square green
                labels[i].style.backgroundColor = colors.GREEN;
            }
            else if(currentSelectionColor == colors.BLUE)
            {
                //touched blue, selection fails
                //labels[i].style.backgroundColor = colors.RED;
                //wrongColorAmt++;
            }
        }
        else if(originalSelectionColor == colors.BLUE)
        {
            if(currentSelectionColor == colors.BLUE)
            {
                //turn current square grey
                labels[i].style.backgroundColor = colors.GREY;       
            }
            else if(currentSelectionColor == colors.GREY)
            {
                //turn current square blue
                labels[i].style.backgroundColor = colors.BLUE;
            }
            else if(currentSelectionColor == colors.GREEN)
            {
                //touched green, selection fails
                //labels[i].style.backgroundColor = colors.RED;
                //wrongColorAmt++;
            }
        }
    }

    function checkIfOverSquare()
    {
        for(let i = 0; i < width*width; i++)
        {
            var rectCollision = checkSelectionRectCollision(i);
            if(rectCollision && !currentlySelectedSquares[i])
            {
                if(originalSelectionColor == colors.NONE)
                {
                    originalSelectionColor = labels[i].style.backgroundColor;
                }
                changeSquareColor(i);
                if(labels[i].style.backgroundColor == colors.GREY)
                {
                    newCheckboxAmt++;
                }
                else if((originalSelectionColor == colors.BLUE && labels[i].style.backgroundColor == colors.BLUE) || (originalSelectionColor == colors.GREEN && labels[i].style.backgroundColor == colors.GREEN))
                {
                    removedCheckboxAmt++;
                }
                currentlySelectedSquares[i] = true;
            }
            else if(!rectCollision && currentlySelectedSquares[i])
            {
                if(labels[i].style.backgroundColor == colors.GREY)
                {
                    newCheckboxAmt--;
                }
                else if((originalSelectionColor == colors.BLUE && labels[i].style.backgroundColor == colors.BLUE) || (originalSelectionColor == colors.GREEN && labels[i].style.backgroundColor == colors.GREEN))
                {
                    removedCheckboxAmt--;
                }
                labels[i].style.backgroundColor = originalSquareColors[i];
                currentlySelectedSquares[i] = false;
            }
        }
    }

    function setOriginalSquareColors()
    {
        for(let i = 0; i < width*width; i++)
        {
            originalSquareColors[i] = labels[i].style.backgroundColor;
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