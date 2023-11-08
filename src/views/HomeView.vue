<script setup>

</script>

<script>
import { RouterLink } from 'vue-router';
import http from '@/services/http.js'
import moment from 'moment'
import * as bootstrap from 'bootstrap';
import axios from 'axios';
import { ref } from 'vue';

export default {

  name: 'fiper',

  data() {

    return {
      model: {
        marcas_motos: [],
        marcas_carros: [],
        marcas_caminhoes: [],
        modelos_carros: [],
        modelos_motos: [],
        modelos_caminhoes: [],
        anos_carros: [],
        anos_motos: [],
        anos_caminhoes: [],
        marcas: [],
        modelos: [],
        anos: [],
        selected_marca: '',
        selected_modelo: '',
        selected_ano: '',
        isActiveCar: false,
        isActiveMoto: false,
        isActiveTruck: false,
        type: '',
        codeFipe: '',
        historyValues: [],

      },

    }

  },

  watch: {
    'model.selected_marca': function (val) {
      this.model.modelos = [];
      this.model.anos = [];
      this.getModelos(this.model.type, val);

    },

    'model.selected_modelo': function (val) {
      this.model.anos = [];
      this.getAnos(this.model.type, this.model.selected_marca, val);
    },

    'model.selected_ano': function (val) {
      // console.log(this.model.selected_marca);
      // console.log(this.model.selected_modelo);
      // console.log(this.model.selected_ano);
      this.getValor(this.model.type, this.model.selected_marca, this.model.selected_modelo, val);

    
    },

  },


  mounted() {
    // this.getMarcasCarros();
    // this.getMarcasMotos();
    // this.getMarcasCaminhoes();

  },

  methods: {

    async setType(type,active) {

      this.model.type = type;

      switch (active) {
        case 1:
          this.model.isActiveCar = true;
          this.model.isActiveMoto = false;
          this.model.isActiveTruck = false;
          break;
        case 2:
          this.model.isActiveMoto = true;
          this.model.isActiveCar = false;
          this.model.isActiveTruck = false;
          break;
        case 3:
          this.model.isActiveTruck = true;
          this.model.isActiveCar = false;
          this.model.isActiveMoto = false;
          break;
        default:
          this.model.isActiveCar = false;
          this.model.isActiveMoto = false;
          this.model.isActiveTruck = false;
          break;
      }

      this.getMarcas(type);

    },

    async getMarcas(type) {
      try {
        const response = await http.get('/marcas/' + type);
        this.model.marcas = response.data;

      } catch (error) {
        console.log(error);
      }
    },

    async getModelos(type, brand) {

      try {
        const response = await http.get('/modelos/' + type + '/' + brand);
        this.model.modelos = response.data;

      } catch (error) {
        console.log(error);
      }
    },

    async getAnos(type, brand, model) {

      try {
        const response = await http.get('/anos/' + type + '/' + brand + '/' + model);
        this.model.anos = response.data;

      } catch (error) {
        console.log(error);
      }
    },

    async getValor(type, brand, model, year) {

      try {
        const response = await http.get('/valor/' + type + '/' + brand + '/' + model + '/' + year)
          .then((response) => {

          this.model.codeFipe = response.data.codeFipe;

          this.getHistoryValues(this.model.codeFipe,year);


        })
  

      } catch (error) {
        console.log(error);
      }
    },

    async getHistoryValues(codeFipe,year){

      try {
        const response = await http.get('/valor/historico/'+this.model.type+'/'+codeFipe+'/'+year)
          .then((response) => {

          this.model.historyValues = response.data;

        })
  

      } catch (error) {
        console.log(error);
      }

    }

  },

}


</script>

<template>
  <main>
    
  <div class="d-flex">

<div>
  <button type="button" class="btn m-4" :class="{ active: model.isActiveCar }" @click="setType('carros',1)">
    <font-awesome-icon class="button_type fa-5x" icon="car"  />
  </button>
</div>

<div>
  <button type="button" class="btn  m-4" :class="{ active: model.isActiveMoto }" @click="setType('motos',2)">
    <font-awesome-icon class="button_type fa-5x" icon="motorcycle"  />
  </button>
</div>

<div>
  <button type="button" class="btn  m-4" :class="{ active: model.isActiveTruck }" @click="setType('caminhoes',3)">
    <font-awesome-icon class="button_type fa-5x" icon="truck" />
  </button>
</div>

</div>


<form>


<div class="input-group mb-3" v-show="model.type.length !== 0">
  <div class="input-group-prepend">
    <label class="input-group-text label-select" for="inputGroupSelect01">Marcas</label>
  </div>
  <select v-model="this.model.selected_marca" required class="form-control" id="exampleFormControlSelect1">
    <option value="" disabled selected>Selecione uma marca</option>
    <option v-for="(item, index) in this.model.marcas" :value="item.code" :key="index">{{ item.name }}
    </option>
  </select>
</div>


<div class="input-group mb-3" v-show="model.selected_marca.length !== 0">

  <div class="input-group-prepend">
    <label class="input-group-text label-select" for="inputGroupSelect01">Modelos</label>
  </div>
  <select v-model="this.model.selected_modelo" required class="form-control" id="exampleFormControlSelect1">
    <option value="" disabled selected>Selecione o modelo</option>
    <option v-for="(item, index) in this.model.modelos" :value="item.code" :key="index">{{ item.name }}
    </option>
  </select>
</div>

<div class="input-group mb-3" v-show="model.selected_modelo.length !== 0">
  <div class="input-group-prepend">
    <label class="input-group-text label-select" for="inputGroupSelect01">Anos</label>
  </div>
  <select v-model="this.model.selected_ano" required class="form-control" id="exampleFormControlSelect1">
    <option value="" disabled selected>Selecione o ano do modelo</option>
    <option v-for="(item, index) in this.model.anos" :value="item.code" :key="index">{{ item.name }}
    </option>
  </select>
</div>



</form>
  </main>

</template>

<style scoped>
.form-control {
  width: 14em;
}

.label-select {
  width: 7em;
}

.button_type {
  border-radius: 0;
}



.btn{
  color: #09e17c;
  padding: 0.45em 0.85em;
  border-radius: 1em;

}

.btn:focus{
  border: none;
  color: #09e17c;
}

.btn:hover{
  background-color: white;
  color: #00ff88;
}

.btn.active{
  background-color: #09e17c;
  color: white;
}

main{
padding-top: 5em;
}

</style>