exports.handler = async(context, event, callback) =>{
    
    const {CurrentTask} = event;

    //calling task handlers
    switch(CurrentTask){

        case 'greeting' :
            await greetingTaskHandler(context, event, callback);
            break;

        case 'get_quantity' :
            await getQuantityTaskHandler(context, event, callback);
            break;

        case 'order_roomservice' :
            await orderRoomServiceTaskHandler(context, event, callback);
            break;

        case 'deliver_roomitems' :
            await deliverRoomItemsTaskHandler(context, event, callback);
            break;

        case 'complete_collect_roomservice' :
            await completeCollectRoomServiceTaskHandler(context, event, callback);
            break;

        case 'complete_collect_roomitems' :
            await completeCollectRoomItemsTaskHandler(context, event, callback);
            break;

        case 'goodbye' :
            await goodbyeTaskHandler(context, event, callback);
            break;

        case 'collect_fallback' :
            await collectFallbackTaskHandler(context, event, callback);
            break;

        case 'fallback' :
            await fallbackHandler(context, event, callback);
            break;

        default :
            await fallbackHandler(context, event, callback);
    } 
};

//greeting handler function
const greetingTaskHandler = async (context, event, callback) => {

    const Say = 'Hi, I can get you items for your room and order you room service. How can I help?',
          Listen = true,
          Remember = false,
          Collect = false;

    speechOut(Say, Listen, Remember, Collect, callback);
}

//get_quantity handler function
const getQuantityTaskHandler = async (context, event, callback) => {

    const Say = false,
          Listen = false,
          Remember = false,
          Collect = {
            "on_complete" : {
                "redirect" : {
                    "method" : "POST",
                    "uri" : "task://complete_collect_roomitems"
                }
            },
            "name" : "quantity_of_item",
            "questions" : [
                {
                    "type" : "Twilio.NUMBER",
                    "question" : "How many would you like?",
                    "name" : "quantity"
                }
            ]
        };

    speechOut(Say, Listen, Remember, Collect, callback);
}

//order_roomservice handler function
const orderRoomServiceTaskHandler = async (context, event, callback) => {

    const Say = 'Our kitchen is open and serving the full menu.',
          Listen = false,
          Remember = false,
          Collect = {
            "on_complete" : {
                "redirect" : {
                    "method" : "POST",
                    "uri" : "task://complete_collect_roomservice"
                }
            },
            "name" : "order_food",
            "questions" : [
                {
                    "type" : "Custom.FOOD",
                    "question" : "What would you like to eat?",
                    "name" : "Food"
                },
                {
                    "question" : "Got it. Any special requests?",
                    "name" : "special_requests"
                }
            ]
        };

    speechOut(Say, Listen, Remember, Collect, callback);
}

//deliver_roomitems handler function
const deliverRoomItemsTaskHandler = async (context, event, callback) => {

    const Say = "Ok!",
          Listen = false,
          Remember = false,
          Collect = {
            "on_complete" : {
                "redirect" : {
                    "method" : "POST",
                    "uri" : "task://complete_collect_roomitems"
                }
            },
            "name" : "deliver_roomitems",
            "questions" : [
                {
                    "type" : "Custom.ROOMITEMS",
                    "question" : "What would you like?",
                    "name" : "item"
                },
                {
                    "type" : "Twilio.NUMBER",
                    "question" : "How many do you need?",
                    "name" : "quantity"
                }
            ]
        };

    speechOut(Say, Listen, Remember, Collect, callback);
}

//complete_collect_roomservice handler function
const completeCollectRoomServiceTaskHandler = async (context, event, callback) => {

    const Say = "Your order will take about 45 minutes. What else can I help you with meantime?",
          Listen = true,
          Remember = false,
          Collect = false;

    speechOut(Say, Listen, Remember, Collect, callback);
}

//complete_collect_roomitems handler function
const completeCollectRoomItemsTaskHandler = async (context, event, callback) => {

    const Say = "Your items will be dropped off within 10 minutes. What else can I help you with?",
          Listen = true,
          Remember = false,
          Collect = false;

    speechOut(Say, Listen, Remember, Collect, callback);
}

//goodbye handler function
const goodbyeTaskHandler = async (context, event, callback) => {

    const Say = "Ok, I'll be here when you need me.",
          Listen = false,
          Remember = false,
          Collect = false;

    speechOut(Say, Listen, Remember, Collect, callback);
}

//collect_fallback handler function
const collectFallbackTaskHandler = async (context, event, callback) => {

    const Say = "Looks like I'm having trouble. Apologies for that. Let's start again, how can I help you today?",
          Listen = true,
          Remember = false,
          Collect = false;

    speechOut(Say, Listen, Remember, Collect, callback);
}

//fallback handler function
const fallbackHandler = async (context, event, callback) => {

    const Say = "I'm sorry didn't quite get that. Please say that again.",
          Listen = true,
          Remember = false,
          Collect = false;

    speechOut(Say, Listen, Remember, Collect, callback);
}

/** 
 * speech-out function 
 * @Say {string}             // message to speak out
 * @Listen {boolean}         // keep session true or false
 * @Remember {object}        // save data in remember object 
 * @callback {function}      // return twilio function response 
 * */ 
const speechOut = (Say, Listen, Remember, Collect, callback) => {

    let responseObject = {
		"actions": []
    };

    if(Say)
        responseObject.actions.push(
            {
				"say": {
					"speech": Say
				}
			}
        );

    if(Listen)
        responseObject.actions.push(
            { 
                "listen": true 
            }
        );

    if(Remember)
        responseObject.actions.push(
            {
                "remember" : Remember
            }
        )

    if(Collect)
        responseObject.actions.push(
            {
                "collect" : Collect
            }
        );

    // return twilio function response
    callback(null, responseObject);
}