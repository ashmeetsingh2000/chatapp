// ======================= [ Elements Container ] =======================
var user_NAME;
var prev_key;

var login_contianer = document.getElementById('login_contianer');
var login_box = document.getElementById('login_box');
var login_form = document.getElementById('login_contianer');
var first_name = document.getElementById('username');

var chat_app_wrapper = document.getElementById('chat_app_wrapper');
var delete_all_message_button = document.getElementById('delete_all_message_button');

var chat_msj_box = document.getElementById('chat_msj_box');

var send_new_message = document.getElementById('send_new_message');
var message = document.getElementById('message');
// ======================= [Elements Container ] ========================


// ====================== [ Chat App login System ] ======================
login_form.addEventListener('submit', (event) => {

    event.preventDefault();
    user_NAME = first_name.value;
    login_box.innerHTML = `<div class="loader"></div>`;

    setTimeout(() => {

        async function postData(url) {
            try {
                const response = await fetch(url, {
                    keepalive: true,
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },

                    body: JSON.stringify({
                        username: {
                            name: `${user_NAME}`
                        }
                    })
                });
                return response.json();
            }
            catch (err) {
                alert('server offline try again later')
            }
        }

        // postData(`http://localhost:5000/login`).then((data) => {
        postData(`https://chat-app-server-virid.vercel.app/login`).then((data) => {
            if (data.res == 'ok') {

                login_contianer.style.display = 'none'
                chat_app_wrapper.style.display = 'block'

                if (first_name.value.toLowerCase() == 'ashmeet') {

                    // make delete option available
                    delete_all_message_button.style.display = 'block'
                    // make delete option available

                }

                get_all_messages()

            }
            else {
                login_box.innerHTML = `<div class="error_message">Kon H Yoo !</div>`
            }


        })

    }, 1000);

})
// ====================== [ Chat App login System ] ======================


// ======================= [ Chat App APi calls ] =======================

// === Previous all message ===
function get_all_messages() {

    async function get_previous_chats(url) {
        try {
            const response = await fetch(url, {
                method: "GET",
                keepalive: true,
                mode: "cors",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "Access-Control-Allow-Origin": "*",
                },
                referrerPolicy: "no-referrer",

            });
            return response.json();
        }
        catch (err) {
            alert('server offline try again later')
        }
    }

    get_previous_chats(`https://chat-app-server-virid.vercel.app/msj`).then((res) => {
        let prev_data = res.chat_data;

        if (prev_data.length == 0) {
            prev_key = 0;
        }
        else {

            let prev_messages = ''

            prev_data.forEach(item => {
                let class_name = '';

                if (item.name == 'ashmeet') { class_name = 'color_one' }
                if (item.name == 'shalu') { class_name = 'color_Two' }
                if (item.name == 'ranjana') { class_name = 'color_three' }

                if (user_NAME.toLowerCase() == item.name) {
                    prev_messages +=
                        `
                                <div class="message_box">

                                    <div class="empty"></div>
                                    <div class="messge_container ${class_name}">
                                        <p class="msj_person">${item.name}</p>
                                        <p>${item.msj}</p>
                                    </div>

                                </div>
                                `
                }
                else {
                    prev_messages +=
                        `<div class="message_box">

                                        <div class="messge_container ${class_name}">
                                            <p class="msj_person">${item.name}</p>
                                            <p class="msj_text">${item.msj}</p>
                                        </div>
                                        <div class="empty"></div>

                                    </div>`
                }
            });

            prev_key = prev_data[prev_data.length - 1].key;

            chat_msj_box.innerHTML = prev_messages;
        }

        start_tracking_messages()

    })

}
// === Previous all message ===


// fetch updated messages
function start_tracking_messages() {

    async function get_updated_messages(url) {
        try {
            const response = await fetch(url, {
                method: "POST",
                keepalive: true,
                mode: "cors",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    key: prev_key
                })
            });
            return response.json();
        }
        catch (err) {
            alert('server offline try again later')
        }
    }

    get_updated_messages(`https://chat-app-server-virid.vercel.app/current`).then((res) => {

        console.log(res)

        let prev_data = res.chat_data;

        prev_data.forEach(item => {

            let class_name = '';

            if (item.name == 'ashmeet') { class_name = 'color_one' }
            if (item.name == 'shalu') { class_name = 'color_Two' }
            if (item.name == 'ranjana') { class_name = 'color_three' }

            let newDiv = document.createElement("div");
            newDiv.classList.add('message_box');

            if (user_NAME.toLowerCase() == item.name) {

                newDiv.innerHTML = `
                                    <div class="empty"></div>
                                    <div class="messge_container ${class_name}">
                                        <p class="msj_person">${item.name}</p>
                                        <p>${item.msj}</p>
                                    </div>

                                </div>
                                `
            }
            else {
                newDiv.innerHTML = `

                                        <div class="messge_container ${class_name}">
                                            <p class="msj_person">${item.name}</p>
                                            <p class="msj_text">${item.msj}</p>
                                        </div>
                                        <div class="empty"></div>

                                    `
            }
            chat_msj_box.append(newDiv);

        });

        prev_key = prev_data[prev_data.length - 1].key;

        start_tracking_messages();

    })

}
// fetch updated messages


send_new_message.addEventListener('submit', (event) => {
    event.preventDefault();

    async function postData(url) {
        try {
            prev_key += 1
            const response = await fetch(url, {
                method: "POST",
                keepalive: true,
                mode: "cors",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    msj_data: {
                        name: user_NAME,
                        msg: message.value,
                        key: prev_key
                    }
                })
            });
            return response.json();
        }
        catch (err) {
            //   serverError
        }
    }

    postData(`https://chat-app-server-virid.vercel.app/add_msj`).then((data) => { })
    message.value = ''

})
// ======================= [ Chat App APi calls ] =======================


// ====================== [ Delete All Messages ] =======================
function delete_all_current_messages() {
    fetch('https://chat-app-server-virid.vercel.app/delete', {
        method: 'DELETE',
    })
        .then(res => res.json())
        .then(res => { alert(res.msj); location.reload(); })
}
// ====================== [ Delete All Messages ] =======================