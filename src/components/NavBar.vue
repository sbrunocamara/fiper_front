<script setup>

import * as bootstrap from 'bootstrap';
import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { useAuth } from '@/stores/auth.js'
import axios from 'axios';
import http from '@/services/http.js'
import moment from 'moment'



const user = reactive({})

window.bootstrap = bootstrap;


</script>

<script>



export default {
    name: 'NavBar',

    data() {

        return {

            model: {
                email: '',
                password: '',
                token: localStorage.getItem('token'),
                user: localStorage.getItem('user'),
                email: localStorage.getItem('email'),
                modalLogin: null,
                logged: false,
                modal_confirm_logout: null
            }

        }
    },

    mounted() {
        this.loginCheck()

    },


    methods: {



        async login() {

            const email = this.model.email
            const password = this.model.password
            const auth = useAuth()

            const dataUser = reactive({
                "email": email,
                "password": password
            })

            try {
                const response = await http.post('/login', dataUser).then(response => {


                    if (response.status == 200) {

                        auth.setToken(response?.data[0].token)
                        auth.setEmail(email)
                        auth.setUser(response?.data[1].name)

                        this.model.user = response?.data[1].name
                        this.model.email = email
                        this.model.password = password

                        var myToast = new bootstrap.Toast(document.getElementById('loginSuccess'), {
                            autohide: false,
                            delay: 3500,
                        });

                        myToast.show();

                        this.model.logged = true

                        this.model.modalLogin.hide()

                    }


                })


            } catch (error) {

                if (error.response.status == 401) {

                    var myToast = new bootstrap.Toast(document.getElementById('loginFail'), {
                        autohide: false,
                        delay: 3500,
                    });

                    myToast.show();

                    this.model.email = ''
                    this.model.password = ''

                }

            }

        },

        async openModalLogin() {

            this.model.modalLogin = new bootstrap.Modal(document.getElementById('modalLogin'), focus)
            this.model.modalLogin.show()

        },
        async openModalConfirmLogout() {

            this.model.modal_confirm_logout = new bootstrap.Modal(document.getElementById('confirmDeleteRequisitos'), focus)
            this.model.modal_confirm_logout.show()

        },

        async doLogin() {

            await this.login()

        },

        async logout() {

            try {

                const response = await http.post('/logout', [], {
                    headers: {
                        Authorization: `Bearer ` + localStorage.getItem("token")
                    }
                }
                )
                    .then(response => {


                        const auth = useAuth()

                        this.model.modal_confirm_logout.hide()
                        this.model.user = ''
                        this.model.email = ''
                        this.model.password = ''

                        auth.resetSession()

                        this.model.logged = false


                    })
            }
            catch (error) {

            }


        },

        async loginCheck() {


            try {

                const response = await http.post('/checkLogin', [], {
                    headers: {
                        Authorization: `Bearer ` + localStorage.getItem("token")
                    }
                }
                )
                    .then(response => {


                        if (response.status == 200) {


                            this.model.logged = true

                        }

                        if (response.status == 401) {

                            const auth = useAuth()

                            auth.resetSession()

                            this.model.logged = false

                        }




                    })
            }
            catch (error) {
                if (error.response.status == 401) {

                    const auth = useAuth()

                    auth.resetSession()


                    this.model.logged = false

                }
            }


        },

    }
}

</script>

<template>
    <nav class="navbar navbar-expand-sm ">


        <button v-show="!this.model.logged" type="button" @click="openModalLogin"
            class="logout btn btn-primary ms-auto me-4">Entrar
        </button>

        <div class="dropdown " v-show="this.model.logged">
            
            <button class="logout logged btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="dropdown"

                aria-haspopup="true" aria-expanded="false">
                {{ this.model.user }}

            </button>
            <div class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="dropdownMenu2">
                <button class="dropdown-item" type="button">Painel</button>
                <button class="dropdown-item" type="button" @click="openModalConfirmLogout">Sair</button>
            </div>
        </div>

        <div>

        </div>


    </nav>

