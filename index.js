document.addEventListener('DOMContentLoaded', function(){
  const hosContainer = document.querySelector('#hos-container');  
  const hostURL = 'http://localhost:3000/lpu';
  const addForm = document.querySelector('#main-form');
  let allHosts = [];

  

  fetch(`${hostURL}`) //Create data in json
    .then( response => response.json() )
    .then( hostData => hostData.forEach(function(host) {
      allHosts = hostData;
      hosContainer.innerHTML += `
      <div id=${host.id}>
        <h2>${host.name}</h2>
        <h3> ${host.address}</h4>
        <p>${host.phone}</p>
        <button data-id="${host.id}" id="edit-${host.id}" data-action="edit">Изменить</button>
        <button data-id="${host.id}" id="delete-${host.id}" data-action="delete">Удалить</button>
      </div>`
    })) 


  addForm.addEventListener('submit', (e) => {
      e.preventDefault() // for event 'submit' on the form 

       // constants for input of each attribute {name,address,phone}
  const nameInput = addForm.querySelector('#name').value
  const addressInput = addForm.querySelector('#address').value
  const phoneInput = addForm.querySelector('#phone').value

  fetch(`${hostURL}`, {
    method: 'POST',
    body: JSON.stringify({
      name: nameInput,
      address: addressInput,
      phone: phoneInput
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then( response => response.json()) // 'optimistic rendering' 
.then( host => {
        hosContainer.innerHTML += `
        <div id=${host.id}>
          <h2>${host.name}</h2>
          <h3>${host.address}</h4>
          <p>${host.phone}</p>
          <button data-id="${host.id}" id="edit-${host.id}" data-action="edit">Редактировать</button>
          <button data-id="${host.id}" id="delete-${host.id}" data-action="delete">Удалить</button>
        </div>`
        })
    })
    hosContainer.addEventListener('click', (e) => {
        if (e.target.dataset.action === 'edit') {
    
    const editButton = document.querySelector(`#edit-${e.target.dataset.id}`)
      editButton.disabled = true //disable edit button 

            const hostData = allHosts.find((host) => {
                return host.id == e.target.dataset.id
            })
            e.target.parentElement.innerHTML += `
                   <div id='edit-place'>
                    <form id="main-form">
                     <input required id="edit-name" placeholder="${hostData.name}">
                      <input required id="edit-address" placeholder="${hostData.address}">
                       <input required id="edit-phone" placeholder="${hostData.phone}">
                     <input type="submit" value="Изменить">
                  </div>`
            
        e.target.addEventListener("submit", (e) => {
                event.preventDefault()
    
        const nameInput = document.querySelector("#edit-name").value
        const addressInput = document.querySelector("#edit-address").value
        const phoneInput = document.querySelector("#edit-phone").value
       // const editedHost = document.querySelector(`#host-${hostData.id}`)
    
        fetch(`${hostURL}/${hostData.id}`, {
                  method: 'PATCH',
                  body: JSON.stringify({
                    name: nameInput,
                  address: addressInput,
                  phone: phoneInput
                  }),
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }).then( response => response.json() )
                .then( host => {
                  editedHost.innerHTML = `
                  <div id=host-${host.id}>
                    <h2>${host.name}</h2>
                    <h3>${host.address}</h3>
                    <p>${host.phone}</p>
                    <button data-id=${host.id} id="edit-${host.id}" data-action="edit">Редактировать</button>
                    <button data-id=${host.id} id="delete-${host.id}" data-action="delete">Удалить</button>
                  </div>
                  <div id=edit-host-${host.id}>
                  </div>`
                  editForm.innerHTML = ""
                })
            })

        } else if (e.target.dataset.action === 'delete') {
          console.log('you pressed delete')
          document.querySelector(`#delete-${e.target.dataset.id}`).remove()
          fetch(`${hostURL}/${e.target.dataset.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          }).then( response => response.json())
        }
 })

}) 
        



