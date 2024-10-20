import { Server } from "socket.io";
import NodeGeocoder from "node-geocoder";
import { config } from "dotenv";
import OpenAI from "openai";
import axios from "axios";
import http from "http";

config();

const io = new Server(3000);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let pendingEns = "";
let pendingAvatar = "";
let pendingLocation = { latitude: 0, longitude: 0 };
let shakeResponseLocations = [];
let pendingSockets = new Map();

const getTimeOfDay = (hours) => {
  let timeOfDay = "";
  if (hours >= 5 && hours < 12) {
    timeOfDay = "morning";
  } else if (hours >= 12 && hours < 17) {
    timeOfDay = "afternoon";
  } else if (hours >= 17 && hours < 21) {
    timeOfDay = "evening";
  } else {
    timeOfDay = "night";
  }
  return timeOfDay;
};

const options = {
  provider: "google", // Choose your preferred provider (e.g., Google, Mapbox, etc.)
  apiKey: process.env.PLACES_API_KEY,
};

const geocoder = NodeGeocoder(options);

io.on("connection", (socket) => {
  socket.on("shake", (ens, avatar, location) => {
    pendingEns = ens;
    pendingAvatar = avatar;
    pendingLocation.latitude = location.latitude;
    pendingLocation.longitude = location.longitude;
    console.log(location);
    console.log("broadcast to other sockets for closest connection");
    socket.broadcast
      .timeout(3000)
      .emit("pending-location", (err, responses) => {
        if (err) {
          console.log("did not get response");
          return;
        }
        shakeResponseLocations = responses;
        // calculate closest other device
        const closestResponse = shakeResponseLocations
          .filter(({ location }) => {
            const latitudeDelta = Math.abs(
              location.latitude - pendingLocation.latitude
            );
            const longitudeDelta = Math.abs(
              location.longitude - pendingLocation.longitude
            );
            return latitudeDelta < 0.00016875 && longitudeDelta < 0.00016875;
          })
          .reduce((acc, response) => {
            if (acc) {
              if (
                Math.abs(response.latitude - location.latitude) <
                  Math.abs(acc.latitude - location.latitude) &&
                Math.abs(response.longitude - location.longitude) <
                  Math.abs(acc.longitude - location.longitude)
              ) {
                return response;
              }
            } else {
              return response;
            }
          }, null);
        if (closestResponse != null) {
          socket.emit("exchange-ens", {
            ens: closestResponse.ens,
            avatar: closestResponse.avatar,
          });
          io.to(closestResponse.id).emit("exchange-ens", {
            ens: pendingEns,
            avatar: pendingAvatar,
          });
          pendingSockets[closestResponse.ens] = closestResponse.id;
          pendingSockets[pendingEns] = socket.id;
        }

        pendingEns = "";
        pendingAvatar = "";
        shakeResponseLocations = [];
      });
  });

  socket.on("make-memory", async (ens1, avatar1, ens2, avatar2, location) => {
    // ens 1 is owner;
    delete pendingSockets[ens1];

    io.to(pendingSockets[ens2]).emit("pending-end");
    delete pendingSockets[ens2];

    const lat = location.latitude;
    const lon = location.longitude;

    // get description of avatar1
    // get description of avatar2
    // get location/landmark
    // generate image based on the 3 things above
    const [{ city, country }] = await geocoder.reverse({ lat, lon });
    const locale = `${city}, ${country}`;
    const params = {
      key: process.env.WEATHER_API_KEY,
      q: `${lat},${lon}`,
    };
    const response = await axios.get(
      "https://api.weatherapi.com/v1/current.json",
      { params }
    );
    const condition = response.data.current.condition;

    const describePrompt =
      "describe this image for an image generator as a character in a brief sentence. include some details";
    const avatar1Response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: describePrompt },
            {
              type: "image_url",
              image_url: {
                url: avatar1,
              },
            },
          ],
        },
      ],
    });
    const avatar1Description = avatar1Response.choices[0].message.content;
    const avatar2Response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: describePrompt },
            {
              type: "image_url",
              image_url: {
                url: avatar2,
              },
            },
          ],
        },
      ],
    });
    const avatar2Description = avatar2Response.choices[0].message.content;
    const now = new Date();
    const hours = now.getHours();
    const timeOfDay = getTimeOfDay(hours);

    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Character 1:'${avatar1Description}'. Character 2:'${avatar2Description}'. The 2 characters are hanging out together happily in ${locale} on a ${condition} ${timeOfDay}. There is no text in the image. 3d cartoony style. Have landmark(s) of the location in the background`,
      n: 1,
      size: "1024x1024",
    });
    const imageUrl = imageResponse.data[0].url;
  });
});
