<template>
  <div id="app">
    <!-- NAVBAR WITH RESPONSIVE TOGGLE -->
    <nav class="navbar navbar-expand-sm navbar-light bg-light mb-3">
        <div class="container">
          <a class="navbar-brand" href="#">{{$t('models')}}</a>
          <button class="navbar-toggler" data-toggle="collapse" data-target="#navbarNav"><span class="navbar-toggler-icon"></span></button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav">
                  <li class="nav-item">
                        <router-link to="/sir" class="nav-link">{{$t('sirModel')}}</router-link>
                  </li>
                  <li class="nav-item">
                      <router-link to="/seir" class="nav-link">{{$t('seirModel')}}</router-link>
                  </li>
                  <li class="nav-item">
                      <router-link to="/camas" class="nav-link">{{$t('icuBeds')}}</router-link>
                  </li>
                  <li class="nav-item">
                      <router-link to="/evolucion" class="nav-link">{{$t('evolution')}}</router-link>
                  </li>
                  <li class="nav-item">
                      <router-link to="/comunidades" class="nav-link">{{$t('comunidades')}}</router-link>
                  </li>
                  <li class="nav-item">
                      <router-link to="/somos" class="nav-link">{{$t('who')}}</router-link>
                  </li>

                  <li class="nav-item">
                    <button class="bg-light lang" @click="changeLocale('en')">
                        <span title="us" class="flag-icon flag-icon-us"></span> English
                    </button>
                  </li>

                  <li class="nav-item">
                    <button class="bg-light lang" @click="changeLocale('es')">
                        <span title="es" class="flag-icon flag-icon-es"></span> Español
                    </button>
                  </li>

              </ul>
            </div>

          </div>
    </nav>

    <!-- HOME SECTION -->
    <header id="home-section">
      <div class="light-overlay">
        <div class="home-inner container">
          <router-view></router-view>
        </div>
      </div>
    </header>

    <footer>
      <cookie-law theme="base" buttonText="Aceptar" buttonDecline buttonDeclineText="Rechazar">
        <div slot="message">
          {{$t('cookies')}} <router-link to="privacidad">{{$t('privacyPolicy')}}.</router-link>
        </div>
      </cookie-law>
    </footer>

    <!-- FOOTER -->
    <footer id="main-footer" class="bg-light">
      <div class="container">
        <div class="row">
          <div class="col text-center py-4">
            <h5><strong>{{$t('moreInfo')}}</strong><a href='https://www.jotdown.es/2020/03/como-combatir-una-pandemia-ii/'>"Cómo combatir una pandemia"</a></h5>
          </div>
        </div>
        <users/>
      </div>
    </footer>
  </div>
</template>

<script>
import CookieLaw from 'vue-cookie-law'
import i18n from './plugins/i18n'
import Users from './components/Users'

export default {
  name: 'app',
  components: {
    CookieLaw,
    Users,
  },

  data() {
    return {
      languages: [
        { flag: 'us', language: 'en', title: 'English' },
        { flag: 'es', language: 'es', title: 'Español' }
      ]
    };
  },
  methods: {
    changeLocale(locale) {
      i18n.locale = locale;
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}


.slidecontainer {
  width: 100%; /* Width of the outside container */
}

/* The slider itself */
.slider {
  -webkit-appearance: none;  /* Override default CSS styles */
  appearance: none;
  width: 100%; /* Full-width */
  height: 15px;
  border-radius: 5px;
  background: #d3d3d3; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: .2s; /* 0.2 seconds transition on hover */
  transition: opacity .2s;
}

/* Mouse-over effects */
.slider:hover {
  opacity: 1; /* Fully shown on mouse-over */
}

/* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
.slider::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #4CAF50; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

.slider::-moz-range-thumb {
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #4CAF50; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

.slider::-ms-track {
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #ADADAD; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

/* The slider itself */
.noslider {
  -webkit-appearance: none;  /* Override default CSS styles */
  appearance: none;
  width: 100%; /* Full-width */
  height: 15px;
  border-radius: 5px;
  background: #d3d3d3; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: .2s; /* 0.2 seconds transition on hover */
  transition: opacity .2s;
}

/* Mouse-over effects */
.noslider:hover {
  opacity: 1; /* Fully shown on mouse-over */
}

.noslider::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #ADADAD; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

.noslider::-moz-range-thumb {
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #ADADAD; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

.noslider::-ms-track {
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #ADADAD; /* Green background */
  cursor: pointer; /* Cursor on hover */
}


.lang {
    padding: 5px;
    border: 1px;
  /*font-size: 18px;*/
    margin: 15px;
}

.flag-icon {
    background-size: contain;
    background-position: 50%;
    background-repeat: no-repeat;
    position: relative;
    display: inline-block;
    width: 1.33333333em;
    height: 1.33333333em;
    line-height: 1em;
}

.flag-icon-es {
    background-image: url(/dist/es.svg);
}

.flag-icon-us {
    background-image: url(/dist/us.svg);
}

</style>
