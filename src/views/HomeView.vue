<script setup>
import NavBar from '@/components/NavBar.vue'
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
        historyLoading: false,
        historyTeste: [{
          "vehicleType": 2,
          "brand": "YAMAHA",
          "model": "YZF R-3 321/ABS",
          "modelYear": 2020,
          "fuel": "Gasolina",
          "codeFipe": "827097-0",
          "fuelAcronym": "G",
          "priceHistory": [
            {
              "price": "R$ 26.900,00",
              "month": "novembro de 2023",
              "reference": "303"
            },
            {
              "price": "R$ 27.080,00",
              "month": "outubro de 2023",
              "reference": "302"
            },
            {
              "price": "R$ 26.630,00",
              "month": "setembro de 2023",
              "reference": "301"
            }
          ]
        }],


      },

    }

  },

  watch: {
    'model.selected_marca': function (val) {
      this.model.modelos = [];
      this.model.anos = [];

      if (val.length !== 0) {
        this.getModelos(this.model.type, val);
      }


    },

    'model.selected_modelo': function (val) {
      this.model.anos = [];

      if (val.length !== 0) {
        this.getAnos(this.model.type, this.model.selected_marca, val);
      }

    },

    'model.selected_ano': function (val) {

      if (val.length !== 0) {
        this.getValor(this.model.type, this.model.selected_marca, this.model.selected_modelo, val);

        this.model.historyLoading = true;
      }


    },

  },


  mounted() {

    // this.getMarcasCarros();
    // this.getMarcasMotos();
    // this.getMarcasCaminhoes();

  },

  methods: {

    async setType(type, active) {

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
        const response = await http.get('/brands/' + type);
        this.model.marcas = response.data;

      } catch (error) {
        console.log(error);
      }
    },

    async getModelos(type, brand) {

      try {
        const response = await http.get('/models/' + type + '/' + brand);
        this.model.modelos = response.data;

      } catch (error) {
        console.log(error);
      }
    },

    async getAnos(type, brand, model) {

      try {
        const response = await http.get('/years/' + type + '/' + brand + '/' + model);
        this.model.anos = response.data;

      } catch (error) {
        console.log(error);
      }
    },

    async getValor(type, brand, model, year) {

      try {
        const response = await http.get('/value/' + type + '/' + brand + '/' + model + '/' + year)
          .then((response) => {

            this.model.codeFipe = response.data.codeFipe;

            this.getHistoryValues(this.model.codeFipe, year);


          })


      } catch (error) {
        console.log(error);
      }
    },

    async getHistoryValues(codeFipe, year) {

      try {
        const response = await http.get('/values/history/' + this.model.type + '/' + codeFipe + '/' + year)
          .then((response) => {

            this.model.historyValues = response.data;
            this.model.historyLoading = false;

          })


      } catch (error) {
        console.log(error);
      }

    },

    
    async exportPdf(codeFipe, year) {

try {
  const response = await http.get('/value/history/' + this.model.type + '/' + codeFipe + '/' + year + '/export/pdf')
    .then((response) => {

      this.model.historyValues = response.data;
      this.model.historyLoading = false;

    })


} catch (error) {
  console.log(error);
}

},

    async reload() {

      this.model.historyValues = [];
      this.model.historyLoading = false;
      this.model.selected_marca = '';
      this.model.selected_modelo = '';
      this.model.selected_ano = '';
      this.model.type = '';
      this.model.codeFipe = '';
      this.model.isActiveCar = false;
      this.model.isActiveMoto = false;
      this.model.isActiveTruck = false;

    }

  },

}


</script>

