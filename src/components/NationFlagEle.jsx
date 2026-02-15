const NationFlagEle = ({ cn, width = 50, height = 30 , onClk=null }) => {
  if (cn === undefined || cn === null || cn === "") {
    return (
      <div
        className={`flag`}
        style={{
          backgroundColor: "#f0f0f0",
          width: width,
          height: height,
          cursor: "not-allowed",
        }}
      />
    );
  }

  const flagUrl = `https://flagcdn.com/w320/${cn?.toLowerCase()}.png`;
  return (
    <div
      className={`flag`}
      onClick={() => onClk(code)}
      style={{
        backgroundImage: `url(${flagUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        cursor: "pointer",
        width: width,
        height: height,
      }}
    />
  );
};

export default NationFlagEle;
