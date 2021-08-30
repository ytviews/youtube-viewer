import { exec } from 'child_process';

export const execWithPromise = (command: string) =>
    new Promise((res, rej) => exec(command, (error, stdout, stderr) => {
      // @ts-ignore
      if (error) rej(new Error(error));
      else {
        res(`stdout: ${stdout}\n stderr: ${stderr}`);
      }
    }));
