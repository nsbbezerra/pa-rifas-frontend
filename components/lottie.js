import { memo } from "react";
import Lottie from "react-lottie";

function LottieApp({ animation, width }) {
  const authAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Lottie
      options={authAnimationOptions}
      width={width}
      isClickToPauseDisabled={true}
    />
  );
}

export default memo(LottieApp);
