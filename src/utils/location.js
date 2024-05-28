const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          console.log('User denied location permission or an error occurred.');
          resolve(null);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
      resolve(null);
    }
  });
};

export default getUserLocation;