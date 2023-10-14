import readline from 'readline';
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

export const askForConfirmation = (): Promise<boolean> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) =>
    rl.question("Are you sure you would like to proceed?", (answer: string) => {
      rl.close();
      const yesNo: boolean = answer.toLowerCase().trim() === "yes";
      resolve(yesNo);
    })
  );
}
