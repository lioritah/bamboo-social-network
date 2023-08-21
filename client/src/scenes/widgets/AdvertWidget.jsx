import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src="http://localhost:3001/assets/netflix_macos_bigsur_icon_189917.png"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>Netflix</Typography>
        <Typography color={medium}>
          <a
            href="https://www.netflix.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Netflix.com
          </a>{" "}
        </Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        Netflix is an American subscription video on-demand over-the-top
        streaming service owned and operated by Netflix, Inc.
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
