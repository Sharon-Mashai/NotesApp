
import { Link } from "expo-router";
import type { ComponentProps } from "react";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

type ExternalLinkProps = Omit<
  ComponentProps<typeof Link>,
  "href"
> & {
  href: string;
};

export function ExternalLink(props: ExternalLinkProps) {
  return (
    <Link
      target="_blank"
      {...props}
      href={props.href as ComponentProps<typeof Link>["href"]}
      onPress={(event) => {
        if (Platform.OS !== "web") {
          event.preventDefault();
          void WebBrowser.openBrowserAsync(props.href);
        }
      }}
    />
  );
}
