const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      const success = (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
        navigator.geolocation.clearWatch(watchId);
      };

      const error = (err) => {
        console.log('User denied location permission or an error occurred.');
        resolve({ declined: true });
        navigator.geolocation.clearWatch(watchId);
      };

      const watchId = navigator.geolocation.watchPosition(success, error, options);
    } else {
      console.log('Geolocation is not supported by this browser.');
      resolve(null);
    }
  });
};

export default getUserLocation;