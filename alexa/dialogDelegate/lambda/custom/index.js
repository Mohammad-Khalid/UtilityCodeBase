/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Hello and welcome to Trip Planing, An assistant that can help you to plan your trip. Where would you like to visit?';
    const repromptText = 'Hello and welcome to Trip Planing, An assistant that can help you to plan your trip. Where would you like to visit?';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .getResponse();
  },
};

const StartedMyTripPlanHanlder = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'PlanMyTripIntent'
      && handlerInput.requestEnvelope.request.dialogState === 'STARTED';
  },
  handle(handlerInput) {

    let currentIntent = handlerInput.requestEnvelope.request.intent;       
    let fromCity = currentIntent.slots.fromCity;

    console.log(`fromCity : ${fromCity}`);
    // fromCity.value is empty if the user has not filled the slot
    if (!fromCity.value) {
      currentIntent.slots.fromCity.value = "Nagpur";
    }

    // Return the Dialog.Delegate directive
    return handlerInput.responseBuilder
      .addDelegateDirective(currentIntent)
      .getResponse();
  },
};

const InProgressMyTripPlanHanlder = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'PlanMyTripIntent'
      && handlerInput.requestEnvelope.request.dialogState === 'IN_PROGRESS';
  },
  handle(handlerInput) {

    const currentIntent = handlerInput.requestEnvelope.request.intent;

    console.log(currentIntent.slots);
    return handlerInput.responseBuilder
      .addDelegateDirective(currentIntent)
      .getResponse();
  },
};

const CompletedMyTripPlanHanlder = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'PlanMyTripIntent'
      && handlerInput.requestEnvelope.request.dialogState === 'COMPLETED';
  },
  handle(handlerInput) {

    const {fromCity, toCity, travelDate} = handlerInput.requestEnvelope.request.intent.slots;
    const speechText = `Okay, I've booked the trip from ${fromCity.value} to ${toCity.value} for ${travelDate.value}.?`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'Hello and welcome to Trip Planing, An assistant that can help you to plan your trip. Where would you like to visit?';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    StartedMyTripPlanHanlder,
    InProgressMyTripPlanHanlder,
    CompletedMyTripPlanHanlder,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
