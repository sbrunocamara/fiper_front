<script setup>

import * as bootstrap from 'bootstrap';

window.bootstrap = bootstrap;

const auth = useAuth()
const user = reactive({})

async function login() {
    const userName = user.user
    const password = user.password

    const dataUser = reactive({
        "user": userName,
        "password": password
    })

    try {
        const response = await http.post('/login', dataUser)

        await auth.setToken(response?.data.token)
        await auth.setUser(userName)

        router.push("/home");


    } catch (error) {
        var myToast = new bootstrap.Toast(document.getElementById('myToast'), {
            autohide: true,
            delay: 3500,
        });
        myToast.show();
    }


}

</script>

<template>
    <nav class="navbar navbar-expand-sm ">
        <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <button  v-show="model.historyValues.length" type="button" class="logout btn btn-primary ms-auto me-4">Entrar</button>
                <button v-show="model.historyValues.length" type="button" class="logout btn btn-primary ms-auto me-4">Sair</button>
            </div>
        </div>
    </nav>
</template>

<style scoped>


.logout:hover {
    background-color: rgb(5, 223, 204);
    border-color: rgb(5, 223, 204);
}

.logout:active {
  background-color: #00fde8;
  color: white;
}

.logout {
    background-color: rgb(212, 212, 212);
    border-color: rgb(212, 212, 212);


}
</style>
```