<template>
  <header>
    <NavBar />
  </header>
  <main>

    <div v-show="model.historyValues.length === 0 && !this.model.historyLoading">

      <div class="d-flex">

        <div>
          <button type="button" class="btn m-4" :class="{ active: model.isActiveCar }" @click="setType('cars', 1)">
            <font-awesome-icon class="button_type fa-5x" icon="car" />
          </button>
        </div>

        <div>
          <button type="button" class="btn  m-4" :class="{ active: model.isActiveMoto }" @click="setType('motorcycles', 2)">
            <font-awesome-icon class="button_type fa-5x" icon="motorcycle" />
          </button>
        </div>

        <div>
          <button type="button" class="btn  m-4" :class="{ active: model.isActiveTruck }"
            @click="setType('trucks', 3)">
            <font-awesome-icon class="button_type fa-5x" icon="truck" />
          </button>
        </div>

      </div>


      <form>

        <div class="input-group mb-3" v-show="model.type.length !== 0">
          <div class="input-group-prepend">
            <label class="input-group-text label-select" for="inputGroupSelect01">Marcas</label>
          </div>
          <select v-model="this.model.selected_marca" required class="form-control" id="selectMarcas">
            <option value="" disabled selected>Selecione uma marca</option>
            <option v-for="(item, index) in this.model.marcas" :value="item.code" :key="index">{{ item.name }}
            </option>
          </select>
        </div>


        <div class="input-group mb-3" v-show="model.selected_marca.length !== 0">

          <div class="input-group-prepend">
            <label class="input-group-text label-select" for="inputGroupSelect01">Modelos</label>
          </div>
          <select v-model="this.model.selected_modelo" required class="form-control" id="selectModelos">
            <option value="" disabled selected>Selecione o modelo</option>
            <option v-for="(item, index) in this.model.modelos" :value="item.code" :key="index">{{ item.name }}
            </option>
          </select>
        </div>

        <div class="input-group mb-3" v-show="model.selected_modelo.length !== 0">
          <div class="input-group-prepend">
            <label class="input-group-text label-select" for="inputGroupSelect01">Anos</label>
          </div>
          <select v-model="this.model.selected_ano" required class="form-control" id="selectAnos">
            <option value="" disabled selected>Selecione o ano do modelo</option>
            <option v-for="(item, index) in this.model.anos" :value="item.code" :key="index">{{ item.name }}
            </option>
          </select>
        </div>
      </form>
    </div>


    <div v-show="model.historyValues.length === 0 && model.historyLoading">
      <div class="spinner-grow loading1" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="spinner-grow loading2" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="spinner-grow loading3" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="spinner-grow loading4" bg-info role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="spinner-grow loading5" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="spinner-grow loading6" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="spinner-grow loading7" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="spinner-grow loading8" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <!-- CARD VEICULO -->
    <div v-show="model.historyValues.length !== 0">
      <div class="d-flex">
        <div class="card_items">
          <div>

            <div class="list_header">
              {{ this.model.historyValues.brand + ' ' + this.model.historyValues.model }}</div>
          </div>

          <div class="card_list">
            <div
              style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 4px; display: inline-flex">
              <div style="width: 24px; height: 24px; position: relative">
                <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute"></div>
                <div
                  style="width: 16px; height: 16px; left: 2px; top: 4px; position: absolute; border-radius: 100%; background: #0bffbd">
                </div>
              </div>
              <div class="list_items">
                <div class="list_name">Marca</div>
                <div>{{ this.model.historyValues.brand }}</div>
              </div>

            </div>


            <div
              style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 4px; display: inline-flex">
              <div style="width: 24px; height: 24px; position: relative">
                <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute"></div>
                <div
                  style="width: 16px; height: 16px; left: 2px; top: 4px; position: absolute; border-radius: 100%; background: #0bffbd">
                </div>
              </div>
              <div class="list_items">
                <div class="list_name">Modelo</div>
                <div>{{ this.model.historyValues.model }}</div>
              </div>
            </div>


            <div
              style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 4px; display: inline-flex">
              <div style="width: 24px; height: 24px; position: relative">
                <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute"></div>
                <div
                  style="width: 16px; height: 16px; left: 2px; top: 4px; position: absolute; border-radius: 100%; background: #0bffbd">
                </div>
              </div>
              <div class="list_items">
                <div class="list_name">Ano</div>
                <div>{{ this.model.historyValues.modelYear }}</div>
              </div>
            </div>


            <div
              style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 4px; display: inline-flex">
              <div style="width: 24px; height: 24px; position: relative">
                <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute"></div>
                <div
                  style="width: 16px; height: 16px; left: 2px; top: 4px; position: absolute; border-radius: 100%; background: #0bffbd">
                </div>
              </div>
              <div class="list_items">
                <div class="list_name">Combustivel</div>
                <div>{{ this.model.historyValues.fuel }}</div>
              </div>
            </div>
          </div>

        </div>

        <!-- END CARD VEICULO -->


        <!-- CARD VALORES -->

        <div v-show="model.historyValues.length !== 0">
          <div class="card_values">
            <p class="text_values">Histórico</p>
            <div class="card_list_values">
              <div v-for="item in this.model.historyValues.priceHistory">
                <div
                  style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 4px; display: inline-flex">
                  <div style="padding-right: 1em;">
                    <div style="width: 30px; height: 8px; top: 10px; border-radius: 13%; background: #0bffbd">
                    </div>
                  </div>
                  <div class="list_items_values">
                    <div class="list_name_values">{{ item.month }}</div>
                    <div class="month">{{ item.price }}</div>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <div class="d-flex justify-content-center">



        <button type="button" @click="reload" class="btn-action btn-primary">Nova consulta</button>
        <div class="dropdown ">

          <button class="logout btn-action btn-primary md-5 dropdown-toggle" type="button" id="dropdownMenu2"
            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Exportar

          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
            <button class="dropdown-item" type="button">PDF</button>
            <button class="dropdown-item" type="button" @click="openModalConfirmLogout">E-mail</button>
          </div>
        </div>

      </div>



    </div>


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

