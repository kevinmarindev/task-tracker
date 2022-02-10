//SELECTORS
const deleteBtn = document.querySelectorAll('#date')
const updateItem = document.querySelectorAll('.item')
const itemsToMarkUncomplete = document.querySelectorAll('.check')
const popUpButton = document.querySelector('.pullup')
const popUpElement = document.querySelector('.popup-main')
const projectsList = document.querySelector('.projects')
const projectForm = document.querySelector('.project-form')
const projectitems = document.querySelectorAll('.project-item')
const projectTitle = document.querySelector('.project-title')
const submitItem = document.querySelector('.submit-item')
const itemsToDisplay = document.querySelector('.items-to-display')
const projectDeleteBttns = document.querySelectorAll('.delete-project')
const todayLink = document.querySelector('.todayItems')

//EVENT LISTENERS
Array.from(updateItem).forEach(thingy => {
    thingy.addEventListener('focusout', updateItemm)
})

Array.from(deleteBtn).forEach(thingy => {
    thingy.addEventListener('focusout', updateDate)
})

Array.from(itemsToMarkUncomplete).forEach(thingy => {
    thingy.addEventListener('click', uncomplete)
})

Array.from(projectitems).forEach(thingy => {
    thingy.addEventListener('click', getItemsWithProject)
})

Array.from(projectDeleteBttns).forEach(item => {
    item.addEventListener('click', deleteProject)
})

popUpButton.addEventListener('click', bringOut)

popUpElement.addEventListener('click', hidePopUp)

submitItem.addEventListener('submit', handleSubmit)

todayLink.addEventListener('click', getTodayItems)


//FUNCTIONS 
async function uncomplete(completedStatus, project){
    console.log(completedStatus, project, this)
    
    const itemId = this.parentNode.dataset.id

    console.log(itemId)
    if(completedStatus === 'c' || completedStatus === 'n') status = completedStatus, console.log('there')
    if(completedStatus !== 'c' && completedStatus !== 'n') status = this.parentNode.childNodes[5].className[0], console.log('here')
    // if(completedStatus != 'n' || completedStatus != 'c') status = this.parentNode.childNodes[5].className[0]
    // const status = completedStatus || this.parentNode.childNodes[5].className[0]
    console.log(status)
    if(status == 'n'){
        try {
        const response = await fetch('todos/completeIt', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemId,
                'status': status
              })
        })
        const data = await response.json()
        console.log(data)
        if(project)getItemsWithProject(null, project)
        else location.reload()

    } catch (error) {
      console.log(error)  
    }
}if(status == 'c'){
    try {
        const response = await fetch('todos/uncompleteIt', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemId,
                'status': status
              })
        })
        const data = await response.json()
        console.log(data)
        if(project) getItemsWithProject(null, project)
        else location.reload()

    } catch (error) {
      console.log(error)  
    }
}

}

async function updateItemm(){
    const itemId = this.parentNode.dataset.id
    const valueOfItem = this.innerText
    const project = projectTitle.innerText
    try {
        const response = await fetch('todos/updateItem', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemId,
                'valueOfItem': valueOfItem
              })
        })
        const data = await response.json()
        console.log(data)
        if(project) getItemsWithProject(null, project)
        else location.reload()

    } catch (error) {
      console.log(error)  
    }
    
}

async function updateDate(){
    let project = projectTitle.innerText
    const itemId = this.parentNode.dataset.id;
    let date = this.innerText
    console.log(itemId, date)
    let regex = /\w\w\w\w-(\w){1,2}-(\w){1,2}/g;
    let dateFormat = date.split('-').join(',').trimEnd()
    let createDate = new Date(dateFormat)
    console.log(dateFormat, createDate)
    // let regex2 = new RegExp('\w\w\w\w/\w{1,2}/\w{1,2}', 'g')
    // let regex = /\w\w\w\w\-\w{1,2}\-\w{1,2}/ | /(\w\w\w\w)/g
    if(regex.test(date) || date == ''){
        try {
            const response = await fetch('todos/updateDate', {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                'itemFromJS': itemId,
                'date': createDate
              })
            })
            if(project)getItemsWithProject(null, project)
            else location.reload()
        } catch (error) {
            
        }
    }
    else console.log('Please enter date as follows: YYYY-MM-DD')

}

//bring out popup
function bringOut(e){
    console.log(e.target)
    if(e.target == popUpButton) popUpElement.style.display = 'block';
}

//hide popup
function hidePopUp(e, project){
    if(project || e.target == popUpElement) popUpElement.style.display = 'none';
}


//see projects for particular project
function seeProject(project){
    projectTitle.innerText = project
    
}


async function handleSubmit(e) {
  e.preventDefault();
let project = projectTitle.innerText;
  console.log(e.target)
  const formData = new FormData(e.target);
  console.log(formData)
  const formProps = Object.fromEntries(formData);
  console.log(formProps)
  let item = formProps.todoItem;
  let date = formProps.date;
  console.log(item, date)
//   if(!projectTitle.innerText)postItemsWithoutProj(e, formProps)
try {
    const response = await fetch('todos/newitem', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                'itemFromJS': item,
                'date': date,
                'project': project      
              })
            })
            if(project) getItemsWithProject(null, project), hidePopUp(null, project)
            else location.reload()
} catch (error) {
    console.log(error)
}
}

