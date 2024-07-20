let inputField=document.getElementById(`story`)
let form=document.getElementById(`form`)
let submitButton=document.getElementById(`submit`)
let storyBox=document.getElementById(`storyBox`)
let alertText=document.getElementById(`alert`)
let completeButton=document.getElementById(`completed`)
let notCompButton=document.getElementById(`not-completed`)
let clearButton=document.getElementById(`clear`)
let allButton=document.getElementById(`all`)
let buttonContainer=document.getElementById(`varieties`)


let todoArray=[]

form.addEventListener(`submit`,collectUserTodos)


function collectUserTodos(event){
event.preventDefault()
let todos=inputField.value.trim()
let isDuplicate=todoArray.some(function(todoObj,index){
return todoObj.todo===todos
})


if(todos.length===0){
    alertText.textContent=`Please enter a to-do item`
    return
}
else if(isDuplicate){
    alertText.textContent=`You have entered this item before`
    return
}
else{
    alertText.textContent=``
    let todosObject={
        todo:todos,
        checker:false
    }
    todoArray.unshift(todosObject)
    localStorage.setItem(`todoArray`,JSON.stringify(todoArray))
    form.reset()
    fetchFromStorage()
}
}

function fetchFromStorage(){
    todoArray=JSON.parse(localStorage.getItem(`todoArray`)) || []
    displayTodo(todoArray)
}
fetchFromStorage()



function displayTodo(theTodo){
    console.log(theTodo);
storyBox.innerHTML=``
if(theTodo.length===0)
{
    storyBox.textContent=`Todos are not available`
    storyBox.style.alignItems=`center`
    storyBox.style.color=`#d7d7d7`
    clearButton.style.backgroundColor=`gray`
    allButton.style.backgroundColor=`gray`
}

else{
      storyBox.style.color=`black`
      theTodo.forEach(function(todoObj,index){
        
        let storyDisplayed=todoObj.todo

      let storyContainer = document.createElement('div');
      storyContainer.classList.add('story-container')
      storyContainer.id=index
      
  
      let checkBox=document.createElement(`div`)
      checkBox.classList.add(`checkBox`)
      checkBox.id=`checkBox` 
  
      let checked=document.createElement(`i`)
      checked.classList.add(`fa-regular`,`fa-circle-check`)
      checked.setAttribute(`data-action`,`check`)
      checked.id=`check`
      checked.style.cursor=`pointer`
      checked.style.color=`green`
  
  
      let unChecked=document.createElement(`i`)
      unChecked.classList.add(`fa-regular`,`fa-circle`)
      unChecked.setAttribute(`data-action`,`uncheck`)
      unChecked.id=`uncheck`
      unChecked.style.cursor=`pointer`
     
  
      let storyLine=document.createElement(`p`)
      storyLine.textContent=storyDisplayed
      storyLine.style.fontSize=`0.9rem`
      storyLine.setAttribute(`data-action`,`uncheck`)
      storyLine.id=`uncheck`
      storyLine.style.cursor=`pointer`
  
      let deleteEditbox=document.createElement(`div`)
      deleteEditbox.classList.add(`deleteEditbox`)
      deleteEditbox.id=`deleteEditbox`
  
      let deleteB=document.createElement(`i`)
      deleteB.classList.add(`fa-solid` ,`fa-trash`)
      deleteB.setAttribute(`data-action`,`del`)
      deleteB.id=`del`
      deleteB.style.cursor=`pointer`
  
  
      let editB=document.createElement(`i`)
      editB.classList.add(`fa-solid` ,`fa-pen-to-square`)
      editB.setAttribute(`data-action`,`edit`)
      editB.id=`edit`
      editB.style.cursor=`pointer`
  
     
      if(!todoObj.checker){
        checkBox.append(unChecked,storyLine)
        deleteEditbox.append(deleteB,editB)
        storyContainer.append(checkBox,deleteEditbox)
        storyBox.append(storyContainer)
        clearButton.style.backgroundColor=`green`
        allButton.style.backgroundColor=`green`
      }
      else{
        checkBox.append(checked,storyLine)
        deleteEditbox.append(deleteB,editB)
        storyContainer.append(checkBox,deleteEditbox)
        storyBox.append(storyContainer)
        storyLine.style.textDecoration = 'line-through'
  }
      })
}
}


