document.addEventListener('DOMContentLoaded', () =>
{
    const gridDisplay = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const resultDisplay = document.getElementById('result');
    const width = 8;
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
    var inputs;
    var originalInputValues = [];
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
        selection.remove();
    }

    function checkIfOverSquare()
    {
        selectionRect = selection.getBoundingClientRect();
        for(let i = 0; i < width*width; i++)
        {
            if(selectionRect.right > inputs[i].getBoundingClientRect().left
            && selectionRect.bottom > inputs[i].getBoundingClientRect().top)
            {
                inputs[i].checked = !originalInputValues[i];
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