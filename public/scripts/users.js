const form = document.getElementsByTagName('form')[0]
const permissionButton = document.querySelector('#permissionButton')
const permissionForm = document.querySelector('#permissionForm')
const errorMessage = document.getElementById('error-message')
const errorMessagePermissions = document.getElementById('error-message-permissions')
const users = document.querySelectorAll('.user')
const loginButton = document.getElementById('loginButton')
const updateUserButton = document.getElementById('updateUserButton')
const loginMessage = document.querySelector('#login-message')
const deleteMessage = document.querySelector('#delete-message')
const updateMessage = document.querySelector('#update-message')
const token = document.querySelector('#token')
let userName;
let userPassword;
let selectIdForUpdating;
const userForDeletion = document.querySelectorAll('.user-for-deletion')
const userForUpdate = document.querySelectorAll('.user-for-update')


updateUserButton.addEventListener('click', async function updateUser(e) {
    const newName = document.querySelector('#user-name-for-updating').value
    const newJob = document.querySelector('#user-job-for-updating').value
    console.log(selectIdForUpdating)
    const token = localStorage.getItem('token')
    const data = { name: newName, job: newJob }
    const response = await fetch(`/users?id=${selectIdForUpdating}`, { method: 'PUT', headers: { 'Authorization': token, 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (response.ok) {
        alert('User info updated sucessfuly!!')
        window.location.reload()
    } else {
        updateMessage.textContent = "You don't have permission for updating!! Please, set an user and password above and make sure you've clicked for making login in the bottom button!"
    }
})
userForUpdate.forEach(user => user.addEventListener('click', async function updateUserInputInfo(e) {
    const nameInput = document.querySelector('#user-name-for-updating')
    const jobInput = document.querySelector('#user-job-for-updating')
    selectIdForUpdating = e.currentTarget.children[0].innerText
    nameInput.value = e.currentTarget.children[1].innerText
    jobInput.value = e.currentTarget.children[2].innerText
}))
userForDeletion.forEach(user => user.addEventListener('click', async function deleteUser(e) {
    const token = localStorage.getItem('token')
    const name = e.currentTarget.children[1].innerText
    if (token.split('--')[1] === name) {
        const shouldDelete = confirm('You are going to delete your own account and permissions, is it ok?')
        if (!shouldDelete) {
            return;
        }
    }
    const response = await fetch(`/users?name=${name}`, { method: 'DELETE', headers: { 'Authorization': token } })
    if (response.ok) {
        window.location.reload()
    } else {
        deleteMessage.textContent = "You don't have permission for deleting!! Please, set an user and password above and make sure you've clicked for making login in the bottom button!"
    }

}))
users.forEach(item => item.addEventListener('click', function redirect(e) {
    const name = e.currentTarget.children[1].innerText
    window.location.replace(`user?name=${name}`)
}))


loginButton.addEventListener('click', async function getToken(e) {
    const loginBody = { name: userName, password: userPassword }
    try {
        const response = await fetch('/login', { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify(loginBody) })
        if (!response.ok) {
            loginMessage.textContent = 'You have to set permissions before trying to make login, only allowed users can login with their name and password.'
            return
        }
        const receivedToken = await response.json()
        localStorage.setItem('token', receivedToken.token)
        loginMessage.textContent = ''
        token.textContent = "Yaaa, Login made sucessfully!! Your token is: " + receivedToken.token
    } catch (error) {
    }
})


permissionButton.addEventListener('click', async function addPermission(e) {
    e.preventDefault()
    const radiosChecked = [...document.querySelectorAll('input[type=radio]')].filter(item => (item.checked))
    if (radiosChecked.length === 0) {
        return errorMessagePermissions.textContent = "You need to choose a name."
    }
    const name = radiosChecked[0].value
    const checkBoxItemsChecked = [...document.querySelectorAll('input[type=checkbox]')]
    const [canDelete, canUpdate] = checkBoxItemsChecked.map(item => item.checked)
    const password = document.querySelector('#permission-password').value
    if (password.trim().length === 0) {
        return errorMessagePermissions.textContent = "Please write something as password."
    }
    const data = JSON.stringify({ name, canDelete, canUpdate, password })
    const response = await fetch('/givePermission', { method: 'POST', headers: { 'Content-type': 'Application/json', 'Authorization': 'meutokensecreto' }, body: data })
    if (response.ok) {
        userName = name
        userPassword = password;
        alert(`Permission settings added to user ${name}! Please now click on the makeLogin Button for simulating your login and setting up a token!!`)
    }
})


form.addEventListener('submit', async function (e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const job = formData.get('job').trim()
    const name = formData.get('name').trim()
    if (!name || !job) {
        errorMessage.textContent = 'Please, use a valid name/job.'
        return;
    }
    const data = { job, name }
    try {
        const response = await fetch(`/users`, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })
        if (response.status === 409) {
            errorMessage.textContent = 'User already exists. Please, try another name.'
            return;
        }
        window.location.reload()
    } catch (e) {
        console.log(e)
        errorMessage.textContent = 'Network error, please try again.'
    }
})