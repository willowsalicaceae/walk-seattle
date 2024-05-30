export const getUserLocation = () => {
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
      };

      const error = (err) => {
        console.log('User denied location permission or an error occurred.');
        resolve({ declined: true });
      };

      // Trigger the location request on button click
      const getLocation = () => {
        navigator.geolocation.getCurrentPosition(success, error, options);
      };

      // Resolve with a function that can be called to trigger the location request
      resolve({ getLocation });
    } else {
      console.log('Geolocation is not supported by this browser.');
      resolve(null);
    }
  });
};

export default getUserLocation;