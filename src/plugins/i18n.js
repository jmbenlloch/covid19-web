import Vue from 'vue';
import VueI18n from 'vue-i18n';
import _ from "lodash"

import SirMessages from './translations/SIRModelTexts'
import SeirMessages from './translations/SEIRModelTexts'

Vue.use(VueI18n);

const messages = {
    'en': {
        models: "Models: ",
        sirModel: "SIR Model",
        seirModel: "SEIR Model",
        icuBeds : "ICU Beds",
        evolution : "COVID-19 Evolution",
        comunidades : "Spanish regions",
        who: "Who are we",
        moreInfo : "More info in (spanish) ",
        users : "Users",
        visits : "Visits",

        cookies : `This web uses cookies to achieve the best user experience.
        In case of any doubt read our `,
        privacyPolicy: "privacy policy",
        privacy: "Privacy policy",
        privacyText: `This web page uses cookies only with the purpose of tracking the number of visitors to it.
        <br>
        Personal data collected (IP address) are anonymized and will only be shared with Google Analytics, the service provider.
        <br>
        They will not be used for any marketing-related activity nor will they be shared with third parties.`,

        //Evolucion
        evolutionTitle: "Epidemic evolution",
        evolutionDataSource: "Data source",
        logScale : "Log scale",
        country : "Country",
        deathsTitle: "Daily number of deaths",
        casesTitle: "Daily number of cases",
        deathsCumTitle: "Total number of deaths",
        casesCumTitle: "Total number of cases",
        deathsLabel: "Daily number of deaths",
        casesLabel: "Daily number of cases",
        deathsCumLabel: "Total number of deaths",
        casesCumLabel: "Total number of cases",

        //Comunidades
        region: "Region",
        altasTitle : "Total number of recovered patients",
        altasLabel : "Total number of recovered patients",
        hospitalTitle : "Total number of patients in hospitals",
        hospitalLabel : "Total number of patients in hospitals",
        icuTitle : "Total number of UCI patients",
        icuLabel : "Total number of ICU patiens",

        //SEIR
        seirTitle: "<strong>Covid19</strong> evolution simulator using SEIR model",
        modelParameters : "Model parameters",
        growthRate: "Reproduction rate",
        duration: "Infection time",
        incubation: "Incubation time",

        //SIR
        sirTitle : "<strong>Covid19</strong> evolution simulator using SIR model",
        infected : 'Infected',
        recovered : 'Recovered',
        exposed : 'Exposed',
        susceptible : 'Susceptible',
        labelDays : "Number of days",
        labelCases : "Number of cases",
        population : "Population",
        relative : "Relative result",
        daysParam: "Total number of days",
        quarantine: "Quarantine effectiveness (%)",

        //ICU Beds
        icuBedsTitle : "<strong>Covid19</strong> evolution simulator using SEIR model",
        mitigationDate: "Starting day of mitigation measures",
        mitigationEff: "Mitigation efficiency",
        enableAll : 'Enable all',
        days : "Days",

        //Somos
        whoText: `This web has been created by members of the <a href="http://next.ific.uv.es">NEXT</a> Collaboration.
        <br>
        All feedback is welcomed, send an e-mail to <span class="font-italic">info [at] jmbenlloch.net</span>`,
    },
    'es': {
        models: "Modelos: ",
        sirModel: "Modelo SIR",
        seirModel: "Modelo SEIR",
        icuBeds : "Camas UCI",
        evolution : "Evolucion COVID-19",
        comunidades : "Comunidades autónomas",
        who: "Quiénes somos",
        moreInfo : "Más información en ",
        users : "Usuarios",
        visits : "Visitas",

        cookies : `Esta web usa cookies para conseguir la mejor experiencia de usuario.
        En caso de dudas consultar la `,
        privacyPolicy: "política de privacidad",
        privacy: "Política de privacidad",
        privacyText: `Esta página web usa cookies con el único propósito de conocer el número de visitantes y usuarios de la misma.
        <br>
        Los datos personales recogidos (dirección IP) son anonimizados y solo se compartirán con Google Analytics, proveedor del servicio.
        <br>
        NO se utilizarán para ningún propósito relacionado con marketing ni serán cedidos a terceros.`,

        //Evolucion
        evolutionTitle: "Evolución de la epidemia",
        evolutionDataSource: "Fuente de los datos",
        logScale : "Escala logarítmica",
        country : "País",
        deathsTitle    : "Número diario de muertes",
        casesTitle     : "Número diario de casos",
        deathsCumTitle : "Número total de muertes",
        casesCumTitle  : "Número total de casos",

        deathsLabel    : "Número diario de muertes",
        casesLabel     : "Número diario de casos",
        deathsCumLabel : "Número total de muertes",
        casesCumLabel  : "Número total de casos",

        //Comunidades
        region: "Comunidad autónoma",
        altasTitle : "Número total de altas",
        altasLabel : "Número total de altas",
        hospitalTitle : "Número total de hospitalizados",
        hospitalLabel : "Número total de hospitalizados",
        icuTitle : "Número total de pacientes en UCI",
        icuLabel : "Número total de pacientes en UCI",

        //SEIR
        seirTitle: "Simulador de la evolución del <strong>Covid19</strong> con modelo SEIR",
        modelParameters : "Parámetros del modelo",
        growthRate: "Tasa de reproducción",
        duration: "Duración de la enfermedad",
        incubation: "Tiempo de incubación",

        //SIR
        sirTitle : "Simulador de la evolución del <strong>Covid19</strong> con modelo SIR",
        infected : 'Infectados',
        recovered : 'Recuperados',
        exposed : 'Expuestos',
        susceptible : 'Susceptibles',
        labelDays : "Número de días",
        labelCases : "Número de casos",
        population : "Población",
        relative : "Resultado relativo",

        //ICU Beds
        icuBedsTitle : "Simulador de la evolución del <strong>Covid19</strong> con modelo SEIR",
        mitigationDate: "Starting day of mitigation measures",
        mitigationEff: "Mitigation efficiency",
        enableAll : 'Habilitar todo',
        days : "Días",

        //Somos
        whoText: `Esta página web ha sido creada por miembros de la Colaboración <a href="http://next.ific.uv.es">NEXT</a>.
        <br>
        Cualquier comentario es bienvenido, enviar e-mail a <span class="font-italic">info [at] jmbenlloch.net</span>`,

    }
};

function loadLocaleMessages () {
  var toBeAdded = [SirMessages, SeirMessages]
  // Loop over all objects with translations
  _.map(toBeAdded, function(texts) {
    // Look over all keys on each object
    _.keys(texts["en"]).forEach(key => {
      messages.en[key] = texts.en[key]
      messages.es[key] = texts.es[key]
    })
  });

  return messages
}

const i18n = new VueI18n({
    locale: 'en', // set locale
    fallbackLocale: 'es', // set fallback locale
    //messages, // set locale messages
    messages : loadLocaleMessages()
});

export default i18n;
