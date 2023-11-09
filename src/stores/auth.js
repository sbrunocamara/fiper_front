import {defineStore} from 'pinia'
import { ref } from 'vue'


export const useAuth = defineStore('auth',{

    state:() => ({

        token: localStorage.getItem('token'),
        user: localStorage.getItem('user'),
        email: localStorage.getItem('email'),
        returnUrl: null
       
    }),

    actions:{

        async setToken(tokenValue){
        localStorage.setItem('token',tokenValue);
       
    },

    async setUser(userValue){
        localStorage.setItem('user',userValue);

    },

    async setEmail(emailValue){
        localStorage.setItem('email',emailValue);
    },

    getToken(){
       return localStorage.getItem('token');
    },
   getUser(){
        return localStorage.getItem('user');
    },
    getEmail(){
        return localStorage.getItem('email');
    },

    async resetSession(){
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('email');
    }
   
}})

export default useAuth