const KEY_TASKS = 'tasks'
const urlApi = 'https://jsonplaceholder.typicode.com/todos'
const startTasksListCount = 5
const userId = 1

const currentListTasks = []

document.addEventListener('DOMContentLoaded', () => {
    if(!localStorage.getItem(KEY_TASKS) || localStorage.getItem(KEY_TASKS).length === 2){
        fetch(urlApi)
        .then(response => response.json())
        .then(tasks => {
            const trueTasks = []

            for (let i = 0; i < startTasksListCount; i++){
                trueTasks[i] = tasks[i]
            }

            return trueTasks
        })
        .then(finalTasks => visualTasks(finalTasks, true))
        .catch(error => console.error(error))
    }

    if (localStorage.getItem(KEY_TASKS)) {
        const tasks = JSON.parse(localStorage.tasks)

        visualTasks(tasks, true)
    }
});

document.getElementsByClassName('add-button')[0].addEventListener('click', (e) => {
    const title = e.target.parentElement.getElementsByClassName('add-input')[0].value

    if (title === '') {
        return
    }

    let id = 1

    const sortedListTasks = currentListTasks.sort((a, b) => a.id - b. id)
    
    for(let i = 0; i < sortedListTasks.length + 1; i++){
        if (!sortedListTasks[i] || sortedListTasks[i].id !== i+1){
            id = i+1
            break
        }
    }

    const task = [{
        userId: 1,
        id: id,
        title: title,
        completed: false
    }]


    visualTasks(task, true)
})

document.getElementsByClassName('button-all-tasks-js')[0].addEventListener('click', (e) => {
    visualTasks(currentListTasks)
    document.getElementsByClassName('active')[0].classList.remove('active')
    e.target.classList.add('active')
})

document.getElementsByClassName('button-completed-tasks-js')[0].addEventListener('click', (e) => {
    visualFilterListTasks(true)
    document.getElementsByClassName('active')[0].classList.remove('active')
    e.target.classList.add('active')
})

document.getElementsByClassName('button-current-tasks-js')[0].addEventListener('click', (e) => {
    visualFilterListTasks(false)
    document.getElementsByClassName('active')[0].classList.remove('active')
    e.target.classList.add('active')
})

async function reminderTask (text) {
    const value = Number(prompt(`Через сколько(сек) напомнить про \"${text}\"`))

    if (!isNaN(value) && value > 0) {
        await new Promise(resolve => setTimeout(resolve, value * 1000));
        alert(`НАПОМИНАНИЕ: "${text}"`);
    } else {
        await alert(`Вы ввели не число`)
    }
}

const visualFilterListTasks = (filterCompletedTasks) => {
    const filterListTasks = currentListTasks.filter(task => {
        return task.completed === filterCompletedTasks
    })

    visualTasks(filterListTasks)
}

const visualTask = (task, addToLS) => {
    const {id, title, completed} = task

    const taskListItem = document.createElement('li')
    taskListItem.classList.add('list-task')
    taskListItem.id = `${id}`

    const createInputCheckBoxTask = document.createElement('input')
    createInputCheckBoxTask.type = 'checkbox'
    createInputCheckBoxTask.checked = completed
    createInputCheckBoxTask.id = `${id}_checkbox`
    createInputCheckBoxTask.classList.add('checkbox')

    createInputCheckBoxTask.addEventListener('change', (e) => {
        toggleTaskCompletion(id, e.target.checked);
    });

    taskListItem.appendChild(createInputCheckBoxTask)

    const createLabelTask = document.createElement('label')
    createLabelTask.classList.add('task-text')
    createLabelTask.innerHTML = title
    createLabelTask.setAttribute('for', `${id}_checkbox`)
    if (completed) {
        createLabelTask.classList.add('completed')
    }

    taskListItem.appendChild(createLabelTask)

    const createReminderTask = document.createElement('img')
    createReminderTask.classList.add('reminder')
    createReminderTask.src = './bell.png'
    createReminderTask.alt = 'bell'
    createReminderTask.addEventListener('click', e => {
        reminderTask(task.title)
    })

    taskListItem.appendChild(createReminderTask)

    const createButtonDelTask = document.createElement('button')
    createButtonDelTask.classList.add('delete-task')
    createButtonDelTask.innerHTML = 'Удалить'
    createButtonDelTask.addEventListener('click', () => removeTask(id));


    taskListItem.appendChild(createButtonDelTask)

    if (addToLS){
        currentListTasks.push(task)
    }

    return taskListItem
}

const visualTasks = (tasks, addToLS) => {
    const tasksList = document.getElementsByClassName('list-tasks')[0]

    if(!addToLS){
        tasksList.innerHTML = ''
    }

    tasks.forEach(task => {
        tasksList.appendChild(visualTask(task, addToLS))
    })

    if (addToLS) {
        localStorage.setItem(KEY_TASKS, JSON.stringify(currentListTasks))
    }
}

const toggleTaskCompletion = (id, completed) => {
    const task = currentListTasks.find(task => task.id === id);
    if (task) {
        task.completed = completed;
        localStorage.setItem(KEY_TASKS, JSON.stringify(currentListTasks))
        visualTasks(currentListTasks)
    }
};

const removeTask = (id) => {
    const taskIndex = currentListTasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        currentListTasks.splice(taskIndex, 1);
        localStorage.setItem(KEY_TASKS, JSON.stringify(currentListTasks))
        visualTasks(currentListTasks)
    }
};
