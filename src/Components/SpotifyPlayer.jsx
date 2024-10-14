const SpotifyPlayer = ({ url }) => {
  // console.log("SpotifyPlayer URL:", url);
  // console.log("Rendering Spotify Player with URL:", url);
  return (
    <div className='spotify-container'>
      <iframe
        style={{
          borderRadius: "12px",
          justifyContent: "center",
          width: "100%",
          height: "152px",
        }}
        src={url}
        width='100%'
        frameBorder='0'
        allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
        loading='lazy'
      ></iframe>
    </div>
  );
};

export default SpotifyPlayer;
