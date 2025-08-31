const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");

process.env.DEBUG = "dialogflow:debug"; // Enable debug

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });

  // Mess menu data
  const messMenu = {
    Monday: {
      breakfast: "Dalia, Sprouts, Veg Sandwich, Tea",
      lunch: "Salad, Raita, Veg Biryani, Puri, Rice, Chapati",
      snacks: "Burger, Tea, Tomato Ketchup",
      dinner: "Salad, Aloo Beans, Arhar Dal, Rice, Chapati, Custard"
    },
    Tuesday: {
      breakfast: "Oats, Mix Parantha, Cut Fruits, Tea",
      lunch: "Salad, Raita, Aloo Chhole Chana, Rajma, Rice, Chapati",
      snacks: "Veg Momos, Cola/Lime Soda, Tomato Ketchup & Mint Sauce",
      dinner: "Salad, Seasonal Veg, Dal Makhani, Pulao, Chapati"
    },
    Wednesday: {
      breakfast: "Aloo Veg, Plain Parantha, Omelet, Tea",
      lunch: "Salad, Raita, Mix Veg, Kadhi Pakora, Rice, Chapati",
      snacks: "Noodles, Tea, Tomato Ketchup & Mint Sauce",
      dinner: "Salad, Paneer/ Punjabi Egg Curry, Dhaba Dal, Plain Rice, Chapati"
    },
    Thursday: {
      breakfast: "Uttapam, Sambar, Coconut Chutney, Tea",
      lunch: "Salad, Raita, Aloo Bhujia, Arhar Dal, Rice, Chapati",
      snacks: "Fries, Lemon Water, Tomato Ketchup",
      dinner: "Salad, Rajma, Masala Chaap, Plain Rice, Chapati"
    },
    Friday: {
      breakfast: "Pickle, Aloo Pyaz Parantha, Curd, Tea",
      lunch: "Salad, Raita, Arbi, Arhar Dal, Rice, Chapati",
      snacks: "Bread Pakora, Tea, Tomato Ketchup & Mint Sauce",
      dinner: "Salad, Veg Biryani/Chicken Biryani, Gravy, Raita, Chapati, Gulab Jamun"
    },
    Saturday: {
      breakfast: "Milk, Matar Kulcha, Poha, Tea",
      lunch: "Salad, Raita, Aloo Gobi, Mix Dal, Rice, Chapati",
      snacks: "Samosa, Tea, Tomato Ketchup & Mint Sauce",
      dinner: "Salad, Matar Mushroom, Mix Dal, Rice, Chapati, Ice Cream"
    },
    Sunday: {
      breakfast: "Masala Dosa, Sambhar, Coconut Chutney, Tea",
      lunch: "Salad, Raita, Pindi Chole, Bhature, Lemon Rice",
      snacks: "Pasta, Rooh Afza/Sweet Lassi, Tomato Ketchup",
      dinner: "Salad, Chicken Curry/Mattar Paneer, Dal Tadka, Rice, Chapati/Tandoori"
    }
  };

  function mealHandler(agent) {
    const meal = agent.parameters.meal; // breakfast/lunch/snacks/dinner
    const dateTime = agent.parameters["date-time"];
    const today = new Date();

    // Determine day
    let day = today.toLocaleString("en-US", { weekday: "long" });

    // Use date-time if provided
    if (dateTime && dateTime !== "") {
      const date = new Date(dateTime);
      day = date.toLocaleString("en-US", { weekday: "long" });
    }

    // Check if meal exists
    if (!meal) {
      agent.add("Please tell me which meal you want: breakfast, lunch, snacks, or dinner.");
      return;
    }

    if (messMenu[day] && messMenu[day][meal.toLowerCase()]) {
      agent.add(`Today's ${meal} on ${day} is: ${messMenu[day][meal.toLowerCase()]}`);
    } else {
      agent.add(`Sorry, I don't have menu info for ${meal} on ${day}.`);
    }
  }

  // Map intent to handler
  let intentMap = new Map();
  intentMap.set("mess.menu.today", mealHandler); // Match your Dialogflow intent
  agent.handleRequest(intentMap);
});
