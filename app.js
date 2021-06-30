document.addEventListener('DOMContentLoaded', () =>
{
    const gridDisplay = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const resultDisplay = document.getElementById('result');
    const resetButton = document.getElementById('reset');
    const doneButton = document.getElementById('done');
    const width = 16;
    var squares = [];
    var squareRects = [];
    var checkedSquareAmt = 10;

    var currentLevelIndex = 7;

    const level1 = [false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,false,true,false,false,true,false,true,true,true,true,true,true,true,true,true,true,false,true,false,false,true,false,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false]
    
    const level2 = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,false,true,false,false,false,false,false,false,false,false,false,false,true,false,true,true,false,true,false,true,true,true,true,true,true,true,true,false,true,false,true,true,false,true,false,true,false,false,false,false,false,false,true,false,true,false,true,true,false,true,false,true,false,true,true,true,true,false,true,false,true,false,true,true,false,true,false,true,false,true,false,false,true,false,true,false,true,false,true,true,false,true,false,true,false,true,false,false,true,false,true,false,true,false,true,true,false,true,false,true,false,true,true,true,true,false,true,false,true,false,true,true,false,true,false,true,false,false,false,false,false,false,true,false,true,false,true,true,false,true,false,true,true,true,true,true,true,true,true,false,true,false,true,true,false,true,false,false,false,false,false,false,false,false,false,false,true,false,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true]

    const level3 = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]

    const level4 = [true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,true,true,true,true,true,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,true,false,true,true,true,true,true,true,false,false,false,false,false,false,true,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,true,false,true,false,true,false,false,false,false,false,true,true,true,true,false,false,true,false,true,false,true,false,false,false,false,false,false,false,false,true,false,false,true,false,true,false,true,false,false,false,false,false,false,false,false,true,false,false,true,false,true,false,true,false,false,false,false,false,false,false,false,true,false,false,true,false,true,false,true,false,false,false,false,false,false,false,false,true,false,false,true,false,true,false,true,false,false,false,false,false,true,true,true,true,false,false,true,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,true,false,true,false,true,true,true,true,true,true,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false]

    const level5 = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]

    level6 = [false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false,true]

    level7 = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]

    level8 = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]

    var levels = [level1, level2, level3, level4, level5, level6, level7, level8];

    createBoard()

    //create a playing board
    function createBoard()
    {
        for (let i=0; i < width*width; i++)
        {
            square = document.createElement('input');
            square.setAttribute("type", "checkbox");
            gridDisplay.appendChild(square);
            squares.push(square);
            squareRects.push(square.getBoundingClientRect());
        }
        setBoardState(levels[currentLevelIndex]);
    }

    function setBoardState(boardArray)
    {
        inputs = document.getElementsByTagName('input');
        for (let i=0; i < width*width; i++)
        {
            inputs[i].checked = boardArray[i];
        }
    }

    function clearBoard()
    {
        inputs = document.getElementsByTagName('input');
        for (let i=0; i < width*width; i++)
        {
            inputs[i].checked = false;
        }
    }

    function resetLevel()
    {
        setBoardState(levels[currentLevelIndex]);
    }

    function levelWin()
    {
        window.alert("You solved the level! On to the next one.");
        //load next level:
        currentLevelIndex++;
        document.getElementById("level").innerHTML = "Level " + (currentLevelIndex+1);
        setBoardState(levels[currentLevelIndex]);
    }

    function checkLevelWin()
    {
        if(!boxesStillChecked()) levelWin();
        else window.alert("You haven't cleared the board yet!");
    }

    var selectionBox;
    var newCheckboxAmt;
    var removedCheckboxAmt;
    var selectionBoxEnabled = true;
    var inputs;
    var originalInputValues = [];
    var alreadySelected = []
    var x;
    var y;
    var finX;
    var finY;
    var ismousedown = false;
    var editMode = false;
    document.addEventListener('mousedown', mouseDown);
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    resetButton.addEventListener('click', resetLevel);
    doneButton.addEventListener('click', checkLevelWin);
    resetButton.addEventListener('mouseleave', enableSelectionBox);
    doneButton.addEventListener('mouseleave', enableSelectionBox);
    resetButton.addEventListener('mouseover', disableSelectionBox);
    doneButton.addEventListener('mouseover', disableSelectionBox);

    function keyDown(event)
    {
        if(event.key == "e") editMode = !editMode;
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
        if(selectionBoxEnabled)
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
            console.log(newCheckboxAmt);
            if(selectionDoesNotSatisfyRules() && !editMode) //it's possible that this doesn't solve the problem correctly
            {
                setBoardToBeforeSelect();
            }
            selectionBox.remove();
            logBoardState();
        }
    }

    function selectionDoesNotSatisfyRules()
    {
        return (newCheckboxAmt < 4 || removedCheckboxAmt < 4) && boxesStillChecked();
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
            if(inputs[i].checked) return true;
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

    function setBoardToBeforeSelect()
    {
        for(let i = 0; i < width*width; i++)
        {
            inputs[i].checked = originalInputValues[i];
        }
    }

    function setAlreadySelectedArray()
    {
        for(let i = 0; i < width*width; i++)
        {
            alreadySelected[i] = false;
        }
    }

    function logBoardState()
    {
        inputs = document.getElementsByTagName('input');
        var checkedArray = []
        for(let i = 0; i < width*width; i++)
        {
            checkedArray.push(inputs[i].checked);
        }
        var jsonArray = JSON.stringify(checkedArray)
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
                if(!alreadySelected[i])
                {
                    alreadySelected[i] = true;
                    if(originalInputValues[i] == false)
                    {
                        inputs[i].checked = true;
                        newCheckboxAmt++;
                    }
                    else
                    {
                        inputs[i].checked = false;
                        removedCheckboxAmt++;
                    }
                    
                }
            }
            else if(alreadySelected[i])
            {
                alreadySelected[i] = false;
                if(originalInputValues[i] == false)
                {
                    inputs[i].checked = false;
                    newCheckboxAmt--;
                }
                else
                {
                    inputs[i].checked = true;
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
        selectionBox.style.border = '1px dashed #ccc';
        selectionBox.style.display = 'block';
        selectionBox.style.width = xString;
        selectionBox.style.height = yString;
    }
})