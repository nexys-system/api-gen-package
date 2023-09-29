import { Env } from './type';

export const getSubdomain = (env: Env) => {
  if (env === Env.dev) {
    return "dev";
  }

  if (env === Env.test) {
    return "test";
  }

  return "app";
};

export const getHost = (
  env: Env,
  domain: string,
  tld: string,
  protocol: string = "https"
) => {
  const subdomain = getSubdomain(env);

  return `${protocol}://${subdomain}.${domain}.${tld}`;
};
