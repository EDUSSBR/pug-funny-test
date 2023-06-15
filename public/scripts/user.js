window.onload = async function load() {
    const name = document.querySelector('#name').innerText
    const response = await fetch(`/users/access?name=${name}`)
    const json = await response.json()
    document.querySelector('.count-container').textContent = json.count
}
document.querySelector('button').addEventListener('click', function goBack() {
    window.location.replace('/users')
})