document.addEventListener('DOMContentLoaded', () =>
{
    const gridDisplay = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const resultDisplay = document.getElementById('result');
    const width = 16;
    var squares = [];
    var squareRects = [];
    var checkedSquareAmt = 10;

    var level1 = [false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,false,true,false,false,true,false,true,true,true,true,true,true,true,true,true,true,false,true,false,false,true,false,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false]

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
        setBoardState();
    }

    function setBoardState()
    {
        inputs = document.getElementsByTagName('input');
        for (let i=0; i < width*width; i++)
        {
            inputs[i].checked = level1[i];
        }
    }

    createBoard()

    function checkForwin()
    {
        for (let i=0; i < squares.length; i++)
        {
            resultDisplay.innerHTML = 'You Win!'
        }
    }

    var selectionBox;
    var newCheckboxAmt;
    var removedCheckboxAmt;
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

    function keyDown(event)
    {
        if(event.key == "e") editMode = true;
    }

    function keyUp(event)
    {
        if(event.key == "e") editMode = false;
    }
    
    // when you press mouse down:
    // - original input values array is established
    // - bool array for whether a checkbox has already been selected created
    // - selectionBox box is created
    function mouseDown(event) 
    {
        inputs = document.getElementsByTagName('input');
        setOriginalInputValues();
        setAlreadySelectedArray();
        createSelectionBox(event);
        newCheckboxAmt = 0;
        removedCheckboxAmt = 0;
        ismousedown = true;
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
        ismousedown = false;
        console.log(newCheckboxAmt);
        if(selectionDoesNotSatisfyRules() && !editMode) //it's possible that this doesn't solve the problem correctly
        {
            setBoardToBeforeSelect();
        }
        selectionBox.remove();
        logBoardState();
        if(!boxesStillChecked()) window.alert("You solved the level!");
    }

    function selectionDoesNotSatisfyRules()
    {
        return (newCheckboxAmt < 4 || removedCheckboxAmt < 4) && boxesStillChecked();
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

    function checkRandomInputs()
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