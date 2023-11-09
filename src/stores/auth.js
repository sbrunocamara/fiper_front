import {defineStore} from 'pinia'
import { ref } from 'vue'


export const useAuth = defineStore('auth',{

    state:() => ({

        token: localStorage.getItem('token'),
        user: localStorage.getItem('user'),
        returnUrl: null
       
    }),

    actions:{

        async setToken(tokenValue){
        localStorage.setItem('token',tokenValue);
       
    },

    async setUser(userValue){
        localStorage.setItem('user',userValue);

    },

    getToken(){
       return localStorage.getItem('token');
    },
   getUser(){
        return localStorage.getItem('user');
    },

    async resetSession(){
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
   
}})

export default useAuth