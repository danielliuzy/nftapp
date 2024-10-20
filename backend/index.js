import { Server } from "socket.io";

const io = new Server(3000);

let pendingEns = "";
let pendingAvatar = "";
let pendingLocation = { latitude: 0, longitude: 0 };
let shakeResponseLocations = [];

io.on("connection", (socket) => {
  socket.on("shake", (ens, avatar, location) => {
    pendingEns = ens;
    pendingAvatar = avatar;
    pendingLocation.latitude = location.latitude;
    pendingLocation.longitude = location.longitude;
    console.log(location);
    console.log("broadcast to other sockets for closest connection");
    socket.broadcast
      .timeout(1000)
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
            return latitudeDelta < 0.0005 && longitudeDelta < 0.0005;
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
        }

        pendingEns = "";
        pendingAvatar = "";
        shakeResponseLocations = [];
      });
  });
});
