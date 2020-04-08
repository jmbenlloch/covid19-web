<template>
  <div>
    <div class="row">
      <div class="col-lg-12 d-flex d-lg-block">
        <h1 class="display-16" v-html="$t('seirTitle')"></h1>
      </div>

      <div class="col-lg-12 d-flex d-lg-block">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">{{$t('modelParameters')}}</h4>
            <ul>
              <li><span class="font-weight-bold">R0</span>: {{$t('growthRate')}}</li>
              <li><span class="font-weight-bold">T</span>: {{$t('duration')}}</li>
              <li><span class="font-weight-bold">Ti</span>: {{$t('incubation')}}</li>
              <li><span class="font-weight-bold">Tm</span>: {{$t('mitigationDate')}}</li>
              <li><span class="font-weight-bold">Q</span>: {{$t('quarantine')}}</li>
              <li><span class="font-weight-bold">Days</span>: {{$t('daysParam')}}</li>
              <li><span class="font-weight-bold">N</span>: {{$t('population')}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <seir-model/>
    <hr>

    <div ref="mathBlock">
      <p class='text-justify' v-html="$t('seirModelParagraph1')"></p>
      <p>
        <img src="dist/sir_seir.png" class="img float-center" alt="SIR model">
      </p>
      <br>
      <p class='text-justify' v-html="$t('seirModelParagraph2')"></p>
      <p class='text-justify' v-html="$t('seirModelParagraph3')"></p>
      <p class='text-justify' v-html="$t('seirModelParagraph4')"></p>
      <p class='text-justify' v-html="$t('seirModelParagraph5')"></p>
      <p class='text-justify' v-html="$t('seirModelParagraph6')"></p>
      <p class='text-justify' v-html="$t('seirModelParagraph7')"></p>
    </div>


  </div>
</template>

<script>
import SeirModel from "../components/SeirModel.vue"
import i18n from '../plugins/i18n'

export default {
  name: 'app',
  components: {
    SeirModel,
  },
  computed: {
    locale : function(){
      return i18n.locale
    }
  },
  watch : {
    locale:  _.debounce(
      function (newvalue, oldvalue) {
        this.renderLatex()
      },
      500),
  },
  methods: {
    renderLatex () {
      if (window.MathJax) {
        window.MathJax.Hub.Queue([
          'Typeset',
          window.MathJax.Hub,
          this.$refs.mathBlock
        ])
      }
    },
  },
  mounted (){
    this.renderLatex()
  }
}
</script>
