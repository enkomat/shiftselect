document.addEventListener('DOMContentLoaded', () =>
{
    const gridDisplay = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const resultDisplay = document.getElementById('result');
    const width = 16;
    var squares = [];
    var squareRects = [];

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
    }

    createBoard()

    function checkForwin()
    {
        for (let i=0; i < squares.length; i++)
        {
            resultDisplay.innerHTML = 'You Win!'
        }
    }

    var selection;
    var selectionAmt;
    var inputs;
    var originalInputValues = [];
    var alreadySelected = []
    var x;
    var y;
    var finX;
    var finY;
    var ismousedown = false;
    document.addEventListener('mousedown', mouseDown)
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp)
    
    function mouseDown(event) 
    {
        inputs = document.getElementsByTagName('input');
        setInputValues();
        prepareAlreadySelectedArray();
        selectionAmt = 0;
        x = event.pageX;
        y = event.pageY;
        var newSelection = document.createElement("div");
        newSelection.className = "selection"
        newSelection.style.top = y.toString() + "px";
        newSelection.style.left = x.toString() + "px";
        document.body.appendChild(newSelection);
        selection = newSelection;
        ismousedown = true;
    }
    
    function mouseMove(event) 
    {
        if (ismousedown) 
        {
            finX = event.pageX;
            finY = event.pageY;
            dX = (finX - x);
            dY = (finY - y);
            if(finY < y) 
            {
                selection.style.top = finY.toString() + 'px';
                selection.style.bottom = y.toString() + 'px';
                dY = (y - finY);
            }
            if(finX < x) 
            {
                selection.style.left = finX.toString() + 'px';
                selection.style.right = x.toString() + 'px';
                dX = (x - finX);
            }
            xString = dX.toString() + 'px';
            yString = dY.toString() + 'px';
            selection.style.border = '1px dashed #ccc';
            selection.style.display = 'block';
            selection.style.width = xString;
            selection.style.height = yString;
            checkIfOverSquare();
        }
    }
    
    function mouseUp(event) 
    {
        ismousedown = false;
        console.log(selectionAmt);
        if(selectionAmt < 4) //it's possible that this doesn't solve the problem correctly
        {
            setBoardToBeforeSelect();
        }
        selection.remove();
    }

    function setBoardToBeforeSelect()
    {
        for(let i = 0; i < width*width; i++)
        {
            inputs[i].checked = originalInputValues[i];
        }
    }

    function prepareAlreadySelectedArray()
    {
        for(let i = 0; i < width*width; i++)
        {
            alreadySelected[i] = false;
        }
    }

    function checkIfOverSquare()
    {
        selectionRect = selection.getBoundingClientRect();
        for(let i = 0; i < width*width; i++)
        {
            if(selectionRect.right > inputs[i].getBoundingClientRect().left
            && selectionRect.bottom > inputs[i].getBoundingClientRect().top
            && selectionRect.left < inputs[i].getBoundingClientRect().right
            && selectionRect.top < inputs[i].getBoundingClientRect().bottom)
            {
                if(!alreadySelected[i])
                {
                    selectionAmt++;
                    alreadySelected[i] = true;
                    inputs[i].checked = !originalInputValues[i];
                }
            }
        }
    }

    function setInputValues()
    {
        for(let i = 0; i < inputs.length; i++)
        {
            originalInputValues[i] = inputs[i].checked;
        }
    }
})