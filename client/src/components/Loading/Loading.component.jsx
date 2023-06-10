import React from "react";

const LoadingComponent = () => {
  return (
    <div style={styles.container}>
      <img
        src="https://cdn.dribbble.com/users/186911/screenshots/4669536/pizza-loader.gif"
        alt="loading"
        style={styles.loading}
      />
    </div>
  );
};

const styles = {
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
},
  loading: {
    width: "100px",
    height: "100px",
    borderRadius:"50px"
  },
};

export default LoadingComponent;