async function getItemsWithProject(e, projectt){
    let project =  projectt || e.target.innerText
    console.log('on the func', project)
    try {
       const response = await fetch(`todos/getItemsWithProject/${project}`, {
                method: 'get',
                headers: {'Content-Type': 'application/json'}
                // body: JSON.stringify({
                // 'project': project      
            //   })
            }) 
            // console.log( await response.json())
            let proccesedResponse = await response.json();
            //call fucntion to display response
            // seeProject(project)
            displayItems(proccesedResponse, project)

    } catch (error) {
        console.log(error)
    
    }
}

async function deleteOne(){
    let id = this.parentNode.dataset.id
    let project = projectTitle.innerText
    console.log(id, project)
    try {
        const response = await fetch(`todos/deleteTodo/${id}`, {
                method: 'delete',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    'id': id,
                    'project': project 
              })
            }) 
            if(project)getItemsWithProject(null, project)
            else getTodayItems()
    } catch (error) {
        console.log(error)
    }
}

async function deleteProject(){
    let projectId = this.parentNode.dataset.id
    let project = this.parentNode.childNodes[1].innerText
    console.log(project, projectId)
    try {
        const response = await fetch(`todos/deleteProject`, {
                method: 'delete',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    'projectid': projectId,
                    'project': project 
              })
            }) 
            location.reload()
    } catch (error) {
        console.log(error)
    }
}

function displayItems(objectWithData, project){
    console.log(objectWithData, project)

    document.querySelector('.main-display h2').innerText = `${objectWithData.left}  items left to do in this Project`;
    projectTitle.innerText = project || '';
    console.log(itemsToDisplay)
    
    itemsToDisplay.textContent = '';
    objectWithData.todos.forEach( el => { 
            //creating elements 
            let li = document.createElement('li')
            let itemText = document.createElement('span')
            let date = document.createElement('span')
            let check = document.createElement('span')
            // let form = document.createElement('form')
            let x = document.createElement('button')

            //creating the delete option
            // form.setAttribute('action', `/todos/deleteTodo/${el._id}?_method=DELETE`)
            // form.setAttribute('method', 'POST')
            x.setAttribute('type', 'submit')
            x.innerText = 'X';
            x.addEventListener('click', deleteOne)
            // form.appendChild(x)

            //creating LIs
            li.setAttribute('class', 'todoItem other')
            li.setAttribute('data-id', `${el._id}`)
            
            //creating span for items text
            itemText.setAttribute('contenteditable', 'true')
            itemText.setAttribute('class', `${el.completed ? 'completed' : 'not'}`)
            itemText.innerText = el.todo
            let completedStatus = itemText.className[0]
            itemText.addEventListener('focusout', updateItemm)

            //date option created
            date.setAttribute('id', 'date')
            date.setAttribute('contenteditable', 'true')
            date.addEventListener('focusout', updateDate)
            // let theDate = el.date.toLocaleDateString()
            if(el.date) date.innerText = new Date(el.date).toLocaleDateString('en-US', {timeZone: 'UTC'})

            //creating the check
            check.setAttribute('class', 'check')
            check.innerText = '✓'
            check.addEventListener('click', (e) => uncomplete.call(e.target, completedStatus, project))

            itemsToDisplay.appendChild(li).append(check, x,itemText, date)


        })
}

async function getTodayItems(){
      // console.log(req._startTime)
        let setDate 
        let hour = new Date().getHours()
        console.log('yes')
        console.log(hour, 'now')
        if(hour < 1){
            setDate = new Date(new Date().setMinutes(0,0,0))
        }
        if(hour >= 1) setDate = new Date(new Date().setHours(0,0,0,0))
        
        console.log(setDate) 

    try {
       const response = await fetch(`todos/today/`, {
                method: 'get',
                headers: {'Content-Type': 'application/json'}
                // body: JSON.stringify({
                // 'project': project      
            //   })
            }) 
            // console.log( await response.json())
            let proccesedResponse = await response.json();
            console.log(proccesedResponse)
            
            //call fucntion to display response
            // seeProject(project)
            displayItems(proccesedResponse)

    } catch (error) {
        console.log(error)
    
    }
    
}

//  let setDate = new Date()
//         let timezone = setDate.getTimezoneOffset() / 60
//         console.log(timezone)
//         let offset = setDate - (setDate.getTimezoneOffset() * 60000)
//         console.log(new Date(), new Date(offset))
        // setDate = new Date(new Date(offset).setHours(-6,0,0,0))
        // let hour = new Date().getHours()
        // console.log(hour)
        // if(hour === 0) setDate = new Date(new Date(offset).setMinutes(0,0,0)), console.log('this')

        // if(hour != 0)setDate = new Date(new Date().setHours(`-${timezone}`,0,0,0)), console.log('that')
        // console.log(setDate)
        //if time is 0:00 through 0:59 use set minutes (0,0,0) else set hours 
        
        // new Date(new Date(offset).setHours(`${timezone > 0 ? '-': timezone.replace('-', '')}${timezone > 0 ? timezone : ''}`,0,0,0))
        
        // console.log(setDate, timezone, new Date(new Date().setHours(-6,0,0,0)))