<!-- Modal CONFIRM LOGOUT-->
<div class="modal fade" id="confirmDeleteRequisitos" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Deseja sair?</h5>
          <button type="button" class="close" data-dismiss="modal" @click="this.modal_confirm_logout.hide()"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Você tem certeza que deseja encerrar a sessão?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="this.modal_confirm_logout.hide()"
            data-dismiss="modal">Cancelar</button>
          <button type="button" class=" submit btn btn-primary" @click="logout">Confirmar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->

    <!-- MODAL LOGIN -->

    <div class="modal fade" id="modalLogin" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Login</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                        @click="this.model.modalLogin.hide()">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="doLogin">
                        <div class="form-group">
                            <label for="recipient-name" class="col-form-label">Email</label>
                            <input type="text" class="form-control " id="recipient-name" v-model="this.model.email"
                                required>
                        </div>
                        <div class="form-group">
                            <label for="message-text" class="col-form-label">Senha</label>
                            <input type="password" class="form-control " id="recipient-password"
                                v-model="this.model.password" required>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="this.model.modalLogin.hide()"
                                data-dismiss="modal">Voltar</button>
                            <button type="submit" class="submit btn btn-primary">Entrar</button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>

    <!-- SUCESSO LOGIN-->
    <div>
        <div class="toast toastLoginSuccess" id="loginSuccess">
            <div class="toastLoginSuccess-header">
                <strong class="me-auto"><i class="bi-gift-fill"></i> Acesso</strong>
                <button type="button" class="btn-close close-toast" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                Login efetuado com sucesso! <a href="#"></a>
            </div>
        </div>
    </div>
    <!-- Toast -->

    <!-- FALHA LOGIN-->
    <div>
        <div class="toast toastLoginFailed" id="loginFail">
            <div class="toastLoginFailed-header">
                <strong class="me-auto"><i class="bi-gift-fill "></i> Acesso</strong>
                <button type="button" class="btn-close close-toast" data-bs-dismiss="toast "></button>
            </div>
            <div class="toast-body">
                Usuário ou Senha inválidos! <a href="#"></a>
            </div>
        </div>
    </div>
    <!-- Toast -->
</template>

<style scoped>



.dropdown {
    position: absolute;
    right: 0;
    margin-right: 1em;
    top: 0.5em;
    

}

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

.toast {
    position: absolute;
    top: 15;
    right: 0;
    margin: 1em;
    background-color: rgb(7, 202, 36);
    margin-top: 70px;

}

.toastLoginSuccess {
    background-color: rgb(144, 231, 195);
    text-align: center;
    font-family: Poppins;


}

.toastLoginSuccess-header {
    background-color: rgb(56, 235, 146);
    text-align: center;
    font-family: Poppins;
    position: relative;
    margin-top: none;
}

.toastLoginFailed {
    background-color: rgb(231, 144, 144);
    text-align: center;
    font-family: Poppins;
}

.toastLoginFailed-header {
    background-color: rgb(238, 59, 59);
    text-align: center;
    font-family: Poppins;
    position: relative;
}

.close {
    border-style: none;
    background-color: transparent;
}

.close-toast {
    position: absolute;
    right: 0.5em;

}

.logged{

background-color: rgba(136, 228, 216, 0.808);
border-color: rgba(136, 228, 216, 0.808); 

}

.logged:focus{
    background-color: rgb(5, 223, 204);
    border-color: rgb(5, 223, 204);

}

.logout:active{
    background-color: #00fde8;
    color: white;
}

.dropdown-item:hover{

    background-color: #b5f0eb;
    border-radius: 3%;

}

.submit{
    background-color: rgb(5, 223, 204);
    border-color: rgb(5, 223, 204);
}

.submit:hover{
    background-color: rgb(7, 248, 228);
    border-color: rgb(7, 248, 228);
}

.submit:active{
    background-color: rgb(7, 117, 108);
    border-color: rgb(7, 117, 108);
}

</style>
```