.btn-action {
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  padding: 0.45em 0.85em;
  border-radius: 1em;
  background-color: #38c7bb;
  border: none;
  margin-top: 2em;
  margin: 2em 1em
}

.btn-action:hover {
  background-color: rgb(5, 223, 204);


}


.btn-action:active {
  background-color: #00fde8;
  color: white;
}

.btn {
  color: #38c7bb;
  padding: 0.45em 0.85em;
  border-radius: 1em;
}

.btn:focus {
  border: none;
  color: #09e17c;
}

.btn:hover {
  background-color: white;
  color: #08f5e1;
}

.btn.active {
  background-color: #38c7bb;
  color: white;
}

main {
  padding-top: 5em;
}

.list_items {
  flex: 1 1 0;
  color: #ffffff;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  word-wrap: "break-word";
  white-space: nowrap;
  /* width: 10px; */
  background-color: #5b77fe;
  overflow: hidden;
  text-overflow: clip;
  border-radius: 15px;
  text-align: center;
}



.list_name {
  background-color: #38c7bb;
  border-radius: 15px;
  flex: 1 1 0;
  /* text-overflow: clip; */
  font-size: 16px;
  /* font-family: Inter; */
  font-weight: 600;
  width: 125px;

  /* margin-left: 10px; */

}

.list_header {
  width: 270px;
  padding: 2%;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  /* margin-left: 15px; */
  margin-bottom: 15px;
  margin-top: 10px;
  /* margin-right: 15px; */
  text-align: center;
  border-radius: 15px;
  background-color: #38c7bb;

}

.card_items {
  width: 100%;
  height: 100%;


  padding: 24px 16px 50px 16px;

  background: #3749d1;
  border-radius: 12px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 24px;
  display: inline-flex
}

.card_list {
  align-self: stretch;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 24px;
  display: flex
}

.card_values {
  margin-top: 18em;
  margin-left: 2em;


}

.card_list_values {
  align-self: stretch;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 24px;
  display: flex
}

.list_items_values {
  flex: 1 1 0;
  color: #ffffff;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  word-wrap: "break-word";
  white-space: nowrap;
  /* width: 10px; */
  background-color: #5b77fe;
  overflow: hidden;
  text-overflow: clip;
  border-radius: 15px;
  text-align: center;
}

.list_name_values {
  background-color: #38c7bb;
  border-radius: 15px;
  flex: 1 1 0;
  /* text-overflow: clip; */
  font-size: 16px;
  /* font-family: Inter; */
  font-weight: 600;
  height: 1.6em;
  width: 200px;

  /* margin-left: 10px; */

}

.text_values {
  font-family: poppins;
  color: #5b77fe;
  border-radius: 15px;
  width: 1px;
  text-align: center;
  font-size: 28px;

}


.loading1 {
  background-color: #04867b;

}

.loading2 {
  background-color: #02b3a4;
}

.loading3 {
  background-color: #0bffbd;
}

.loading4 {
  background-color: #00ffbb;
}

.loading5 {
  background-color: rgb(7, 240, 201);
}

.loading6 {
  background-color: rgb(5, 187, 172);
}

.loading7 {
  background-color: #08ca5f;
}

.loading8 {
  background-color: #05e66a;
}


.logout:hover {
    background-color: rgb(5, 223, 204);
    border-color: rgb(5, 223, 204);
}

.logout:active {
    background-color: #00fde8;
    color: white;
}


.dropdown-item:hover{

background-color: #b5f0eb;
border-radius: 3%;

}

</style>