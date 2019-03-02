'use strict';
const Alexa = require('alexa-sdk');
var http = require('https');


const APP_ID = "amzn1.ask.skill.6fa43a09-dcd5-4ef6-9338-4ac8bbd04ea6";

const SKILL_NAME = 'Nice Jokes';
const GET_FACT_MESSAGE = "Hier ist dein Witz: ";
const HELP_MESSAGE = 'Du kannst sagen: Erzähl mir einen Witz, Erzhä mi einen Flachwitz oder erzähl mir einen Chuck Norris Witz.';
const HELP_REPROMPT = 'Wie kann ich dir helfen?';
const STOP_MESSAGE = 'Man riecht sich!';

const data = [
    "Warum bohren Beamte freitags immer in der Nase? - Antwort: Weil sie zum Ende der Arbeitswoche angewiesen werden, noch einmal das Letzte aus sich herauszuholen.",
"Treffen sich zwei Unterhosen. Fragt die eine: „Warum bist du so braun?“, Sagt die andere: Ich hatte eine beschissene Woche.",
"Ich wurde gestern auf der Autobahn geblitzt. - Ich dachte erst, ich hätte eine Idee.",
"Der kleine Peter zu seiner Mama: Alle sagen, ich habe so lange Zähne. - Mama: Schhhhh, sag doch sowas nicht. Du zerkratzt mir noch unseren ganzen Fußboden.",
"Beim Bewerbungsgespräch: Der Chef: Wir suchen jemanden, der zeigt, dass er verantwortlich sein kann. - Sagt der Bewerber: „Oh ja, das kann ich. In meinem letzten Job, sagten alle, immer wenn etwas schief gegangen ist, dass ich verantwortlich bin.",
"Der Ehemann zu seiner Frau: Wir haben im Lotto gewonnen. Ich habe schon große Pläne mit dem Gewinn. Was sollen wir uns alles kaufen? Die Frau: Um ganz ehrlich zu sein Peter, ich würde gerne meine Hälfte nehmen und dich verlassen. Der Mann: Oh, ok! Wir haben 30 Euro gewonnen. Hier hast du deine 15 Euro!",
"Kurze Erinnerung: Auf einer Beerdigung solltest du einen Blumenstrauß niemals hinter dich werfen, nur um zu sehen, wer ihn fängt.",
"Eine Frau wurde vor einem Gericht zu einer Geldstrafe verurteilt, weil sie ihr eigenes Popcorn, Cola und Süßigkeiten mitgebracht hatte. Insgesamt kam sie aber trotzdem günstiger davon.",
];

const flat_jokes = [
"Was ist niedlich und hüpft qualmend über'n Acker? — Ein Kaminchen!",
"Was sagt ein Gen, wenn es ein anderes trifft? — Halogen.",
"Was ist ein studierter Bauer? — Ein Ackerdemiker",
"Wie heißt das intelligenteste Gemüse? — Schlaubergine.",
"Ich bin so unentschlossen. Als japanischer Krieger wäre ich ein Nunja.",
"Was ist gelb und schießt? Eine Banone!",
"Steht ein Baum allein im Wald.",
"Was ist die Lieblingsspeise von Piraten? — Kapern",
"Was ist groß, grau und kann telefonieren? — Ein Telefant",
"Wieso können Seeräuber keinen Kreis fahren? — Weil sie Pi raten",
"Was ist ein Keks unter einem Baum? — Ein schattiges Plätzchen.",
"Was ist rot und steht am Straßenrand? — Eine Hagenutte",
"Was ist gelb und hüpft durch den Wald? — Der Postfrosch",
"Was sagt der große Stift zum kleinen Stift? — Wachsmalstift!",
"Sagt der Pessimist Schlimmer geht nicht! — Sagt der Optimist: Doch!",
"Egal wir gut Du fährst, Züge fahren Güter",
"Mein Arzt hat eine Südamerikanische Augenkrankheit bei mir diagnostiziert — Ich Chile",
"Neulich im Tatort: Wo waren Sie zur Tatzeit? — Im Internet!",
"Ich habe manchmal das Gefühl, der Münster-Tatort nutzt Gags, die Fips Asmussen zu flach waren.",
"Warum summen Bienen? — Weil sie den Text nicht kennen!",
"Was bestellt ein Maulwurf im Restaurant? — Ein Drei-Gänge-Menü.",
"Wie nennt man ein verschwundenes Rindtier? — Oxford.",  ]


const handlers = {
    'LaunchRequest': function () {
        this.new = true;
        this.response.shouldEndSession(false);
        this.response.cardRenderer(SKILL_NAME, "Moin Keule! Frag mich doch nach einem Witz.");
        this.response.speak("Moin Keule! Frag mich doch nach einem Witz.");
        this.emit(':responseReady');
    },
    'casual_joke': function () {
        const factArr = flat_jokes;
        const factIndex = Math.floor(Math.random() * factArr.length);
        const randomFact = factArr[factIndex];
        const speechOutput = GET_FACT_MESSAGE + randomFact;

        this.response.cardRenderer(SKILL_NAME, randomFact);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'chuck_joke': function () {
        this.response.shouldEndSession(false);
        httpGet('api.chucknorris.io','/jokes/random', '', (theResult) => {
                const theFact = theResult;
                const speechOutput = theFact;
                this.response.cardRenderer(SKILL_NAME, "Chuck Norris - Baaaam!");
                this.response.speak(JSON.parse(speechOutput).value);
                this.emit(':responseReady');
            });
    },
    'flat_joke': function () {
        const factArr = data;
        const factIndex = Math.floor(Math.random() * factArr.length);
        const randomFact = factArr[factIndex];
        const speechOutput = GET_FACT_MESSAGE + randomFact;

        this.response.cardRenderer(SKILL_NAME, randomFact);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
     'Unhandled': function () {
     const speech_output = 'Goodbye and take care!'
     this.response.speak(speech_output);
     this.emit(':responseReady');
},
};


function httpGet(host, path ,query, callback) {
    var options = {
        host: host,
        path: path+ encodeURIComponent(query),
        method: 'GET',
    };

    var req = http.request(options, res => {
        res.setEncoding('utf8');
        var responseString = "";
        res.on('data', chunk => {
            responseString = responseString + chunk;
        });
        res.on('end', () => {
            console.log(responseString);
            callback(responseString);
        });

    });
    req.end();
}
exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