storyBox.addEventListener(`click`,function(event){
let userEvent=event.target
let userAction=userEvent.dataset.action
let targetParent=userEvent.parentElement.parentElement
let parentId=targetParent.id
parentId=Number(parentId)

if(targetParent.className !== `story-container`){
    return
}
else{
    if(userAction===`uncheck` || userAction===`check`)
    {
        checkUncheck(parentId)
    }

    else if(userAction===`del`)
    {
        deleteTodo(parentId)
    }

    else if(userAction===`edit`)
    {
        editTodo(parentId)
    }
}
})


function checkUncheck(parentId){
todoArray=todoArray.map(function(todoobj,ind){
    if(ind===parentId){
        return{
            todo:todoobj.todo,
            checker:!todoobj.checker
        }
    }
    else{
        return{
            todo:todoobj.todo,
            checker:todoobj.checker
        }
    }
})
localStorage.setItem(`todoArray`,JSON.stringify(todoArray))
displayTodo(todoArray)
}



function deleteTodo(parentId){
    todoArray.splice(parentId,1)
localStorage.setItem(`todoArray`,JSON.stringify(todoArray))
displayTodo(todoArray)
}


function editTodo(parentId){
    let editedTodo=todoArray[parentId]
    inputField.value=editedTodo.todo
    submitButton.textContent=`SAVE TO-DO`
    let newTodo= inputField.value.trim()
    form.removeEventListener(`submit`,collectUserTodos)

    form.addEventListener(`submit`,function editedCollects(event){
    event.preventDefault()
    editedTodo.todo=inputField.value.trim()
    localStorage.setItem(`todoArray`,JSON.stringify(todoArray))
    fetchFromStorage()
    form.reset()
    submitButton.textContent=`SUBMIT`
    form.removeEventListener(`submit`,editedCollects)
    form.addEventListener(`submit`,collectUserTodos)      
        
    
    
    })

}



buttonContainer.addEventListener(`click`,function(event){
    let userEvent=event.target
    let userAction=userEvent.dataset.action
    
    
    let targetParent=userEvent.parentElement.parentElement

    if(targetParent.className !== `varieties`){
        console.log(targetParent);
        return
    }
    else{
        if(userAction===`all`)
        {
            console.log(`all`);
            allFunction()
        }
    
        else if(userAction===`completed`)
        {
            completed()
          
        }
    
        else if(userAction===`not-completed`)
        {
            notCompleted()
        }

        else if(userAction===`clear`)
            {
                clearFunction()
            }
    
    }
    })


  function clearFunction(){
    todoArray=[]
    localStorage.setItem(`todoArray`,JSON.stringify(todoArray))
    displayTodo(todoArray)
  }

  function allFunction(){
    allButton.style.backgroundColor=`green`
    completeButton.style.backgroundColor=`gray`
    notCompButton.style.backgroundColor=`gray`
    fetchFromStorage()
  }

  function completed(){
    let completeArray=todoArray.filter(function(todoObj){
        return todoObj.checker==true
    })
  if(completeArray.length==0){
    storyBox.textContent=`No completed Todos yet`
    storyBox.style.color = '#d3d3d3';
  storyBox.style.alignItems = 'center';
  }
    else{
        displayTodo(completeArray)
    }
    allButton.style.backgroundColor=`gray`
    notCompButton.style.backgroundColor=`gray`
    completeButton.style.backgroundColor=`green`
  }



  function notCompleted(){
    let notCompletedArray=todoArray.filter(function(todoObj){
        return todoObj.checker==false
    })
    if(notCompletedArray.length==0){
        storyBox.textContent=`All Todos are completed`
        storyBox.style.color = '#d3d3d3';
      storyBox.style.alignItems = 'center';
    }
    else{
        displayTodo(notCompletedArray)
    }
    allButton.style.backgroundColor=`gray`
    notCompButton.style.backgroundColor=`green`
    completeButton.style.backgroundColor=`gray`
  

}


let zit=7312*30
let dif=3908*30
let celbt10=5172*6
let sum=zit+dif+celbt10
console.log(sum/2);
