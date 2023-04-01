import * as util from "util";
import ffmpeg from "fluent-ffmpeg";

export const makeEncryptedHls = async (filePath: string, duration: number, key: string, iv?: string, outFileName?: string) => {
    const command = ffmpeg(filePath);
    console.log('make hls start');
    command.addOption([
      `-hls_enc 1`, // 1 = enable enc
      `-hls_enc_key ${key}`,
      `-hls_enc_iv ${iv || "0".repeat(32)}`,
      '-profile:v baseline',
      '-level 3.0',
      '-start_number 0',
      `-hls_time ${duration}`,
      '-hls_list_size 0',
      '-f hls'
    ]).output(outFileName || 'output.m3u8').on('end', (stdout) => {
      console.log(stdout);
      console.log('make hls end');
    }).run();
  };

export const calcSplitNumber = async (path: string, duration: number): Promise<number> => {
  const promise = util.promisify(ffmpeg.ffprobe);
  const metadata = await promise(path) as any;
  return Math.ceil(metadata.format.duration / duration);
};

export const calcDuration = async (path: string, splitNumber: number): Promise<number> => {
  const promise = util.promisify(ffmpeg.ffprobe);
  const metadata = await promise(path) as any;
  return Math.ceil(metadata.format.duration / splitNumber);
};
