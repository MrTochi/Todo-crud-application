let inputField=document.getElementById(`story`)
let form=document.getElementById(`form`)
let submitButton=document.getElementById(`submit`)
let storyBox=document.getElementById(`storyBox`)
let alertText=document.getElementById(`alert`)
let completeB=document.getElementById(`completed`)
let notCompButton=document.getElementById(`not-completed`)
let clearB=document.getElementById(`clear`)
let allB=document.getElementById(`all`)
let buttonCont=document.getElementById(`varieties`)


let todoStories=[]



form.addEventListener(`submit`,collectTodos)

function collectTodos(event){
  event.preventDefault()
  let todo=inputField.value.trim()
  let duplicateTodo=todoStories.some(function(todoObj){
    return (todo==todoObj.userTodo)
  })
  if(todo.length===0){
    alertText.textContent=`Please enter a todo`
    return
  }
  else if(duplicateTodo){
    alertText.textContent=`This item has been previously entered `
    return
  }
  else{
    alertText.textContent=``
    let todoObject={
      userTodo:todo,
      toggleChecker:false
    }
    todoStories.unshift(todoObject)
    localStorage.setItem(`todoStories`,JSON.stringify(todoStories))
    fetchTodo()
    form.reset()
 
  }
  
}


function fetchTodo(){
todoStories=JSON.parse(localStorage.getItem(`todoStories`)) || []
displayOnui(todoStories)
}
fetchTodo()


function displayOnui(theTodos){//this theTodos parameter is here because of the argument passed on the display function in not completed and completed functions
  
  storyBox.innerHTML=``
  if(theTodos.length==0){
    storyBox.textContent=`No Todos Entered Yet`
    storyBox.style.color=`#d3d3d3`
    storyBox.style.alignItems=`center`
    clearB.style.backgroundColor=`gray`
    allB.style.backgroundColor=`gray`
    completeB.style.backgroundColor = 'gray';
    notCompButton.style.backgroundColor = 'gray';
  }
  else{
    theTodos.forEach(function(story,index){
      storyBox.style.color=`black`
      let storyDisplayed=story.userTodo
     

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
  
     
      if(!story.toggleChecker){
        checkBox.append(unChecked,storyLine)
        deleteEditbox.append(deleteB,editB)
        storyContainer.append(checkBox,deleteEditbox)
        storyBox.append(storyContainer)
        clearB.style.backgroundColor=`blue`
        allB.style.backgroundColor=`blue`
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
  let userTarget=event.target
  let targetParent=userTarget.parentElement.parentElement


  if(targetParent.className !== `story-container`)
  {
    return
  }
  else{
    let targetAction=userTarget.dataset.action
  let targetID=targetParent.id
  targetID=Number(targetID)
    if(targetAction===`uncheck` || targetAction===`check`)
    {
      checkTodo(targetID)
    }

    else if(targetAction===`del`){
      delTodo(targetID)
    }

    else if(targetAction===`edit`){
      editTodo(targetID)
    }
  }
  
})




function checkTodo(containerID){
  todoStories=todoStories.map(function(objTodo,objInd){
    if(objInd===containerID){
      return{
        userTodo:objTodo.userTodo,
      toggleChecker:!objTodo.toggleChecker

      }
    }
    else{
      return{
        userTodo:objTodo.userTodo,
      toggleChecker:objTodo.toggleChecker
      }
    }
  })
  localStorage.setItem(`todoStories`,JSON.stringify(todoStories))
  displayOnui(todoStories)
}


/*Delete optiom 1
function delTodo(delID){
todoStories=todoStories.filter(function(objTodo,objInd){
if(objInd !==delID)
{
  return objTodo
}
})
displayOnui()
}*/

//Delete option 2
function delTodo(delID){
  todoStories.forEach(function(objTodo,objInd){
  if(objInd ===delID)
  {
    todoStories.splice(objInd,1) 
  }
  })
  localStorage.setItem(`todoStories`,JSON.stringify(todoStories))
  displayOnui(todoStories)
}


function editTodo(editId){
let todoEdited=todoStories[editId]//when you click on the edit icon,the container carrying the todo object is stored in the array.this is possible using the index number(editId)

inputField.value=todoEdited.userTodo//then,the inputfield now carries the value that is to be edited

submitButton.textContent=`SAVE EDIT`//the button changes to save just to inform the user of their action

form.removeEventListener(`submit`,collectTodos)//i removed the old event listener so as not to reignite the submit action earlier written

form.addEventListener('submit', function saveEditedTodo(event) {//this is a new event listener action to save what was edited
  event.preventDefault();
  todoEdited.userTodo = inputField.value;
  localStorage.setItem('todoStories', JSON.stringify(todoStories));
  fetchTodo();
  form.reset();

  submitButton.textContent = "SUBMIT";//After saving,button text changes to Submit

  form.removeEventListener('submit', saveEditedTodo);//remove the save action
  form.addEventListener('submit', collectTodos);//readd the new submit action
});

}



buttonCont.addEventListener(`click`,function buttonAction(event){
let targetStore=event.target
let userAction=targetStore.dataset.action

let targetsBox=targetStore.parentElement.parentElement
if(targetsBox.className!==`varieties`){
  return
}
else{
  if(userAction===`completed`){
   
    completedFunction()
  }

  else if(userAction===`all`){
   
    allFunction()
  }

  else if(userAction===`not-completed`){
    
    notCompletedFunction()
  }

  else if(userAction===`clear`){
     clearFunction()
  }
}
})



function allFunction() {
  allB.style.backgroundColor = 'blue';
  completeB.style.backgroundColor = 'gray';
  notCompButton.style.backgroundColor = 'gray';
  fetchTodo()//This fetches all the todos from storage and displays it to the Ui since the display function was called in the said function above
}


function clearFunction(){
 todoStories=[]
 localStorage.setItem('todoStories', JSON.stringify(todoStories));
 displayOnui(todoStories)
}

function completedFunction(){
   let completedTodos=todoStories.filter(function(todoObj){
    if(todoObj.toggleChecker==true){
      return todoObj
    }
  })
    //you dont need to save to local storage here like on clear,delete and other functions.this is because this action is temporary.saving a temporary action will alter the flow of seeing all other todos
    if (completedTodos.length === 0) {
      storyBox.textContent = 'No Completed Todos';
      storyBox.style.color = '#d3d3d3';
      storyBox.style.alignItems = 'center';
    } else {
      displayOnui(completedTodos);
    }
  
    completeB.style.backgroundColor = 'blue';
    allB.style.backgroundColor = 'gray';
    notCompButton.style.backgroundColor = 'gray';
}




function notCompletedFunction(){
   let notcompletedTodos=todoStories.filter(function(todoObj){
    if(todoObj.toggleChecker==false){
      return todoObj
    }
   
  })
  if (notcompletedTodos.length === 0) {
    storyBox.textContent = 'No Not-Completed Todos';
    storyBox.style.color = '#d3d3d3';
    storyBox.style.alignItems = 'center';
  } else {
    displayOnui(notcompletedTodos);
  }

  notCompButton.style.backgroundColor = 'blue';
  allB.style.backgroundColor = 'gray';
  completeB.style.backgroundColor = 'gray';

  //you dont need to save to local storage here like on clear,delete and other functions.this is because this action is temporary.saving a temporary action will alter the flow of seeing all other todos
}


