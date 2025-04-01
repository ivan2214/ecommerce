import { Html, Button } from "@react-email/components";
import * as React from "react";

export const EmailTemplate = ({
  link,
  text,
}: {
  link: string;
  text: string;
}) => (
  <Html lang="en" dir="ltr">
    <Button href={link} style={{ color: "#61dafb" }}>
      {text}
    </Button>
  </Html>
);
