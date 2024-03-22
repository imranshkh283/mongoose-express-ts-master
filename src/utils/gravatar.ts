import gravatar from "gravatar";

export const createGravatar = (email: string) => {
  const options: gravatar.Options = {
    s: "200",
    r: "pg",
    d: "mm",
  };
  const avatar = gravatar.url(email, options);
};
