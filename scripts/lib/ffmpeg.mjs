import { execFile } from "node:child_process";
import { promisify } from "node:util";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";

const execFileAsync = promisify(execFile);

export async function runFfmpeg(args) {
  return execFileAsync(ffmpegInstaller.path, args, { maxBuffer: 1024 * 1024 * 64 });
}

export async function probeClip(filePath) {
  const { stdout } = await execFileAsync(ffprobeInstaller.path, [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height,r_frame_rate,duration",
    "-of",
    "json",
    filePath,
  ]);
  const parsed = JSON.parse(stdout);
  return parsed.streams[0];
}
