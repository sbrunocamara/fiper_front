<script setup>

</script>

<script>
import { RouterLink } from 'vue-router';
import http from '@/services/http.js'
import moment from 'moment'
import * as bootstrap from 'bootstrap';
import axios from 'axios';

export default {

  name: 'fiper',

  data() {

    return {
      model: {
        marcas_motos: [],
        marcas_carros: [],
        marcas_caminhoes: [],

      },

    }

  },


  mounted() {
    this.getMarcasCarros();
    this.getMarcasMotos();
    this.getMarcasCaminhoes();

  },

  methods: {

    async getMarcasCarros() {
      try {
        const response = await http.get('/marcas/carros');
        this.model.marcas_carros = response.data;

      } catch (error) {
        console.log(error);
      }
    },

    async getMarcasMotos() {
      try {
        const response = await http.get('/marcas/motos');
        this.model.marcas_motos = response.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getMarcasCaminhoes() {
      try {
        const response = await http.get('/marcas/caminhoes');
        this.model.marcas_caminhoes = response.data;
      } catch (error) {
        console.log(error);
      }
    },
  }



}

</script>

<template>
  <main>
  </main>
  <form>

  
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <label class="input-group-text" for="inputGroupSelect01">Marcas</label>
        </div>
        <select v-model="this.model.marcas_motos" required class="form-control" id="exampleFormControlSelect1">
          <!-- <option selected disabled hidden>Default Value</option>
        <option selected>Choose...</option> -->
          <option v-for="(item, index) in this.model.marcas_motos" :value="item.name" :key="index">{{ item.name }}
          </option>

        </select>
      </div>



    <div class="form-group">
      <label for="exampleFormControlSelect1">Example select</label>
      <select class="form-control" id="exampleFormControlSelect1">
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
      </select>
    </div>

    <div class="form-group">
      <label for="exampleFormControlSelect1">Example select</label>
      <select class="form-control" id="exampleFormControlSelect1">
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
      </select>
    </div>
  </form>
</template>

<style scoped>

 /* #exampleFormControlSelect1{
    
    
 } */
</style>